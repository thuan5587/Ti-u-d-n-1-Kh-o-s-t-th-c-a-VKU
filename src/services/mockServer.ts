import { SurveyItem, MockServerConfig } from '../types/survey';
import { getMockConfig, saveMockConfig } from './db';

export interface ServerSyncLog {
  id: string;
  surveyId: string;
  equipmentCode: string;
  category: string;
  status: 'SUCCESS' | 'REJECTED' | 'FAILED';
  message: string;
  receivedAt: number;
}

const SERVER_LOGS_KEY = 'vku_server_received_logs';

class MockServerService {
  private config: MockServerConfig = {
    mode: 'success',
    latencyMs: 650,
    receivedCount: 0,
  };

  private logs: ServerSyncLog[] = [];

  constructor() {
    this.init();
  }

  private async init() {
    try {
      this.config = await getMockConfig();
      const rawLogs = localStorage.getItem(SERVER_LOGS_KEY);
      if (rawLogs) {
        this.logs = JSON.parse(rawLogs);
      }
    } catch (e) {
      console.warn('[MockServer] Failed to load config from DB', e);
    }
  }

  public getConfig(): MockServerConfig {
    return { ...this.config };
  }

  public async updateConfig(newConfig: Partial<MockServerConfig>): Promise<MockServerConfig> {
    this.config = { ...this.config, ...newConfig };
    await saveMockConfig(this.config);
    return this.config;
  }

  public getLogs(): ServerSyncLog[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    localStorage.removeItem(SERVER_LOGS_KEY);
  }

  /**
   * Simulates an HTTP POST /api/surveys/sync endpoint
   */
  public async syncSurveyToServer(survey: SurveyItem): Promise<{ success: boolean; message: string; serverId?: string }> {
    // 1. Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, this.config.latencyMs));

    // 2. Mode checks
    if (this.config.mode === 'offline_simulate') {
      const errLog: ServerSyncLog = {
        id: crypto.randomUUID(),
        surveyId: survey.id,
        equipmentCode: survey.equipmentCode,
        category: survey.category,
        status: 'FAILED',
        message: 'Mô phỏng máy chủ không thể tiếp cận (Connection Refused)',
        receivedAt: Date.now(),
      };
      this.addLog(errLog);
      throw new Error('Không thể kết nối đến Máy chủ VKU (Lỗi mạng hoặc máy chủ ngoại tuyến)');
    }

    if (this.config.mode === 'random_fail') {
      const shouldFail = Math.random() < 0.5;
      if (shouldFail) {
        const errLog: ServerSyncLog = {
          id: crypto.randomUUID(),
          surveyId: survey.id,
          equipmentCode: survey.equipmentCode,
          category: survey.category,
          status: 'FAILED',
          message: 'Lỗi 503: Máy chủ cơ sở vật chất VKU quá tải hoặc chập chờn',
          receivedAt: Date.now(),
        };
        this.addLog(errLog);
        throw new Error('503 Service Unavailable: Máy chủ VKU tạm thời quá tải');
      }
    }

    // 3. Validation
    if (!survey.room || !survey.building) {
      const rejectLog: ServerSyncLog = {
        id: crypto.randomUUID(),
        surveyId: survey.id,
        equipmentCode: survey.equipmentCode,
        category: survey.category,
        status: 'REJECTED',
        message: 'Thiếu thông tin phòng hoặc tòa nhà',
        receivedAt: Date.now(),
      };
      this.addLog(rejectLog);
      throw new Error('Dữ liệu khảo sát không hợp lệ (Thiếu thông tin phòng/tòa nhà)');
    }

    // 4. Success handling
    this.config.receivedCount = (this.config.receivedCount || 0) + 1;
    await saveMockConfig(this.config);

    const serverId = `VKU-SRV-${Date.now().toString(36).toUpperCase()}`;
    const successLog: ServerSyncLog = {
      id: serverId,
      surveyId: survey.id,
      equipmentCode: survey.equipmentCode || 'Không mã',
      category: survey.category,
      status: 'SUCCESS',
      message: `Đồng bộ thành công [${survey.building} - ${survey.room}]`,
      receivedAt: Date.now(),
    };
    this.addLog(successLog);

    return {
      success: true,
      message: 'Khảo sát đã được lưu thành công trên Máy chủ VKU Facilities',
      serverId,
    };
  }

  private addLog(log: ServerSyncLog) {
    this.logs.unshift(log);
    if (this.logs.length > 50) this.logs.pop();
    try {
      localStorage.setItem(SERVER_LOGS_KEY, JSON.stringify(this.logs));
    } catch {
      // Ignore quota errors
    }
  }
}

export const mockServer = new MockServerService();
