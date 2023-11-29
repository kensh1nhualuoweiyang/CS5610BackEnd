import PlaylistSchema from "./schema.js";
import mongoose from "mongoose";
const playlistModel = mongoose.model("Playlist",PlaylistSchema)
export default playlistModel