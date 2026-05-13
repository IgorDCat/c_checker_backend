import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import checkerRoutes from './routes/checkerRoutes';

const app = express();

app.use(express.json());

app.use('/checker', checkerRoutes);


const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
