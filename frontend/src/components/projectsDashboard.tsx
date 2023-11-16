'use client';

import Project from '@/components/project';
import { Divider } from '@nextui-org/react';
import useProjects from 'src/hooks/useProjects';

export default function ProjectsDashboard() {
  const projects = useProjects();

  if (projects.areLoading) return <p>Loading...</p>;
  if (projects.error) return <p>Ha habido un error</p>;

  const data = projects.data;

  return (
    <main>
      <h2 className="text-xl">Tus proyectos</h2>
      <Divider className="mb-4" />
      <ul className="flex flex-row gap-10">
        {data.map((project) => {
          return <Project key={project.id} data={project} />;
        })}
      </ul>
    </main>
  );
}
