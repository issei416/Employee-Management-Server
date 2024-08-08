import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnect = async () => {
    try {
        const dbString = process.env.DBSTRING;
        const connection = await mongoose.connect(dbString);
        console.log("DB connected successfully")
        return connection;
    } catch (error) {
        console.log(error.message);
    }
}

export default dbConnect;