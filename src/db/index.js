
import {DB_NAME} from '../constants.js';
import mongoose from 'mongoose';

const connectDB = async ()=>
{
try {
        console.log(process.env.USERNAME)
        const connectionString = await mongoose.connect(`mongodb://localhost:27017/Grocery_DB`)   
        console.log("MongoDB is connected " + connectionString.connection.host)
}
catch(error)
{
    console.log(`mongo connection failed due to this error`,error)
    process.exit(1)
}
}

export default connectDB;