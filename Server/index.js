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
  supplyRequestsRouter
} from './Route/index.js';
import { errorHandler, notFoundHandler } from './Middleware/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'development';

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging in development
if (environment !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded images
const uploadDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/assignments', assignmentsRouter);
app.use('/supplies', suppliesRouter);
app.use('/incidents', incidentsRouter);
app.use('/supplyRequests', supplyRequestsRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${environment} mode on port ${PORT}`);
});

export default app;
