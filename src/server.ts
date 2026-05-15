import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import checkerRoutes from './routes/checkerRoutes';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use('/checker', checkerRoutes);

app.use(express.json());

app.get('/', (_, res) => {
    res.json({
        status: 'ok',
    });
});

const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});