import cors from 'cors';
import express from 'express';
import { createApiRouter } from './routes/apiRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp(pool, environment = process.env) {
  const app = express();
  const allowedOrigins = (environment.WEB_ORIGINS ?? 'http://localhost:5173,http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: '1mb' }));
  app.get('/api/health', async (_request, response, next) => {
    try {
      await pool.execute('SELECT 1');
      response.json({ data: { status: 'ok' } });
    } catch (error) {
      next(error);
    }
  });
  app.use('/api', createApiRouter(pool));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
