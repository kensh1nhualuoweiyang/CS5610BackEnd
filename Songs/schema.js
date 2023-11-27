import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    sid: {type: String, required:true, unique:true},
    name: String,
    image: {type: String, required:true},
    artist: String,
    likes:{type: Number,default:0},
    preview:{type:String,required:true},
    comments: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            comment:{type:String, required: true}
        }
        
    ],
},{collection:"Songs"})

export default songSchema