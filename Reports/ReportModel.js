import ReportSchema from "./schema.js";
import mongoose from "mongoose";
const ReportModel = mongoose.model("Reports",ReportSchema)
export default ReportModel