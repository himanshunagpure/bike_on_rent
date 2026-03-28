import mongoose from "mongoose";

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MOGODB CONNECTED");
        console.log("testing2")
    } catch (error){
        console.error(error);
        process.exit(1);
    };
}

export default connectDB;