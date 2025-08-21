import { Router } from 'express';
import { SellerController } from '../controllers/SellerController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const sellerController = new SellerController();

router.use(authenticateToken);
router.post('/', sellerController.createSeller);
router.get('/', sellerController.getAllSellers);
router.get('/:id', sellerController.getSellerById);
router.put('/:id', sellerController.updateSeller);
router.delete('/:id', sellerController.deleteSeller);

export default router;