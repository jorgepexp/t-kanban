"use client";

import Column from "@/components/Column";
import { Button, Input } from "@nextui-org/react";
import useBoard from "src/hooks/useBoard";

const Page = () => {
	// TODO Remember to change this fixed value
	const board = useBoard(1);

	if (board.isLoading) {
		return <p>Loading...</p>;
	}

	if (board.error) {
		// TODO Añadir botón para crear tablero
		return <p>Error loading board</p>;
	}

	function handleTitleChange() {
		const title = document.querySelector('[data-titleid="board-name-display"]');
		const input = document.querySelector('[data-titleid="board-name-input"]');
		// console.log("Node", title);
		// console.log("Node", input);
		title?.classList.add("hidden");

		// @ts-ignore
		input.style.display = "inline";
		console.log(input.style.display);
		console.log(input);
	}

	function addColumnHandler() {
		// TODO Change with a modal
		const columnName = prompt("Name");
		if (!columnName) return;
		board.addColumn(columnName);
	}

	function handleBoardNameInputBlur() {
		// TODO Fix this shit
		const title = document.querySelector('[data-titleid="board-name-display"]');
		const input = document.querySelector('[data-titleid="board-name-input"]');
		title?.classList.remove("hidden");
		input.style.display = "hidden";
	}

	const { name, states: columns } = board.data;

	return (
		<main className="h-[100vh]">
			<div className="flex justify-center mb-8">
				<h2
					className="text-2xl m-auto font-medium"
					onClick={handleTitleChange}
					data-titleid="board-name-display"
				>
					{name}
				</h2>
				<Input
					className="w-[200px]"
					placeholder={"Example: Projects board"}
					value={name}
					size="md"
					onChange={(e) => board.setName(e.target.value)}
					data-titleid="board-name-input"
					onBlur={handleBoardNameInputBlur}
					style={{
						display: "none",
					}}
				/>
			</div>

			<div className={`px-4 overflow-auto flex flex-row flex-nowrap gap-8`}>
				{columns.map((column) => (
					<Column
						key={column.id}
						id={column.id}
						name={column.name}
						onColumnNameChange={board.setColumnName}
						onTaskAdd={board.addColumnTask}
						tasks={column.tasks}
					/>
				))}

				<Button
					radius="sm"
					size="md"
					onClick={addColumnHandler}
				>
					+ Añade una columna nueva
				</Button>
			</div>
		</main>
	);
};

export default Page;
