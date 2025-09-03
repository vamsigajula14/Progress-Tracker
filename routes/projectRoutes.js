const {createProject,getProjectById,getProjects,deleteProject,updateProject} = require('../controllers/projectController');

const express = require('express');
const middleware = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/',middleware,createProject);

router.get('/',middleware,getProjects);

router.get('/:id',middleware,getProjectById);

router.delete('/:id',middleware,deleteProject);

router.put('/:id',middleware,updateProject);


module.exports = router;