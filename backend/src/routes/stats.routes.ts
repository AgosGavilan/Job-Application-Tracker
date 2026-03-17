import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getSummary, getWeekly } from '../controllers/stats.controller';

const router = Router();

router.use(authenticateToken);

router.get('/summary', getSummary);
router.get('/weekly', getWeekly);

export default router;