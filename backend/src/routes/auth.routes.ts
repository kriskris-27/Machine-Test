import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { loginValidator, validateRequest } from '../middlewares/validator.middleware';

const router = Router();

router.post('/login', loginValidator, validateRequest, login);

export default router;
