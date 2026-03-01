import multer from 'multer';
import path from 'path';
import { AppError } from '../middlewares/error.middleware';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const filetypes = /csv|xlsx|axls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // We also check mimetypes for better security
    const mimetypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];

    if (extname || mimetypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new AppError(400, 'Error: Only .csv, .xlsx, and .axls files are allowed!'), false);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
