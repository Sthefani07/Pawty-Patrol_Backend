import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const db = process.env.MongoURI;

const connectDB = async () =>{
    try {
        await mongoose.connect(db, {
            //useNewUrlParser: true,
        });

        console.log('Mongo BD Connected...')
    } catch (error) {
        console.error(error.message)
        process.exit(1);
    }
}

export default connectDB;