import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const clientController = new ClientController();


router.use(authenticateToken);
router.post('/', clientController.createClient);
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export default router;