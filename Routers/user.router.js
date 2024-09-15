import express from "express";
import {
  deleteEmployee,
  getAllEmployees,
  getDashboardStats,
  getEmployee,
  getProfilePicture,
  login,
  register,
  updateEmployee,
  uploadProfilePictureController,
} from "../Controller/user.controller.js";
import { roleAuth, userAuth } from "../Middleware/userAuth.js";
import { uploadProfilePicture } from "../Services/MulterConfiguration.js";

const Router = express.Router();

Router.post("/register", register);
Router.post("/login", login);
Router.get("/getemployee", getEmployee);
Router.post("/getallemployees", userAuth(), getAllEmployees);
Router.post("/updateemployee", userAuth(), updateEmployee);
Router.delete("/deleteemployee/:id", roleAuth("admin"), deleteEmployee);
Router.post(
  "/uploadprofilepicture",
  userAuth(),
  uploadProfilePicture,
  uploadProfilePictureController
);
Router.get("/getdashboardstats", userAuth(), getDashboardStats);
Router.get("/getprofilepicture",userAuth(),getProfilePicture)

export default Router;
