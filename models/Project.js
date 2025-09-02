const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["pending","inprogress","completed"],
        default : "pending"
    },
    progress : {
        type : Number,
        defalut : 0
    },
    listoftasks : [{
        type : Schema.Types.ObjectId,
        ref : "Tasks"
}]
},{
    timestamps : true
})

const Projects = mongoose.model("Projects",projectSchema);

module.exports = Projects;