import dotenv from "dotenv";
import express from 'express';
import cors from "cors";
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRouter } from './routes';
import { AppError } from './lib/AppError';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT ?? 5000

app.use(helmet());

app.use(cors());
app.use(morgan('dev')) 
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// RATE LIMITER

app.use('/api/v1', apiRouter)

// to handle 404 errors
app.use((_req, _res, next) => {
    next(new AppError(404, 'NOT_FOUND', 'Route not found'))
})


// common error handling middleware
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`we are live on ${PORT}`);
})