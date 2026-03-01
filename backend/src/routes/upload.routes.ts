import { Router } from 'express';
import { uploadAndPreview } from '../controllers/upload.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../config/multer';

const router = Router();

router.use(protect);

router.post('/preview', upload.single('file'), uploadAndPreview);

export default router;
