const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create Task
router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, creatorEmail, assigneeEmail } = req.body;

    const creator = await User.findOne({ email: creatorEmail });
    
    if (!creator) {
      return res.status(400).json({ error: 'Invalid creator' });
    }

    let assignee = null;
    if (assigneeEmail) {
      assignee = await User.findOne({ email: assigneeEmail });
      if (!assignee) {
        return res.status(400).json({ error: 'Invalid assignee' });
      }
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      creator: { email: creator.email, fullName: creator.fullName },
      assignee: assignee ? { email: assignee.email, fullName: assignee.fullName } : null
    });

    await task.save();

    if (assignee) {
      const notification = new Notification({
        userEmail: assignee.email,
        message: `New task assigned: ${title}`
      });

      await notification.save();
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tasks (with search & filter)
router.get('/', async (req, res) => {
  const { email, search, status, priority, dueDate, createdBy, assigneeEmail } = req.query;

  const query = {};

  if (email) {
    query.$or = [{ 'assignee.email': email }, { 'creator.email': email }];
  }

  if (createdBy === 'true') {
    query['creator.email'] = email;
  }

  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ];
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (dueDate) query.dueDate = { $lte: new Date(dueDate) };
    
  if (assigneeEmail) {
        query['assignee.email'] = assigneeEmail;
  }

  try {
    const tasks = await Task.find(query).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (req.body.assigneeEmail && req.body.assigneeEmail !== task.assignee.email) {
      const newAssignee = await User.findOne({ email: req.body.assigneeEmail });
      if (newAssignee) {
        const notification = new Notification({
          userEmail: newAssignee.email,
          message: `You have been assigned a task: ${task.title}`
        });
        await notification.save();
      }
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;