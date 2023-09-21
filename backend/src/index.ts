import express from 'express';
import cors from 'cors';
import router from './routes/board';

const app = express();
const port = 3001;

app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(router);

app.listen(port, () => {
  console.log('🔥 Server up and running on port', port);
});
