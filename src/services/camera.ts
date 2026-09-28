import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface PhotoCaptureResult {
  base64: string;
  format: string;
}

export class CameraService {
  /**
   * Capture photo using Capacitor Camera with fallback to HTML5 file input
   */
  public static async takePhoto(watermarkText?: string): Promise<string> {
    try {
      // 1. Try Capacitor Camera plugin
      const photo = await Camera.getPhoto({
        quality: 75,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // Allows choosing Camera or Gallery
        width: 1200,
        height: 1200,
        correctOrientation: true,
      });

      if (photo.dataUrl) {
        return await this.applyWatermark(photo.dataUrl, watermarkText);
      }
    } catch (err: any) {
      console.warn('[CameraService] Capacitor Camera error/dismissed, falling back to Web Input:', err);
      // User cancelled or browser fallback needed
      if (err?.message?.includes('cancelled') || err?.message?.includes('User cancelled')) {
        throw new Error('Đã hủy chụp ảnh');
      }
    }

    // 2. Web File Input fallback
    return this.takePhotoWebFallback(watermarkText);
  }

  /**
   * Web input fallback for standard desktop / mobile browsers
   */
  private static takePhotoWebFallback(watermarkText?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Hint for back camera on mobile browsers

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          reject(new Error('Chưa chọn ảnh'));
          return;
        }

        try {
          const reader = new FileReader();
          reader.onload = async () => {
            const rawBase64 = reader.result as string;
            const watermarked = await this.applyWatermark(rawBase64, watermarkText);
            resolve(watermarked);
          };
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        } catch (e) {
          reject(e);
        }
      };

      input.oncancel = () => {
        reject(new Error('Đã hủy chọn ảnh'));
      };

      input.click();
    });
  }

  /**
   * Adds an official VKU inspection watermark stamp to the photo
   */
  public static async applyWatermark(
    dataUrl: string,
    extraText?: string
  ): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        // Draw original photo
        ctx.drawImage(img, 0, 0, width, height);

        // Watermark styling
        const barHeight = Math.max(36, Math.round(height * 0.06));
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'; // Slate 900 semi-transparent
        ctx.fillRect(0, height - barHeight, width, barHeight);

        // Watermark text
        const fontSize = Math.max(14, Math.round(barHeight * 0.42));
        ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'middle';

        const now = new Date();
        const dateStr = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN');
        const text = `VKU INSPECTION • ${dateStr} ${extraText ? '• ' + extraText : ''}`;

        ctx.fillText(text, 16, height - barHeight / 2);

        // Return compressed JPEG data URL
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };

      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }
}
