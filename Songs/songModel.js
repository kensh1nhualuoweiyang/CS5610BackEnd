import songSchema from "./schema.js";
import mongoose from "mongoose";
const songModel = mongoose.model("Songs",songSchema)
export default songModel