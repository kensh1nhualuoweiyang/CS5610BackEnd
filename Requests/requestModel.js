import requestSchema from "./schema.js";
import mongoose from "mongoose";
const requestModel = mongoose.model("Requests",requestSchema)
export default requestModel