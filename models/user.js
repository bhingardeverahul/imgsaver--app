const mongoose=require('mongoose')
const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        required:true, 
        default:Date.now
    }
})
const User=mongoose.model("User",UserSchema)
module.exports=User