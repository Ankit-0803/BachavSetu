import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import * as dotenv from 'dotenv';
import { connectDB } from './Config/db.js';
import {
  homeRouter,
  assignmentsRouter,
  suppliesRouter,
  authRouter,
  incidentsRouter,
  supplyRequestsRouter // Added supply requests router
} from './Route/index.js';
import { errorHandler, notFoundHandler } from './Middleware/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'development';

await connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Serve uploaded images
const uploadDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadDir));

app.use(homeRouter);
app.use('/assignments', assignmentsRouter);
app.use('/supplies', suppliesRouter);
app.use('/auth', authRouter);
app.use('/incidents', incidentsRouter);
app.use('/supplyRequests', supplyRequestsRouter); // Added supply requests route

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
  console.info(`app running on ${environment} mode at port ${PORT}`);
});

export default app;
