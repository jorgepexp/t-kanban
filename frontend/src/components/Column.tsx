"use client";

import { TaskState, Task } from "src/lib/api";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { RetryableError } from "src/hooks/errors";

type ColumnProps = TaskState & {
  onColumnNameChange: (id: string, name: string) => void;
  onTaskAdd: (id: string, name: string) => Promise<void>;
  tasks: Task[];
};

const COLUMN_WIDTH = "200px";
const COLUMN_HEIGHT = "250px";

function Column(props: ColumnProps) {
  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.onColumnNameChange(props.uuid, event.target.value);
  }
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [taskName, setTaskName] = useState("");
  const [taskCreateError, setTaskCreateError] = useState<RetryableError>();

  async function handleAddTask() {
    try {
      onClose();
      setTaskName("");
      await props.onTaskAdd(props.uuid, taskName);
    } catch (error) {
      if (error instanceof RetryableError) {
        return setTaskCreateError(error);
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
            <div
              className={
                task.id === undefined
                  ? "bg-stone-500 rounded-sm p-1 hover:bg-stone-700"
                  : "bg-sky-900 rounded-sm p-1 hover:bg-sky-800 cursor-pointer"
              }
              key={task.uuid}
            >
              <li>{task.name}</li>
            </div>
          );
        })}
      </ul>

      <Button variant="ghost" onClick={onOpen} className="mt-2">
        + Añadir tarea
      </Button>

      {taskCreateError && (
        <button
          onClick={async () => {
            await taskCreateError.retry();
            setTaskCreateError(undefined);
          }}
        >
          Retry
        </button>
      )}

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
                onKeyUp={(ev) => (ev.key === "Enter" ? handleAddTask() : null)}
                autoFocus
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={() => handleAddTask()}>
                Crear
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Column;
