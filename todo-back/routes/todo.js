const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const ToDo = require('../models/ToDo');

const token_secret = process.env.JSON_WEB_TOKEN_SECRET;


const verifyToken = (req, res, next) => {
    const headerAuthorization = req.headers.authorization;

    if (!headerAuthorization || !headerAuthorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized", status: "error" });
    }

    const token = headerAuthorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, token_secret); 
        req.user = decoded; 
        next(); 
    
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", status: "error", error: error.message });
    }
};

//routes

router.post('/new', verifyToken, async (req, res) => {

    const todo_data = req.body;

    console.log(todo_data);

    try {
        const todo = new ToDo({
            user_id: todo_data.user_id,
            title: todo_data.title,
            description: todo_data.description,
        })

        await todo.save();

        res.status(201).json({message: 'To Do created', status: 'ok', todo: todo});

    } catch (error) {

        res.status(500).json({message: error.message, status: 'error'});
        console.error(`Error: ${error.message}`);

    }
});

router.get('/:id', verifyToken, async (req, res) => {

    const user_id = req.params.id;

    try {

        const todoList = await ToDo.find({user_id: user_id});

        if(todoList.length === 0) {
            return res.status(404).json({message: 'To Do not found', status: 'error'});
        }

        const data = {
            message: 'To Do App',
            status: 'ok',
            route: '/' + req.params.id,
            todos: todoList
        }
    
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({message: error.message, status: 'error'});
        console.error(`Error: ${error.message}`);
    }

});


module.exports = router;