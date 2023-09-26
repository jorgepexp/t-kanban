import express from 'express';
import cors from 'cors';
import BoardController from './controllers/board';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/api/boards/:id', BoardController.getBoard);

app.put('/api/boards/:id', BoardController.editBoard)

app.post('/api/boards', BoardController.createBoard);


app.listen(port, () => {
  console.log('🔥 Server up and running on http://localhost:%d', port);
});
