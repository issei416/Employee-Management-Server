import User from "../Models/User.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Project from "../Models/projects.schema.js";
import LeaveRecords from "../Models/leaves.schmea.js";
import Attendance from "../Models/attendance.schema.js";
import mongoose from "mongoose";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

export const register = async (req, res) => {
  try {
    let user = req.body;
    const exists = await User.findOne({ email: user.email }); // check if user already exists
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const encryptedPassword = await bcrypt.hash(user.password, 10); // encrypt the password
    user.password = encryptedPassword;
    user = new User(user);
    await user.save(); // create new user an dsave in db
    res.status(201).json({ message: "User registered successfully" }); //response to frontend
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // destructure creds from req
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" }); // check user existence
    }
    const verify = await bcrypt.compare(password, user.password); // verify password using bcrypt
    if (!verify) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    }); //creating a token that expires in 2 hours
    user.token = token;
    user = new User(user);
    await user.save(); // save the token in db
    res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: `login failed : ${error.message}` });
  }
};

export const getEmployee = async (req, res) => {
  // this resource requires authorization (only admins)
  try {
    const token = req.headers.authorization.split(" ")[1]; //get the token from req
    if (!token) {
      return res.status(401).json({ message: "token is missing" }); // check for missing token
    }
    const userid = jwt.verify(token, process.env.JWT_SECRET); // verifying token using jwt
    const user = await User.findById(userid);
    console.log(user);
    res.status(200).json({ user }); // response for frontend
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: `login failed : ${error.message}` });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find(); // get all employees
    const filteredEmployees = employees.map((emp) => {
      return {
        employeeId: emp._id,
        name: emp.name,
        email: emp.email,
        designation: emp.designation,
        role: emp.role,
      }; // omits phonenumber and password data since it's displayed to all employees without and role auth
    });
    res.status(200).json({ employees: filteredEmployees }); //response to FE
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `request failed : ${error.message}` });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const userId = req.user._id; //get user to be updated using params
    console.log(req.body.user);
    const updatedUser = await User.findByIdAndUpdate(userId, req.body.user, {
      new: true,
    }); // update the user
    res
      .status(201)
      .json({ message: "updated user profile successfully", updatedUser }); // response to FE
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `request failed : ${error.message}` });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const userId = req.params.id; // gte user to be deleted using params
    const deletedUser = await User.findByIdAndDelete(userId); //delete the user from db
    res.status(201).json({ message: "deleted user successfully", deletedUser }); //response to FE
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `request failed : ${error.message}` });
  }
};

export const uploadProfilePictureController = async (req, res) => {
  try {
    const employeeId = req.user.id; // Get employee ID from JWT token
    const ext = path.extname(req.file.originalname);
    const uploadDir = path.join(__dirname, "../uploads/profile_pictures");
    console.log(uploadDir);
    const newFilePath = path.join(uploadDir, `${employeeId}${ext}`);

    // Check if an existing profile picture for this employee exists
    const existingFilePath = findExistingProfilePicture(employeeId);

    if (existingFilePath) {
      // Delete the old profile picture if it exists
      fs.unlinkSync(existingFilePath);
    }

    // Store the new profile picture path in the database (assuming the user model has a 'profilePicture' field)
    await User.findByIdAndUpdate(employeeId, {
      profilePicture: `/uploads/profile_pictures/${employeeId}${ext}`,
    });

    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully!",
      profilePicture: `/uploads/profile_pictures/${employeeId}${ext}`,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to upload profile picture" });
  }
};

// Helper function to check if an employee already has a profile picture
export const findExistingProfilePicture = (employeeId) => {
  console.log(employeeId);
  const directory = path.join(__dirname, "../uploads/profile_pictures");
  console.log(directory);
  const files = fs.readdirSync(directory);
  console.log(files);

  // Find the existing profile picture by matching the employee ID
  const existingFile = files.find((file) => file.startsWith(employeeId));
  console.log(existingFile);

  if (existingFile) {
    return path.join(directory, existingFile);
  }
  return null;
};

export const getProfilePicture = async (req, res) => {
  try {
    const employeeId = req.user._id; // Get employee ID from JWT token
    const filePath = findExistingProfilePicture(employeeId);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    // Send the file as binary data, with the appropriate content type
    const mimeType = 'image/jpg'; // Adjust based on your image format (jpg, png, etc.)
    res.setHeader('Content-Type', mimeType);
    res.sendFile(filePath); // This will send the image binary as a response
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).json({ message: "Failed to fetch profile picture" });
  }
};

//dashboard stats

export const getDashboardStats = async (req, res) => {
  try {
    const employeeId = req.user._id;

    // Fetch counts specific to the employee
    const employeeProjectsCount = await Project.countDocuments({
      assignedEmployees: employeeId, // Count projects where this employee is assigned
    });
    console.log(employeeProjectsCount);

    const employeePendingProjects = await Project.countDocuments({
      assignedEmployees: employeeId,
      status: "active", // Count pending projects for the employee
    });
    console.log(employeePendingProjects);

    // Get the start and end of the month
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based, so January is 0

    const startOfMonth = new Date(year, month, 1); // Start of the current month
    const endOfMonth = new Date(year, month + 1, 0); // End of the current month
    endOfMonth.setHours(23, 59, 59, 999); // Set to the end of the day
    console.log(startOfMonth, endOfMonth);

    // Query attendance for the employee and the specified date range
    const daysOffCount = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: startOfMonth,
            $lt: endOfMonth, // Fetch records within the month
          },
          "attendance.employeeId": new mongoose.Types.ObjectId(employeeId),
          "attendance.status": "Absent", // Only Absent days
        },
      },
      {
        $unwind: "$attendance", // Unwind the attendance array to access employee-specific data
      },
      {
        $match: {
          "attendance.employeeId": new mongoose.Types.ObjectId(employeeId),
          "attendance.status": "Absent", // Filter absent status
        },
      },
      {
        $count: "daysOff", // Count the number of records
      },
    ]);
    console.log(daysOffCount);

    const employeeDaysOffCount =
      daysOffCount.length > 0 ? daysOffCount[0].daysOff : 0;

    // Respond with data
    res.status(200).json({
      projects: employeeProjectsCount,
      pending: employeePendingProjects,
      daysOff: employeeDaysOffCount,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching employee dashboard stats", error });
  }
};
