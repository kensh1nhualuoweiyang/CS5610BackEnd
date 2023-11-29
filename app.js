import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import session from 'express-session';
import UserRoutes from "./Users/routes.js";
import "dotenv/config";
import SongRoutes from "./Songs/routes.js";
import PlayListRoute from "./Playlist/routes.js";
import ReportRoutes from "./Reports/routes.js";

const DB_CONNECTION = process.env.DB_CONNECTION || 'mongodb://127.0.0.1:27017/WebApp'
mongoose.connect(DB_CONNECTION)
const app = express()
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL || "http://localhost:3000"
    })
)
const sessionOption = {
    secret: "any string",
    resave: false,
    saveUninitialized: false,
}
if (process.env.NODE_ENV !== "development") {
    sessionOption.proxy = true;
    sessionOption.cookie = {
        sameSite: "none",
        secure: true,
    };
}
app.use(session(sessionOption))
app.use(express.json())
SongRoutes(app)
UserRoutes(app)
ReportRoutes(app)
PlayListRoute(app)
app.listen(process.env.PORT || 4000)