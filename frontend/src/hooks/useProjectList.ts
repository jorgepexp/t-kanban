'use client';

import { useEffect, useState, useCallback } from 'react';
import Api from 'src/lib/api';
import { Project } from 'src/lib/definitions';

// Este hook debe tener estas responsabilidades:
// - Manejar el cómputo de proyectos
// - Mantener sus datos actualizados

export default function useProjectList() {
  const [error, setError] = useState<Error>();
  const [projectList, setProjectList] = useState<Project[] | undefined>();
  const [areLoading, setAreLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setAreLoading(true);
      const allProjects = await Api.fetchAllProjects();
      setProjectList(allProjects);
    } catch (error) {
      setError(error as Error);
    } finally {
      setAreLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function createProject(name: string) {
    const createdProject = await Api.createProject(name);
    setProjectList((projects) => {
      return (
        projects && [
          ...projects,
          {
            id: createdProject.id,
            name: createdProject.name,
            uuid: crypto.randomUUID(),
            tasks: [],
            states: [],
          },
        ]
      );
    });

    return createdProject.id;
  }

  return {
    data: projectList as Project[],
    error,
    areLoading,
    createProject,
  };
}
