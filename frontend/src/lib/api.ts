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
    await sleep(100)
    return {
      id: '1',
      name: 'Tablerico 👍🏻',
      columns: [
        { id: '1', name: 'To do', tasks: [] },
        { id: '2', name: 'Doing', tasks: [] },
        { id: '3', name: 'Done', tasks: [] },
      ]
    }
  },
  async saveBoard(board: Board) {
    await sleep(100)
    
    console.log('// TODO update en base de datos', board)
  }
}

export default Api
