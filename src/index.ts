// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import measureRoutes from './routes/measureRoutes';
import connectDB from './config/db';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use('/api/measures', measureRoutes);

app.listen(PORT, () => {
    console.log(`Servidor está operando na porta ${PORT}`);
});

export default app;
