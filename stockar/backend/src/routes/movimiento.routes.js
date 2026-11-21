import { Router } from 'express';
import movimientoController from '../controllers/movimiento.controller.js';

const router = Router();

// Kárdex inmutable: no hay PATCH ni DELETE
router.get('/', movimientoController.getAll);
router.get('/:id', movimientoController.getById);
router.post('/', movimientoController.create);

export default router;
