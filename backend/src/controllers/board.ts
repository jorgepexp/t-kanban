import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Task {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
  tasks: Task[] | [];
}

const BoardController = {
  async createBoard(req: Request, res: Response) {
    const board = await prisma.project.create({
      data: {
        name: req.body.name,
      },
    });

    res.status(200).send(board);
  },
  async getBoard(req: Request, res: Response) {
    if (!req.params.id) return;
    const id = Number(req.params.id);

    const project = await prisma.project.findFirst({
      where: { id },
    });
    if (!project) return;

    const states = await prisma.state.findMany({
      where: { projectId: id },
      include: {
        tasks: true,
      },
    });

    // TODO No ignorar
    // @ts-ignore
    project.states = states;

    res.status(200).send(project);
  },
  async editBoard(req: Request, res: Response) {
    if (!req.params.id) return;
    const id = Number(req.params.id);

    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        name: req.body.name,
      },
    });

    const statesWithoutTasks = req.body.states.map(
      ({ tasks, ...rest }: { tasks: Task[] }) => rest
    );

    for (const state of statesWithoutTasks) {
      if (state.id === -1) {
        await prisma.state.create({
          data: {
            name: state.name,
            projectId: state.projectId,
          },
        });
        break;
      }
      await prisma.state.update({
        where: {
          id: state.id,
        },
        data: state,
      });
    }

    const tasks = req.body.states.flatMap((state: State) => state.tasks);
    for (const task of tasks) {
      if (task.id === -1) {
        await prisma.task.create({
          data: {
            name: task.name,
            stateId: task.stateId,
            projectId: task.projectId,
          },
        });
      } else {
        await prisma.task.update({
          where: {
            id: task.id,
          },
          data: task,
        });
      }
    }

    const updatedStates = await prisma.state.findMany({
      where: {
        projectId: id,
      },
      include: {
        tasks: true,
      },
    });

    const updatedProject = {
      ...project,
      states: [...updatedStates],
    };

    res.status(200).send(updatedProject);
  },
};

export default BoardController;
