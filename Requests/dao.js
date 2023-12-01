import requestModel from "./requestModel.js"
import userModel from "../Users/userModel.js"
export const createRequest = async (item) => await requestModel.create(item)


export const fetchAllUnresolved = async () => {
    return await requestModel.find({resolved:false})
}

export const findRequestByUser = async (uid) => await requestModel.findOne({ $and: [{ uid: uid }, { resolved: false }] });

export const processRequest = async(accept,id,uid,target) => {
    const process = accept === "true"
    await requestModel.updateOne({_id:id},{resolved:true})
    if(process){
       await userModel.updateOne({_id:uid},{role:target})
    }
}