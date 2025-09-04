const express = require("express");
const {createSubTask,getSubTask,updateSubTask,deleteSubTask} = require("../controllers/subTaskController");
const middleware  = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/',middleware,createSubTask);

router.get('/:id',middleware,getSubTask);

router.put('/:id',middleware,updateSubTask);

router.delete('/:id',middleware,deleteSubTask);


module.exports = router;