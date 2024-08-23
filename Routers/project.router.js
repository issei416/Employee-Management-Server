import express from "express";
import { roleAuth, userAuth } from "../Middleware/userAuth.js";
import { createProject, getAllProjects, getEmployeeProjects } from "../Controller/project.controller.js";

const Router = express.Router();

Router.post('/create', roleAuth('admin'), createProject);
Router.get('/getallprojects', roleAuth('admin'), getAllProjects);
Router.get('/getemployeeprojects', userAuth(), getEmployeeProjects);

export default Router