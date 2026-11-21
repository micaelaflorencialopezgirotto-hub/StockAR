import { Router } from 'express';
import productoProveedorController from '../controllers/productoProveedor.controller.js';

const router = Router();

router.get('/', productoProveedorController.getAll);
router.get('/:id', productoProveedorController.getById);
router.post('/', productoProveedorController.create);
router.patch('/:id', productoProveedorController.update);
router.delete('/:id', productoProveedorController.remove);

export default router;
