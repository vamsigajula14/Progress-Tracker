const express = require("express");
const {createSubTask,getSubTask,updateSubTask,updateSubtaskStatus,deleteSubTask} = require("../controllers/subTaskController");
const middleware  = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/',middleware,createSubTask);

router.get('/:id',middleware,getSubTask);

router.put('/:id',middleware,updateSubTask);

router.delete('/:id',middleware,deleteSubTask);

router.patch('/:id/status',middleware,updateSubtaskStatus);

module.exports = router;