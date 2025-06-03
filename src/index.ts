import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
//import cors from "cors";
dotenv.config();

const app = express();



//Routes
//app.use("/api/auth", authRoutes);
app.post("/api/v1/signup", (req, res) => {
    res.send("Hello World");
}); 

app.post("/api/v1/signin", (req, res) => {
    res.send("Hello World");
});

app.get("/api/v1/content", (req, res) => {
    res.send("Hello World");
}); 


app.delete("/api/v1/content", (req, res) => {
    res.send("Hello World");
}); 

app.post("/api/v1/brain/share", (req, res) => {
    res.send("Hello World");
}); 

app.get("/api/v1/brain/:shareLink", (req, res) => {
    res.send("Hello World");
});  












