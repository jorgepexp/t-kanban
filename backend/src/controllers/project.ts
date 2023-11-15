import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { HTTPException } from '../lib/exceptions';

const prisma = new PrismaClient();

class ProjectNotFound extends HTTPException {
  constructor(id: number) {
    super(`Project with id ${id} not found.`, 404);
  }
}

const ProjectController = {
  async createProject(req: Request, res: Response) {
    const project = await prisma.project.create({
      data: {
        name: req.body.name,
      },
    });

    res.send(project);
  },
  async getProject(req: Request, res: Response) {
    const id = Number(req.params.id);

    const project = await prisma.project.findFirst({
      where: { id },
      include: {
        tasks: {
          orderBy: {
            id: 'asc',
          },
        },
        states: {
          orderBy: {
            id: 'asc',
          },
        },
      },
    });

    if (!project) throw new ProjectNotFound(id);

    res.status(200).send(project);
  },

  async getAllProjects(req: Request, res: Response) {
    const projects = await prisma.project.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    res.status(200).send(projects);
  },

  async updateProjectName(req: Request, res: Response) {
    const id = Number(req.params.id);
    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        name: req.body.name,
      },
    });
    if (!project) throw new ProjectNotFound(id);

    res.status(200).send(project);
  },
  async deleteProject(req: Request, res: Response) {
    const id = Number(req.params.id);
    const project = await prisma.project.delete({
      where: {
        id,
      },
    });

    if (!project) throw new ProjectNotFound(id);

    res.status(200).send();
  },

  async createTaskState(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { name } = req.body;

    const taskState = await prisma.taskState.create({
      data: {
        projectId: id,
        name,
      },
    });
    res.status(200).send(taskState);
  },
  async updateTaskState(req: Request, res: Response) {
    const projectId = Number(req.params.id);
    const { name, id } = req.body;

    const taskState = await prisma.taskState.update({
      where: {
        id,
      },
      data: {
        projectId,
        name,
      },
    });

    res.status(200).send(taskState);
  },
  async deleteTaskState(req: Request, res: Response) {
    const id = Number(req.params.id);

    await prisma.taskState.delete({
      where: {
        id,
      },
    });

    res.status(200).send();
  },

  async createTask(req: Request, res: Response) {
    const projectId = Number(req.params.id);
    const { name, stateId } = req.body;

    const task = await prisma.task.create({
      data: {
        projectId,
        stateId,
        name,
      },
    });

    res.status(200).send(task);
  },
  async updateTask(req: Request, res: Response) {
    const projectId = Number(req.params.id);
    const stateId = Number(req.params.stateId);
    const { name, taskId } = req.body;

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        projectId,
        stateId,
        name,
      },
    });

    res.status(200).send(task);
  },
  async deleteTask(req: Request, res: Response) {
    const { taskId } = req.body;
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    res.status(200).send();
  },
};

export default ProjectController;
