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
    res.status(500).json({ message: `request failed: ${error.message} ` });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ assignedBy: req.user._id })
      .populate("assignedEmployees", "name")
      .populate("assignedBy", "name");
    if (!projects.length) {
      return res
        .status(200)
        .json({ message: "No projects found for this employee." });
    }
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: `request failed: ${error.message} ` });
  }
};

export const getEmployeeProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const empProjects = await Project.find({ assignedEmployees: userId })
      .populate("assignedEmployees", "name")
      .populate("assignedBy", "name");
    console.log(empProjects);
    if (empProjects.length == 0) {
      return res
        .status(200)
        .json({
          message: "Employee not assigned to any projects",
          projects: [],
        });
    }
    res
      .status(200)
      .json({ message: "Employee projects fetched", "projects": empProjects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `request failed: ${error.message} ` });
  }
};
