import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useState, useCallback } from 'react';
import Api from 'src/lib/api';
import { Project } from 'src/lib/definitions';
import { RetryableError } from './errors';

// Este hook debe tener estas responsabilidades:
// - Manejar la entidad proyecto
// - Mantener sus datos actualizados
// - Si una acción de mutación atomica falla, esta devuelve un error con una funcion para volver a intentarlo.

export default function useProject(projectId: number) {
  const [error, setError] = useState<Error>();
  const [project, setProject] = useState<Project | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const debouncedProject = useDebounce(project, 100);

  const fetchProject = useCallback(async () => {
    try {
      setIsLoading(true);
      const project = await Api.fetchProject(projectId);
      setProject(project);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
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
      if (foundState?.id === undefined) throw new Error('Missing column ID');

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

  async function addColumn(name: string) {
    if (!project) return;

    const columnUUID = crypto.randomUUID();
    setProject(
      (project) =>
        project && {
          ...project,
          states: [...project.states, { name, uuid: columnUUID }],
        }
    );

    async function create() {
      return await Api.createTaskState((project as Project).id, name);
    }

    try {
      const createdColumn = await create();
      setProject((project) => {
        if (!project) return;
        debugger;
        const states = project.states.map((state) =>
          state.uuid === columnUUID ? { ...state, id: createdColumn.id } : state
        );

        return { ...project, states };
      });
    } catch (error) {
      throw new RetryableError(create);
    }
  }

  async function addTask(columnUUID: string, name: string, fixedUUID?: string) {
    const state = (project as Project).states.find(
      (state) => state.uuid === columnUUID
    );
    if (!state || !state?.id) throw new Error('Missing state');

    const taskUUID = fixedUUID ?? crypto.randomUUID();

    if (fixedUUID === undefined) {
      setProject((project) => {
        if (!project) return;
        return {
          ...project,
          tasks: [
            ...project.tasks,
            {
              name,
              uuid: taskUUID,
              stateUUID: columnUUID,
              stateId: state.id,
            },
          ],
        };
      });
    }

    async function create() {
      return await Api.createTask(
        (project as Project).id,
        (state as any).id,
        name
      );
    }

    try {
      const createdTask = await create();
      setProject((project) => {
        if (!project) return;

        const tasks = project.tasks.map((task) =>
          task.uuid === taskUUID ? { ...task, id: createdTask.id } : task
        );

        return { ...project, tasks };
      });
    } catch (error) {
      throw new RetryableError(create);
    }
  }

  return {
    data: project as Project,
    error,
    isLoading,
    setColumnName,
    setName,
    addColumn,
    addTask,
  };
}
