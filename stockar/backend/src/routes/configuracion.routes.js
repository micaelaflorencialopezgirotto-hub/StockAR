import { Router } from 'express';
import configuracionController from '../controllers/configuracion.controller.js';

const router = Router();

// Una sola fila de configuración: no lleva id
router.get('/', configuracionController.get);
router.patch('/', configuracionController.update);

export default router;
