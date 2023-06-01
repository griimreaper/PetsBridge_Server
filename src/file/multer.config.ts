import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
      callback(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Aquí puedes realizar la validación para permitir solo ciertos tipos de archivos
    const allowedFormats = ['.jpg', '.png', '.jpeg', '.pdf'];
    const ext = extname(file.originalname).toLowerCase();
    if (allowedFormats.includes(ext)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file format'));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  cleanup: true,
};
