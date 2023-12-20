'use client';

import Project from '@/components/project';
import { Divider } from '@nextui-org/react';
import useProjectList from 'src/hooks/useProjectList';

export default function ProjectsDashboard() {
  const projects = useProjectList();

  if (projects.areLoading) return <p>Loading...</p>;
  if (projects.error) return <p>Ha habido un error</p>;

  const data = projects.data;

  return (
    <main className="px-4">
      <h2 className="text-xl">Tus proyectos</h2>
      <Divider className="mb-4 mt-1" />
      <ul className="flex flex-row gap-10">
        {data.map((project) => {
          return <Project key={project.id} data={project} />;
        })}
      </ul>
    </main>
  );
}
