const SubTasks = require("../models/SubTask");
const Tasks = require("../models/Task");
const Projects = require("../models/Project");

const createSubTask = async (req,res)=>{
    try{
        const {name,description,taskId} = req.body;
        const task = await Tasks.findById(taskId);
        if(!task){
            res.status(404).json({
                success : false,
                error : "Task not found"
            })
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
        const subtask = new SubTasks({name : name,description : description,taskId : taskId});
        await subtask.save();
        await Tasks.findByIdAndUpdate(taskId,{$push : {subtasks : subtask._id}},{new:true})
        res.status(201).json({
            success : true,
            message : "subTask created successfully",
            subtask
        });

    }catch(err){
        res.status(500).json({
            success : false,
            message : "Failed to create sub task",
            err : err.message
        })
    }
}

const getSubTask = async (req,res)=>{
    try{
        const id = req.params.id;
        const subtask = await SubTasks.findById(id);
        if(!subtask){
            res.status(404).json({
                success:false,
                error : "subTask not found"
            })
            return;
        }
        const task = await Tasks.findById(subtask.taskId);
        if(!task){
            res.status(404).json({
                success : false,
                error : "substask's related Task not found"
            })
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
        res.status(200).json({
            success : true,
            message : "subtask fetched feasuccessfully ",
            subtask
        })

    }
    catch(err){
        res.status(500).json({
            success : false,
            message : "Error fetching subTask",
            error : err.message
            
        })
    }
}

const updateSubTask = async (req,res)=>{
    try{
        const id = req.params.id;
        const {name,description} = req.body;
        const subtask = await SubTasks.findById(id);
        if(!subtask){
            res.status(404).json({
                success : false,
                error : "subtask not found"
            })
            return;
        }
        const task = await Tasks.findById(subtask.taskId);
        if(!task){
            res.status(404).json({
                success : false,
                error : "Task not found realated to sub task",
            })
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
        const updatedSubTask = await SubTasks.findByIdAndUpdate(id,{name : name,description : description},{new:true});
        res.status(200).json({
            success : true,
            message : "Sub task successfully updated",
            updatedSubTask
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Error updating sub task",
            error : err.message    
        })
    }
}

const deleteSubTask = async (req,res)=>{
    try{
        const id = req.params.id;
        const subtask = await SubTasks.findById(id);
        if(!subtask){
            res.status(404).json({
                success : false,
                message : "subtask not found",
            });
        }
        const task = await Tasks.findById(subtask.taskId);
        if(!task){
            res.status(404).json({
                success : false,
                message : "task not found parent of subtask"
            });
            return;
        }
        const project = await Projects.findById(task.projectId);
        if(!project || project.userId.toString() != req.user.id){
            res.status(403).json({
                success : false,
                message : "Unauthorized"
            });
            return;
        }
        const deletedSubTask = await SubTasks.deleteOne({_id : id});
        await Tasks.findByIdAndUpdate(subtask.taskId,{$pull : {subtasks : id}},{new:true});
        res.status(200).json({
            success : true,
            message : "Sub task successfully deleted",
            deletedSubTask
        });
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Failed to deletd sub task",
            error : err.message
        })
    }
}


module.exports = {createSubTask, getSubTask, updateSubTask, deleteSubTask}