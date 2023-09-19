"use client";

import React from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
} from "@nextui-org/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import CreateBoardButton from "@/components/CreateBoardButton";

export default function App() {
	return (
		<Navbar className="border-b-2 border-purple-600 mb-5">
			<NavbarBrand>
				<p className="font-bold text-inherit">tKanban</p>
			</NavbarBrand>
			<NavbarContent
				className="hidden sm:flex gap-4"
				justify="center"
			>
				{/* TODO Add real routes */}
				<NavbarItem isActive>
					<Link
						color="foreground"
						href="boards"
					>
						<p className="mr-3">Añade un tablero</p>
						{/* TODO Añadir icono */}
						<CreateBoardButton />
					</Link>
				</NavbarItem>
				<NavbarItem isActive>
					<Link
						color="foreground"
						href="boards"
					>
						Boards
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem className="hidden lg:flex">
					<ThemeSwitcher />
				</NavbarItem>
				<NavbarItem className="hidden lg:flex">
					<Link href="/login">Login</Link>
				</NavbarItem>
				<NavbarItem>
					<Button
						as={Link}
						color="primary"
						href="#"
						variant="flat"
					>
						Sign Up
					</Button>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
