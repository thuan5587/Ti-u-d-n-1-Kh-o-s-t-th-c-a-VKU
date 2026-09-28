import { mockServer, ServerSyncLog } from '../services/mockServer';
import { networkService } from '../services/network';
import { syncEngine } from '../services/sync';

export class DevSettings {
  private container: HTMLElement;
  private showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;

  constructor(
    container: HTMLElement,
    showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void
  ) {
    this.container = container;
    this.showToast = showToast;
    this.init();
  }

  private init() {
    this.render();
    this.setupEventListeners();
  }

  public render() {
    const config = mockServer.getConfig();
    const isSimulatingOffline = networkService.isSimulatingOffline();
    const logs = mockServer.getLogs();

    this.container.innerHTML = `
      <div class="card">
        <h2 class="card-title">Mô Phỏng Thực Địa & Bảng Điều Khiển Kiểm Thử</h2>
        <p class="card-description">
          Công cụ hỗ trợ giảng viên và sinh viên kiểm tra toàn diện hành vi Ngoại tuyến (Tầng hầm), Hàng đợi IndexedDB và Khôi phục kết nối.
        </p>

        <!-- Network Simulation Block -->
        <div style="background: var(--input-bg); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
              <path d="M10.71 5.05A16 16 0 0 1 22.58 9"/>
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
              <line x1="12" y1="20" x2="12.01" y2="20"/>
            </svg>
            Mô phỏng Môi trường Mạng (Tầng hầm VKU vs Trực tuyến)
          </h3>
          <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">
            Chuyển nhanh trạng thái để quan sát cách PWA tự động lưu vào IndexedDB khi ở tầng hầm và tự động gửi hàng đợi khi lên mặt đất có Wi-Fi/4G.
          </p>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button id="btn-toggle-basement" class="btn ${isSimulatingOffline ? 'btn-danger' : 'btn-secondary'}">
              ${isSimulatingOffline ? '🔴 Đang ở Tầng hầm (Mất mạng)' : '🏢 Giả lập đi vào Tầng hầm (Cắt mạng)'}
            </button>
            <button id="btn-toggle-online" class="btn ${!isSimulatingOffline ? 'btn-primary' : 'btn-secondary'}">
              🟢 Khôi phục kết nối Mạng (Tự động đồng bộ)
            </button>
          </div>
        </div>

        <!-- Server Response Mocking Block -->
        <div style="background: var(--input-bg); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px;">Cấu hình Phản hồi Máy chủ VKU (Mock Facilities Server)</h3>
          <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">
            Mô phỏng các kịch bản thực tế khi máy chủ nhận yêu cầu từ hàng đợi Service Worker / Background Sync.
          </p>

          <div class="form-grid" style="margin-bottom: 12px;">
            <div class="form-group">
              <label class="form-label" for="select-mock-mode">Chế độ phản hồi API</label>
              <select id="select-mock-mode" class="form-control">
                <option value="success" ${config.mode === 'success' ? 'selected' : ''}>Thành công 100% (HTTP 200 OK)</option>
                <option value="random_fail" ${config.mode === 'random_fail' ? 'selected' : ''}>Chập chờn ngẫu nhiên 50% (HTTP 503 để test Retry)</option>
                <option value="offline_simulate" ${config.mode === 'offline_simulate' ? 'selected' : ''}>Máy chủ từ chối kết nối (Server Down)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="input-latency">Độ trễ phản hồi mạng (ms)</label>
              <input id="input-latency" class="form-control" type="number" min="100" max="3000" step="100" value="${config.latencyMs}" />
            </div>
          </div>
        </div>

        <!-- Server Inbound Logs -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 1rem; font-weight: 700;">Nhật ký Máy chủ nhận Khảo sát (${logs.length})</h3>
            <button id="btn-clear-logs" class="btn btn-secondary" style="font-size: 0.75rem; padding: 4px 10px;">
              Xóa nhật ký
            </button>
          </div>

          ${
            logs.length === 0
              ? `
            <div style="font-size: 0.8125rem; color: var(--text-muted); padding: 16px; background: var(--input-bg); border-radius: var(--radius-md); text-align: center;">
              Chưa có gói tin nào được gửi tới máy chủ trong phiên này.
            </div>
          `
              : `
            <div style="max-height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
              ${logs
                .map(
                  (log) => `
                <div style="padding: 10px 14px; background: var(--input-bg); border-left: 3px solid ${log.status === 'SUCCESS' ? 'var(--success-500)' : 'var(--danger-500)'}; border-radius: var(--radius-sm); font-size: 0.8125rem;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <strong>${log.status === 'SUCCESS' ? '✓ ' + log.id : '⚠️ THẤT BẠI'}</strong>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">${new Date(log.receivedAt).toLocaleTimeString('vi-VN')}</span>
                  </div>
                  <div style="color: var(--text-muted);">${log.message} • Thiết bị: ${log.equipmentCode}</div>
                </div>
              `
                )
                .join('')}
            </div>
          `
          }
        </div>
      </div>
    `;
  }

  private setupEventListeners() {
    const btnBasement = document.getElementById('btn-toggle-basement');
    if (btnBasement) {
      btnBasement.addEventListener('click', () => {
        networkService.setSimulatedOffline(true);
        this.showToast('Đã kích hoạt chế độ: TẦNG HẦM (NGOẠI TUYẾN)', 'warning');
        this.render();
        this.setupEventListeners();
      });
    }

    const btnOnline = document.getElementById('btn-toggle-online');
    if (btnOnline) {
      btnOnline.addEventListener('click', () => {
        networkService.setSimulatedOffline(false);
        this.showToast('Đã khôi phục kết nối! Tự động kiểm tra và đồng bộ hàng đợi.', 'success');
        syncEngine.syncQueue();
        this.render();
        this.setupEventListeners();
      });
    }

    const selectMode = document.getElementById('select-mock-mode') as HTMLSelectElement;
    if (selectMode) {
      selectMode.addEventListener('change', async () => {
        await mockServer.updateConfig({ mode: selectMode.value as any });
        this.showToast('Đã cập nhật chế độ phản hồi máy chủ!', 'success');
      });
    }

    const inputLatency = document.getElementById('input-latency') as HTMLInputElement;
    if (inputLatency) {
      inputLatency.addEventListener('change', async () => {
        const val = parseInt(inputLatency.value, 10) || 600;
        await mockServer.updateConfig({ latencyMs: val });
        this.showToast(`Đã thiết lập độ trễ phản hồi: ${val}ms`, 'success');
      });
    }

    const btnClearLogs = document.getElementById('btn-clear-logs');
    if (btnClearLogs) {
      btnClearLogs.addEventListener('click', () => {
        mockServer.clearLogs();
        this.render();
        this.setupEventListeners();
        this.showToast('Đã xóa nhật ký máy chủ', 'warning');
      });
    }
  }
}
