import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  
    const q =
           `SELECT c.*, name, profilePic FROM comments AS c JOIN users AS u ON (u.userId = c.userId)
    WHERE c.postId = ?
    ORDER BY c.createdAt DESC`;
    //console.log("PostId: " + req.query.postId)
    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      //console.log(data);
      return res.status(200).json(data);
    });
};

export const addLike = (req, res) => {
  
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q =
        "INSERT INTO comments(`desc`, `userId`, `postId`) VALUES (?)";
      const values = [
        req.body.desc,
        userInfo.userId,
        req.body.postId,
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Comment has been created.");
      });
    });
  };