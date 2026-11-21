import { Router } from 'express';
import proveedorController from '../controllers/proveedor.controller.js';

const router = Router();

router.get('/', proveedorController.getAll);
router.get('/:id', proveedorController.getById);
router.post('/', proveedorController.create);
router.patch('/:id', proveedorController.update);
router.delete('/:id', proveedorController.remove);

export default router;
