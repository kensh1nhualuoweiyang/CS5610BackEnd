import songModel from "./songModel.js";

export const createSong = (item) => songModel.create(item)
export const getSongById = (id) => songModel.findOne({ sid: id })


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
        })
}

export const deleteComments = async (id, uid, commentText) => {
    await songModel.updateOne({ sid: id },
        {
            $pull: {
                comments: {
                    user: uid,
                    comment: commentText
                }
            }
        })
}

export const updateLikeSong = async (like, id) => {
    const incre = like === "true"
    const value = incre ? 1 : -1

    await songModel.updateOne({ _id: id },
        {
            $inc: { likes: value }
        })
}