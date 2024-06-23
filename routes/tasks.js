const express = require('express');
const router = express.Router();

let tasks = [];
let currentId = 1;

// Retrieve all tasks
router.get('/', (req, res) => {
    res.json(tasks);
});

// Create a new task
router.post('/', (req, res) => {
    const task = {
        id: currentId++,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate
    };
    tasks.push(task);
    res.status(201).json(task);
});

// Retrieve a single task by its ID
router.get('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
});

// Update an existing task
router.put('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.dueDate = req.body.dueDate || task.dueDate;
    res.json(task);
});

// Delete a task
router.delete('/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }
    tasks.splice(taskIndex, 1);
    res.status(204).end();
});

module.exports = router;