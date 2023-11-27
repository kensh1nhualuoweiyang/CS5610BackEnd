
import * as dao from "./dao.js"
function UserRoutes(app){
    

    const getUser = async (req,res) =>{
        if(req.session['currentUser']){
            res.json(req.session['currentUser'])
        }
        else{
            return null;
        }
    }

    const register = async(req,res) =>{
            const exist = await dao.findByUserName(req.body.userName)
            if(exist.length > 0){
                res.status(400).json({message:"Duplicate Username Found, Please Try Again"})
            }
            else{
                const response = await dao.createUser(req.body)
                res.json(response) 
            }
    }

    const login = async(req,res) =>{
        const {userName, password} = req.body
        const currUser = await dao.findByCredential(userName,password)
        if(currUser){
            req.session['currentUser'] = currUser
            res.json(currUser)
        }
        else{
            res.status(401).json({message:"Invalid Credential"})
        }
       
    }

    const logOut = async (req, res) => {
        req.session.destroy();
        res.json(200)
    }

    const search = async (req, res) => {
        const {keyword} = req.query
        const users = await dao.findByUserName(keyword, { projection: { username: 1, _id: 1 } });
        res.json(users);
    };

    const getUserInfo = async (req,res) =>{
        const {uid} = req.query
        const user = await dao.findByID(uid)
        res.json(user)
    }
    
    const getLikesSong = async (req,res) =>{
        const {uid} = req.query
        const response = await dao.findByID(uid)
        res.json(response.likedSong)
    }

    const handleLikeSong = async (req,res) =>{
        const {like,sid,uid} = req.query
        await dao.updateLikeSong(like,uid,sid)
        const response = await dao.findByID(uid)

        res.json(response.likedSong)
    }

    app.put(`/api/songs`,handleLikeSong)
    app.get(`/api/likesSong`,getLikesSong)
    app.post(`/api/userInfo`,getUserInfo)
    app.post("/api/currUser",getUser)
    app.post("/api/register",register)
    app.post("/api/login",login)
    app.post("/api/logOut",logOut)
    app.get("/api/user",search)
}

export default UserRoutes