
import mongoose from 'mongoose';
import config from './index.js';


export const connectDatabase = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(config.database.uri, config.database.options);
      console.log('✅ MongoDB connected successfully');
      
      // Set up connection event handlers
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

      return;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries} failed:`, error.message);
      
      if (retries === maxRetries) {
        console.error('❌ Max retries reached. Exiting...');
        process.exit(1);
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, retries), 30000);
      console.log(`⏳ Retrying in ${waitTime / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
};


export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed gracefully');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
};

export default { connectDatabase, disconnectDatabase };
