import express from 'express'
import cors from "cors"
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRouter } from './routes';
const app = express();

app.use(helmet());

app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', apiRouter)


app.listen(8080, ()=>{
    console.log("we are live on 8080");
})