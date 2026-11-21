import { Router } from 'express';
import historialPrecioController from '../controllers/historialPrecio.controller.js';

const router = Router();

router.get('/', historialPrecioController.getAll);
router.get('/:id', historialPrecioController.getById);
router.post('/', historialPrecioController.create);
router.patch('/:id', historialPrecioController.update);
router.delete('/:id', historialPrecioController.remove);

export default router;
