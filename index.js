const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting 'Bearer <token>'
  const validToken = 'my-hardcoded-token';

  if (!token || token !== validToken) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }
  next();
};

// Apply auth middleware to all routes
app.use(authMiddleware);

// In-memory storage for tasks and audit logs
let tasks = [{
  id: 1,
  title: 'Task 1',
  description: 'Description 1',
  priority: 'Medium',
  status: 'Open',
  assignedTo: 'Agent1'
},
{
  id: 2,
  title: 'Task 2',
  description: 'Description 2',
  priority: 'High',
  status: 'In Progress',
  assignedTo: 'Agent2'
},
{
  id: 3,
  title: 'Task 3',
  description: 'Description 3',
  priority: 'Low',
  status: 'Completed',
  assignedTo: 'Agent1'
},
{
  id: 4,
  title: 'Task 4',
  description: 'Description 4',
  priority: 'Medium',
  status: 'Open',
  assignedTo: 'Agent3'
},
{
  id: 5,
  title: 'Task 5',
  description: 'Description 5',
  priority: 'High',
  status: 'In Progress',
  assignedTo: 'Agent2'
}];
let taskId = 5;
let auditLogs = [];
let logId = 1;

// Function to add audit log
function addAuditLog(action, taskId, details = {}) {
  const log = {
    id: logId++,
    action,
    taskId,
    timestamp: new Date().toISOString(),
    details
  };
  auditLogs.push(log);
  return log;
}

// GET /audit-logs - Retrieve audit logs
app.get('/audit-logs', (req, res) => {
  res.json(auditLogs);
});

// GET /tasks - Return all tasks with optional keyword, priority, and status filtering
app.get('/tasks', (req, res) => {
  const keyword = req.query.q;
  const priority = req.query.priority;
  const status = req.query.status;
  let filteredTasks = tasks;

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(lowerKeyword) || 
      task.description.toLowerCase().includes(lowerKeyword)
    );
  }

  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }

  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }

  res.json(filteredTasks);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, priority = 'Medium', status = 'Open', assignedTo = 'Unassigned' } = req.body;
  
  // Validation
  if (!title || !description) {
    return res.status(400).json({ error: 'Unable to create task. Title and description are required' });
  }
  
  taskId++;
  
  const newTask = {
    id: taskId,
    title,
    description,
    priority,
    status,
    assignedTo
  };
  tasks.push(newTask);
  addAuditLog('create', taskId, { title, description, priority, status, assignedTo });
  res.status(201).json(newTask);
});

// POST /tasks/:id/assign - Assign a task to an agent
app.post('/tasks/:id/assign', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { assignedTo } = req.body;

  if (!assignedTo) {
    return res.status(400).json({ error: 'Assigned agent name is required' });
  }

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex].assignedTo = assignedTo;
  addAuditLog('assign', taskId, { assignedTo });
  res.json({ message: `Task ${taskId} assigned to ${assignedTo}`, task: tasks[taskIndex] });
});

// GET /tasks/summary - Return a summary of tasks
app.get('/tasks/summary', (req, res) => {
  const summary = {
    total: tasks.length,
    titles: tasks.map(task => task.title)
  };
  res.json(summary);
});

// GET /tasks/:id - Return a specific task
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// DELETE /tasks/:id - Delete a specific task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  addAuditLog('delete', taskId, { title: deletedTask.title });
  res.json({ message: 'Task deleted successfully' });
});

// GET /tasks/agent/:agent - Retrieve all tasks assigned to a specific agent
app.get('/tasks/agent/:agent', (req, res) => {
  const agent = req.params.agent;
  const agentTasks = tasks.filter(task => task.assignedTo === agent);
  res.json(agentTasks);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 