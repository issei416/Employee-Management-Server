import Project from "../Models/projects.schema.js";
import converTotDate from "../Services/convertToDate.services.js";

export const createProject = async (req, res) => {
  try {
    let project = req.body;
    project.assignedBy = req.user._id;
    project.startDate = converTotDate(project.startDate, "DD-MM-YYYY");
    project.endDate = converTotDate(project.endDate, "DD-MM-YYYY");
    project = new Project(project);
    console.log(project);
    await project.save();
    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    res.status(500).json({ "message":`request failed: ${error.message} `});
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ assignedBy: req.user._id });
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ "message":`request failed: ${error.message} `});
  }
};

export const getEmployeeProjects = async (req, res) => {
    try {
        const userId = req.body.userId;
        const empProjects = await Project.find({assignedEmployees: userId})
        console.log(empProjects);
        if (empProjects.length == 0) {
            return res.status(400).json({"message":"Employee not assigned to any projects"})
        }
        res.status(200).json({"message":"Employee projects fetched", empProjects });
    } catch (error) {
        res.status(500).json({ "message":`request failed: ${error.message} `});
    }
}
