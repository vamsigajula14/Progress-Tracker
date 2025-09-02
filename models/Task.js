const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    projectId : {
        type : Schema.Types.ObjectId,
        ref : "Projects",
        required : true,
        index : true
    },
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : false
    },
    subtasks : [{
        type : Schema.Types.ObjectId,
        ref : "SubTasks"
    }],
    status : {
        type : String,
        enum : ["pending","inprogress","completed"],
        default : "pending"
    },
    progress : {
        type : Number,
        default : 0
    }
},{
    timestamps : true
})


const Tasks = mongoose.model("Tasks",taskSchema);

module.exports = Tasks;