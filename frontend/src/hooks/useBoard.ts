import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState, useCallback } from "react";
import Api, { Board } from "src/lib/api";

export default function useBoard(boardId: number) {
	const [error, setError] = useState<Error>();
	const [board, setBoard] = useState<Board>();
	const [isLoading, setIsLoading] = useState(true);
	const debouncedBoard = useDebounce(board, 100);

	const fetchBoard = useCallback(async () => {
		try {
			setIsLoading(true);
			const board = await Api.fetchBoard(boardId);
			setBoard(board);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			setError(error as Error);
		}
	}, [boardId]);

	useEffect(() => {
		fetchBoard();
	}, [fetchBoard]);

	useEffect(() => {
		if (!debouncedBoard) return;
		Api.saveBoard(debouncedBoard);
	}, [debouncedBoard]);

	function setColumnName(columnId: number, name: string) {
		setBoard((board) => {
			if (board === undefined) return;

			return {
				...board,
				states: board.states.map((column) => {
					if (column.id !== columnId) return column;
					return { ...column, name };
				}),
			};
		});
	}

	function setName(name: string) {
		setBoard((board) => board && { ...board, name });
	}

	function addColumn(name: string) {
		if (!board) return;
		setBoard(
			(board) =>
				board && {
					...board,
					states: [
						...board.states,
						{ name, id: -1, tasks: [], projectId: board?.id },
					],
				}
		);
	}

	function addColumnTask(columnId: number, name: string) {
		setBoard((board) => {
			if (board === undefined) return;

			return {
				...board,
				states: board.states.map((column) => {
					if (column.id !== columnId) return column;

					return {
						...column,
						tasks: [
							...column.tasks,
							{ name, id: -1, stateId: columnId, projectId: board.id },
						],
					};
				}),
			};
		});
	}

	return {
		data: board as Board,
		error,
		isLoading,
		setColumnName,
		setName,
		addColumn,
		addColumnTask,
	};
}
