import { Router } from 'express';
import articleRoutes from './articleRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BeyondChat Articles API',
    version: '1.0.0',
    endpoints: {
      articles: '/api/articles',
      health: '/api/health',
    },
  });
});

router.use('/articles', articleRoutes);

export default router;
