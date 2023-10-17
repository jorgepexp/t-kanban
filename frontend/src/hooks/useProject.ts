import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState, useCallback } from "react";
import Api, { Project, Task, TaskState } from "src/lib/api";

export default function useProject(projectId: number) {
	const [error, setError] = useState<Error>();
	const [project, setProject] = useState<Project | undefined>();
	const [isLoading, setIsLoading] = useState(true);
	const [isFetching, setIsFetching] = useState(false);
	const [retryData, setRetryData] = useState<{
		fn: (...args: any[]) => Promise<void>;
		params: any[];
	}>();
	const debouncedProject = useDebounce(project, 100);

	const fetchProject = useCallback(async () => {
		try {
			setIsLoading(true);
			const project = await Api.fetchProject(projectId);
			setProject(project);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			setError(error as Error);
		}
	}, [projectId]);

	useEffect(() => {
		fetchProject();
	}, [fetchProject]);

	useEffect(() => {
		if (!debouncedProject) return;
		Api.saveProject(debouncedProject);
	}, [debouncedProject]);

	function setColumnName(columnUUID: string, name: string) {
		setProject((project) => {
			if (project === undefined) return;

			const foundState = project.states.find(
				(state) => state.uuid === columnUUID
			);

			if (foundState?.id === undefined) throw new Error("Missing column");

			Api.updateTaskState(project.id, foundState.id, name);

			const states = project?.states.map((state) =>
				foundState.id === state.id ? { ...state, name } : state
			);

			return {
				...project,
				states,
			};
		});
	}

	function setName(name: string) {
		Api.updateProjectName((project as Project).id, name);
		setProject((project) => project && { ...project, name });
	}

	function addColumn(name: string) {
		if (!project) return;

		const generatedUUID = crypto.randomUUID();
		setProject(
			(project) =>
				project && {
					...project,
					states: [...project.states, { name, uuid: generatedUUID }],
				}
		);

		Api.createTaskState((project as Project).id, name);
	}

	async function addTask(columnUUID: string, name: string) {
		setIsFetching(true);
		const state = (project as Project).states.find(
			(state) => state.uuid === columnUUID
		);
		if (!state || !state?.id) throw new Error("Missing state");
		// debugger;

		const generatedUUID = crypto.randomUUID();
		setProject((project) => {
			if (!project) return;
			return {
				...project,
				tasks: [
					...project.tasks,
					{
						name,
						uuid: generatedUUID,
						stateUUID: columnUUID,
						stateId: state.id,
					},
				],
			};
		});

		const task = await Api.createTask((project as Project).id, state.id, name);
		console.log("Task from create task", task);
		// Si la llamada no es satisfactoria, aquí habría que manejar el devolver el proyecto a su estado previo
		if (task === null) {
			setProject((project) => {
				if (!project) return;
				const tasks = project.tasks.filter(
					(task) => task.uuid !== generatedUUID
				);

				return {
					...project,
					tasks,
				};
			});
			setIsFetching(false);
			// TODO
			// setError(new Error("Error creando tarea"));
			setRetryData({ fn: addTask, params: [columnUUID, name] });
			return;
		}

		setProject((project) => {
			if (!project) return;
			const tasks = project?.tasks.map((task) =>
				task.uuid === generatedUUID ? { ...task, id: task.id } : task
			);
			return {
				...project,
				tasks,
			};
		});
		setIsFetching(false);
	}

	function removeError() {
		setError(undefined);
	}

	function retryCall() {
		if (!retryData) throw new Error("Missing retry call information");
		retryData.fn(...retryData.params);
	}

	return {
		data: project as Project,
		error,
		isLoading,
		isFetching,
		setColumnName,
		setName,
		addColumn,
		addTask,
		removeError,
		retryCall,
	};
}
