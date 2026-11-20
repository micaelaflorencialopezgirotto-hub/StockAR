import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ mensaje: 'API de StockAR funcionando' });
});

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
