import express from 'express';
import { PORT } from './config.js';
import userRoutes from './routes/users.routes.js';
import cors from 'cors';  

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);


app.listen(PORT, () => {
  console.log('Servidor en puerto 3000');
});