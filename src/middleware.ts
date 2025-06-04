//middleware
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded =await jwt.verify(token, process.env.JWT_SECRET as string);
    //@ts-ignore
    if (decoded) {req.userId = decoded.userId;}
    next();
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded =await jwt.verify(token, process.env.JWT_SECRET as string);
    //@ts-ignore
        if (decoded) {req.userId = decoded.userId;}
    next();
}

export const isUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded =await jwt.verify(token, process.env.JWT_SECRET as string);
    //@ts-ignore
    if (decoded) {req.userId = decoded.userId;}
    next();
}   