import { Request, Response } from 'express';
import { PrismaClient, Project, Task, TaskState } from '@prisma/client';
import { HTTPException } from '../lib/exceptions';

const prisma = new PrismaClient();

class ProjectNotFound extends HTTPException {
  constructor(id: number) {
    super(`Board with id ${id} not found.`, 404);
  }
}

const BoardController = {
  async createBoard(req: Request, res: Response) {
    const board = await prisma.project.create({
      data: {
        name: req.body.name,
      },
    });

    res.send(board);
  },
  async getBoard(req: Request, res: Response) {
    const id = Number(req.params.id);

    const project = await prisma.project.findFirst({
      where: { id },
      include: {
        tasks: true,
        states: true,
      },
    });

    if (!project) {
      throw new ProjectNotFound(id);
    }

    res.status(200).send(project);
  },
};

export default BoardController;
