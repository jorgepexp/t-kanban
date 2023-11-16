'use client';

import { useEffect, useState, useCallback } from 'react';
import Api from 'src/lib/api';
import { Project } from 'src/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

// Este hook debe tener estas responsabilidades:
// - Manejar el cómputo de proyectos
// - Mantener sus datos actualizados

export default function useProjects() {
  const [error, setError] = useState<Error>();
  const [projects, setProjects] = useState<Project[] | undefined>();
  const [areLoading, setAreLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    noStore();
    try {
      // TODO Remember to remove
      // console.log('Fetching data...');
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      setAreLoading(true);
      const allProjects = await Api.fetchAllProjects();
      // console.log('Fetching complete');
      setProjects(allProjects);
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
    noStore();
    const createdProject = await Api.createProject(name);
    setProjects((projects) => {
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
    data: projects as Project[],
    error,
    areLoading,
    createProject,
  };
}
