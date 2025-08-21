import { Router } from 'express';
import { FunctionsController } from '../controllers/FunctionsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const functionController = new FunctionsController();

router.use(authenticateToken);
router.get('/', functionController.getAllFunctions);
router.post('/', functionController.createFunction);
// router.get('/:id', functionController.getFunctionById);
router.put('/:id', functionController.updateFunction);
router.delete('/:id', functionController.deleteFunction);
router.post('/execute-query', functionController.executeQuery);
router.post('/execute-query-for-all', functionController.executeQueryForAll);

export default router;