import { Request, Response } from 'express';

// TODO Encapsulate
interface Task {
  id: string;
  name: string;
}

interface Column {
  id: string;
  name: string;
  tasks: Task[] | [];
}

interface Board {
  id: string;
  name: string;
  columns: Column[] | [];
}

const BoardController = {
  getBoard(req: Request, res: Response) {
    if (!req.params.id) return;

    const data: Board = {
      id: req.params.id,
      name: 'Tablerico 👍🏻',
      columns: [
        { id: '1', name: 'To do', tasks: [] },
        { id: '2', name: 'Doing', tasks: [] },
        { id: '3', name: 'Done', tasks: [] },
      ],
    };

    res.send(data);
  },
  editBoard(req: Request, res: Response) {
    if (!req.params.id) return;

    const data: Board = {
      id: req.params.id,
      name: 'Tablerico 👍🏻',
      columns: [
        { id: '1', name: 'To do', tasks: [] },
        { id: '2', name: 'Doing', tasks: [] },
        { id: '3', name: 'Done', tasks: [] },
      ],
    };

    res.send(data);
  },
};

export default BoardController;
