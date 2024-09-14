import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    projectName: {
        type: "String",
        required:true
    }, startDate: {
        type: Date,
        required:true
    }, endDate: {
        type: Date,
        required:true
    }, description: {
        type: "String",
        required:true
    }, assignedEmployees: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required:true
    }, assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }, status: {
        type: "String",
        enum: ["active", "inactive"],
        default: "active",
        required:true
    }, priority: {
        type: "String",
        enum: ["high", "medium", "low"],
        required:true
    }
})

const Project = mongoose.model("Project", projectSchema);
export default Project;