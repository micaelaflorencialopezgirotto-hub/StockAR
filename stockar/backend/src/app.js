import express from 'express';
import indexRoutes from './routes/index.routes.js';

const app = express();

app.use(express.json());

app.use('/api', indexRoutes);

export default app;
