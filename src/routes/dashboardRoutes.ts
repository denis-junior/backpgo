import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const dashboardController = new DashboardController();

router.use(authenticateToken);
router.get('/', dashboardController.getAllClients);

export default router;