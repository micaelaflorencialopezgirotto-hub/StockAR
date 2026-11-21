import { Router } from 'express';
import usuarioController from '../controllers/usuario.controller.js';

const router = Router();

router.get('/', usuarioController.getAll);
router.get('/:id', usuarioController.getById);
router.post('/', usuarioController.create);
router.patch('/:id', usuarioController.update);
router.delete('/:id', usuarioController.remove);

export default router;
