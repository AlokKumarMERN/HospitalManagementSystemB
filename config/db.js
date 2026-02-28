import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    return;
  }

  try {
    // Optimize MongoDB connection for serverless
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });
    
    // Graceful shutdown (only for non-serverless environments)
    if (!process.env.VERCEL) {
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    isConnected = false;
    // Don't exit process in serverless environment
    if (!process.env.VERCEL) {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

export default connectDB;
