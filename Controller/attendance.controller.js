import Attendance from "../Models/attendance.schema.js";
import User from "../Models/User.schema.js";
import dotenv from 'dotenv';
dotenv.config();

export const markAttendance = () => {
    try {
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "message": `request failed : ${error.message}` });
    }
}