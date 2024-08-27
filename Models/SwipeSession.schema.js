import mongoose from "mongoose";

const SwipeSessionSchema = new mongoose.Schema({
    swipeInTime: {
        type: Date,
        required: true
    },
    swipeOutTime: {
        type: Date
    }
});

export default SwipeSessionSchema;