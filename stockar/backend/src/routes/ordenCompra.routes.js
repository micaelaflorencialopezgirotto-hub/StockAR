import { Router } from 'express';
import ordenCompraController from '../controllers/ordenCompra.controller.js';

const router = Router();

router.get('/', ordenCompraController.getAll);
router.get('/:id', ordenCompraController.getById);
router.post('/', ordenCompraController.create);
router.patch('/:id', ordenCompraController.update);
router.delete('/:id', ordenCompraController.remove);

export default router;
