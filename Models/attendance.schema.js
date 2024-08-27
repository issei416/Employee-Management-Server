import mongoose from "mongoose";
import SwipeSessionSchema from "./SwipeSession.schema.js";

const attendanceSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    attendance: [
      {
        employeeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        sessions: [SwipeSessionSchema],
        totalTime: {
          type: Number,
          default: 0,
        },
        swipedIn: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          enum: ["Present", "Absent"],
        },
      },
    ],
  },
  { strict: false }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
