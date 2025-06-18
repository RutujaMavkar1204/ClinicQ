import mongoose,{Schema} from 'mongoose'
import jwt from 'json-web-token'
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
   gender:{
    type:String,
    enum:['male','female','other'],
    required:function(){this.role==='Patient'}
   },
   age:{
    type:Number,
    required:function(){this.role==='Patient'}
   },
   password:{
    type:String,
    required:[true,'Password is Required'],
   },
   case:{
    type:String,
    enum:['Emergency','Normal'],
    required:function(){this.role==='Patient'}
   },
   photo:{
    type:String,
    required:true
   },
   clinicName:{
    type:String,
    required:function(){this.role==='Doctor'}
   },
   specialization:{
    type:String,
    required:function(){this.role==='Doctor'}
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

const generateAccessToken=async function(){
    await jwt.sign({
        _id:this._id,
        email:this.email,
        password:this.password

    },
        process.env.ACCESS_TOKEN_SECRET,
    {
       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    })
}
const generateRefreshToken=async function(){
    await jwt.sign({
        _id:this.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY  
    }
)
}
export const User= mongoose.model('User',userSchema)
