

import axios from "axios";
import * as dao from "./dao.js"
const KEY = process.env.REACT_APP_API_KEY
const SEARCH = process.env.REACT_APP_SEARCH_URL
const TRACK = process.env.REACT_APP_TRACK_URL
function SongRoutes(app) {
    const searchSong = async (req, res) => {
        const { keyword } = req.query
        const response = await axios.get(SEARCH, {
            params: { 
                q: keyword,
                limit: 100,
            },
            headers: {
                'X-RapidAPI-Key': KEY,
                'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        });
        res.json(response.data)
    }
    

    const getSongDetail = async (req,res) =>{
        const {sid} = req.query
        const record = await dao.getSongById(sid)
        if(record){
            res.json(record)
        }
        else{
            const url = TRACK + sid
            const response = await axios.get(url,{
                headers: {
                    'X-RapidAPI-Key': KEY,
                    'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
                }
            })
            const songInfo = {
                sid,
                name: response.data.title,
                image: response.data.album.cover_xl,
                artist:response.data.artist.name,
                preview:response.data.preview,
            }
            const song = await dao.createSong(songInfo)
            res.json(song)
        }
    }

    const updateLikeSong = async (req,res) => {
        const {like,sid} = req.query
        const response = await dao.updateLikeSong(like,sid)
        res.json(response)
    }

    const getComments = async (req,res) =>{
        const {sid} = req.query
        const response = await dao.getSongById(sid)
        await response.populate('comments.user');
        res.json(response.comments)
    }

    const postComment = async (req,res) => {
        const {sid,comment} = req.query
        const currentUser = req.session['currentUser']
        const response = await dao.addComments(sid,currentUser._id,comment.toString())
        res.json(response)
    }

    const deleteComment= async (req,res) => {
        const {sid,comment,uid} = req.query
        const response = await dao.deleteComments(sid,uid,comment)
        res.json(response)
    }   

    app.put("/api/songLikes",updateLikeSong)
    app.get("/api/songDetail", getSongDetail)
    app.get("/api/songs", searchSong)
    app.get("/api/comments",getComments)
    app.post("/api/comments",postComment)
    app.delete("/api/comments",deleteComment)
}

export default SongRoutes