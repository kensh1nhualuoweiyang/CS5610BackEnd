import playlistModel from "./PlaylistModel.js";
import userModel from "../Users/userModel.js";
export const findByPlaylistName = async (item) => await playlistModel.find({ name: { $regex: item, $options: 'i' } });
export const createPlayList = async (item, uid) => {
    const pid = (await playlistModel.create({ ...item, author: uid }))._id
    await userModel.updateOne({ _id: uid },
        {
            $push: {
                myPlaylist:
                {
                    $each: [{ _id: pid }],
                    $position: 0
                }
            }
        }
    )
}

export const deletePlayList = async (id, uid) => {


    await playlistModel.deleteOne({ _id: id })

    await userModel.updateOne({ _id: uid },
        {
            $pull: {
                myPlaylist: id
            }
        }
    )
}


export const getPlayList = async (id) => await playlistModel.findById(id)

export const addToPlayList = async (id, sid) => await playlistModel.updateOne({ _id: id },
    {
        $push: {
            Songs:
            {
                $each: [sid],
                $position: 0
            }
        }
    }
)

export const removeFromPlayList = async (id, sid) => await playlistModel.updateOne({ _id: id },
    {
        $pull: { Songs: sid }
    }
)

export const updatePlaylistLike = async (like, id, uid) => {
    const value = like === "true" ? 1 : -1
    await playlistModel.updateOne({ _id: id },
        {
            $inc: { likes: value }
        }
    )
    await userModel.updateOne({ _id: uid },
        {
            [value === 1 ? "$push" : "$pull"]: {
                likedPlaylist: id
            }
        }
    )
}

export const fetchPlaylistRec = async () =>  await playlistModel.find().sort({likes:-1}).limit(15)