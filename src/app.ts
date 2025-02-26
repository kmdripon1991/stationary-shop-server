import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';
import notFound from './app/middlewares/notFound';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.use(
  cors({
    origin: [
      // 'http://localhost:5173',
      'https://stationary-shop-client-omega.vercel.app',
    ],
    credentials: true,
  }),
);

app.use('/', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//not found middleware
app.use(notFound);

// Error-handling middleware
app.use(globalErrorHandler);

export default app;
