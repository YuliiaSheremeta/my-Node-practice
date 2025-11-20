import mongoose from "mongoose";
import 'dotenv/config';

 const connectMongoDB = async () => {
   try {
      const user = process.env.MONGODB_USER;
      const pwd = process.env.MONGODB_PASSWORD;
      const url = process.env.MONGO_URL;
      const db = process.env.MONGODB_DB;


      await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,);

      console.log('✅ MongoDB connection established successfully');
   } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1); // аварійне завершення програми
  }
};
export default connectMongoDB;
