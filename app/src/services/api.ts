import axios from 'axios';
import { Task } from '../types';

const API_URL = 'http://localhost:4000/tasks';

// Fetch all tasks
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get<Task[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
};

// Create new task
export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const response = await axios.post<Task>(API_URL, task);
    return response.data;
  } catch (error) {
    console.error('Failed to create task:', error);
    throw error;
  }
};

// Update existing task
export const updateTask = async (id: number, task: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const response = await axios.put<Task>(`${API_URL}/${id}`, task);
    return response.data;
  } catch (error) {
    console.error(`Failed to update task with id ${id}:`, error);
    throw error;
  }
};

// Delete a task by ID
export const deleteTask = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Failed to delete task with id ${id}:`, error);
    throw error;
  }
};
