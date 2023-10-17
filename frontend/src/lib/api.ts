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

const BASE_URL = "http://localhost:3001";

const Api = {
	async createProject(name: string) {
		const response = await fetch(`http://localhost:3001/api/projects/`, {
			method: "POST",
			body: JSON.stringify({ name }),
		});
	},
	async fetchProject(id: number): Promise<Project> {
		const response = await fetch(`${BASE_URL}/api/projects/${id}`);

		console.log("Is response ok?", response.ok);
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
	async saveProject(project: Project) {
		const updatedProject = await fetch(
			`${BASE_URL}/api/projects/${project.id}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(project),
			}
		);

		return updatedProject.json();
	},
	async updateProjectName(projectId: number, name: string) {
		await fetch(`${BASE_URL}/api/projects/${projectId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name }),
		});
	},

	async createTaskState(projectId: number, name: string) {
		await fetch(`${BASE_URL}/api/projects/${projectId}/states`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name }),
		});
	},
	async updateTaskState(projectId: number, stateId: number, name: string) {
		const response = await fetch(
			`${BASE_URL}/api/projects/${projectId}/states`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, id: stateId }),
			}
		);

		return response;
	},

	async createTask(
		projectId: number,
		stateId: number,
		name: string
	): Promise<Task | null> {
		// TODO Remember to remove
		const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
		await sleep(2000);

		return null;

		const response = await fetch(`${BASE_URL}/api/projects/${projectId}/task`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, stateId }),
		});

		if (response.status === 200) return (await response.json()) as Task;

		return null;
	},
};

export default Api;
