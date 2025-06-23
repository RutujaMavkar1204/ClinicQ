import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema({
   username:{
    type:String,
    unique:true,
    required:true,
    trim:true,
    lowercase:true
   },
   fullName:{
    type:String,
    required:true,
   },
   email:{
    type:String,
    required:true,
    unique:true
   },
   role:{
    type:String,
    enum:['Doctor', 'Patient'],
    required:true,
   },
   phoneNumber:{
    type:Number,
   },
   password:{
    type:String,
    required:[true,'Password is Required'],
   },
   photo:{
    type:String,
    required:true
   },
   refreshToken:{
     type:String,
   }

},{timeStamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){next()}
    this.password=await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
    {
       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    })
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY  
    }
)
}
export const User= mongoose.model('User',userSchema)
