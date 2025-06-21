import { timeStamp } from "console";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    username : {  type : String,  required : true, unique : true,   lowercase : true,   trim : true, index : true },
    email    : { type : String, unique : true,   lowercase : true,   trim : true },
    Fullname : {    type : String,    lowercase : true,    trim : true,    index : true },
    Address : {     type : String,    required : true  },
    pincode : {    type : Number,    required : true },
    Password : {    type : String,    required : [true,"password is required"]  }   ,     // we can send this message to frontend it password is not entered},
    refreshToken:{    type : String } ,
    role :{    type : String,    required : true }},
    {timeStamps : true}       
)
 
//prehook to decrypt password before saving password in database
// userSchema.pre("save",async function (next) { 

//     //if(this.modified(this.Password)) {
//           this.Password = await bcrypt.hash(this.Password,10) 
//           console.log(this.Password)
//         //}     // condition checks when the password is modified only not if other field changes
//          // we use next to pass to next prehook or middleware of server logic
    
// })


// userSchema.methods.isPasswordCorrect = async function (passowrd) { // this method is in inbuilt methods of userschema just like prototypes
//     return await bcrypt.compare(passowrd,this.passowrd)
// }

// 12 gives number of rounds this algorithm goes through

userSchema.methods.generateAccessToken = function ()
{
    // short lived accessToken
         return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
        fullname : this.Fullname 
    },
    process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : ACCESS_TOKEN_EXPIRY
        })

}

userSchema.methods.generateRefreshToken = function ()
{
    // short lived accessToken
    return jwt.sign({
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : REFRESH_TOKEN_EXPIRY
        }
)
}

export const User = mongoose.model("User",userSchema)


//mongodb converts names to smaller case.
// we should never mention id.
//we can also mention validations