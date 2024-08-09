import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true
    }
});

const Attendance = mongoose.Model("Attendance", attendanceSchema);
export default Attendance;