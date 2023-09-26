export type Task = {
	id: number;
	name: string;
};

export type State = {
	id: number;
	name: string;
	tasks: Task[];
};

export type Board = {
	id: number;
	name: string;
	states: State[];
};

const Api = {
	async fetchBoard(id: number): Promise<Board> {
		const board = await fetch(`http://localhost:3001/api/boards/${id}`);
		return board.json();
	},
	async saveBoard(board: Board) {
		const updatedBoard = await fetch(
			`http://localhost:3001/api/boards/${board.id}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(board),
			}
		);

		return updatedBoard.json();
	},
};

export default Api;
