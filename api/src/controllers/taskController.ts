import { Request, Response } from 'express';
import { tasks } from '../data/tasks';
import { Task } from '../types';

// Get all tasks
export const getTasks = (req: Request, res: Response): void => {
  const nonDeletedTasks = tasks.filter(task => task.isDeleted === 0);
  res.json(nonDeletedTasks);
};

// Get a task by ID
export const getTaskById = (req: Request, res: Response): void => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId && t.isDeleted === 0);

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  res.json(task);
};

// Create a new task
export const createTask = (req: Request, res: Response): void => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400).json({ message: 'Missing Title/description' });
    return;
  }

  const newTask: Task = {
    id: tasks.length + 1,
    title,
    description,
    isDeleted: 0
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

// Update an existing task
export const updateTask = (req: Request, res: Response): void => {
  const taskId = parseInt(req.params.id);
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400).json({ message: 'Missing Title/description' });
    return;
  }

  const taskIndex = tasks.findIndex(t => t.id === taskId && t.isDeleted === 0);

  if (taskIndex === -1) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  tasks[taskIndex] = { ...tasks[taskIndex], title, description };
  res.json(tasks[taskIndex]);
};

// Mark task as deleted
export const deleteTask = (req: Request, res: Response): void => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId && t.isDeleted === 0);

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  task.isDeleted = 1;
  res.json({ success: true, message: 'Task marked as deleted' });
};
