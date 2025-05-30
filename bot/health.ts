import express, { Request, Response, NextFunction } from 'express';
import { getHealthStatus } from './scheduler';

const app = express();
const port = process.env.PORT || 3000;

// Add CORS headers to allow access from anywhere
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/health', (req: Request, res: Response) => {
  const health = getHealthStatus();
  const status = health.isHealthy ? 200 : 503;
  
  res.status(status).json({
    status: health.isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: health.uptime,
    lastHealthCheck: health.lastHealthCheck,
    lastError: health.lastError,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Add a simple root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Bot is running. Check /health for status.');
});

export const startHealthServer = () => {
  app.listen(port, () => {
    console.log(`Health check server running on port ${port}`);
    console.log(`Health check available at http://localhost:${port}/health`);
  });
}; 