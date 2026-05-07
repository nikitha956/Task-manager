const express = require("express");
const taskRouter = express.Router();

const { createTask, getTasks, getTaskById, updateTask, deleteTask} = require("../controllers/taskController");
const { authMiddleWare } = require("../middleware/auth");


taskRouter.route('/')
    .get(authMiddleWare, getTasks)
    .post(authMiddleWare, createTask);

taskRouter.route('/:id')
    .get(authMiddleWare, getTaskById)
    .put(authMiddleWare, updateTask)
    .delete(authMiddleWare, deleteTask)


module.exports = taskRouter    