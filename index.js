import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./Database/dbConfig.js";
import userRouter from "./Routers/user.router.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

dbConnect();

app.get('/', (req, res) => {
    res.status(200).send("App is working fine");
});
app.use('/api/user', userRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})