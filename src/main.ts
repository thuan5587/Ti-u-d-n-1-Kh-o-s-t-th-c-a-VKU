import confetti from 'canvas-confetti';
import { InspectionForm } from './components/InspectionForm';
import { SurveyList } from './components/SurveyList';
import { StatsDashboard } from './components/StatsDashboard';
import { DevSettings } from './components/DevSettings';
import { networkService } from './services/network';
import { syncEngine } from './services/sync';

class App {
  private activeTab: 'form' | 'queue' | 'stats' | 'settings' = 'form';
  private deferredInstallPrompt: any = null;

  // Components
  private inspectionForm!: InspectionForm;
  private surveyList!: SurveyList;
  private statsDashboard!: StatsDashboard;
  private devSettings!: DevSettings;

  constructor() {
    this.init();
  }

  private async init() {
    this.registerServiceWorker();
    this.initTheme();
    this.initPwaInstall();
    this.initToasts();
    this.initModal();
    this.initNetworkListener();
    this.initSyncListener();
    this.initNavigation();

    // Mount UI components
    const tabFormEl = document.getElementById('tab-form')!;
    const tabQueueEl = document.getElementById('tab-queue')!;
    const tabStatsEl = document.getElementById('tab-stats')!;
    const tabSettingsEl = document.getElementById('tab-settings')!;

    this.inspectionForm = new InspectionForm(
      tabFormEl,
      (msg, type) => this.showToast(msg, type),
      () => {
        // When survey submitted, switch to queue tab
        this.switchTab('queue');
      }
    );

    this.surveyList = new SurveyList(
      tabQueueEl,
      (msg, type) => this.showToast(msg, type),
      (title, content) => this.openModal(title, content)
    );

    this.statsDashboard = new StatsDashboard(tabStatsEl);
    this.devSettings = new DevSettings(tabSettingsEl, (msg, type) => this.showToast(msg, type));

    // Initial check of queue badge
    await syncEngine.notifyQueueChanged();
  }

  // ==================== SERVICE WORKER REGISTRATION ====================
  private registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((reg) => {
            console.log('[PWA] ServiceWorker registered successfully with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] ServiceWorker registration failed:', err);
          });
      });
    }
  }

  // ==================== THEME TOGGLE ====================
  private initTheme() {
    const savedTheme = localStorage.getItem('vku_theme') || 'theme-light';
    document.body.className = savedTheme;
    this.updateThemeIcons(savedTheme);

    const btnTheme = document.getElementById('btn-theme-toggle');
    if (btnTheme) {
      btnTheme.addEventListener('click', () => {
        const isDark = document.body.classList.contains('theme-dark');
        const newTheme = isDark ? 'theme-light' : 'theme-dark';
        document.body.className = newTheme;
        localStorage.setItem('vku_theme', newTheme);
        this.updateThemeIcons(newTheme);
      });
    }
  }

  private updateThemeIcons(theme: string) {
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (theme === 'theme-dark') {
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    } else {
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    }
  }

  // ==================== PWA INSTALL PROMPT ====================
  private initPwaInstall() {
    const btnInstall = document.getElementById('btn-install-pwa');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (btnInstall) {
        btnInstall.classList.remove('hidden');
      }
    });

    if (btnInstall) {
      btnInstall.addEventListener('click', async () => {
        if (this.deferredInstallPrompt) {
          this.deferredInstallPrompt.prompt();
          const { outcome } = await this.deferredInstallPrompt.userChoice;
          console.log(`[PWA] Install prompt outcome: ${outcome}`);
          this.deferredInstallPrompt = null;
          btnInstall.classList.add('hidden');
        } else {
          this.showToast('Bạn có thể cài đặt PWA bằng cách chọn Thêm vào MH chính trên trình duyệt', 'warning');
        }
      });
    }

    window.addEventListener('appinstalled', () => {
      console.log('[PWA] Application installed on device!');
      this.showToast('Đã cài đặt VKU Field Survey thành công!', 'success');
      if (btnInstall) btnInstall.classList.add('hidden');
    });
  }

  // ==================== NETWORK STATUS ====================
  private initNetworkListener() {
    const pill = document.getElementById('network-pill');
    const text = document.getElementById('network-text');
    const banner = document.getElementById('offline-banner');

    networkService.subscribe((isOnline) => {
      if (isOnline) {
        pill?.classList.remove('offline');
        pill?.classList.add('online');
        if (text) text.innerText = 'TRỰC TUYẾN';
        banner?.classList.add('hidden');
      } else {
        pill?.classList.remove('online');
        pill?.classList.add('offline');
        if (text) text.innerText = 'NGOẠI TUYẾN - TẦNG HẦM';
        banner?.classList.remove('hidden');
      }
    });
  }

  // ==================== SYNC NOTIFICATIONS & BADGES ====================
  private initSyncListener() {
    const headerCount = document.getElementById('header-queue-count');
    const navCount = document.getElementById('nav-queue-count');
    const navBadge = document.getElementById('nav-queue-badge');
    const syncIcon = document.getElementById('sync-icon');
    const btnHeaderSync = document.getElementById('btn-header-sync');

    syncEngine.onQueueChange((count) => {
      if (headerCount) headerCount.innerText = count.toString();
      if (navCount) navCount.innerText = count.toString();
      if (navBadge) {
        navBadge.innerText = count.toString();
        if (count > 0) {
          navBadge.classList.remove('hidden');
        } else {
          navBadge.classList.add('hidden');
        }
      }
    });

    syncEngine.onProgress((current, total, item) => {
      syncIcon?.classList.add('spinning');
      if (item) {
        this.showToast(`Đang gửi (${current}/${total}): [${item.building} - ${item.room}]...`);
      }
    });

    syncEngine.onComplete((success, errors) => {
      syncIcon?.classList.remove('spinning');
      if (success > 0) {
        this.showToast(`Đồng bộ thành công ${success} khảo sát lên máy chủ!`, 'success');
        // Trigger celebratory confetti effect
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
          });
        } catch {
          // Ignore
        }
      }
      if (errors > 0) {
        this.showToast(`Có ${errors} khảo sát chưa thể gửi (sẽ lưu lại trong queue)`, 'warning');
      }
      this.surveyList?.refresh();
      this.statsDashboard?.refresh();
    });

    if (btnHeaderSync) {
      btnHeaderSync.addEventListener('click', async () => {
        if (!networkService.isOnline()) {
          this.showToast('Bạn đang ở tầng hầm ngoại tuyến. Vui lòng kết nối mạng để đồng bộ.', 'warning');
          return;
        }
        syncIcon?.classList.add('spinning');
        await syncEngine.syncQueue(true);
        syncIcon?.classList.remove('spinning');
      });
    }
  }

  // ==================== NAVIGATION TABS ====================
  private initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab') as any;
        this.switchTab(tab);
      });
    });
  }

  private switchTab(tab: 'form' | 'queue' | 'stats' | 'settings') {
    this.activeTab = tab;

    // Update nav active states
    document.querySelectorAll('.nav-item').forEach((item) => {
      if (item.getAttribute('data-tab') === tab) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle tab sections
    const tabs: { [key: string]: HTMLElement | null } = {
      form: document.getElementById('tab-form'),
      queue: document.getElementById('tab-queue'),
      stats: document.getElementById('tab-stats'),
      settings: document.getElementById('tab-settings'),
    };

    Object.keys(tabs).forEach((key) => {
      if (key === tab) {
        tabs[key]?.classList.remove('hidden');
      } else {
        tabs[key]?.classList.add('hidden');
      }
    });

    // Refresh view data when opening tabs
    if (tab === 'queue') {
      this.surveyList?.refresh();
    } else if (tab === 'stats') {
      this.statsDashboard?.refresh();
    } else if (tab === 'settings') {
      this.devSettings?.render();
    }
  }

  // ==================== TOAST & MODAL SYSTEM ====================
  private initToasts() {
    // Container is ready in HTML
  }

  public showToast(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  private initModal() {
    const modalBackdrop = document.getElementById('global-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    closeBtn?.addEventListener('click', () => this.closeModal());
    modalBackdrop?.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) this.closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  public openModal(title: string, contentHtml: string) {
    const modalBackdrop = document.getElementById('global-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (modalTitle) modalTitle.innerText = title;
    if (modalBody) modalBody.innerHTML = contentHtml;
    modalBackdrop?.classList.remove('hidden');
  }

  public closeModal() {
    const modalBackdrop = document.getElementById('global-modal');
    modalBackdrop?.classList.add('hidden');
  }
}

// Instantiate application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
