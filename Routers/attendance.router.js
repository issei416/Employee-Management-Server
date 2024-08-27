import express from "express";
import { userAuth, roleAuth } from "../Middleware/userAuth.js";
import { applyLeave, getAllEmployeeLeaves, getEmployeeLeaves, manageLeave, pendingLeaves, swipeToggle } from "../Controller/attendance.controller.js";

const Router = express.Router();

Router.post('/swipetoggle', userAuth(),swipeToggle);
Router.post('/applyleave', userAuth(), applyLeave);
Router.get('/getmyleaves', userAuth(), getEmployeeLeaves);
Router.get('/getallemployeeleaves', roleAuth('admin'), getAllEmployeeLeaves);
Router.get('/getpendingleaves', roleAuth('admin'), pendingLeaves);
Router.put('/manageleave', roleAuth('admin'), manageLeave);

export default Router;