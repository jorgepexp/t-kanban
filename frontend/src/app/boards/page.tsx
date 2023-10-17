"use client";

import Column from "@/components/Column";
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
} from "@nextui-org/react";
import { BiErrorAlt } from "react-icons/bi";
import { useState } from "react";
import useProject from "src/hooks/useProject";

const Page = () => {
	// TODO Remember to change this fixed value
	const project = useProject(1);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [taskStateName, setTaskStateName] = useState("");
	const [isErrorWindowOpen, setIsErrorWindowOpen] = useState(false);
	const [isRetryingCall, setIsRetryingCall] = useState(false);

	if (project.isLoading) return <p>Loading...</p>;

	if (project.error) {
		// if (isErrorWindowOpen) setIsRetryingCall(false);
		if (!isErrorWindowOpen) {
			setIsErrorWindowOpen(true);
		}

		return <p>Ha habido un error</p>;
	}

	function handleAddColumn(closeModalHandler: () => void) {
		project.addColumn(taskStateName);
		closeModalHandler();
	}

	function retryCall() {
		setIsRetryingCall(true);
		project.retryCall();
	}

	const { name, states: columns } = project.data;

	return (
		<main>
			<div className="flex justify-center mb-8">
				<Input
					className="w-full m-auto"
					classNames={{
						input: "text-2xl font-medium hover:bg-transparent text-center",
						inputWrapper: "bg-transparent text-lg font-medium",
					}}
					placeholder={"Example: Gif renderer project"}
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
							name={column.name}
							onColumnNameChange={project.setColumnName}
							onTaskAdd={project.addTask}
							tasks={project.data.tasks.filter(
								(task) => task.stateUUID === column.uuid
							)}
							isFetching={project.isFetching}
						/>
					);
				})}

				<Button
					radius="sm"
					size="md"
					onClick={onOpen}
				>
					+ Añade una columna nueva
				</Button>
				<Modal
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					onClose={() => setTaskStateName("")}
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
											ev.key === "Enter" ? handleAddColumn(onClose) : null
										}
										autoFocus
									/>
								</ModalBody>
								<ModalFooter>
									<Button
										color="danger"
										variant="light"
										onPress={onClose}
									>
										Cerrar
									</Button>
									<Button
										color="primary"
										onPress={() => handleAddColumn(onClose)}
									>
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
						{!isRetryingCall ? (
							<p className="flex items-center">
								<BiErrorAlt className="text-red-500 text-xl" />
								&nbsp; Algo ha ido mal :(
							</p>
						) : (
							<p>Reintentando...</p>
						)}
					</CardBody>
					<CardFooter>
						<Button
							className="ml-auto"
							radius="sm"
							size="md"
							onClick={() => {
								project.removeError();
								setIsErrorWindowOpen(false);
							}}
						>
							Dismiss
						</Button>
						<Button
							className="ml-auto"
							radius="sm"
							size="md"
							onClick={() => retryCall()}
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
