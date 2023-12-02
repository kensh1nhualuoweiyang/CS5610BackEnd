import songModel from "./songModel.js";
import userModel from "../Users/userModel.js";
export const createSong = async (item) => await songModel.create(item)
export const getSongById = async (id) => await songModel.findOne({ sid: id })


export const addComments = async (id, uid, commentText) => {
    await songModel.updateOne({ sid: id },
        {
            $push: {
                comments:
                {
                    $each: [{ user: uid, comment: commentText }],
                    $position: 0
                }
            }
        }
    )
}

export const deleteComments = async (id, commentId) => {
    await songModel.updateOne({ sid: id },
        {
            $pull: { comments: { _id: commentId, } }
        })
}

export const updateLikeSong = async (like, id,uid) => {
    const incre = like === "true"
    const value = incre ? 1 : -1

    await songModel.updateOne({ _id: id },
        {
            $inc: { likes: value }
        })
    await userModel.updateOne({_id:uid},
        {
            [value==1? "$push":"$pull"]:{
                likedSong: id  
            }
        })
}

export const getSongRec = async () =>{
    return await songModel.find().sort({likes:-1}).limit(27)
    
}