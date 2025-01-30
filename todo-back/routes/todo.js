const express = require('express');
const router = express.Router();

const ToDo = require('../models/ToDo');

//routes
router.get('/', (req, res) => {
    const data = {
        message: 'To Do App',
        status: 'ok',
        route: '/'
    }

    res.status(200).json(data);
});

router.post('/new', async (req, res) => {

});