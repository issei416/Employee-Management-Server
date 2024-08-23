import Attendance from "../Models/attendance.schema.js";
import LeaveRecords from "../Models/leaves.schmea.js";
import User from "../Models/User.schema.js";
import dotenv from 'dotenv';
import converTotDate from "../Services/convertToDate.services.js";
dotenv.config();

export const markAttendance = () => {
    try {
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "message": `request failed : ${error.message}` });
    }
}

export const applyLeave = async (req, res) => {
    try {
        const userId = req.user._id; //get use rId from token
        const leavebody = req.body;
        console.log(leavebody.startDate = converTotDate(leavebody.startDate, "YYYY-MM-DD"));
        console.log(leavebody.endDate = converTotDate(leavebody.endDate, "YYYY-MM-DD"));
        const leave = new LeaveRecords({ ...leavebody,"user": userId }); //create new leave instance
        await leave.save(); //save the leave in db
        res.status(200).json({ "message": "leave applied successfully", leave }); //response to FE
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "message": `request failed : ${error.message}` });
    }
}

export const getEmployeeLeaves = async (req, res) => {
    try {
        const userId = req.user._id; //get the userid from token
        const leaves = await LeaveRecords.find({ "user": userId }); //get all leaves of the user
        if (leaves.length === 0) {
            return res.status(200).json({ "message": "No leaves found in record" });
        }
        console.log(leaves);
        res.status(200).json(leaves); //response to fe
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "message": `request failed : ${error.message}` });
    }
}

export const getAllEmployeeLeaves = async (req, res) => { // this rescource can only be accessed by admin
    try {
        const allLeaves = await LeaveRecords.find(); //get all leaves to admin
        console.log(allLeaves);
        res.status(200).json(allLeaves); //response to fe
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "message": `request failed : ${error.message}` });
    }
}

export const pendingLeaves = async (req, res) => { //this resource requires admin authorization
    try {
        const pendingLeaves = await LeaveRecords.find({ "status": "Pending" }); // get all leaves which are not approved or rejected yet
        console.log(pendingLeaves);
        res.status(200).json(pendingLeaves); //send all pending leaves to fe
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "message": `request failed : ${error.message}` });
    }
}

export const manageLeave = async (req, res) => {
    try {
        const { leaveId, status } = req.body; //get leavid and status of the leave 
        const updatedLeave = await LeaveRecords.findByIdAndUpdate(leaveId, { "status": status }, { new: true }); //update the leaves status in db
        console.log(updatedLeave);
        res.status(200).json({"message":"leave updated successfully",updatedLeave}); //response to fe
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "message": `request failed : ${error.message}` });
    }
}
