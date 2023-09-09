import express from "express"
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import commentRoutes from "./routes/comments.js"
import likeRoutes from "./routes/likes.js"
import postRoutes from "./routes/posts.js"
import cookieParser from "cookie-parser"
import relationshipRoutes from "./routes/relationship.js"
import cors from "cors"
import multer from "multer"

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
        //const uniqueSuffix = Date.now() + '-' + Math.round(Mathrandom() * 1E9)
        cb(null, + Date.now() + '-' + file.originalname)
    }
})
const upload = multer({storage: storage})
const app = express();
//Middlewares
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true,
}));
app.use(cookieParser())

app.post("/api/upload", upload.single("file"), (req,res)=>{
    const file = req.file;
    res.status(200).json(file.filename);
})
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/relationships", relationshipRoutes)
app.listen(8800, () => {
    console.log("Server 8800");
})