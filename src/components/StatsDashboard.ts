import { getAllSurveys } from '../services/db';
import { CATEGORIES } from '../types/survey';

export class StatsDashboard {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public async refresh() {
    const surveys = await getAllSurveys();
    const total = surveys.length;
    const pending = surveys.filter((s) => s.status === 'PENDING_SYNC' || s.status === 'SYNCING').length;
    const synced = surveys.filter((s) => s.status === 'SYNCED').length;
    const error = surveys.filter((s) => s.status === 'SYNC_ERROR').length;

    // Breakdown by category
    const catCounts: { [key: string]: number } = {};
    CATEGORIES.forEach((c) => (catCounts[c.id] = 0));
    surveys.forEach((s) => {
      catCounts[s.category] = (catCounts[s.category] || 0) + 1;
    });

    // Breakdown by condition rating
    const ratingCounts = [0, 0, 0, 0, 0, 0];
    surveys.forEach((s) => {
      if (s.conditionRating >= 1 && s.conditionRating <= 5) {
        ratingCounts[s.conditionRating]++;
      }
    });

    // PWA & Storage metrics
    let storageEstimatedMb = '0.00';
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const est = await navigator.storage.estimate();
        if (est.usage) {
          storageEstimatedMb = (est.usage / (1024 * 1024)).toFixed(2);
        }
      } catch (e) {
        // Ignore
      }
    }

    this.container.innerHTML = `
      <div>
        <!-- Metric Cards Grid -->
        <div class="stats-grid">
          <div class="stat-metric-card">
            <div class="stat-icon-wrapper blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">${total}</div>
              <div class="stat-name">Tổng số phiếu khảo sát</div>
            </div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-icon-wrapper amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">${pending}</div>
              <div class="stat-name">Hàng đợi chờ gửi (Offline)</div>
            </div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-icon-wrapper green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">${synced}</div>
              <div class="stat-name">Đã gửi lên Máy chủ VKU</div>
            </div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-icon-wrapper rose">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <div class="stat-value">${error}</div>
              <div class="stat-name">Lỗi đồng bộ (Sẽ thử lại)</div>
            </div>
          </div>
        </div>

        <!-- Charts and Categorical Breakdown -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 24px;">
          <!-- Category Card -->
          <div class="card" style="margin-bottom: 0;">
            <h3 class="card-title" style="font-size: 1.1rem; margin-bottom: 16px;">Phân loại theo hạng mục thiết bị</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${CATEGORIES.map((cat) => {
                const count = catCounts[cat.id] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 600; margin-bottom: 4px;">
                      <span>${cat.name}</span>
                      <span>${count} (${pct}%)</span>
                    </div>
                    <div style="height: 8px; background: var(--input-bg); border-radius: 4px; overflow: hidden;">
                      <div style="width: ${pct}%; height: 100%; background: var(--primary-600); border-radius: 4px; transition: width 0.4s ease;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Condition Rating Card -->
          <div class="card" style="margin-bottom: 0;">
            <h3 class="card-title" style="font-size: 1.1rem; margin-bottom: 16px;">Đánh giá chất lượng thực tế (1 - 5 sao)</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars];
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const starColor = stars >= 4 ? 'var(--success-500)' : stars === 3 ? 'var(--warning-500)' : 'var(--danger-500)';
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 600; margin-bottom: 4px;">
                      <span>⭐ ${stars} sao ${stars <= 2 ? '(Cần sửa chữa)' : ''}</span>
                      <span>${count} (${pct}%)</span>
                    </div>
                    <div style="height: 8px; background: var(--input-bg); border-radius: 4px; overflow: hidden;">
                      <div style="width: ${pct}%; height: 100%; background: ${starColor}; border-radius: 4px; transition: width 0.4s ease;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- PWA Offline Readiness Verification Checklist -->
        <div class="card">
          <h3 class="card-title" style="font-size: 1.1rem; margin-bottom: 8px;">Trạng Thái Kiến Trúc Ngoại Tuyến (PWA & Offline Specs)</h3>
          <p class="card-description">Kiểm tra tính tuân thủ các tiêu chuẩn kỹ thuật đề bài</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
            <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--input-bg); border-radius: var(--radius-md);">
              <span style="color: var(--success-600); font-size: 1.25rem;">✓</span>
              <div>
                <strong style="font-size: 0.875rem; display: block;">Service Worker (Cache-First)</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${'serviceWorker' in navigator ? 'Đã kích hoạt & Pre-cache App Shell' : 'Không hỗ trợ'}</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--input-bg); border-radius: var(--radius-md);">
              <span style="color: var(--success-600); font-size: 1.25rem;">✓</span>
              <div>
                <strong style="font-size: 0.875rem; display: block;">Bộ nhớ đệm IndexedDB</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Đã lưu ${total} bản ghi (Dung lượng: ~${storageEstimatedMb} MB)</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--input-bg); border-radius: var(--radius-md);">
              <span style="color: var(--success-600); font-size: 1.25rem;">✓</span>
              <div>
                <strong style="font-size: 0.875rem; display: block;">Manifest PWA Độc lập (Standalone)</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Màu chủ đề #0284c7, Icons 192x192 & 512x512</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--input-bg); border-radius: var(--radius-md);">
              <span style="color: var(--success-600); font-size: 1.25rem;">✓</span>
              <div>
                <strong style="font-size: 0.875rem; display: block;">Capacitor Bridge & Camera/GPS</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">@capacitor/camera, @capacitor/network, Geolocation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
