import { db } from "../connect.js";
import jwt from "jsonwebtoken";
//import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  //console.log("Token: " + token)
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
       userId !== "undefined"
         ?  `SELECT p.*, name, profilePic FROM posts AS p JOIN users AS u ON (u.userId = p.userId) WHERE 
              p.userId = ? ORDER BY p.createdAt DESC`
         :  `SELECT DISTINCT p.*, name, profilePic FROM posts AS p JOIN users AS u ON (u.userId = p.userId)
              LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? 
              OR p.userId =?
              ORDER BY p.createdAt DESC`

    const values =
      userId !== "undefined" ? [userId] : [userInfo.userId, userInfo.userId];
    
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`desc`, `img`, `userId`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      userInfo.userId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM posts WHERE `postId`=? AND `userId` = ?";

    db.query(q, [req.params.postId, userInfo.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};
