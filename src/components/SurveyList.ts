import { getAllSurveys, deleteSurvey, saveSurvey, updateSurveyStatus } from '../services/db';
import { SurveyItem, CATEGORIES } from '../types/survey';
import { syncEngine } from '../services/sync';
import { networkService } from '../services/network';
import { GeolocationService } from '../services/geolocation';

export class SurveyList {
  private container: HTMLElement;
  private currentFilter: 'all' | 'pending' | 'synced' = 'all';
  private surveys: SurveyItem[] = [];
  private showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
  private openModal: (title: string, contentHtml: string) => void;

  constructor(
    container: HTMLElement,
    showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void,
    openModal: (title: string, contentHtml: string) => void
  ) {
    this.container = container;
    this.showToast = showToast;
    this.openModal = openModal;
    this.init();
  }

  private async init() {
    await this.refresh();

    // Listen to queue changes from sync engine
    syncEngine.onQueueChange(() => {
      this.refresh();
    });
  }

  public async refresh() {
    this.surveys = await getAllSurveys();
    this.render();
    this.setupEventListeners();
  }

  public render() {
    const pendingCount = this.surveys.filter((s) => s.status === 'PENDING_SYNC' || s.status === 'SYNC_ERROR').length;
    const syncedCount = this.surveys.filter((s) => s.status === 'SYNCED').length;

    const filteredSurveys = this.surveys.filter((s) => {
      if (this.currentFilter === 'pending') return s.status === 'PENDING_SYNC' || s.status === 'SYNC_ERROR' || s.status === 'SYNCING';
      if (this.currentFilter === 'synced') return s.status === 'SYNCED';
      return true;
    });

    this.container.innerHTML = `
      <div class="card">
        <div class="queue-header-row">
          <div>
            <h2 class="card-title">Hàng Đợi & Lịch Sử Khảo Sát</h2>
            <p class="card-description">
              Dữ liệu được lưu trữ cục bộ trong IndexedDB, tự động đẩy lên máy chủ theo thứ tự FIFO khi kết nối mạng.
            </p>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button id="btn-seed-data" class="btn btn-secondary" style="font-size: 0.8125rem; padding: 8px 14px;">
              + Dữ liệu mẫu (Tầng hầm)
            </button>
            <button id="btn-sync-all" class="btn btn-primary" style="font-size: 0.8125rem; padding: 8px 14px;" ${pendingCount === 0 ? 'disabled' : ''}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
              Đồng bộ ngay (${pendingCount})
            </button>
          </div>
        </div>

        <!-- Filter tabs -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div class="filter-tabs">
            <button class="filter-tab ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">
              Tất cả (${this.surveys.length})
            </button>
            <button class="filter-tab ${this.currentFilter === 'pending' ? 'active' : ''}" data-filter="pending">
              Chờ gửi (${pendingCount})
            </button>
            <button class="filter-tab ${this.currentFilter === 'synced' ? 'active' : ''}" data-filter="synced">
              Đã đồng bộ (${syncedCount})
            </button>
          </div>

          <div style="font-size: 0.8125rem; color: var(--text-muted);">
            Thứ tự: Mới nhất đến cũ nhất
          </div>
        </div>

        <!-- Items list -->
        ${
          filteredSurveys.length === 0
            ? `
          <div style="text-align: center; padding: 48px 16px; color: var(--text-muted); background: var(--input-bg); border-radius: var(--radius-lg); border: 2px dashed var(--border-subtle);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: var(--text-subtle);">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            <div style="font-weight: 700; font-size: 1rem; color: var(--text-main); margin-bottom: 4px;">Chưa có dữ liệu khảo sát trong mục này</div>
            <p style="font-size: 0.875rem;">Hãy tạo phiếu kiểm tra mới ở tab "Khảo sát" hoặc nhấn "Dữ liệu mẫu" để thử nghiệm đồng bộ ngoại tuyến.</p>
          </div>
        `
            : `
          <div class="survey-cards-list">
            ${filteredSurveys.map((survey) => this.renderSurveyItem(survey)).join('')}
          </div>
        `
        }
      </div>
    `;
  }

  private renderSurveyItem(item: SurveyItem): string {
    const categoryName = CATEGORIES.find((c) => c.id === item.category)?.name || item.category;
    const timeFormatted = new Date(item.createdAt).toLocaleString('vi-VN');

    let badgeClass = 'pending';
    let badgeText = 'Chờ đồng bộ';
    let badgeIcon = '⏳';

    if (item.status === 'SYNCED') {
      badgeClass = 'synced';
      badgeText = 'Đã gửi máy chủ';
      badgeIcon = '✓';
    } else if (item.status === 'SYNCING') {
      badgeClass = 'syncing';
      badgeText = 'Đang đồng bộ...';
      badgeIcon = '🔄';
    } else if (item.status === 'SYNC_ERROR') {
      badgeClass = 'error';
      badgeText = 'Lỗi máy chủ (Chờ gửi lại)';
      badgeIcon = '⚠️';
    }

    return `
      <div class="survey-item-card" data-id="${item.id}">
        <div class="survey-item-main">
          ${
            item.photoBase64
              ? `<img src="${item.photoBase64}" class="survey-thumb" alt="Ảnh chụp" />`
              : `<div class="survey-thumb-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                  </svg>
                 </div>`
          }

          <div class="survey-details">
            <div class="survey-location-title">${item.building} — ${item.room}</div>
            <div class="survey-meta-row">
              <span class="status-badge ${badgeClass}">${badgeIcon} ${badgeText}</span>
              <span><strong>${categoryName}</strong></span>
              <span>⭐ ${item.conditionRating}/5 sao</span>
              <span>• ${timeFormatted}</span>
            </div>
            ${item.lastSyncError ? `<div style="font-size: 0.75rem; color: var(--danger-600); font-weight: 500;">Lỗi: ${item.lastSyncError}</div>` : ''}
          </div>
        </div>

        <div class="survey-actions">
          <button class="btn btn-secondary btn-view-detail" data-id="${item.id}" style="padding: 6px 12px; font-size: 0.75rem;">
            Chi tiết
          </button>
          ${
            item.status === 'SYNC_ERROR' || item.status === 'PENDING_SYNC'
              ? `
            <button class="btn btn-primary btn-retry-item" data-id="${item.id}" style="padding: 6px 10px; font-size: 0.75rem;">
              Thử lại
            </button>
          `
              : ''
          }
          <button class="btn btn-danger btn-delete-item" data-id="${item.id}" style="padding: 6px 10px; font-size: 0.75rem;" title="Xóa khảo sát">
            ✕
          </button>
        </div>
      </div>
    `;
  }

  private setupEventListeners() {
    // Filter tabs
    const filterBtns = this.container.querySelectorAll('.filter-tab');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.getAttribute('data-filter') as any;
        this.render();
        this.setupEventListeners();
      });
    });

    // Seed Data
    const btnSeed = document.getElementById('btn-seed-data');
    if (btnSeed) {
      btnSeed.addEventListener('click', () => this.seedDemoData());
    }

    // Sync All
    const btnSyncAll = document.getElementById('btn-sync-all');
    if (btnSyncAll) {
      btnSyncAll.addEventListener('click', async () => {
        if (!networkService.isOnline()) {
          this.showToast('Thiết bị đang Ngoại tuyến! Vui lòng kết nối mạng để đồng bộ.', 'error');
          return;
        }
        this.showToast('Đang bắt đầu đồng bộ hàng đợi...', 'success');
        const res = await syncEngine.syncQueue(true);
        if (res.success > 0) {
          this.showToast(`Đã đồng bộ thành công ${res.success} khảo sát!`, 'success');
        } else if (res.errors > 0) {
          this.showToast(`Có ${res.errors} khảo sát gặp lỗi máy chủ.`, 'warning');
        }
        this.refresh();
      });
    }

    // Individual item actions
    this.container.querySelectorAll('.btn-view-detail').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) this.showItemDetails(id);
      });
    });

    this.container.querySelectorAll('.btn-retry-item').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (id) {
          await updateSurveyStatus(id, 'PENDING_SYNC');
          this.showToast('Đã đưa vào hàng đợi gửi lại!', 'success');
          syncEngine.syncQueue();
          this.refresh();
        }
      });
    });

    this.container.querySelectorAll('.btn-delete-item').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (id && confirm('Bạn có chắc chắn muốn xóa bản ghi khảo sát này khỏi IndexedDB?')) {
          await deleteSurvey(id);
          this.showToast('Đã xóa khảo sát khỏi IndexedDB', 'warning');
          this.refresh();
        }
      });
    });
  }

  private showItemDetails(id: string) {
    const item = this.surveys.find((s) => s.id === id);
    if (!item) return;

    const categoryName = CATEGORIES.find((c) => c.id === item.category)?.name || item.category;
    const timeFormatted = new Date(item.createdAt).toLocaleString('vi-VN');
    const syncedTimeFormatted = item.syncedAt ? new Date(item.syncedAt).toLocaleString('vi-VN') : 'Chưa đồng bộ';

    const contentHtml = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${
          item.photoBase64
            ? `
          <div style="border-radius: var(--radius-md); overflow: hidden; max-height: 280px; box-shadow: var(--card-shadow);">
            <img src="${item.photoBase64}" style="width: 100%; height: 100%; object-fit: cover; display: block;" alt="Ảnh kiểm định" />
          </div>
        `
            : ''
        }

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.875rem;">
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Mã UUID Phiếu:</span>
            <code style="word-break: break-all; font-size: 0.75rem;">${item.id}</code>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Trạng thái đồng bộ:</span>
            <strong style="color: ${item.status === 'SYNCED' ? 'var(--success-600)' : 'var(--warning-600)'}">${item.status}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Tòa nhà & Tầng:</span>
            <strong>${item.building} (${item.floor})</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Số phòng:</span>
            <strong>${item.room}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Hạng mục & Mã thiết bị:</span>
            <strong>${categoryName}</strong> (${item.equipmentCode || 'Không có tem'})
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Đánh giá chất lượng:</span>
            <strong>⭐ ${item.conditionRating} / 5 sao</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Thời gian tạo:</span>
            <span>${timeFormatted}</span>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Thời gian đồng bộ máy chủ:</span>
            <span>${syncedTimeFormatted}</span>
          </div>
        </div>

        <div style="background: var(--input-bg); padding: 12px; border-radius: var(--radius-sm); font-size: 0.875rem;">
          <strong style="display: block; margin-bottom: 4px;">Ghi chú sự cố:</strong>
          <p style="color: var(--text-muted);">${item.defectNotes || 'Không có ghi chú thêm.'}</p>
        </div>

        <div style="font-size: 0.8125rem; color: var(--text-muted);">
          <strong>Tọa độ GPS:</strong> ${GeolocationService.formatCoordinates(item.gps)}
          ${
            item.gps
              ? `<br><a href="https://maps.google.com/?q=${item.gps.latitude},${item.gps.longitude}" target="_blank" style="color: var(--primary-600); text-decoration: underline;">Xem vị trí trên Google Maps ↗</a>`
              : ''
          }
        </div>
      </div>
    `;

    this.openModal(`Khảo sát: ${item.building} - ${item.room}`, contentHtml);
  }

  private async seedDemoData() {
    const demoItems: SurveyItem[] = [
      {
        id: crypto.randomUUID(),
        createdAt: Date.now() - 1000 * 60 * 35, // 35 mins ago
        building: 'Khu V - Tòa nhà Công nghệ cao',
        floor: 'Tầng hầm (B1 - Khu máy bay/kho)',
        room: 'B1-LAB01',
        gps: { latitude: 15.975412, longitude: 108.252431, accuracy: 8, timestamp: Date.now() },
        category: 'aircon',
        equipmentCode: 'VKU-AC-901',
        conditionRating: 2,
        defectNotes: 'Điều hòa Panasonic phòng lab tầng hầm rò rỉ nước, quạt gió kêu to bất thường.',
        status: 'PENDING_SYNC',
        syncAttempts: 0,
      },
      {
        id: crypto.randomUUID(),
        createdAt: Date.now() - 1000 * 60 * 70, // 70 mins ago
        building: 'Khu K - Khu Giảng đường Chính',
        floor: 'Tầng 3',
        room: 'K.304',
        gps: { latitude: 15.976012, longitude: 108.251980, accuracy: 12, timestamp: Date.now() },
        category: 'projector',
        equipmentCode: 'VKU-PRJ-221',
        conditionRating: 1,
        defectNotes: 'Máy chiếu bị mờ bóng đèn, cổng HDMI bị gãy chân cắm.',
        status: 'PENDING_SYNC',
        syncAttempts: 0,
      },
      {
        id: crypto.randomUUID(),
        createdAt: Date.now() - 1000 * 60 * 180, // 3 hours ago
        building: 'Tòa Thư viện số & Nghiên cứu',
        floor: 'Tầng 2',
        room: 'LIB-STUDY-02',
        gps: { latitude: 15.974912, longitude: 108.253102, accuracy: 10, timestamp: Date.now() },
        category: 'electrical',
        equipmentCode: 'VKU-ELEC-440',
        conditionRating: 5,
        defectNotes: 'Hệ thống đèn LED và ổ cắm âm bàn hoạt động rất tốt sau khi bảo dưỡng tuần trước.',
        status: 'SYNCED',
        syncAttempts: 1,
        syncedAt: Date.now() - 1000 * 60 * 175,
      },
    ];

    for (const item of demoItems) {
      await saveSurvey(item);
    }

    this.showToast('Đã thêm 3 bản ghi khảo sát mẫu (có khảo sát ở tầng hầm B1)!', 'success');
    await this.refresh();
  }
}
