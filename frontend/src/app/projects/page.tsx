import ProjectsDashboard from '@/components/projectsDashboard';
import { Suspense } from 'react';

const Page = () => {
  return (
    <>
      <Suspense fallback={<ProjectsDashboardSekeleton />}>
        <ProjectsDashboard />
      </Suspense>

      {/* <div className="flex justify-center items-center gap-4 flex-col">
        <div>Esto podría ser otro componente</div>
      </div> */}
    </>
  );
};

// TODO Move to its own file
function ProjectsDashboardSekeleton() {
  return (
    <>
      <div>Cargando...</div>
    </>
  );
}

export default Page;
