import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState, useCallback } from "react";
import Api, { Project, Task, TaskState } from "src/lib/api";

export default function useProject(projectId: number) {
	const [error, setError] = useState<Error>();
	const [project, setProject] = useState<Project>();
	const [isLoading, setIsLoading] = useState(true);
	const [isFetching, setIsFetching] = useState(false);
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
		// Antes de la respuesta, hacemos que la columna esté en estilo disabled
		// ?? TODO Hacer codigo

		console.log(project?.id, name);

		Api.createTaskState((project as Project).id, name);

		if (!project) return;
		setProject(
			(project) =>
				project && {
					...project,
					states: [...project.states, { name, uuid: crypto.randomUUID() }],
				}
		);
	}

	function addTask(columnUUID: string, name: string) {
		setIsFetching(true);
		const state = (project as Project).states.find(
			(state) => state.uuid === columnUUID
		);
		if (!state || !state?.id) throw new Error("Missing state");

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

		Api.createTask((project as Project).id, state.id, name)
			.then((response) => {
				if (response.status === 200) {
					setIsFetching(false);
					return response.json();
				}
			})
			.then((task: Task) => {
				const { id } = task;
				setProject((project) => {
					if (!project) return;
					const tasks = project?.tasks.map((task) =>
						task.uuid === generatedUUID ? { ...task, id } : task
					);

					return {
						...project,
						tasks,
					};
				});
			});
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
	};
}
