const Projects = require('../models/Project');
const User = require("../models/User");

const Tasks = require('../models/Task');

const SubTasks = require('../models/SubTask');

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = req.user.id;

    const project = new Projects({ name, description, userId: id });
    await project.save();
    await User.findByIdAndUpdate(req.user.id,{$push:{projects : project._id}});
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Error while creating new project",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Projects.find({ userId: req.user.id }).populate("listoftasks");
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { message: "Error fetching projects", details: err.message },
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Projects.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("listoftasks");

    if (!project) return res.status(404).json({ success: false, error: "Project not found" });

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { message: "Error while fetching project", details: err.message },
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, description, status, progress } = req.body;
    
    const project = await Projects.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, description, status, progress },
      { new: true }
    );
    if (!project) return res.status(404).json({ success: false, error: "Project not found" });


    res.json({ success: true, message: "Project updated successfully", project });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { message: "Error while updating a project", details: err.message },
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;

    const project = await Projects.findOne({ _id: id, userId: req.user.id });

    if (!project) return res.status(404).json({ success: false, error: "Project not found" });

    const tasks = await Tasks.find({projectId : project._id});

    for(const task of tasks){
        await SubTasks.deleteMany({taskId : task._id});
    }

    await Tasks.deleteMany({projectId : project._id});


    await Projects.deleteOne({ _id: id, userId: req.user.id });

    await User.findByIdAndUpdate(req.user.id,{$pull : {projects:project._id}});

    res.json({ success: true, message: `${project.name} deleted successfully` });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { message: "Error while deleting the record", details: err.message },
    });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };