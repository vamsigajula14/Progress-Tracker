const Tasks = require('../models/Task');
const SubTasks = require("../models/SubTask");
const Projects = require('../models/Project');
const User = require('../models/User');

const createTask = async (req,res)=>{
    try{
        const {name,description,projectId} = req.body;
        const project = await Projects.findById(projectId);
        if(!project || project.userId.toString() != req.user.id){
            res.status(500).json({
                success : false,
                error : "Unauthorized"
            })
            return;
        }
        const task = new Tasks({name, description, projectId});
        await task.save();
        await Projects.findByIdAndUpdate(projectId,{$push:{listoftasks:task._id}});
        const updatedProject = await Projects.findById(projectId).populate("listoftasks");
        res.status(201).json({
            success : true,
            task,
            project : updatedProject
        })
    }
    catch(err){
        res.status(500).json({
            success : false,
            error : err.message || "Error creating a task"
        });
    }
}

const getTaskById = async (req,res)=>{
    try{
        const task = await Tasks.findById(req.params.id).populate("subtasks");
        if(!task){
            res.status(404).json({success : false, error : "No task found"});
            return;
        }
        const project = await Projects.findById(task.projectId);
        if(!project || project.userId.toString() != req.user.id){
             res.status(403).json({
                success : false,
                error : "Unauthorized"
            })
            return;
        }
        res.status(200).json({success:true,task});
    }
    catch(err){
        res.status(500).json({
            success : false,
            error : {message : "Error fetching task",err : err.message}
        })
    }
}

const getTasks = async (req,res)=>{
    try{
        const id = req.params.projectId;
        const tasks = await Tasks.find({projectId : id});
        if(tasks.length == 0){
            res.status(404).json({
                success : false, error : "No task found"
            });
            return;
        }
        const project = await Projects.findById({_id : tasks[0].projectId});
        if(!project || project.userId.toString() != req.user.id){
            res.status(403).json({
                success : false,
                error : "Unauthourized"
            })
            }
            res.json({
                success : true,
            tasks
        })
    }
    catch(err){
        res.status(500).json({
            error : {
                success : false,
                message : "Error fetching tasks",
                error : err.message
            }
        })
    }
}

const updateTask = async (req,res)=>{
    try{
        const {name, description, status, progress} = req.body;
        const id = req.params.id;
        const temTask = await Tasks.findById({_id : id});
        if(!temTask){
            res.status(404).json({
                success : false,
                error : "Task not found"
            })
            return;
        }
        const project = await Projects.findById({_id : temTask.projectId});
        if(!project || project.userId.toString() != req.user.id){
            res.status(403).json({
                success : false,
                error : "Unauthorized access"
            })
            return;
        }
        const task = await Tasks.findOneAndUpdate({_id : id},{name,description,status,progress},{new:true});
        if(!task){
            res.status(404).json({
                success : false,
               message : "Error updating task"
            });
            return;
        }
        const updatedProject = await Projects.findById(temTask.projectId).populate("listoftasks");
        res.status(200).json({
            success : true,
            task,
            project : updatedProject
        });
    }
    catch(err){
        res.status(500).json({
            error : {
                success : false,
                message : "Failed to update",
                error : err.message
            }
        });
    }
}

const deleteTask = async (req,res)=>{
    try{
        const id = req.params.id;
        const task = await Tasks.findById({_id:id});
        if(!task){
            res.status(404).json({
                success : false,
                message : "Task not found"
            });
            return;
        }
        const project = await Projects.findById({_id : task.projectId});
        if (!project || project.userId.toString() != req.user.id){
            res.status(403).json({
                success : false,
                error : "Unauthorized"
            });
            return;
        }
        await SubTasks.deleteMany({taskId : id});
        await Tasks.deleteOne({_id:id});
        await Projects.findByIdAndUpdate(task.projectId,{$pull:{listoftasks:task._id}});
        res.status(200).json({
            success : true,
            message : `${task.name} Successfully deleted`
        })
    }catch(err){
        res.json({
            error : {
                success : false,
                message : "Failed to delete",
                error : err.message
            }
        })

    }
}


module.exports = {createTask,getTaskById,getTasks,updateTask,deleteTask}