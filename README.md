# VKU Field Survey — Ứng Dụng PWA Khảo Sát Thực Địa Cơ Sở Vật Chất Ngoại Tuyến

> **Tiểu dự án 1:** Khảo sát thực địa VKU — Thu thập dữ liệu ngoại tuyến (PWA & Capacitor Bridge)  
> **Khóa học:** Phát triển ứng dụng đa nền tảng  
> **Trọng số:** 10%

---

## 🎯 Bối cảnh & Tình huống vấn đề

Các thanh tra cơ sở vật chất và kiểm toán viên sinh viên tại Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (**VKU**) phải thực hiện kiểm định tại chỗ các trang thiết bị phòng học, máy chiếu, máy điều hòa, hệ thống điện trong **tầng hầm (B1)** và các khu giảng đường xa xôi nơi **hoàn toàn không có tín hiệu Wi-Fi và 4G/5G**.

Hệ thống **VKU Field Survey** được xây dựng với kiến trúc **Offline-First**, đảm bảo:
1. **Khởi động ngoại tuyến trong chớp mắt (< 1 giây)** nhờ Service Worker và chiến lược Cache-First cho App Shell.
2. **Không bao giờ mất dữ liệu** nhờ bộ nhớ đệm IndexedDB theo thời gian thực (Real-time Draft & Offline Queue).
3. **Tự động gửi tuần tự (FIFO)** lên máy chủ nền khi kết nối mạng được khôi phục (Background Sync).
4. **Cầu nối phần cứng thiết bị** thông qua Capacitor Bridge (`@capacitor/camera`, `@capacitor/network`, `@capacitor/geolocation`) với cơ chế dự phòng (web fallback) mượt mà trên mọi trình duyệt.

---

## 🏗️ Kiến trúc Kỹ thuật

```
VKU Field Survey (PWA + Capacitor)
├── Giao diện (App Shell): HTML5 + Modern Vanilla CSS + Plus Jakarta Sans
├── Trình điều khiển Logic: TypeScript (Vite Bundler)
├── Lưu trữ Ngoại tuyến: IndexedDB (idb wrapper)
│   ├── 'draft'     -> Tự động lưu bản nháp theo thời gian thực
│   ├── 'surveys'   -> Hàng đợi phiếu khảo sát (UUID, timestamp, status)
│   └── 'settings'  -> Cấu hình mô phỏng máy chủ
├── Mạng & Đồng bộ:
│   ├── Service Worker (Cache-First App Shell + Background Sync)
│   ├── @capacitor/network + Web Online/Offline Events
│   └── Sequential FIFO Sync Engine
└── Phần cứng & Cảm biến:
    ├── @capacitor/camera + Canvas Watermark Stamp + Web File Fallback
    └── @capacitor/geolocation + HTML5 GPS Fallback + VKU Campus Coordinates
```

---

## 📋 Tính năng Cốt lõi Chi tiết

### 1. Cài đặt PWA Độc lập (Standalone PWA)
- File `manifest.json` chuẩn cấu hình `display: "standalone"`, `theme_color: "#0284c7"`, `background_color: "#0f172a"`.
- Biểu tượng đáp ứng đầy đủ kích thước: `icon-192.png`, `icon-512.png`, `icon-maskable.png` và vector `icon.svg`.
- Hỗ trợ nút cài đặt PWA trực tiếp (`beforeinstallprompt`).
- Service Worker (`public/sw.js`) lưu cache toàn bộ tài nguyên App Shell (HTML, CSS, JS, fonts, icons) với chiến lược **Cache-First**, khởi động ngoại tuyến dưới 1 giây.

### 2. Biểu mẫu Khảo sát Đa bước & Lưu Nháp Tức thì (Real-time Draft Auto-save)
- **Bước 1: Vị trí khuôn viên:** Chọn Tòa nhà (Khu V, Khu K, Khu A, Thư viện, KTX, Nhà đa năng), Tầng (Tầng hầm B1, Tầng 1 đến 6), Số phòng (`V.A101`, `LAB 302`...), lấy tọa độ GPS thực địa.
- **Bước 2: Hạng mục & Đánh giá:** Phân loại thiết bị (Phần cứng PC/Server, Máy chiếu, Điều hòa, Hệ thống Điện, Nội thất phòng ốc), Mã tem tài sản VKU, Đánh giá chất lượng trực quan 1–5 sao với mô tả cụ thể.
- **Bước 3: Chi tiết lỗi & Ảnh hiện trường:** Ghi chú mô tả lỗi sự cố, chụp ảnh từ Camera thiết bị (tích hợp đóng dấu chìm Watermark: Thời gian + Tòa nhà + Phòng học phục vụ thanh tra).
- **Bước 4: Xác nhận & Nộp bài:** Tóm tắt toàn bộ dữ liệu trước khi lưu vào IndexedDB.
- **Cơ chế chống mất dữ liệu:** Mọi thao tác gõ phím / đổi bước đều được tự động lưu vào bảng `draft` trong IndexedDB. Khi người dùng vô tình tải lại trình duyệt (F5), toàn bộ dữ liệu đang điền vẫn còn nguyên vẹn.

### 3. Hàng đợi Ngoại tuyến & Tự động Đồng bộ (Offline Queue & Auto Sync)
- Khi thanh tra bấm lưu phiếu tại tầng hầm (mất mạng):
  - Phiếu khảo sát được cấp mã **UUID v4**, thời gian tạo, và lưu trong IndexedDB với trạng thái `PENDING_SYNC`.
  - Huy hiệu (badge) trên thanh tiêu đề tăng số lượng chờ đồng bộ.
- Khi thiết bị kết nối mạng trở lại (hoặc thanh tra bước ra khỏi tầng hầm):
  - Hệ thống lắng nghe sự kiện mạng qua `@capacitor/network`, `window.addEventListener('online')` và Service Worker Background Sync.
  - Kích hoạt **Sync Engine**: Quét hàng đợi và gửi tuần tự (FIFO) từng phiếu lên máy chủ.
  - Cập nhật trạng thái từng phiếu thành `SYNCING` ➜ `SYNCED` (kèm thời gian đồng bộ `syncedAt`) hoặc `SYNC_ERROR` nếu máy chủ lỗi để chờ gửi lại.
  - Hiệu ứng chúc mừng (Confetti) và thông báo Toast khi đồng bộ hoàn tất.

### 4. Bảng Điều khiển Mô phỏng Kiểm Thử (Simulation & Dev Tools)
Tích hợp sẵn tab **"Mô phỏng & Dev"** giúp người đánh giá dễ dàng kiểm thử:
- **Nút "Giả lập vào Tầng hầm (Cắt mạng)":** Chuyển toàn bộ ứng dụng sang trạng thái Ngoại tuyến ngay trên trình duyệt mà không cần tắt Wi-Fi máy tính.
- **Nút "Khôi phục kết nối Mạng":** Giả lập bước ra khỏi tầng hầm, kích hoạt đồng bộ tự động tức thì.
- **Cấu hình phản hồi Máy chủ:** Chuyển đổi giữa 3 chế độ: *Thành công 100%*, *Máy chủ chập chờn (Random 503)* để kiểm tra nút "Thử lại", và *Máy chủ ngoại tuyến*.
- **Nhật ký Máy chủ (Server Inbound Logs):** Xem trực quan các gói tin máy chủ đã tiếp nhận thành công.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Yêu cầu môi trường
- Node.js version 18 trở lên (đã kiểm thử tương thích Node.js v22)
- Trình duyệt hiện đại (Chrome, Edge, Firefox, Safari)

### Các lệnh thực thi

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển cục bộ
npm run dev
```

Sau khi chạy, mở trình duyệt và truy cập:
👉 `http://localhost:5173/`

### Kiểm tra bản Build Production
```bash
npm run build
npm run preview
```

---

## 📂 Cấu trúc Thư mục Dự án

```
Thực hành 1/
├── public/
│   ├── icons/
│   │   ├── icon-192.png       # Biểu tượng PWA 192x192
│   │   ├── icon-512.png       # Biểu tượng PWA 512x512
│   │   ├── icon-maskable.png  # Biểu tượng Maskable Android
│   │   └── icon.svg           # Biểu tượng Vector SVG
│   ├── manifest.json          # Web App Manifest tiêu chuẩn
│   └── sw.js                  # Service Worker Cache-First & Background Sync
├── src/
│   ├── components/
│   │   ├── DevSettings.ts     # Bảng điều khiển giả lập Tầng hầm & Mock Server
│   │   ├── InspectionForm.ts  # Biểu mẫu kiểm định 4 bước + Tự động lưu nháp
│   │   ├── StatsDashboard.ts  # Bảng thống kê cơ sở vật chất & PWA Checklist
│   │   └── SurveyList.ts      # Quản lý Hàng đợi & Lịch sử phiếu khảo sát
│   ├── services/
│   │   ├── camera.ts          # Capacitor Camera Bridge + Watermark + Web Fallback
│   │   ├── db.ts              # IndexedDB wrapper qua thư viện idb
│   │   ├── geolocation.ts     # Định vị GPS hiện trường
│   │   ├── mockServer.ts      # Mô phỏng máy chủ tiếp nhận dữ liệu đồng bộ
│   │   ├── network.ts         # Giám sát trạng thái mạng thời gian thực
│   │   └── sync.ts            # Động cơ xử lý hàng đợi tuần tự (FIFO Sync Engine)
│   ├── styles/
│   │   └── main.css           # Hệ thống giao diện hiện đại, glassmorphism, Dark/Light mode
│   ├── types/
│   │   └── survey.ts          # Định nghĩa kiểu dữ liệu TypeScript
│   └── main.ts                # Điều phối trung tâm ứng dụng
├── capacitor.config.ts        # Cấu hình Capacitor Bridge cho Mobile
├── index.html                 # App Shell & Meta tags chuẩn PWA
├── package.json               # Danh sách thư viện phụ thuộc
├── tsconfig.json              # Cấu hình TypeScript
├── vite.config.ts             # Cấu hình Vite
└── README.md                  # Tài liệu hướng dẫn đồ án
```
