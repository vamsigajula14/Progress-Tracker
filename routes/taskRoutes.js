const express = require('express');
const middleware = require('../middleware/authMiddleware');
const {createTask,getTasks,getTaskById,updateTask,deleteTask} = require("../controllers/taskController");
const router = express.Router();

router.post("/",middleware,createTask);
router.get("/project/:projectId",middleware,getTasks);
router.get("/:id",middleware,getTaskById);
router.put("/:id",middleware,updateTask);
router.delete("/:id",middleware,deleteTask);


module.exports = router;