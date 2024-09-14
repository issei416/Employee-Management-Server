import express from "express";
import { deleteEmployee, getAllEmployees, getDashboardStats, getEmployee, login, register, updateEmployee } from "../Controller/user.controller.js";
import { roleAuth, userAuth } from "../Middleware/userAuth.js";

const Router = express.Router();

Router.post('/register', register);
Router.post('/login', login);
Router.get('/getemployee', getEmployee);
Router.post('/getallemployees', userAuth(), getAllEmployees);
Router.post('/updateemployee/:id', userAuth(), updateEmployee);
Router.delete('/deleteemployee/:id', roleAuth('admin'), deleteEmployee);
// Router.post('/uploadprofilepicture',userAuth(),uploadProfilePicture)
Router.get("/getdashboardstats",userAuth(),getDashboardStats)

export default Router;