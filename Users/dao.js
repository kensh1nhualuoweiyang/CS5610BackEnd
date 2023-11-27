import userModel from "./userModel.js";
export const createUser = (item) => {
    console.log(item);
    userModel.create(item)
}
export const updateUser = (id, item) =>  userModel.updateOne({ _id: id }, { $set: item })
export const findByUserName = (item) => userModel.find({ userName: { $regex: item, $options: 'i' } });
export const findByCredential = (userName, password) => userModel.findOne({ userName, password })
export const findByID = (id) => userModel.findOne({ _id: id })
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
};
