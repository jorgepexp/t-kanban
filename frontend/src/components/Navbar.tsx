'use client';

import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@nextui-org/react';

import { CreateProjectModal } from './modals';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Navbar className="border-b-1 border-indigo-950 mb-5 bg-indigo-900">
      <NavbarBrand>
        <Link
          color="foreground"
          href="/"
          className="font-bold text-inherit text-xl"
        >
          tKanban
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link color="foreground" href="/projects">
            Proyectos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            color="secondary"
            variant="ghost"
            onPress={() => setIsModalOpen(true)}
          >
            + Añade un proyecto
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <CreateProjectModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </Navbar>
  );
}
