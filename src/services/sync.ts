import { getPendingSurveys, updateSurveyStatus, getAllSurveys } from './db';
import { networkService } from './network';
import { mockServer } from './mockServer';
import { SurveyItem } from '../types/survey';

type SyncProgressCallback = (current: number, total: number, activeItem?: SurveyItem) => void;
type SyncCompleteCallback = (successCount: number, errorCount: number) => void;
type QueueChangeCallback = (pendingCount: number) => void;

class SyncEngine {
  private isSyncing: boolean = false;
  private progressListeners: Set<SyncProgressCallback> = new Set();
  private completeListeners: Set<SyncCompleteCallback> = new Set();
  private queueChangeListeners: Set<QueueChangeCallback> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    // 1. Subscribe to network status changes
    networkService.subscribe(async (isOnline) => {
      console.log(`[SyncEngine] Network status changed: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
      if (isOnline) {
        // Auto trigger sync on reconnect
        console.log('[SyncEngine] Network restored! Checking queue for pending surveys...');
        await this.syncQueue(false);
      }
      this.notifyQueueChanged();
    });

    // 2. Listen to Service Worker messages (e.g. background sync triggered)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'BACKGROUND_SYNC_TRIGGERED') {
          console.log('[SyncEngine] Received sync signal from ServiceWorker');
          this.syncQueue(false);
        }
      });
    }
  }

  /**
   * Request background sync via Service Worker if supported
   */
  public async requestBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // @ts-ignore: SyncManager types
        await registration.sync.register('sync-surveys');
        console.log('[SyncEngine] Registered ServiceWorker Background Sync tag: sync-surveys');
      } catch (err) {
        console.warn('[SyncEngine] Background sync registration failed, will use fallback', err);
      }
    }
  }

  /**
   * Process the offline queue sequentially (FIFO)
   */
  public async syncQueue(isManual: boolean = false): Promise<{ success: number; errors: number }> {
    if (this.isSyncing) {
      console.log('[SyncEngine] Sync already in progress, skipping concurrent call');
      return { success: 0, errors: 0 };
    }

    if (!networkService.isOnline()) {
      console.log('[SyncEngine] Device is offline. Cannot process queue right now.');
      return { success: 0, errors: 0 };
    }

    this.isSyncing = true;
    let successCount = 0;
    let errorCount = 0;

    try {
      const pendingItems = await getPendingSurveys();
      const total = pendingItems.length;

      if (total === 0) {
        this.isSyncing = false;
        this.notifyQueueChanged();
        return { success: 0, errors: 0 };
      }

      console.log(`[SyncEngine] Starting sequential sync for ${total} items...`);

      for (let i = 0; i < pendingItems.length; i++) {
        // Abort if network dropped mid-sync
        if (!networkService.isOnline()) {
          console.warn('[SyncEngine] Network dropped during queue sync. Pausing queue.');
          break;
        }

        const survey = pendingItems[i];
        this.notifyProgress(i + 1, total, survey);

        // Mark as SYNCING in IndexedDB
        await updateSurveyStatus(survey.id, 'SYNCING');
        this.notifyQueueChanged();

        try {
          // Send to mock/real backend
          await mockServer.syncSurveyToServer(survey);

          // Mark as SYNCED
          await updateSurveyStatus(survey.id, 'SYNCED');
          successCount++;
        } catch (err: any) {
          console.error(`[SyncEngine] Failed to sync survey ${survey.id}:`, err);
          const errorMsg = err?.message || 'Lỗi kết nối máy chủ';
          await updateSurveyStatus(survey.id, 'SYNC_ERROR', errorMsg);
          errorCount++;
        }

        this.notifyQueueChanged();
      }

      this.notifyComplete(successCount, errorCount);
    } catch (e) {
      console.error('[SyncEngine] Unexpected error in syncQueue:', e);
    } finally {
      this.isSyncing = false;
      this.notifyQueueChanged();
    }

    return { success: successCount, errors: errorCount };
  }

  public async getPendingCount(): Promise<number> {
    const pending = await getPendingSurveys();
    return pending.length;
  }

  public getIsSyncing(): boolean {
    return this.isSyncing;
  }

  // Event Listeners
  public onProgress(cb: SyncProgressCallback): () => void {
    this.progressListeners.add(cb);
    return () => this.progressListeners.delete(cb);
  }

  public onComplete(cb: SyncCompleteCallback): () => void {
    this.completeListeners.add(cb);
    return () => this.completeListeners.delete(cb);
  }

  public onQueueChange(cb: QueueChangeCallback): () => void {
    this.queueChangeListeners.add(cb);
    this.notifyQueueChanged();
    return () => this.queueChangeListeners.delete(cb);
  }

  private notifyProgress(current: number, total: number, activeItem?: SurveyItem) {
    this.progressListeners.forEach((cb) => cb(current, total, activeItem));
  }

  private notifyComplete(successCount: number, errorCount: number) {
    this.completeListeners.forEach((cb) => cb(successCount, errorCount));
  }

  public async notifyQueueChanged() {
    const count = await this.getPendingCount();
    this.queueChangeListeners.forEach((cb) => cb(count));
  }
}

export const syncEngine = new SyncEngine();
