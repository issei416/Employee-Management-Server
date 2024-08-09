import express from "express";
import { markAttendance } from "../Controller/user.controller";

const Router = express.Router();

Router.post('/markattendance', userAuth(), markAttendance);

export default Router;