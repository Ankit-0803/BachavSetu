import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { connectDB } from './Config/db.js';

// Import ALL routers from index.js in Route folder
import { homeRouter, assignmentsRouter, suppliesRouter, authRouter, incidentsRouter } from './Route/index.js';
import { errorHandler, notFoundHandler } from './Middleware/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'development';

// DB
await connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Routes
app.use(homeRouter);
app.use('/assignments', assignmentsRouter);
app.use('/supplies', suppliesRouter);
app.use('/auth', authRouter);
app.use('/incidents', incidentsRouter); // ADD THIS LINE

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
  console.info(`app running on ${environment} mode at port ${PORT}`);
});

export default app;
