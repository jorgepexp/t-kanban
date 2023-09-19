import { Button, Input } from "@nextui-org/react";
import { Column } from "src/lib/api";

type ColumnProps = Column & {
	onColumnNameChange: (id: string, name: string) => void;
	onTaskAdd: (id: string, name: string) => void;
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
			className={`p-2 min-h-[${CARD_HEIGHT}] min-w-[${CARD_WIDTH}] max-w-[${CARD_WIDTH}] rounded-lg border-solid border-1 border-green-500 bg-stone`}
		>
			<div className="rounded-md">
				<Input
					variant="bordered"
					placeholder="Example: To do"
					value={props.name}
					onChange={handleNameChange}
				/>
			</div>

			<ul>
				{props.tasks.map((task) => (
					<li key={task.id}>{task.name}</li>
				))}
			</ul>

			<Button
				variant="light"
				onClick={handleAddTaskClick}
			>
				Añadir tarea
			</Button>
		</div>
	);
};

export default Column;
