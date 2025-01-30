const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Import routes
const userRouter = require('./routes/user');
const todoRouter = require('./routes/todo');

// Connect to MongoDB

const init_database = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

init_database();


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/user', userRouter);
app.use('/todo', todoRouter)


app.get( '/', (req, res) => {
    const data = {
        message: 'ToDo App',
        status: 'ok', 
        route: '/'
    }

    res.status(200).json(data);
});

app.get('/env', (req, res) => {
    const data = {
        message: 'Environment Variables',
        status: 'ok',
        env: process.env
    }

    res.status(200).json(data);
})

// Server listening
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});