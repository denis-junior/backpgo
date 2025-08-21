import { Router } from 'express';
import { ContractController } from '../controllers/ContractController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const contractController = new ContractController();


router.use(authenticateToken);
// router.post('/', contractController.createClient);
// router.get('/', contractController.getAllClients);
// router.get('/:id', contractController.getClientById);
router.put('/status/:id', contractController.updateStatusContract);
router.put('/sign/:id', contractController.signContract);
router.put('/accept-proposal/:id', contractController.acceptProposal);
// router.delete('/:id', contractController.deleteClient);

export default router;