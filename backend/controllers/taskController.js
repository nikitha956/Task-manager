const Task = require("../models/taskModel");


// CREATE TASK
exports.createTask = async (req, res) => {
    try {
        // extract task details
        const {title, description, priority, dueDate, completed} = req.body;
        
        // create task
        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            completed: completed === "Yes" || completed === true,
            owner : req.user.id
        });

        res.status(201).json({
            success: true,
            task: task,
            message: "Task created Successfully !"
        })
    } 
    catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Internal server error !"
        })
    }
}

// GET ALL TASK FOR LOGGED-IN USER
exports.getTasks = async(req, res) =>{
    try {
        const userId = req.user.id;
        // find all task of user in decreasing order of creation
        const tasks = await Task.find({owner: userId}).sort({createdAt: -1});

        res.json({
            success: true, 
            tasks
        })

    }
     catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Internal server error !"
        })
    }
}

// GET SINGLE TASK BY ID (MUST BELONG TO THAT USER )    
exports.getTaskById = async (req, res) => {
    try {
        // find task with id whose owner is user
        const task = await Task.findOne({_id: req.params.id, owner: req.user.id});
        
        // if task not found
        if(!task){
            return res.json({
                success: false,
                message: "Task not Found !"
            })
        }
        
        res.json({
            success: true,
            task
        })
    } 
    catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Internal server error !"
        })    
    }
}

// UPDATING TASK
exports.updateTask = async(req, res) =>{
    try {
        const data = {...req.body}

        if(data.completed !== undefined){
            data.completed = data.completed === "YEs" || data.completed === true
        }

        const updateTask = await Task.findOneAndUpdate(
            {_id:req.params.id, owner: req.user.id},
            data,
            {new: true, runValidators: true}
        )

        if(!updateTask){
            return res.status(404).json({
                success: false,
                message: "Task not Found for current User"
            })
        }

        res.status(200).json({
            success: true,
            updateTask
        })
    } 
    catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Internal server error !"
        })    
    }
}

// DELETE TASK
exports.deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedTask = await Task.findOneAndDelete({_id:id, owner:req.user.id})    

        if(!deletedTask){
            return res.status(404).json({
                success: false,
                message: "Task not found or doesn't belong to you !"
            })
        }

        res.json({
            success: true,
            message: "Task deleted successfully"
        })
    } 
    catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Internal server error !"
        })  
    }
}