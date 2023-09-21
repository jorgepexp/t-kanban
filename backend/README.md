# backend

## Crear una migración

Despues de editar el schema de prisma, lanzamos:

```bash
yarn prisma migrate dev --name <nombre declarativo>

# Ejemplo:
yarn prisma migrate dev --name add-comment-relation
```
