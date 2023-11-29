import mongoose from "mongoose";


const ReportSchema = new mongoose.Schema({
    text: {type: String, required:true},
    reason: {type: String, required:true},
    cid: {type: String, required:true},
    sid:{type: String, required:true},
    resolved: {type:Boolean, default:false}
}, { collection: "Reports" })

export default ReportSchema