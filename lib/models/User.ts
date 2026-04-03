import mongoose, { models, Schema } from "mongoose";

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    authProvider:{
        type:String,
        enum:['local','google'],
        default:'local'
    }
},
    {timestamps:true}
);

export default  models.User || mongoose.model("User",UserSchema);