import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import { z } from "zod";
import UserModel from "./db";
import bcrypt from "bcrypt";

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
app.post("/api/v1/signup", async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod
    const { username, password } = userSchema.parse(req.body);

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid input or internal error" });
  }
});

app.post("/api/v1/signin", async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod
    const { username, password } = userSchema.parse(req.body);

    // Find the user in the database
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ Generate JWT token after successful login
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" } // token expires in 1 hour
    );

    // Return token to client
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================== SAMPLE ROUTES ==========================
app.get("/api/v1/content", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.delete("/api/v1/content", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.post("/api/v1/brain/share", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get("/api/v1/brain/:shareLink", (req: Request, res: Response) => {
  res.send("Hello World");
});

// ========================== START SERVER ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
