import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_DB_URI}${process.env.MONGO_DB_NAME}`);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.log("Error in MONGO Connect: ", error);
        process.exit(1);
    }
}

export default connectDB;
