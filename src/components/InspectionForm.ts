import { BUILDINGS, FLOORS, CATEGORIES, Category, ConditionRating, DraftSurvey, SurveyItem } from '../types/survey';
import { saveDraft, getDraft, clearDraft, saveSurvey } from '../services/db';
import { GeolocationService } from '../services/geolocation';
import { CameraService } from '../services/camera';
import { networkService } from '../services/network';
import { syncEngine } from '../services/sync';

export class InspectionForm {
  private container: HTMLElement;
  private currentStep: number = 1;
  private totalSteps: number = 4;

  // Form State
  private building: string = BUILDINGS[0];
  private floor: string = FLOORS[1];
  private room: string = 'V.A101';
  private gpsLocation: any = null;
  private category: Category = 'hardware';
  private equipmentCode: string = '';
  private conditionRating: number = 4;
  private defectNotes: string = '';
  private photoBase64: string = '';

  private onSubmittedCallback?: () => void;
  private showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;

  constructor(
    container: HTMLElement,
    showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void,
    onSubmitted?: () => void
  ) {
    this.container = container;
    this.showToast = showToast;
    this.onSubmittedCallback = onSubmitted;
    this.init();
  }

  private async init() {
    await this.loadDraft();
    this.render();
    this.setupEventListeners();
  }

  private async loadDraft() {
    try {
      const draft = await getDraft();
      if (draft) {
        if (draft.building) this.building = draft.building;
        if (draft.floor) this.floor = draft.floor;
        if (draft.room) this.room = draft.room;
        if (draft.gps) this.gpsLocation = draft.gps;
        if (draft.category) this.category = draft.category;
        if (draft.equipmentCode) this.equipmentCode = draft.equipmentCode;
        if (draft.conditionRating) this.conditionRating = draft.conditionRating;
        if (draft.defectNotes) this.defectNotes = draft.defectNotes;
        if (draft.photoBase64) this.photoBase64 = draft.photoBase64;
        if (draft.step) this.currentStep = draft.step;
      } else {
        // Automatically fetch initial GPS in the background
        this.fetchGPS();
      }
    } catch (e) {
      console.warn('Failed to load draft:', e);
    }
  }

  private async autoSaveDraft() {
    const draft: DraftSurvey = {
      building: this.building,
      floor: this.floor,
      room: this.room,
      gps: this.gpsLocation,
      category: this.category,
      equipmentCode: this.equipmentCode,
      conditionRating: this.conditionRating,
      defectNotes: this.defectNotes,
      photoBase64: this.photoBase64,
      step: this.currentStep,
      updatedAt: Date.now(),
    };
    await saveDraft(draft);

    const draftPill = document.getElementById('draft-indicator');
    if (draftPill) {
      draftPill.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Đã tự động lưu nháp
      `;
    }
  }

  public render() {
    const ratingLabels: { [key: number]: string } = {
      1: '1 sao: Hỏng nặng / Ngừng hoạt động (Cần sửa chữa ngay)',
      2: '2 sao: Kém / Cần bảo trì khắc phục sự cố',
      3: '3 sao: Trung bình / Hoạt động được nhưng có lỗi nhỏ',
      4: '4 sao: Khá tốt / Hoạt động ổn định',
      5: '5 sao: Rất tốt / Thiết bị như mới',
    };

    const progressWidth = `${((this.currentStep - 1) / (this.totalSteps - 1)) * 100}%`;

    this.container.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div>
            <h2 class="card-title">Phiếu Kiểm Tra Cơ Sở Vật Chất</h2>
            <p class="card-description">Thu thập dữ liệu kiểm định hiện trường ngoại tuyến (Tầng hầm / Mất mạng)</p>
          </div>
          <div id="draft-indicator" class="draft-status">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Bản nháp IndexedDB
          </div>
        </div>

        <!-- Step Indicator -->
        <div class="step-indicator-wrapper">
          <div class="step-indicator">
            <div class="step-progress-bar" style="width: ${progressWidth};"></div>

            <div class="step-node ${this.currentStep === 1 ? 'active' : ''} ${this.currentStep > 1 ? 'completed' : ''}">
              <div class="step-circle">${this.currentStep > 1 ? '✓' : '1'}</div>
              <span class="step-label">Vị trí</span>
            </div>

            <div class="step-node ${this.currentStep === 2 ? 'active' : ''} ${this.currentStep > 2 ? 'completed' : ''}">
              <div class="step-circle">${this.currentStep > 2 ? '✓' : '2'}</div>
              <span class="step-label">Thiết bị</span>
            </div>

            <div class="step-node ${this.currentStep === 3 ? 'active' : ''} ${this.currentStep > 3 ? 'completed' : ''}">
              <div class="step-circle">${this.currentStep > 3 ? '✓' : '3'}</div>
              <span class="step-label">Lỗi & Ảnh</span>
            </div>

            <div class="step-node ${this.currentStep === 4 ? 'active' : ''}">
              <div class="step-circle">4</div>
              <span class="step-label">Xác nhận</span>
            </div>
          </div>
        </div>

        <!-- STEP 1: VỊ TRÍ KHUÔN VIÊN -->
        <div id="form-step-1" class="${this.currentStep === 1 ? '' : 'hidden'}">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="select-building">Tòa nhà / Khu vực VKU</label>
              <select id="select-building" class="form-control">
                ${BUILDINGS.map((b) => `<option value="${b}" ${this.building === b ? 'selected' : ''}>${b}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="select-floor">Tầng kiểm tra</label>
              <select id="select-floor" class="form-control">
                ${FLOORS.map((f) => `<option value="${f}" ${this.floor === f ? 'selected' : ''}>${f}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="input-room">Mã / Tên Phòng học (VD: V.A101, LAB 204)</label>
              <input id="input-room" class="form-control" type="text" placeholder="VD: V.A102 hoặc LAB 301" value="${this.room}" />
            </div>

            <div class="form-group">
              <label class="form-label">
                Tọa độ GPS Hiện trường (Capacitor/Web GPS)
                <button type="button" id="btn-gps-refresh" class="btn-gps-refresh">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="22" y1="12" x2="18" y2="12"/>
                    <line x1="6" y1="12" x2="2" y2="12"/>
                    <line x1="12" y1="6" x2="12" y2="2"/>
                    <line x1="12" y1="22" x2="12" y2="18"/>
                  </svg>
                  Định vị lại
                </button>
              </label>
              <div class="gps-box">
                <span id="gps-display" class="gps-value">
                  ${GeolocationService.formatCoordinates(this.gpsLocation)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: THIẾT BỊ & ĐÁNH GIÁ -->
        <div id="form-step-2" class="${this.currentStep === 2 ? '' : 'hidden'}">
          <label class="form-label" style="margin-bottom: 10px;">Hạng mục cơ sở vật chất kiểm tra</label>
          <div class="category-grid">
            ${CATEGORIES.map(
              (cat) => `
              <div class="category-card ${this.category === cat.id ? 'selected' : ''}" data-cat="${cat.id}">
                <div class="category-icon">${this.getCategoryIconSvg(cat.id)}</div>
                <div class="category-name">${cat.name}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); line-height: 1.2;">${cat.description}</div>
              </div>
            `
            ).join('')}
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="input-equip-code">Mã thiết bị / Tem tài sản VKU (Tùy chọn)</label>
              <input id="input-equip-code" class="form-control" type="text" placeholder="VD: VKU-EQUIP-8842" value="${this.equipmentCode}" />
            </div>

            <div class="form-group">
              <label class="form-label">Đánh giá tình trạng (1 - 5 sao)</label>
              <div class="rating-container">
                <div class="star-group">
                  ${[1, 2, 3, 4, 5]
                    .map(
                      (star) => `
                    <button type="button" class="star-btn ${star <= this.conditionRating ? 'active' : ''}" data-rating="${star}">
                      <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </button>
                  `
                    )
                    .join('')}
                </div>
                <span id="rating-desc" class="rating-desc">${ratingLabels[this.conditionRating]}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: CHI TIẾT LỖI & ẢNH CHỤP -->
        <div id="form-step-3" class="${this.currentStep === 3 ? '' : 'hidden'}">
          <div class="form-group" style="margin-bottom: 20px;">
            <label class="form-label" for="textarea-defect">Mô tả sự cố & Ghi chú kiểm định</label>
            <textarea id="textarea-defect" class="form-control" rows="4" placeholder="Mô tả chi tiết tình trạng hư hỏng, vị trí cụ thể trong phòng, đề xuất thay thế...">${this.defectNotes}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">
              Ảnh chụp hiện trường (Capacitor Camera Bridge / Web Fallback)
            </label>
            
            ${
              this.photoBase64
                ? `
              <div class="photo-preview-wrapper">
                <img src="${this.photoBase64}" class="photo-preview-img" alt="Ảnh chụp sự cố" />
                <button type="button" id="btn-remove-photo" class="photo-remove-btn" title="Xóa ảnh chụp">✕</button>
              </div>
            `
                : `
              <div id="photo-drop-zone" class="photo-upload-area">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary-600); margin-bottom: 8px;">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <div style="font-weight: 700; margin-bottom: 4px;">Chụp ảnh thiết bị / Tải ảnh lên</div>
                <div style="font-size: 0.8125rem; color: var(--text-muted);">
                  Hỗ trợ Camera gốc thiết bị & tự động đóng dấu Watermark kiểm định VKU
                </div>
              </div>
            `
            }
          </div>
        </div>

        <!-- STEP 4: XEM LẠI & NỘP BÀI -->
        <div id="form-step-4" class="${this.currentStep === 4 ? '' : 'hidden'}">
          <div style="background: var(--input-bg); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
            <h3 style="font-size: 1rem; margin-bottom: 12px; color: var(--primary-700);">Tóm tắt khảo sát chuẩn bị gửi</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; font-size: 0.875rem;">
              <div><strong>Tòa nhà:</strong> ${this.building}</div>
              <div><strong>Vị trí:</strong> ${this.floor} — ${this.room}</div>
              <div><strong>Hạng mục:</strong> ${CATEGORIES.find((c) => c.id === this.category)?.name}</div>
              <div><strong>Mã thiết bị:</strong> ${this.equipmentCode || 'Không có mã tem'}</div>
              <div><strong>Đánh giá:</strong> ⭐ ${this.conditionRating}/5 sao</div>
              <div><strong>GPS:</strong> ${this.gpsLocation ? `${this.gpsLocation.latitude}, ${this.gpsLocation.longitude}` : 'Chưa lấy'}</div>
            </div>

            <div style="margin-top: 12px; font-size: 0.875rem;">
              <strong>Ghi chú lỗi:</strong>
              <p style="color: var(--text-muted); margin-top: 4px;">${this.defectNotes || '(Không có ghi chú thêm)'}</p>
            </div>

            ${
              this.photoBase64
                ? `
              <div style="margin-top: 14px;">
                <strong>Ảnh đính kèm:</strong>
                <img src="${this.photoBase64}" style="max-height: 140px; border-radius: var(--radius-sm); margin-top: 6px; display: block;" />
              </div>
            `
                : ''
            }
          </div>

          <div style="background: rgba(2, 132, 199, 0.08); border-left: 4px solid var(--primary-600); padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.8125rem;">
            <strong>Cơ chế Ngoại tuyến:</strong> Nếu bạn đang ở tầng hầm hoặc mất mạng, khảo sát sẽ được lưu an toàn với trạng thái <code>PENDING_SYNC</code> trong IndexedDB và tự động đồng bộ khi có kết nối trở lại.
          </div>
        </div>

        <!-- FORM CONTROLS -->
        <div class="form-actions">
          <div>
            ${
              this.currentStep > 1
                ? `
              <button type="button" id="btn-step-prev" class="btn btn-secondary">
                ← Quay lại
              </button>
            `
                : `
              <button type="button" id="btn-reset-draft" class="btn btn-danger" style="font-size: 0.8125rem;">
                Xóa nháp
              </button>
            `
            }
          </div>

          <div>
            ${
              this.currentStep < this.totalSteps
                ? `
              <button type="button" id="btn-step-next" class="btn btn-primary">
                Tiếp tục →
              </button>
            `
                : `
              <button type="button" id="btn-submit-survey" class="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Lưu & Đưa Vào Hàng Đợi Đồng Bộ
              </button>
            `
            }
          </div>
        </div>
      </div>
    `;
  }

  private setupEventListeners() {
    // Step Prev/Next
    const btnNext = document.getElementById('btn-step-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.validateCurrentStep()) {
          this.currentStep++;
          this.autoSaveDraft();
          this.render();
          this.setupEventListeners();
        }
      });
    }

    const btnPrev = document.getElementById('btn-step-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        this.currentStep--;
        this.autoSaveDraft();
        this.render();
        this.setupEventListeners();
      });
    }

    // Reset draft button
    const btnReset = document.getElementById('btn-reset-draft');
    if (btnReset) {
      btnReset.addEventListener('click', async () => {
        if (confirm('Bạn có chắc chắn muốn xóa bản nháp và nhập lại từ đầu?')) {
          await clearDraft();
          this.room = '';
          this.equipmentCode = '';
          this.defectNotes = '';
          this.photoBase64 = '';
          this.conditionRating = 4;
          this.currentStep = 1;
          this.render();
          this.setupEventListeners();
          this.showToast('Đã xóa bản nháp!', 'warning');
        }
      });
    }

    // Input handlers
    const selectBuilding = document.getElementById('select-building') as HTMLSelectElement;
    if (selectBuilding) {
      selectBuilding.addEventListener('change', (e) => {
        this.building = (e.target as HTMLSelectElement).value;
        this.autoSaveDraft();
      });
    }

    const selectFloor = document.getElementById('select-floor') as HTMLSelectElement;
    if (selectFloor) {
      selectFloor.addEventListener('change', (e) => {
        this.floor = (e.target as HTMLSelectElement).value;
        this.autoSaveDraft();
      });
    }

    const inputRoom = document.getElementById('input-room') as HTMLInputElement;
    if (inputRoom) {
      inputRoom.addEventListener('input', (e) => {
        this.room = (e.target as HTMLInputElement).value;
        this.autoSaveDraft();
      });
    }

    const inputEquip = document.getElementById('input-equip-code') as HTMLInputElement;
    if (inputEquip) {
      inputEquip.addEventListener('input', (e) => {
        this.equipmentCode = (e.target as HTMLInputElement).value;
        this.autoSaveDraft();
      });
    }

    const textareaDefect = document.getElementById('textarea-defect') as HTMLTextAreaElement;
    if (textareaDefect) {
      textareaDefect.addEventListener('input', (e) => {
        this.defectNotes = (e.target as HTMLTextAreaElement).value;
        this.autoSaveDraft();
      });
    }

    // GPS refresh button
    const btnGPS = document.getElementById('btn-gps-refresh');
    if (btnGPS) {
      btnGPS.addEventListener('click', () => this.fetchGPS(true));
    }

    // Category cards selection
    const catCards = this.container.querySelectorAll('.category-card');
    catCards.forEach((card) => {
      card.addEventListener('click', () => {
        this.category = card.getAttribute('data-cat') as Category;
        this.autoSaveDraft();
        this.render();
        this.setupEventListeners();
      });
    });

    // Rating star buttons
    const starBtns = this.container.querySelectorAll('.star-btn');
    starBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.conditionRating = parseInt(btn.getAttribute('data-rating') || '4', 10);
        this.autoSaveDraft();
        this.render();
        this.setupEventListeners();
      });
    });

    // Photo capture / dropzone
    const photoZone = document.getElementById('photo-drop-zone');
    if (photoZone) {
      photoZone.addEventListener('click', () => this.capturePhoto());
    }

    const btnRemovePhoto = document.getElementById('btn-remove-photo');
    if (btnRemovePhoto) {
      btnRemovePhoto.addEventListener('click', () => {
        this.photoBase64 = '';
        this.autoSaveDraft();
        this.render();
        this.setupEventListeners();
      });
    }

    // Submit Survey button
    const btnSubmit = document.getElementById('btn-submit-survey');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => this.handleSubmit());
    }
  }

  private validateCurrentStep(): boolean {
    if (this.currentStep === 1) {
      if (!this.room.trim()) {
        this.showToast('Vui lòng nhập số phòng hoặc tên phòng kiểm tra', 'error');
        return false;
      }
    }
    return true;
  }

  private async fetchGPS(isManual: boolean = false) {
    const gpsDisplay = document.getElementById('gps-display');
    if (gpsDisplay) gpsDisplay.innerText = 'Đang định vị vệ tinh GPS...';

    try {
      this.gpsLocation = await GeolocationService.getCurrentLocation();
      if (gpsDisplay) {
        gpsDisplay.innerText = GeolocationService.formatCoordinates(this.gpsLocation);
      }
      this.autoSaveDraft();
      if (isManual) this.showToast('Đã cập nhật tọa độ GPS thành công!', 'success');
    } catch (e) {
      console.warn('GPS error:', e);
      if (gpsDisplay) gpsDisplay.innerText = 'Không thể lấy GPS (Đã dùng mặc định VKU)';
    }
  }

  private async capturePhoto() {
    try {
      const watermarkInfo = `${this.building} - ${this.room || 'Phòng học'}`;
      const photo = await CameraService.takePhoto(watermarkInfo);
      this.photoBase64 = photo;
      await this.autoSaveDraft();
      this.render();
      this.setupEventListeners();
      this.showToast('Đã chụp ảnh hiện trường thành công!', 'success');
    } catch (err: any) {
      if (err.message && !err.message.includes('hủy')) {
        this.showToast(err.message, 'error');
      }
    }
  }

  private async handleSubmit() {
    if (!this.room.trim()) {
      this.showToast('Vui lòng nhập tên/số phòng trước khi nộp!', 'error');
      this.currentStep = 1;
      this.render();
      this.setupEventListeners();
      return;
    }

    const newSurvey: SurveyItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      building: this.building,
      floor: this.floor,
      room: this.room.trim(),
      gps: this.gpsLocation,
      category: this.category,
      equipmentCode: this.equipmentCode.trim(),
      conditionRating: this.conditionRating,
      defectNotes: this.defectNotes.trim(),
      photoBase64: this.photoBase64,
      status: 'PENDING_SYNC',
      syncAttempts: 0,
    };

    // 1. Save to IndexedDB (Always offline-first guarantee!)
    await saveSurvey(newSurvey);

    // 2. Clear Draft
    await clearDraft();

    // 3. Register Background Sync if supported
    await syncEngine.requestBackgroundSync();

    // 4. Reset local form state
    this.room = '';
    this.equipmentCode = '';
    this.defectNotes = '';
    this.photoBase64 = '';
    this.currentStep = 1;

    // 5. Trigger sync queue if online
    if (networkService.isOnline()) {
      this.showToast('Đã lưu! Thiết bị trực tuyến, đang tự động đồng bộ...', 'success');
      syncEngine.syncQueue();
    } else {
      this.showToast('Đã lưu vào bộ nhớ ngoại tuyến (Tầng hầm)! Sẽ gửi khi có mạng.', 'warning');
    }

    // Notify parent to switch tab or refresh queue
    if (this.onSubmittedCallback) {
      this.onSubmittedCallback();
    }

    this.render();
    this.setupEventListeners();
  }

  private getCategoryIconSvg(cat: Category): string {
    switch (cat) {
      case 'hardware':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
      case 'projector':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="16" cy="12" r="3"/><circle cx="6" cy="12" r="1.5"/></svg>`;
      case 'aircon':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
      case 'electrical':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      case 'furniture':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"/></svg>`;
    }
  }
}
