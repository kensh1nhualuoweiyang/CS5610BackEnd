import mongoose from "mongoose";

const requestSchema = mongoose.Schema({
    role: { type: String, required: true },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    resolved: { type: Boolean, default: false }
}, { collection: "Requests" })

export default requestSchema