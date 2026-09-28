import { Network, ConnectionStatus } from '@capacitor/network';

type NetworkCallback = (isOnline: boolean, connectionType: string) => void;

class NetworkService {
  private isOnlineState: boolean = true;
  private connectionTypeState: string = 'unknown';
  private listeners: Set<NetworkCallback> = new Set();
  private simulatedOffline: boolean = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // 1. Initial check using Capacitor Network
      const status = await Network.getStatus();
      this.isOnlineState = status.connected;
      this.connectionTypeState = status.connectionType;

      // 2. Listen to Capacitor Network changes
      await Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
        this.handleStatusChange(status.connected, status.connectionType);
      });
    } catch (err) {
      console.warn('[NetworkService] Capacitor Network not available, using Web API fallback', err);
      this.isOnlineState = navigator.onLine;
      this.connectionTypeState = 'web';
    }

    // 3. Fallback: Browser native online/offline listeners
    window.addEventListener('online', () => {
      this.handleStatusChange(true, 'wifi');
    });

    window.addEventListener('offline', () => {
      this.handleStatusChange(false, 'none');
    });
  }

  private handleStatusChange(connected: boolean, type: string) {
    if (this.simulatedOffline) {
      // In simulated offline mode, suppress actual online triggers
      this.notifyListeners(false, 'simulated-offline');
      return;
    }
    this.isOnlineState = connected;
    this.connectionTypeState = type;
    this.notifyListeners(connected, type);
  }

  public isOnline(): boolean {
    if (this.simulatedOffline) return false;
    return this.isOnlineState;
  }

  public getConnectionType(): string {
    if (this.simulatedOffline) return 'simulated-offline';
    return this.connectionTypeState;
  }

  public setSimulatedOffline(forceOffline: boolean) {
    this.simulatedOffline = forceOffline;
    const effectiveOnline = forceOffline ? false : (navigator.onLine && this.isOnlineState);
    this.notifyListeners(effectiveOnline, forceOffline ? 'simulated-offline' : this.connectionTypeState);
  }

  public isSimulatingOffline(): boolean {
    return this.simulatedOffline;
  }

  public subscribe(cb: NetworkCallback): () => void {
    this.listeners.add(cb);
    // Immediate callback with current state
    cb(this.isOnline(), this.getConnectionType());
    return () => this.listeners.delete(cb);
  }

  private notifyListeners(isOnline: boolean, type: string) {
    this.listeners.forEach((cb) => {
      try {
        cb(isOnline, type);
      } catch (e) {
        console.error('[NetworkService] Listener error:', e);
      }
    });
  }
}

export const networkService = new NetworkService();
