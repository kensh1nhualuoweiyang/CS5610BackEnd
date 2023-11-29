
import * as dao from "./dao.js"
import songModel from "../Songs/songModel.js";
function PlayListRoute(app) {
    const createPlayList = async (req, res) => {
        const { name, description } = req.query
        if (name.length == 0 || description.length == 0) {
            res.status(400).json({ message: 'Playlist Name/Description Cannot Be Empty' });
        }
        else {
            const uid = req.session["currentUser"]._id
            const response = await dao.createPlayList({ name, description }, uid)
            res.json(response)
        }

    }

    const addToPlaylist = async (req, res) => {
        const { id, sid } = req.query
        const songs = (await dao.getPlayList(id)).Songs
        const exist = songs && songs.some(song => song === sid);
        if (exist) {
            res.status(400).json({ message: 'Song already exists in the playlist.' });
        }
        else {
            await dao.addToPlayList(id, sid)
            res.json(200)
        }

    }

    const deletePlayList = async (req, res) => {
        const { id } = req.query
        const uid = req.session["currentUser"]._id
        await dao.deletePlayList(id, uid)
        res.json(200)
    }

    const fetchPlaylist = async (req, res) => {
        try {
            const { pid } = req.query
            const response = await dao.getPlayList(pid)
            await response.populate({
                path: "author",
                select: { userName: 1, _id: 1 }
            })

            if (response.Songs.length > 0) {
                const newSongs = await Promise.all(response.Songs.map(async (item) => {
                    return (await songModel.findOne({ sid: item })).toJSON()
                }));
                let newObj = {
                    ...response._doc,
                    newSongs
                }
                res.json(newObj)
            }
            else {
                res.json(response)
            }


        }
        catch (err) {
            console.log("111");
        }
    }

    app.get(`/api/playlist`, fetchPlaylist)
    app.delete(`/api/playlist`, deletePlayList)
    app.put(`/api/AddToPlaylist`, addToPlaylist)
    app.post(`/api/playlist`, createPlayList)
}

export default PlayListRoute