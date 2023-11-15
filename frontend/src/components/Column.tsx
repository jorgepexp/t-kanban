'use client';

import { TaskState, Task as TaskType } from 'src/lib/definitions';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { useState } from 'react';
import { RetryableError } from 'src/hooks/errors';
import Task from './task';

type ColumnProps = TaskState & {
  onColumnNameChange: (id: string, name: string) => void;
  onTaskAdd: (id: string, name: string) => Promise<void>;
  tasks: TaskType[];
  handleCreationError: (error: RetryableError) => void;
};

const COLUMN_WIDTH = '200px';
const COLUMN_HEIGHT = '250px';

export default function Column(props: ColumnProps) {
  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.onColumnNameChange(props.uuid, event.target.value);
  }
  const [taskName, setTaskName] = useState('');
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  async function handleAddTask() {
    try {
      onClose();
      setTaskName('');
      await props.onTaskAdd(props.uuid, taskName);
    } catch (error) {
      if (error instanceof RetryableError) {
        return props.handleCreationError(error);
      }

      throw error;
    }
  }

  return (
    <div
      className={`p-3 min-h-[${COLUMN_HEIGHT}] min-w-[${COLUMN_WIDTH}] max-w-[${COLUMN_WIDTH}] rounded-lg border-solid border-1 border-violet-700 bg-stone`}
    >
      <div className="rounded-md mb-2">
        <Input
          variant="bordered"
          placeholder="Example: To do"
          value={props.name}
          onChange={handleNameChange}
        />
      </div>

      <ul className="flex flex-col gap-2">
        {props.tasks.map((task) => {
          return (
            <Task
              id={task.id}
              uuid={task.uuid}
              name={task.name}
              key={task.uuid}
            />
          );
        })}
      </ul>

      <Button
        variant="ghost"
        onClick={onOpen}
        className="mt-2"
        isDisabled={props.id === undefined}
      >
        + Añadir tarea
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Añade una tarea nueva
            </ModalHeader>
            <ModalBody>
              <Input
                placeholder="Nombre de la tarea. Ej: Tender la ropa"
                value={taskName}
                onChange={(ev) => setTaskName(ev.target.value)}
                onKeyUp={(ev) => (ev.key === 'Enter' ? handleAddTask() : null)}
                autoFocus
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleAddTask}>
                Crear
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}
