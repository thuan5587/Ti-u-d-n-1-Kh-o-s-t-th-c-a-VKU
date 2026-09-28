export type Category = 
  | 'hardware'
  | 'projector'
  | 'aircon'
  | 'electrical'
  | 'furniture';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'hardware', name: 'Phần cứng (PC/Server)', icon: 'monitor', description: 'Máy tính thực hành, màn hình, chuột, phím' },
  { id: 'projector', name: 'Máy chiếu & Màn hình', icon: 'projector', description: 'Máy chiếu trần, màn chiếu, cáp HDMI/VGA' },
  { id: 'aircon', name: 'Điều hòa & Thông gió', icon: 'fan', description: 'Máy lạnh, quạt treo tường, điều khiển' },
  { id: 'electrical', name: 'Hệ thống Điện', icon: 'zap', description: 'Đèn huỳnh quang/LED, ổ cắm âm bàn, công tắc' },
  { id: 'furniture', name: 'Nội thất & Phòng ốc', icon: 'door', description: 'Bàn ghế giảng đường, cửa ra vào, bảng từ' }
];

export const BUILDINGS = [
  'Khu V - Tòa nhà Công nghệ cao',
  'Khu K - Khu Giảng đường Chính',
  'Khu A - Tòa Nhà Hành chính & Hiệu bộ',
  'Tòa Thư viện số & Nghiên cứu',
  'Ký túc xá Sinh viên VKU',
  'Nhà thể thao Đa năng & Sân tập'
];

export const FLOORS = [
  'Tầng hầm (B1 - Khu máy bay/kho)',
  'Tầng 1 (Trệt)',
  'Tầng 2',
  'Tầng 3',
  'Tầng 4',
  'Tầng 5',
  'Tầng 6 (Sân thượng kỹ thuật)'
];

export type SyncStatus = 'PENDING_SYNC' | 'SYNCING' | 'SYNCED' | 'SYNC_ERROR';

export type ConditionRating = 1 | 2 | 3 | 4 | 5;

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface SurveyItem {
  id: string; // UUID v4
  createdAt: number;
  building: string;
  floor: string;
  room: string;
  gps: GPSLocation | null;
  category: Category;
  equipmentCode: string;
  conditionRating: number; // 1 to 5
  defectNotes: string;
  photoBase64?: string;
  status: SyncStatus;
  syncAttempts: number;
  lastSyncError?: string;
  syncedAt?: number;
}

export interface DraftSurvey {
  building?: string;
  floor?: string;
  room?: string;
  gps?: GPSLocation | null;
  category?: Category;
  equipmentCode?: string;
  conditionRating?: number;
  defectNotes?: string;
  photoBase64?: string;
  step?: number;
  updatedAt: number;
}

export interface MockServerConfig {
  mode: 'success' | 'random_fail' | 'offline_simulate';
  latencyMs: number;
  receivedCount: number;
}
