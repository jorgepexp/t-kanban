import { Task as TaskType } from 'src/lib/definitions';

type Props = Omit<TaskType, 'stateUUID' | 'stateId'>;
export default function Task(props: Props) {
  return (
    <>
      <div
        className={
          props.id === undefined
            ? 'bg-stone-500 rounded-sm p-1 hover:bg-stone-700'
            : 'bg-sky-900 rounded-sm p-1 hover:bg-sky-800 cursor-pointer'
        }
        key={props.uuid}
      >
        <li>{props.name}</li>
      </div>
    </>
  );
}
