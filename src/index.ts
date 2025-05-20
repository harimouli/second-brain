import express from "express";
import mongoose from "mongoose";
import jwt from  "jsonwebtoken"; 
import { json } from "express/lib/response";

import { UserModel, ContentModel } from "./db";       

import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
const app = express();
app.use(express.json())




app.post("/api/v1/signup", async (req, res) => {
   //TODO  //zod validation , hash password


    const username = req.body.username;
    const password = req.body.password;

    try {
         await UserModel.create({
            username: username,
            password: password
         })

         res.status(200).json({
            message: "User signed up"
         })

    }catch(err) {
        res.status(411).json({
            message: "user already exists"
        })
        
    }

})

app.post("/api/v1/signin", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const existingUser =  await UserModel.findOne({
        username,
        password
    })
    if(existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD);

        res.status(200).json({
            token
        })
    }else{
        res.status(401).json({
            message: "Incorrect credentials"
        })
    }




})

app.post("/api/v1/content", userMiddleware,async(req, res) => {
        const link = req.body.link;
        const title = req.body.title;
        const type = req.body.type
        //@ts-ignore
        const userId = req.userId;

        try {
            await ContentModel.create({
                title,
                link,
                type,
                //@ts-ignore
                userId
            })
        }catch(err){
            res.status(501).json({
                message: "Something went wrong!"
            })
        }

        res.status(200).json({
            message: "Content added!"
        })

})

app.get("/api/v1/content", userMiddleware,async (req, res) => {
    //@ts-ignore
    const userId = req.userId;

    const content = await ContentModel.findOne({
        userId
    }).populate("userId", "username");

    res.json({
        content
    })

})

app.delete("/api/v1/content", (req, res)=> {

})

app.post("/api/v1/brain/share", (req, res) => {

})

app.get("/api/v1/brain/:shareLink", (req, res)=> {
    
})


app.listen(3000, () => {
    console.log("server is listening on port");
})