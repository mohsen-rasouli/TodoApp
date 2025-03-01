const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');
require('dotenv').config();

const app = express();

// Import routes
const userRouter = require('./routes/user');
const todoRouter = require('./routes/todo');

// --- Logging Setup with Winston ---
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// --- Database Connection ---
const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// --- Server Error Handler ---
const errorHandler = (err, req, res, next) => {
  logger.error(`${err.stack}`);
  res.status(500).json({
    message: 'Internal Server Error',
    status: 'error',
    error: err.message,
  });
};

// --- Middlewares ---
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Secure Express App
app.use(morgan('combined')); //HTTP request logger
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// --- Routes ---
app.use('/user', userRouter);
app.use('/todo', todoRouter);

// --- Root Route ---
app.get('/', (req, res) => {
  const data = {
    message: 'ToDo App',
    status: 'ok',
    route: '/',
  };
  res.status(200).json(data);
});

// --- Environment Route ---
app.get('/env', (req, res) => {
  const data = {
    message: 'Environment Variables',
    status: 'ok',
    env: process.env,
  };
  res.status(200).json(data);
});

// --- Error Handling Middleware ---
app.use(errorHandler);
// --- Start the server and init database ---
const startServer = async () => {
    await connectToDatabase()
    app.listen(3003, () => {
    logger.info('Server is running on port 3003');
  });
}

startServer();
