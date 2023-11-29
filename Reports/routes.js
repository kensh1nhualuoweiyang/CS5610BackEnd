import * as dao from "./dao.js"

function ReportRoutes(app) {

    const fetchAllUnresolved = async (req, res) => {
        const response = await dao.fetchAllUnresolved()
        res.json(response)
    }

    const resolve = async (req, res) => {
        const {id,deleteReport} = req.query
        const deleteAction = deleteReport === "true"
        if(!deleteAction)
            await dao.resolveByPass(id)
        else{
            await dao.resolveByDelete(id)
        }
        res.sendStatus(200)
    }



    const createReport = async (req, res) => {
        const {text,reason,cid,sid} = req.query
        if(reason.length == 0)
            res.status(400).json({message:"Reason Cannot Be Empty"})
        else{
            await dao.createReport({text,reason,cid,sid})
            res.sendStatus(200)
        }
      
    }

    app.post(`/api/report`, createReport)
    app.put(`/api/resolve`, resolve)
    app.get(`/api/reports`, fetchAllUnresolved)
}
export default ReportRoutes