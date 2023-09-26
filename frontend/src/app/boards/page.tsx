'use client'

import Column from '@/components/Column'
import { Button, Input } from '@nextui-org/react'
import useBoard from 'src/hooks/useBoard'

const Page = () => {
  // TODO Remember to change this fixed value
  const board = useBoard(1)

  if (board.isLoading) {
    return <p>Loading...</p>
  }

  if (board.error) {
    // TODO Añadir botón para crear tablero
    return <p>Error loading board</p>
  }

  function addColumnHandler() {
    // TODO Change with a modal
    const columnName = prompt('Name')
    if (!columnName) return
    board.addColumn(columnName)
  }

  const { name, states: columns } = board.data

  return (
    <main className='h-[100vh]'>
      <div className='flex justify-center mb-8'>
        <Input
          className='w-full m-auto'
          classNames={{
            input: 'text-2xl font-medium hover:bg-transparent text-center',
            inputWrapper: 'bg-transparent text-lg font-medium',
          }}
          placeholder={'Example: Projects board'}
          value={name}
          size='md'
          onChange={(event) => board.setName(event.target.value)}
        />
      </div>

      <div className={`px-4 overflow-auto flex flex-row flex-nowrap gap-8`}>
        {columns.map((column) => (
          <Column
            key={column.uuid}
            uuid={column.uuid}
            name={column.name}
            onColumnNameChange={board.setColumnName}
            onTaskAdd={board.addColumnTask}
            tasks={board.data.tasks.filter((task) => task.stateUUID === column.uuid)}
          />
        ))}

        <Button radius='sm' size='md' onClick={addColumnHandler}>
          + Añade una columna nueva
        </Button>
      </div>
    </main>
  )
}

export default Page
