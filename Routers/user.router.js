import express from "express";
import { getAllEmployees, getEmployee, login, register } from "../Controller/user.controller.js";
import { userAuth } from "../Middleware/userAuth.js";

const Router = express.Router();

Router.post('/register', register);
Router.post('/login', login);
Router.get('/getemployee', getEmployee);
Router.get('/getallemployees', userAuth('admin'), getAllEmployees);
// Router.post('/updateEmployee', userAuth, updateEmployee);

export default Router;