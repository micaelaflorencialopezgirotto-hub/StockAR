import { Router } from 'express';
import listaPreciosItemController from '../controllers/listaPreciosItem.controller.js';

const router = Router();

router.get('/', listaPreciosItemController.getAll);
router.get('/:id', listaPreciosItemController.getById);
router.post('/', listaPreciosItemController.create);
router.patch('/:id', listaPreciosItemController.update);
router.delete('/:id', listaPreciosItemController.remove);

export default router;
