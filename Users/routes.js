
import * as dao from "./dao.js"
function UserRoutes(app) {


    const getUser = async (req, res) => {
        if (req.session['currentUser']) {
            res.json(req.session['currentUser'])
        }
        else {
            res.json(null);
        }
    }

    const register = async (req, res) => {
        const exist = await dao.findByUserName(req.body.userName)
        if (exist.length > 0) {
            res.status(400).json({ message: "Duplicate Username Found, Please Try Again" })
        }
        else {
            const response = await dao.createUser(req.body)
            res.json(response)
        }
    }

    const login = async (req, res) => {
        const { userName, password } = req.body
        const currUser = await dao.findByCredential(userName, password)
        if (currUser) {
            req.session['currentUser'] = currUser
            res.json(currUser)
        }
        else {
            res.status(401).json({ message: "Invalid Credential" })
        }

    }

    const logOut = async (req, res) => {
        req.session.destroy();
        res.json(200)
    }

    const search = async (req, res) => {
        const { keyword } = req.query
        const users = await dao.findByUserName(keyword, { projection: { username: 1, _id: 1 } });
        res.json(users);
    };

    const getUserInfo = async (req, res) => {
        const { uid } = req.query
        const user = await dao.findByID(uid)
        res.json(user)
    }

    const getPlaylistByUser = async (req, res) => {
        const { uid } = req.query
        const userId = uid === "undefined" ? req.session['currentUser']._id : uid;
        const user = await dao.findByID(userId)
        if (user.myPlaylist.length > 0)
            await user.populate('myPlaylist');
        res.json(user.myPlaylist);
    }

    const getLikedPlaylistByUser = async (req, res) => {
        const { uid } = req.query
        const userId = uid === "undefined" ? (req.session['currentUser'] ? req.session['currentUser']._id : uid) : uid;
        if (userId === "undefined") {
            res.json([])
        }
        else {
            const user = await dao.findByID(userId)
            if (user.myPlaylist.length > 0)
                await user.populate('likedPlaylist');
            res.json(user.likedPlaylist);
        }

    }

    const getLikedSongByUser = async (req, res) => {

        const { uid } = req.query
        const userId = uid === "undefined" ? (req.session['currentUser'] ? req.session['currentUser']._id : uid) : uid;
        if (userId === "undefined") {
            res.json([])
        }
        else {
            const user = await dao.findByID(userId)
            if (user.likedSong.length > 0)
                await user.populate('likedSong');
            res.json(user.likedSong);
        }


    }

    const fetchFollower = async (req, res) => {
        const { uid } = req.query;
        const user = await dao.findByID(uid);
        if (user.followers.length > 0) {
            await user.populate({
                path: "followers",
                select: { userName: 1, _id: 1 }
            });

            res.json(user.followers);
        } else {
            res.json([]);
        }
    };

    const fetchFollowing = async (req, res) => {
        const { uid } = req.query
        const user = await dao.findByID(uid)
        if (user.followings.length > 0) {
            await user.populate({
                path: "followings",
                select: { userName: 1, _id: 1 }
            })
            res.json(user.followings)
        }
        else {
            res.json([])
        }
    }

    const updateFollows = async (req, res) => {
        const { follow, id } = req.query
        const uid = req.session['currentUser']._id
        await dao.updateFollows(follow, uid, id)
        res.json(200)
    }

    const updateProfile = async (req, res) => {
        const item = req.body
        if (item.userName.length == 0 || item.password.length == 0
            || item.email.length == 0) {
            res.status(400).json({ message: "Field Cannot be empty" })
        }
        else {
            const exist = await dao.findByUserName(item.userName)
            if (exist.length > 0 && !exist.some((user) => user._id.toString() === item._id.toString())) {  
                res.status(400).json({ message: "Duplicate Username Found" })
            }
            else {
                await dao.updateProfile(item._id, item)
                res.json(200)
            }
        }
    }

    

    app.put(`/api/updateProfile`, updateProfile)
    app.put(`/api/followers`, updateFollows)
    app.get(`/api/follower`, fetchFollower)
    app.get(`/api/following`, fetchFollowing)
    app.get(`/api/likedSong`, getLikedSongByUser)
    app.get(`/api/likedPlaylist`, getLikedPlaylistByUser)
    app.get(`/api/userPlaylist`, getPlaylistByUser)
    app.post(`/api/userInfo`, getUserInfo)
    app.post("/api/currUser", getUser)
    app.post("/api/register", register)
    app.post("/api/login", login)
    app.post("/api/logOut", logOut)
    app.get("/api/user", search)

}

export default UserRoutes