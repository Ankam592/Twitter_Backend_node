import dotenv from 'dotenv';
import {app} from "./apps.js";
import connectDB from './db/index.js';



dotenv.config({                                   // configure the .env as some times they are in folders like giving path

    path:"./.env"
})   

const PORT = process.env.PORT || 3000


connectDB().then(()=>
{
    app.listen(PORT,()=>
        {
            console.log(`Server is running on port : ${PORT}`);
            
        })
}).catch((error)=>
{
    console.log("MongoDB connsction Error" + error);
})
