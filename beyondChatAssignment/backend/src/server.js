
import app from './app.js';
import config from './config/index.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';


process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  
  if (config.server.isProduction) {
    process.exit(1);
  }
});


process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});


const startServer = async () => {
  try {
   
    await connectDatabase();

    
    const server = app.listen(config.server.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 BeyondChat Articles API Server              ║
║                                                   ║
║   Environment: ${config.server.nodeEnv.padEnd(32)}║
║   Port: ${String(config.server.port).padEnd(39)}║
║   URL: http://localhost:${String(config.server.port).padEnd(23)}║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal) => {
      console.log(`\n⚠️ ${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('✅ HTTP server closed');

        try {
          await disconnectDatabase();
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      
      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
