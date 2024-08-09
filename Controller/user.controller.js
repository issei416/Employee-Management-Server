import User from "../Models/User.schema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
    try {
        let user = req.body;
        const exists = await User.findOne({ email: user.email }) // check if user already exists
        if (exists) {
            return res.status(400).json({ "message": "User already exists" })
        }
        const encryptedPassword = await bcrypt.hash(user.password, 10); // encrypt the password
        user.password = encryptedPassword;
        user = new User(user);
        await user.save(); // create new user an dsave in db
        res.status(201).json({ "message": "User registered successfully" }) //response to frontend
    } catch (error) {
        console.log(error);
        res.status(500).json({"message":error.message})
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // destructure creds from req
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ "message": "User not found" })// check user existence
        }
        const verify = bcrypt.compare(password, user.password); // verify password using bcrypt
        if (!verify) {
            return res.status(400).json({ "message": "Incorrect password" });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' }); //creating a token that expires in 2 hours
        user.token = token;
        user = new User(user);
        await user.save(); // save the token in db
        res.status(200).json({ "message": "User logged in successfully", token })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({"message":`login failed : ${error.message}`})
    }
}


export const getEmployee = async (req,res) => { // this resource requires authorization (only admins)
    try { 
        const token = req.headers.authorization.split(' ')[1]; //get the token from req 
        if (!token) {
            return res.status(401).json({ "message": "token is missing" });// check for missing token
        }
        const userid = jwt.verify(token, process.env.JWT_SECRET);// verifying token using jwt
        const user = await User.findById(userid);
        console.log(user);
        res.status(200).json(user); // response for frontend
    } catch (error) {
        console.log(error.message);
        res.status(500).json({"message":`login failed : ${error.message}`})
    }
}

export const getAllEmployees = async (req, res) => {
    
    try {
        const employees = await User.find({"role":"employee"}); // get all employees
        res.status(200).json(employees); //response to FE
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": `request failed : ${error.message}` });
    }
    
}

export const updateEmployee = async (req, res) => {
    try {
        const userId = req.params.id; //get user to be updated using params
        const updatedUser = await User.findByIdAndUpdate(userId, req.body.updatedUser, { new: true }); // update the user
        res.status(201).json({"message":"updated user profile successfully",updatedUser}) // response to FE
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": `request failed : ${error.message}` });
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const userId = req.params.id; // gte user to be deleted using params
        const deletedUser = await User.findByIdAndDelete(userId); //delete the user from db
        res.status(201).json({"message":"deleted user successfully",deletedUser}) //response to FE
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": `request failed : ${error.message}` });
    }
}



