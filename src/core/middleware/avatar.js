import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';


const UPLOAD_DIR = path.join(process.cwd(), 'public', 'avatar');
const ALLOWED_MIMETYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_DIMENSION = 3000;
const QUALITY = 90;


if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true, mode: 0o755 });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(16).toString('hex');
        const timestamp = Date.now();
        cb(null, `${timestamp}_${randomName}`);
    }
});


async function validateAndProcessImage(tempPath, originalMimetype) {
    try {
        const buffer = fs.readFileSync(tempPath);
        const detectedType = await fileTypeFromBuffer(buffer);

        if (!detectedType || !ALLOWED_MIMETYPES.includes(detectedType.mime)) {
            throw new Error('Format file tidak didukung untuk portfolio');
        }

        const metadata = await sharp(buffer).metadata();
        if (!metadata.width || !metadata.height) {
            throw new Error('File bukan gambar yang valid');
        }

        // Cek resolusi minimum untuk portfolio (minimal 800px di sisi terpendek)
        const minDimension = Math.min(metadata.width, metadata.height);
        if (minDimension < 800) {
            throw new Error('Resolusi terlalu kecil untuk portfolio (minimal 800px)');
        }

        // Generate final filename dengan ekstensi yang benar
        const finalFilename = `${path.parse(tempPath).name}.${detectedType.ext}`;
        const finalPath = path.join(UPLOAD_DIR, finalFilename);

        // Proses gambar portfolio dengan kualitas tinggi
        await sharp(tempPath)
            .resize(MAX_DIMENSION, MAX_DIMENSION, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .rotate()
            .jpeg({ quality: QUALITY, progressive: true })
            .toFile(finalPath);

        // Hapus file temporary
        fs.unlinkSync(tempPath);

        const finalStats = fs.statSync(finalPath);
        const finalMetadata = await sharp(finalPath).metadata();

        return {
            success: true,
            filename: finalFilename,
            path: finalPath,
            size: finalStats.size,
            dimensions: {
                width: finalMetadata.width,
                height: finalMetadata.height
            },
            mimetype: 'image/jpeg'
        };

    } catch (error) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        return {
            success: false,
            error: error.message
        };
    }
}


const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE, files: 1 },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
            return cb(new Error(`Format tidak didukung: ${file.mimetype}`));
        }

        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExts = ['.png', '.jpg', '.jpeg', '.webp'];
        if (!allowedExts.includes(ext)) {
            return cb(new Error(`Ekstensi tidak didukung: ${ext}`));
        }

        const suspiciousPatterns = /\.(php|js|html|exe|bat|sh|cmd|scr|jsp|asp)$/i;
        if (suspiciousPatterns.test(file.originalname)) {
            return cb(new Error('Nama file tidak diizinkan'));
        }

        cb(null, true);
    }
});


const UploadAvatarMiddleware = async (req, res, next) => {
    upload.single('avatar')(req, res, async (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                success: false,
                error: 'Upload gagal',
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Tidak ada file yang diupload'
            });
        }

        const result = await validateAndProcessImage(
            req.file.path,
            req.file.mimetype
        );

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: 'Validasi gambar gagal',
                message: result.error
            });
        }

        req.image = {
            filename: result.filename,
            originalName: req.file.originalname,
            size: result.size,
            dimensions: result.dimensions,
        };

        next();
    });
};


export const deleteAvatar = (filename) => {
    try {
        const filePath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return { success: true, message: 'file deleted successfully' };
        }
        return { success: false, message: 'file not found' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};


export const serveAvatar = (filename) => {
    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Image tidak ditemukan' });
    }

    return filePath;
};

export default UploadAvatarMiddleware;