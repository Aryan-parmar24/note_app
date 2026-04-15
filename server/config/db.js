import 'dotenv/config';
import mongoose from 'mongoose';

const connectToMongoDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to mongodb");

    } catch (error) {

        console.log("Error in connecting with mongodb", error.message);

    }
};

export default connectToMongoDB;