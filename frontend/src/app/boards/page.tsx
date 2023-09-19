"use client";

import Column from "@/components/Column";
import { Button, Input } from "@nextui-org/react";
import useBoard from "src/hooks/useBoard";

type Column = {
	id: string;
	name: string;
};

const Page = () => {
	const board = useBoard("1");

	if (board.isLoading) {
		return <p>Loading...</p>;
	}

	if (board.error) {
		// TODO Añadir botón para crear tablero
		return <p>Error loading board</p>;
	}

	const { name, columns } = board.data;

	return (
		<main className="h-[100vh]">
			<h2 className="mb-8 text-center text-2xl m-auto font-medium">{name}</h2>
			<Input
				placeholder={"Example: Projects board"}
				value={name}
				onChange={(e) => board.setName(e.target.value)}
			/>

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
					onClick={() => {
						// TODO Encapsular
						const columnName = prompt("Name");
						if (!columnName) return;
						board.addColumn(columnName);
					}}
				>
					+ Añade una columna nueva
				</Button>
			</div>
		</main>
	);
};

export default Page;
