import { Button, Input } from "@nextui-org/react";
import { State, Task } from "src/lib/api";

type ColumnProps = State & {
	onColumnNameChange: (id: number, name: string) => void;
	onTaskAdd: (id: number, name: string) => void;
	tasks: Task[];
};

const CARD_WIDTH = "200px";
const CARD_HEIGHT = "250px";

const Column = (props: ColumnProps) => {
	function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
		props.onColumnNameChange(props.id, event.target.value);
	}

	function handleAddTaskClick() {
		// TODO Use dialog instead of prompt
		const name = prompt("Write your task name");
		if (!name) return;

		props.onTaskAdd(props.id, name);
	}

	return (
		<div
			key={props.id}
			className={`p-3 min-h-[${CARD_HEIGHT}] min-w-[${CARD_WIDTH}] max-w-[${CARD_WIDTH}] rounded-lg border-solid border-1 border-violet-700 bg-stone`}
		>
			<div className="rounded-md mb-2">
				<Input
					variant="bordered"
					placeholder="Example: To do"
					value={props.name}
					onChange={handleNameChange}
				/>
			</div>

			<ul className="flex flex-col gap-2">
				{props.tasks.map((task) => (
					<div
						className="bg-sky-900 rounded-sm p-1 hover:bg-sky-800 cursor-pointer"
						key={task.id}
					>
						<li>{task.name}</li>
					</div>
				))}
			</ul>

			<Button
				variant="ghost"
				onClick={handleAddTaskClick}
				className="mt-2"
			>
				+ Añadir tarea
			</Button>
		</div>
	);
};

export default Column;
