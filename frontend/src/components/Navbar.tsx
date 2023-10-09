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

export default function App() {
	return (
		<Navbar className="border-b-1 border-indigo-950 mb-5 bg-indigo-900">
			<NavbarBrand>
				<Link
					color="foreground"
					href="/"
					className="font-bold text-inherit text-xl "
				>
					tKanban
				</Link>
			</NavbarBrand>
			<NavbarContent
				className="hidden sm:flex gap-4"
				justify="center"
			>
				<NavbarItem isActive>
					<Link
						color="foreground"
						href="boards"
					>
						Tableros
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Button
						color="secondary"
						variant="ghost"
					>
						+ Añade un tablero
					</Button>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">
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
