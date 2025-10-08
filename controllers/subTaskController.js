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

// PATCH /api/subtasks/:id/status
const updateSubtaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const subtask = await SubTasks.findById(id);
    if (!subtask) {
      return res.status(404).json({ success: false, message: "Subtask not found" });
    }

    //  Update the subtask status
    subtask.status = status;
    await subtask.save();

    //  Find parent task
    const task = await Tasks.findById(subtask.taskId);
    if (task) {
      // Fetch all subtasks for this task
      const subtasks = await SubTasks.find({ _id: { $in: task.subtasks } });

      // Calculate how many are completed
      const total = subtasks.length;
      const completed = subtasks.filter((s) => s.status === "completed").length;

      // Compute progress percentage
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      // Update task progress
      task.progress = progress;
      await task.save();

      //  Update the parent project as well
      const project = await Projects.findById(task.projectId);
      if (project) {
        const allTasks = await Tasks.find({ project: project._id });
        const totalTasks = allTasks.length;
        const totalProgress = allTasks.reduce((sum, t) => sum + t.progress, 0);
        project.progress =
          totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;
        await project.save();
      }
    }

    res.json({
      success: true,
      message: "Subtask status updated successfully",
      subtask,
    });
  } catch (err) {
    console.error("Error updating subtask:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

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


module.exports = {createSubTask, getSubTask, updateSubTask, updateSubtaskStatus,deleteSubTask}