# backend

## Create a migration

After editing prisma schema, run migrations with: 

```bash
yarn prisma migrate dev --name <declarative-name>

# Example:
yarn prisma migrate dev --name add-comment-relation
```
