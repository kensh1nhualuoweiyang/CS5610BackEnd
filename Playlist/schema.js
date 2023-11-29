import mongoose from "mongoose";


const PlaylistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    likes: { type: Number, default: 0 },
    description: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    Songs: [
        String
    ],
}, { collection: "Playlist" })

export default PlaylistSchema