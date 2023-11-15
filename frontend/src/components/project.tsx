import Link from 'next/link';
import { Project } from 'src/lib/definitions';

export default function Project({ data }: { data: Project }) {
  return (
    <Link
      href={`/projects/${data.id}`}
      key={data.id}
      className="w-[200px] p-2 border-solid border-1 border-white rounded-lg cursor-pointer"
    >
      {data.name}
    </Link>
  );
}
