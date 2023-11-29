import ReportModel from "./ReportModel.js"
import songModel from "../Songs/songModel.js"
export const fetchAllUnresolved = async () => {
    return await ReportModel.find({resolved:false})
}

export const createReport = async(item) => await ReportModel.create(item)


export const resolveByPass = async (id) => await ReportModel.updateOne({_id:id},{resolved:true})

export const resolveByDelete = async (id) => {
    await ReportModel.updateOne({_id:id},{resolved:true})
    const report = await ReportModel.findById(id)
    await songModel.updateOne({sid:report.sid},
        {
            $pull:{comments:{_id:report.cid}}
        }
    )
}