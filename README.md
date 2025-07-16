# Task Manager API

A simple REST API built with Node.js and Express for managing tasks in a contact centre.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Application**:
   - For production:
     ```bash
     npm start A simple REST API built with Node.js and Express for managing tasks in a contact centre.
     ```
   - For development (with auto-restart on file changes):
     ```bash
     npm run dev
     ```

   The server will start on `http://localhost:3000`.

## Modifications for Contact Center Agents

The Task Manager API has been enhanced from its basic version to better serve the needs of contact center agents. Below are the key modifications and the motivations behind them:

- **Task Prioritization and Status Tracking**: Added `priority` (Low, Medium, High) and `status` (Open, In Progress, Completed) fields to tasks. This allows agents to manage their workload based on urgency and track progress,this is important in a fast-paced contact center environment where customer issues vary in importance and resolution time.

- **Task Assignment to Agents**: Introduced an `assignedTo` field and a `POST /tasks/:id/assign` endpoint to assign tasks to specific agents. This ensures accountability and clear ownership of tasks, facilitating more efficient collaboration and workload distribution among agents.

- **Audit Logging for Task Changes**: Implemented an in-memory audit log system to track task creation, assignment, and deletion, accessible via `GET /audit-logs`. This helps as tracking actions is often necessary for operational oversight and customer service audits.

- **Agent-Specific Task Retrieval**: Added `GET /tasks/agent/:agent` endpoint to retrieve all tasks assigned to a specific agent. This helps agents focus on their responsibilities and allows supervisors to monitor individual workloads, improving efficiency and management.

These modifications aim to address the challenges faced by contact center agents, such as managing multiple customer interactions, ensuring task accountability, and maintaining operational transparency.

## API Endpoints

**Note**: All endpoints now require authentication. Include the following header in all requests:
```
Authorization: Bearer my-hardcoded-token
```

- **GET /tasks**: Retrieve all tasks. Supports optional query parameters for filtering:
  - `q`: Keyword filtering (case-insensitive) on title or description.
    - Example: `http://localhost:3000/tasks?q=work`
  - `priority`: Filter by priority (e.g., Low, Medium, High).
    - Example: `http://localhost:3000/tasks?priority=High`
  - `status`: Filter by status (e.g., Open, In Progress, Completed).
    - Example: `http://localhost:3000/tasks?status=Open`
- **POST /tasks**: Create a new task. Requires JSON body with `title` and `description`. Optional fields: `priority` (defaults to Medium), `status` (defaults to Open), `assignedTo` (defaults to Unassigned).
  - Example: `{ "title": "Task 1", "description": "Description of Task 1", "priority": "High", "status": "In Progress", "assignedTo": "Agent1" }`
- **GET /tasks/:id**: Retrieve a specific task by ID.
- **GET /tasks/summary**: Get a summary of all tasks (total count and titles).
- **DELETE /tasks/:id**: Delete a specific task by ID.
- **POST /tasks/:id/assign**: Assign a task to an agent. Requires JSON body with `assignedTo`.
  - Example: `{ "assignedTo": "Agent2" }`
- **GET /audit-logs**: Retrieve audit logs of task changes (create, assign, delete).
- **GET /tasks/agent/:agent**: Retrieve all tasks assigned to a specific agent.
  - Example: `http://localhost:3000/tasks/agent/Agent1` will return all tasks assigned to Agent1.

## Testing the API

You can use tools like `curl` or Postman to interact with the API. Make sure to include the Authorization header in your requests.

### Example Requests

- Create a Task:
  ```bash
  curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -H "Authorization: Bearer my-hardcoded-token" -d '{"title": "Task 6", "description": "Description of Task 6", "priority": "High", "status": "Open", "assignedTo": "Agent1"}'
  ```

- Get All Tasks:
  ```bash
  curl http://localhost:3000/tasks -H "Authorization: Bearer my-hardcoded-token"
  ```

- Get All Tasks with Keyword Filter:
  ```bash
  curl http://localhost:3000/tasks?q=work -H "Authorization: Bearer my-hardcoded-token"
  ```

- Get Tasks by Priority:
  ```bash
  curl http://localhost:3000/tasks?priority=High -H "Authorization: Bearer my-hardcoded-token"
  ```

- Get Tasks by Status:
  ```bash
  curl http://localhost:3000/tasks?status=Open -H "Authorization: Bearer my-hardcoded-token"
  ```

- Assign a Task to an Agent:
  ```bash
  curl -X POST http://localhost:3000/tasks/1/assign -H "Content-Type: application/json" -H "Authorization: Bearer my-hardcoded-token" -d '{"assignedTo": "Agent2"}'
  ```

- Get Audit Logs:
  ```bash
  curl http://localhost:3000/audit-logs -H "Authorization: Bearer my-hardcoded-token"
  ```

- Delete a Task:
  ```bash
  curl -X DELETE http://localhost:3000/tasks/1 -H "Authorization: Bearer my-hardcoded-token"
  ``` 