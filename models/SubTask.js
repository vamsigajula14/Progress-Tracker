const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subTaskSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : false
    },
    taskId : {
        type : Schema.Types.ObjectId,
        ref : "Tasks",
        index : true,
        required : true
    },
    status : {
        type : String,
        enum : ["pending","inprogress","completed"],
        default : "pending"
    }
},{
    timestamps : true
})

const SubTasks = mongoose.model("SubTasks",subTaskSchema);

module.exports = SubTasks;