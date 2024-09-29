import React, { useState, useEffect } from 'react';
import { Task } from '../../types';
import { createTask, updateTask } from '../../services/api';
import { toast } from 'react-toastify';
import './index.css';

interface TaskFormProps {
  existingTask: Task | null;
  onTaskSaved: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ existingTask, onTaskSaved }) => {
  const [taskData, setTaskData] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingTask) {
      setTaskData({
        title: existingTask.title,
        description: existingTask.description,
      });
    } else {
      setTaskData({
        title: '',
        description: '',
      });
    }
  }, [existingTask]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (existingTask) {
        await updateTask(existingTask.id, taskData);
        toast.success('Task updated successfully', {
          hideProgressBar: true,
        });
      } else {
        await createTask(taskData);
        toast.success('Task created successfully', {
          hideProgressBar: true,
        });
      }

      // Reset form and trigger task list reload
      setTaskData({
        title: '',
        description: '',
      });
      onTaskSaved();
    } catch (error) {
      toast.error('An error occurred while saving task.', {
        hideProgressBar: true,
      });
      console.error('Failed to save task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={taskData.title}
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={taskData.description}
          onChange={handleInputChange}
          required
          rows={2}
          disabled={isSubmitting}
        ></textarea>
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : existingTask ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
