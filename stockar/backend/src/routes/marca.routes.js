import { Router } from 'express';
import marcaController from '../controllers/marca.controller.js';

const router = Router();

router.get('/', marcaController.getAll);
router.get('/:id', marcaController.getById);
router.post('/', marcaController.create);
router.patch('/:id', marcaController.update);
router.delete('/:id', marcaController.remove);

export default router;
