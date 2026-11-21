import { Router } from 'express';
import ordenCompraItemController from '../controllers/ordenCompraItem.controller.js';

const router = Router();

router.get('/', ordenCompraItemController.getAll);
router.get('/:id', ordenCompraItemController.getById);
router.post('/', ordenCompraItemController.create);
router.patch('/:id', ordenCompraItemController.update);
router.delete('/:id', ordenCompraItemController.remove);

export default router;
