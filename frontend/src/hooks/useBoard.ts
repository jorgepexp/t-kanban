import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState, useCallback } from 'react'
import Api, { Project } from 'src/lib/api'

export default function useBoard(boardId: number) {
  const [error, setError] = useState<Error>()
  const [board, setBoard] = useState<Project>()
  const [isLoading, setIsLoading] = useState(true)
  const debouncedBoard = useDebounce(board, 100)

  const fetchBoard = useCallback(async () => {
    try {
      setIsLoading(true)
      const board = await Api.fetchBoard(boardId)
      setBoard(board)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setError(error as Error)
    }
  }, [boardId])

  useEffect(() => {
    fetchBoard()
  }, [fetchBoard])

  useEffect(() => {
    if (!debouncedBoard) return
    Api.saveBoard(debouncedBoard)
  }, [debouncedBoard])

  function setColumnName(columnUUID: string, name: string) {
    setBoard((board) => {
      if (board === undefined) return

      const state = board.states.find((state) => state.uuid === columnUUID)

      if (state?.id === undefined) {
        throw new Error('Missing column')
      }

      return {
        ...board,
        states: board.states.map(({ id }) => (state.id === id ? { ...state, name } : state)),
      }
    })
  }

  function setName(name: string) {
    setBoard((board) => board && { ...board, name })
  }

  function addColumn(name: string) {
    if (!board) return
    setBoard((board) => board && { ...board, states: [...board.states, { name, uuid: crypto.randomUUID() }] })
  }

  function addColumnTask(columnUUID: string, name: string) {
    setBoard((board) => {
      if (!board) return

      const state = board.states.find((state) => state.uuid === columnUUID)

      return {
        ...board,
        tasks: [
          ...board.tasks,
          {
            name,
            uuid: crypto.randomUUID(),
            stateUUID: columnUUID,
            stateId: state?.id,
          },
        ],
      }
    })
  }

  return {
    data: board as Project,
    error,
    isLoading,
    setColumnName,
    setName,
    addColumn,
    addColumnTask,
  }
}
