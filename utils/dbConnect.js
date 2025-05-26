import mongoose from "mongoose";

let isConnected = false;

async function connect() {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit();
    }
}

export default connect;
