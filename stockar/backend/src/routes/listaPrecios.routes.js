import { Router } from 'express';
import listaPreciosController from '../controllers/listaPrecios.controller.js';

const router = Router();

router.get('/', listaPreciosController.getAll);
router.get('/:id', listaPreciosController.getById);
router.post('/', listaPreciosController.create);
router.patch('/:id', listaPreciosController.update);
router.delete('/:id', listaPreciosController.remove);

export default router;
