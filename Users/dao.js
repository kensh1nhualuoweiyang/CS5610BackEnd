import userModel from "./userModel.js";
export const createUser = (item) => {
    userModel.create(item)
}
export const updateUser = async (id, item) => await userModel.updateOne({ _id: id }, { $set: item })
export const findByUserName = async (item) => await userModel.find({ userName: { $regex: item, $options: 'i' } });
export const findByCredential = async (userName, password) => await userModel.findOne({ userName, password })
export const findByID = async (id) => await userModel.findById(id)
export const updateLikeSong = async (like, uid, sid) => {
    const isLike = like === "true";
    await userModel.updateOne(
        { _id: uid },
        {
            [isLike ? '$push' : '$pull']: {
                likedSong: sid
            }
        }
    )
}

export const updateFollows = async (follow, uid, id) => {
    const isFollow = follow === "true";
    await userModel.updateOne({ _id: uid },
        {
            [isFollow ? '$push' : '$pull']: {
                followings: id
            }
        }
    )

    await userModel.updateOne({ _id: id },
        {
            [isFollow ? '$push' : '$pull']: {
                followers: uid
            }
        }
    )

}
