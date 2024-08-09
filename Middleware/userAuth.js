import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import User from "../Models/User.schema.js";
dotenv.config();

export const userAuth = () => async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ "message": "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ "message": "user does not exist" });
        }
        req.user = decoded;

        next();

    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    } 
}

export const roleAuth = (role) => async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ "message": "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const user = await User.findById(decoded._id);
        if (user.role !== role) {
            return res.status(401).json({ "message": "Unauthorized to access this resource" });
        }

        next();

    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
}