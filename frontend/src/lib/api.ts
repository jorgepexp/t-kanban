export type Project = {
  id: number
  uuid: string
  name: string
  tasks: Task[]
  states: TaskState[]
}

export type Task = {
  id?: number
  uuid: string
  name: string
  stateUUID: string
  stateId?: number
}

export type TaskState = {
  id?: number
  uuid: string
  name: string
}

const Api = {
  async fetchBoard(id: number): Promise<Project> {
    const response = await fetch(`http://localhost:3001/api/projects/${id}`)

    const json = (await response.json()) as Project

    json.uuid = crypto.randomUUID()
    json.states = json.states.map((state) => ({ ...state, uuid: crypto.randomUUID() }))
    json.tasks = json.tasks.map((task) => ({
      ...task,
      uuid: crypto.randomUUID(),
      stateUUID: json.states.find((state) => (state.id as Number) === (task.stateId as Number))?.uuid as string,
    }))

    console.log(json)

    return json
  },
  async saveBoard(board: Project) {
    const updatedBoard = await fetch(`http://localhost:3001/api/projects/${board.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(board),
    })

    return updatedBoard.json()
  },
}

export default Api
