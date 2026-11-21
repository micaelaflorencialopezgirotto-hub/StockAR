import { Router } from 'express';
import depositoController from '../controllers/deposito.controller.js';

const router = Router();

router.get('/', depositoController.getAll);
router.get('/:id', depositoController.getById);
router.post('/', depositoController.create);
router.patch('/:id', depositoController.update);
router.delete('/:id', depositoController.remove);

export default router;
