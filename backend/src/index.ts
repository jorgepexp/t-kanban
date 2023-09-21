import express from 'express';
import cors from 'cors';

import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3001;

const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/api/boards/:id', async (req, res) => {
  const id = Number(req.params.id);

  const project = await prisma.project.findFirst({
    where: { id },
  });

  res.send(project);
});

// TODO: Hacer el put

app.listen(port, () => {
  console.log('🔥 Server up and running on http://localhost:%d', port);
});
