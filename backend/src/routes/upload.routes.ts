import { Router, Request, Response, NextFunction } from 'express';
import { uploadAndPreview, uploadAndDistribute } from '../controllers/upload.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../config/multer';

const router: Router = Router();

router.use(protect);

router.post('/preview', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    uploadAndPreview(req, res, next);
});

router.post('/distribute', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    uploadAndDistribute(req, res, next);
});

export default router;
