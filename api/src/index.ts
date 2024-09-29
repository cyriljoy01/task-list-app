import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from './controllers/taskController';
import { validateTask } from './middleware/validate';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Routes

app.get('/tasks', getTasks); // GET: Retrieve a list of all tasks
app.get('/tasks/:id', getTaskById); // GET: Retrieve a specific task by its ID
app.post('/tasks', validateTask, createTask); // POST: Create a new task
app.put('/tasks/:id', validateTask, updateTask); // PUT: Update an existing task’s title and description
app.delete('/tasks/:id', deleteTask); // DELETE: Delete a task by its ID

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
