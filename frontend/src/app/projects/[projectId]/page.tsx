'use client';

import Column from '@/components/column';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  CardFooter,
} from '@nextui-org/react';
import { BiErrorAlt } from 'react-icons/bi';
import { useState } from 'react';
import useProject from 'src/hooks/useProject';
import { RetryableError } from 'src/hooks/errors';
import { AddColumnButton } from '@/components/buttons';

type Params = {
  params: {
    projectId: number;
  };
};

const Page = ({ params }: Params) => {
  const project = useProject(Number(params.projectId));
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [taskStateName, setTaskStateName] = useState('');
  const [isErrorWindowOpen, setIsErrorWindowOpen] = useState(false);
  const [creationError, setCreationError] = useState<RetryableError>();

  if (project.isLoading) return <p>Loading...</p>;
  if (project.error) return <p>Ha habido un error</p>;

  async function handleAddColumn() {
    try {
      await project.addColumn(taskStateName);
      setTaskStateName('');
    } catch (error) {
      if (error instanceof RetryableError) return handleCreationError(error);

      throw error;
    } finally {
      onClose();
    }
  }

  function handleCreationError(error: RetryableError) {
    setIsErrorWindowOpen(true);
    setCreationError(error);
  }

  const { name, states: columns } = project.data;

  return (
    <main>
      <div className="flex justify-center mb-8">
        <Input
          className="w-full m-auto"
          classNames={{
            input: 'text-2xl font-medium hover:bg-transparent text-center',
            inputWrapper: 'bg-transparent text-lg font-medium',
          }}
          placeholder={'Example: Gif renderer project'}
          value={name}
          size="md"
          onChange={(event) => project.setName(event.target.value)}
        />
      </div>

      <div className={`px-4 overflow-auto flex flex-row flex-nowrap gap-8`}>
        {columns.map((column) => {
          return (
            <Column
              key={column.uuid}
              uuid={column.uuid}
              id={column.id}
              name={column.name}
              onColumnNameChange={project.setColumnName}
              onTaskAdd={project.addTask}
              tasks={project.data.tasks.filter(
                (task) => task.stateUUID === column.uuid
              )}
              handleCreationError={handleCreationError}
            />
          );
        })}

        <AddColumnButton openHandler={onOpen} />
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onClose={() => setTaskStateName('')}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Añade una columna nueva
                </ModalHeader>
                <ModalBody>
                  <Input
                    placeholder="Nombre de columna. Ej: To Do"
                    value={taskStateName}
                    onChange={(ev) => setTaskStateName(ev.target.value)}
                    onKeyUp={(ev) =>
                      ev.key === 'Enter' ? handleAddColumn() : null
                    }
                    autoFocus
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button color="primary" onPress={handleAddColumn}>
                    Añadir
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      {isErrorWindowOpen && (
        <Card className="w-[200px] absolute bottom-3 right-3">
          <CardBody>
            <p className="flex items-center">
              <BiErrorAlt className="text-red-500 text-xl" />
              &nbsp; Algo ha ido mal :(
            </p>
          </CardBody>
          <CardFooter>
            <Button
              className="ml-auto"
              radius="sm"
              size="md"
              onClick={() => {
                setIsErrorWindowOpen(false);
                setCreationError(undefined);
              }}
            >
              Dismiss
            </Button>
            <Button
              className="ml-auto"
              radius="sm"
              size="md"
              onClick={async () => {
                await (creationError as any).retry();
                setIsErrorWindowOpen(false);
                setCreationError(undefined);
              }}
            >
              Retry
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  );
};

export default Page;
