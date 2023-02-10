//realize connect to data library
import mongoose from "mongoose";

//connect library
const connectDB = async () => { 
    try {
        mongoose.set('strictQuery', true);
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            ssl: true,
            sslValidate: false,
        });
        console.log(`MogoDB is connecting, ${connect.connection.host}`.cyan.underline)
    } catch (error) { 
        console.log(`Error: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
}
export default connectDB;