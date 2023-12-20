import { Project, Task, TaskState } from './definitions';

const BASE_URL = 'http://localhost:3001';

const Api = {
  async createProject(name: string) {
    const response = await fetch(`http://localhost:3001/api/projects/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const json = await response.json();

    if (response.status === 200) {
      const { id } = json;
      // We need to create this in order so that's why we're not using Promise.all or similar
      await this.createTaskState(id, 'To do');
      await this.createTaskState(id, 'Doing');
      await this.createTaskState(id, 'Done');
    }

    return json as Project;
  },
  async fetchProject(id: number): Promise<Project> {
    const response = await fetch(`${BASE_URL}/api/projects/${id}`);
    const json: Project = await response.json();

    json.uuid = crypto.randomUUID();
    json.states = json.states.map((state) => ({
      ...state,
      uuid: crypto.randomUUID(),
    }));
    json.tasks = json.tasks.map((task) => ({
      ...task,
      uuid: crypto.randomUUID(),
      stateUUID: json.states.find((state) => state.id === task.stateId)
        ?.uuid as string,
    }));

    return json;
  },
  async fetchAllProjects(): Promise<Project[]> {
    const response = await fetch(`${BASE_URL}/api/projects`);
    const json = await response.json();

    return json as Project[];
  },
  async saveProject(project: Project) {
    await fetch(`${BASE_URL}/api/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
  },
  async updateProjectName(projectId: number, name: string) {
    await fetch(`${BASE_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  },

  async createTaskState(projectId: number, name: string) {
    try {
      const response = await fetch(
        `${BASE_URL}/api/projects/${projectId}/states`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name }),
        }
      );
      const json = await response.json();

      if (response.status === 200) {
        return json as TaskState;
      } else throw new Error(`${json.message}`);
    } catch (error) {
      throw new Error(`Failed to create task state: ${error}`);
    }
  },
  async updateTaskState(projectId: number, stateId: number, name: string) {
    await fetch(`${BASE_URL}/api/projects/${projectId}/states`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, id: stateId }),
    });
  },

  async createTask(
    projectId: number,
    stateId: number,
    name: string
  ): Promise<Task> {
    const response = await fetch(`${BASE_URL}/api/projects/${projectId}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, stateId }),
    });
    const json = await response.json();

    return json as Task;
  },
};

export default Api;
