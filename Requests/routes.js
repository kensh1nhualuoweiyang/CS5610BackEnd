
import * as dao from "./dao.js"

function RequestRoutes(app){
    const createRequest = async (req,res) =>{
        const {uid,role} = req.query
        const exist = await dao.findRequestByUser(uid)
        if(exist){
            res.status(400).json({message:"Only one request change per user is allowed"})
        }   
        else{
            await dao.createRequest({uid,role})
            res.sendStatus(200)
        }
    }
    
    const fetchAllUnresolved = async (req,res) =>{
        const response = await dao.fetchAllUnresolved()
        await Promise.all(
            response.map(async (item) => {
                await item.populate({
                    path: "uid",
                    select: { userName: 1, _id: 1 },
                });
            })
        );
   
        res.json(response)
    }

    const processRequest = async (req,res) =>{
        const {accept,id,uid,role} = req.query
        await dao.processRequest(accept,id,uid,role)
        res.sendStatus(200)
    }

    app.put(`/api/request`,processRequest)
    app.get(`/api/request`,fetchAllUnresolved)
    app.post(`/api/request`,createRequest )

}

export default RequestRoutes