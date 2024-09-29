import React, { useEffect, useState } from 'react';
import { getTasks, updateTask, deleteTask } from '../../services/api';
import { Task } from '../../types';
import TaskForm from '../TaskForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './index.css';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<{ [key: number]: Partial<Task> }>({}); // Store changes locally

  const loadTasks = async () => {
    const taskList = await getTasks();
    setTasks(taskList);
  };

  const handleInputBlur = async (id: number, field: keyof Task) => {
    const updatedTask = editingTask[id];
    if (updatedTask) {
      const taskToUpdate = tasks.find((task) => task.id === id);
      if (taskToUpdate) {
        const newTask = {
          ...taskToUpdate,
          ...updatedTask, // Apply local changes to the task
        };
        console.log('newTask', newTask)
        if (!newTask.description || !newTask.title) {
          toast.error("Missing required fields!", {
            hideProgressBar: true,
          });
          loadTasks(); // Reload the tasks
          return;
        }
        await updateTask(id, { title: newTask.title, description: newTask.description });
        toast.success("Task updated successfully!", {
          hideProgressBar: true,
        });

        // Clear the local changes after saving
        setEditingTask((prevState) => {
          const newState = { ...prevState };
          delete newState[id];
          return newState;
        });

        loadTasks(); // Reload the tasks
      }
    }
  };

  const handleInputChange = (id: number, field: keyof Task, value: string) => {
    setEditingTask((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [field]: value,
      },
    }));
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    loadTasks();
  };

  const handleTaskSaved = () => {
    loadTasks();
    setSelectedTask(null);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="task-list-container">
      <TaskForm existingTask={selectedTask} onTaskSaved={handleTaskSaved} />

      <div className="table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th className="small-column">ID</th>
              <th>Title</th>
              <th>Description</th>
              <th className="small-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="small-column">{task.id}</td>
                <td>
                  <input
                    type="text"
                    value={editingTask[task.id]?.title ?? task.title}
                    onChange={(e) => handleInputChange(task.id, 'title', e.target.value)}
                    onBlur={() => handleInputBlur(task.id, 'title')} // Trigger update on blur
                  />
                </td>
                <td>
                  <textarea
                    value={editingTask[task.id]?.description ?? task.description}
                    onChange={(e) => handleInputChange(task.id, 'description', e.target.value)}
                    onBlur={() => handleInputBlur(task.id, 'description')} // Trigger update on blur
                    rows={2}
                  />
                </td>
                <td className="small-column actions">
                  <div className="tooltip-container">
                    <FaEdit className="edit-icon" onClick={() => setSelectedTask(task)} />
                    <span className="tooltip-text">Edit Task</span>
                  </div>
                  <div className="tooltip-container">
                    <FaTrashAlt className="delete-icon" onClick={() => handleDelete(task.id)} />
                    <span className="tooltip-text">Delete Task</span>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default TaskList;
