import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./Database/dbConfig.js";
import userRouter from "./Routers/user.router.js";
import attendanceRouter from "./Routers/attendance.router.js"
import projectRouter from "./Routers/project.router.js"
import './Schedulers/AttendanceScheduler.js'

dotenv.config();

//express cofiguration
const app = express();
app.use(cors());
app.use(express.json());

//db connection
dbConnect();

app.get('/', (req, res) => {
    res.status(200).json({"message":"App is working fine"});
});

//routes configuration
app.use('/api/user', userRouter);
app.use('/api/user/attendance', attendanceRouter);
app.use('/api/user/project', projectRouter)


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})