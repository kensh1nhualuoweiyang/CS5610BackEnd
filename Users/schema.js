import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    role: {
        type: String,
        enum: ["User", "Creator", "Admin"],
        default: "User"
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    likedSong: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Songs'
        }
    ],
    likedPlaylist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Playlist'
        }
    ],
    myPlaylist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Playlist'
        }
    ]
}, { collection: "Users" })

export default userSchema