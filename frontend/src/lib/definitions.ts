export type Project = {
  id: number;
  uuid: string;
  name: string;
  tasks: Task[];
  states: TaskState[];
};

export type Task = {
  id?: number;
  uuid: string;
  name: string;
  stateUUID: string;
  stateId?: number;
};

export type TaskState = {
  id?: number;
  uuid: string;
  name: string;
};
