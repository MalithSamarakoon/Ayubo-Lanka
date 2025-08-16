import mongoose from 'mongoose';


// Single, clean connection function
export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Force IPv4 if needed
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn; // Return connection for potential reuse
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('Troubleshooting Tips:');
    console.log('- Verify cluster name in Atlas');
    console.log('- Check internet connection');
    console.log('- Try alternative connection string');
    process.exit(1);
  }
};