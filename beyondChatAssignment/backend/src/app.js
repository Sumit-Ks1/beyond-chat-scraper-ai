import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/index.js';

const app = express();


app.use(helmet());

app.use(cors(config.cors));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);


app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));


if (config.server.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}


app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to BeyondChat Articles API',
    documentation: '/api',
  });
});


app.use(notFoundHandler);

app.use(errorHandler);

export default app;
