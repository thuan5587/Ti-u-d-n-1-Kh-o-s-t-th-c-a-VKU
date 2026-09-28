import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { SurveyItem, DraftSurvey, SyncStatus, MockServerConfig } from '../types/survey';

interface VKUSurveyDB extends DBSchema {
  surveys: {
    key: string;
    value: SurveyItem;
    indexes: {
      'by-status': SyncStatus;
      'by-created': number;
    };
  };
  draft: {
    key: string;
    value: DraftSurvey;
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'VKU_FieldSurvey_DB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<VKUSurveyDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<VKUSurveyDB>> {
  if (!dbPromise) {
    dbPromise = openDB<VKUSurveyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Surveys Store
        if (!db.objectStoreNames.contains('surveys')) {
          const surveyStore = db.createObjectStore('surveys', { keyPath: 'id' });
          surveyStore.createIndex('by-status', 'status');
          surveyStore.createIndex('by-created', 'createdAt');
        }

        // Draft Store
        if (!db.objectStoreNames.contains('draft')) {
          db.createObjectStore('draft');
        }

        // Settings Store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

// ==================== DRAFT STORE (Real-time auto-save) ====================
const DRAFT_KEY = 'vku_active_draft';

export async function saveDraft(draft: DraftSurvey): Promise<void> {
  const db = await getDB();
  await db.put('draft', draft, DRAFT_KEY);
}

export async function getDraft(): Promise<DraftSurvey | null> {
  const db = await getDB();
  const draft = await db.get('draft', DRAFT_KEY);
  return draft || null;
}

export async function clearDraft(): Promise<void> {
  const db = await getDB();
  await db.delete('draft', DRAFT_KEY);
}

// ==================== SURVEY STORE (Offline Queue & Synced Items) ====================
export async function saveSurvey(survey: SurveyItem): Promise<void> {
  const db = await getDB();
  await db.put('surveys', survey);
}

export async function getSurvey(id: string): Promise<SurveyItem | undefined> {
  const db = await getDB();
  return db.get('surveys', id);
}

export async function getAllSurveys(): Promise<SurveyItem[]> {
  const db = await getDB();
  const items = await db.getAllFromIndex('surveys', 'by-created');
  // Return newest first
  return items.reverse();
}

export async function getPendingSurveys(): Promise<SurveyItem[]> {
  const db = await getDB();
  const all = await db.getAll('surveys');
  // Pending or sync_error that needs retry
  return all
    .filter((item) => item.status === 'PENDING_SYNC' || item.status === 'SYNC_ERROR')
    .sort((a, b) => a.createdAt - b.createdAt); // FIFO order
}

export async function updateSurveyStatus(
  id: string,
  status: SyncStatus,
  errorMsg?: string
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('surveys', 'readwrite');
  const store = tx.objectStore('surveys');
  const item = await store.get(id);

  if (item) {
    item.status = status;
    item.syncAttempts = (item.syncAttempts || 0) + 1;
    if (status === 'SYNCED') {
      item.syncedAt = Date.now();
      delete item.lastSyncError;
    } else if (status === 'SYNC_ERROR') {
      item.lastSyncError = errorMsg || 'Lỗi không xác định khi kết nối máy chủ';
    }
    await store.put(item);
  }
  await tx.done;
}

export async function deleteSurvey(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('surveys', id);
}

export async function getSurveyStats() {
  const all = await getAllSurveys();
  return {
    total: all.length,
    pending: all.filter((s) => s.status === 'PENDING_SYNC').length,
    synced: all.filter((s) => s.status === 'SYNCED').length,
    error: all.filter((s) => s.status === 'SYNC_ERROR').length,
    syncing: all.filter((s) => s.status === 'SYNCING').length,
  };
}

// ==================== SETTINGS STORE ====================
export async function getMockConfig(): Promise<MockServerConfig> {
  const db = await getDB();
  const config = await db.get('settings', 'mock_config');
  return (
    config || {
      mode: 'success',
      latencyMs: 800,
      receivedCount: 0,
    }
  );
}

export async function saveMockConfig(config: MockServerConfig): Promise<void> {
  const db = await getDB();
  await db.put('settings', config, 'mock_config');
}
