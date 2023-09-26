import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import BoardController from './controllers/board';
import { HTTPException } from './lib/exceptions';
import { globalErrorHandler } from './lib/error-handler';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

const asyncHandler =
  (controller: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    controller(req, res).catch(next);

app.get('/api/projects/:id', asyncHandler(BoardController.getBoard));

// app.put('/api/projects/:id', BoardController.editBoard);

// Crear "columna": POST /api/projects/:projectId/states { name: string }
// Crear tarea: POST /api/projects/:project/task -> { name: string, stateId: number }
// Actualizar nombre tablero: PUT /api/projects/:id
// Actualizar columna: PUT /api/projects/:projectId/states/:stateId

app.post('/api/projects', BoardController.createBoard);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log('🔥 Server up and running on http://localhost:%d', port);
});
