'use client';

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useState } from 'react';
import { useDisclosure } from '@nextui-org/react';
import useProjects from 'src/hooks/useProjects';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

type Props = {
  isOpen: boolean;
  closeModal: () => void;
};

export function CreateProjectModal(props: Props) {
  const { onOpenChange } = useDisclosure();
  const [projectName, setProjectName] = useState('');
  const project = useProjects();
  const router = useRouter();
  const [isInvalid, setIsInvalid] = useState(false);

  async function createProject() {
    if (!projectName) return setIsInvalid(true);
    const createdProjectId = await project.createProject(projectName);
    closeModal();
    router.push(`/projects/${createdProjectId}`);
  }

  function closeModal() {
    setProjectName('');
    setIsInvalid(false);
    props.closeModal();
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onOpenChange={onOpenChange}
      onClose={closeModal}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Escribe el nombre de tu proyecto</ModalHeader>
            <form action="">
              <ModalBody>
                <Input
                  placeholder={'Nombre del proyecto. Ej: Generador de gifs'}
                  value={projectName}
                  onChange={(ev) => {
                    setProjectName(ev.target.value);
                    setIsInvalid(false);
                  }}
                  onKeyUp={(ev) =>
                    ev.key === 'Enter' ? createProject() : null
                  }
                  autoFocus
                  className="pt-2"
                />
                <p
                  className={clsx('mt-2', {
                    'text-pink-600 text-sm pl-2': isInvalid,
                    invisible: !isInvalid,
                  })}
                >
                  Debes introducir un nombre para el proyecto
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={closeModal}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={() => createProject()}>
                  Añadir
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
