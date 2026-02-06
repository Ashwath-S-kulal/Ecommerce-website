import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/eKart`);
    console.log('MongoDB connected successfully');
  }
  catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};
        
export default connectDB;