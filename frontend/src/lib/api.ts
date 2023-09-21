type Task = {
  id: string
  name: string
}

export type Column = {
  id: string
  name: string
  tasks: Task[]
}

export type Board = {
  id: string
  name: string
  columns: Column[]
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const Api = {
  fetchBoard: async (id: string): Promise<Board> => {
    const board = await fetch(`http://localhost:3001/board/${id}`)
    return board.json();
  },
  async saveBoard(board: Board) {
    await sleep(100)
    console.log('// TODO update en base de datos', board)
  }
}

export default Api
