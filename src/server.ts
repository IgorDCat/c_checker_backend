import 'dotenv/config';

import express from 'express';
import checkerRoutes from './routes/checkerRoutes';

const app = express();

app.use(express.json());

app.use('/checker', checkerRoutes);

app.get('/', (_, res) => {
    res.json({
        status: 'ok',
    });
});

const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});