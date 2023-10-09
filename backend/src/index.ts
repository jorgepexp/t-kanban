import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import ProjectController from './controllers/project';
import { globalErrorHandler } from './lib/error-handler';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

const asyncHandler =
  (controller: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    controller(req, res).catch(next);

// Project routes
app.get('/api/projects/:id', asyncHandler(ProjectController.getProject));
app.post('/api/projects', ProjectController.createProject);
app.put('/api/projects/:id', asyncHandler(ProjectController.updateProjectName));
app.delete('/api/projects/:id', asyncHandler(ProjectController.deleteProject));

// States routes
app.post(
  '/api/projects/:id/states',
  asyncHandler(ProjectController.createTaskState)
);
app.put(
  '/api/projects/:id/states',
  asyncHandler(ProjectController.updateTaskState)
);
app.delete(
  '/api/projects/states/:id',
  asyncHandler(ProjectController.deleteTaskState)
);

// Task routes
app.post('/api/projects/:id/task', asyncHandler(ProjectController.createTask));
app.put(
  '/api/projects/:id/states/:stateId',
  asyncHandler(ProjectController.updateTask)
);
app.delete(
  '/api/projects/:id/task',
  asyncHandler(ProjectController.deleteTask)
);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log('🔥 Server up and running on http://localhost:%d', port);
});
