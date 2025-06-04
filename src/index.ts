import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import { z } from "zod";
import {UserModel, ContentModel} from "./db";
import bcrypt from "bcrypt";
import { authMiddleware } from "./middleware";


// ✅ Load environment variables
dotenv.config(); // Load environment variables

const app = express();

// Middleware to parse incoming JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Zod schema for validating incoming user data (username & password)
const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Routes
//@ts-ignore
app.post("/api/v1/signup", async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod
    const { username, password } = userSchema.parse(req.body);

    // Check if the user already exists
    //@ts-ignore
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    //@ts-ignore
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid input or internal error" });
  }
});
//@ts-ignore
app.post("/api/v1/signin", async (req: Request, res: Response) => {
  try {
    // Validate the request body using Zod schema
    const { username, password } = userSchema.parse(req.body);
    
    // Find user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    // Verify password
    //@ts-ignore
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    
    // Generate JWT token with 1 hour expiry
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input data", errors: error.errors });
    }
    
    // Handle missing JWT secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET not configured" });
    }
    
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================== SAMPLE ROUTES ==========================
//@ts-ignore
app.post("/api/v1/content", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, links } = req.body;
    const userId = (req as any).userId;
    const content = await ContentModel.create({ title, links, tags: [], userId });
    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//@ts-ignore
app.get("/api/v1/content", authMiddleware, async (req: Request, res: Response) => {
  const userID=(req as any).userId;
  const content=await ContentModel.find({userId:userID}).populate("userId","username");
  res.status(200).json({content});
});

//@ts-ignore
app.delete("/api/v1/content", authMiddleware, async (req: Request, res: Response) => {
   const contentID=req.body.contentID;
   const userID=(req as any).userId;
   const content=await ContentModel.findOne({_id:contentID,userId:userID});
   if(!content){
    return res.status(404).json({message:"Content not found"});
   }
   await ContentModel.deleteOne({_id:contentID});
   res.status(200).json({message:"Content deleted successfully"});
});

//@ts-ignore
app.post("/api/v1/brain/share", authMiddleware, (req: Request, res: Response) => {
  res.send("Hello World");
});

//@ts-ignore
app.get("/api/v1/brain/:shareLink", authMiddleware, (req: Request, res: Response) => {
  res.send("Hello World");
});

// ========================== START SERVER ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
