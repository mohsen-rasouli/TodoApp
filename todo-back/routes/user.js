const router = require('express').Router();
const bcryptjs = require('bcryptjs');

const User = require('../models/User');

router.get('/', (req, res) => {
    const data = {
        message: 'Users',
        status: 'ok'
    }

    res.status(200).json(data);
});

router.get('/:id', (req, res) => {

    const user_id = req.params.id;
    const data = {
        message: 'User',
        status: 'ok',
        user_id
    }

    res.status(200).json(data);
});

router.post('/new', async (req, res) => {

    const user = req.body;
    

    try {
        const newUser= new User({
            username: user.username,
            password: bcryptjs.hash(user.password, 10), //user.password,
            email: user.email
        })

        await newUser.save();

        await delete newUser.password;

        await res.status(201).json({message: 'User created', status: 'ok', user: newUser});
    } catch(error) {
        res.status(500).json({message: error.message, status: 'error'});
        console.error(`Error: ${error.message}`);
    }  

});

router.post('/auth', async (req, res) => {

    const data = req.body;

    try {
        const user = await User.findOne({username: data.username});
        if(!user) {
            return res.status(401).json({message: 'User not found', status: 'error'});
        }

        if(!bcryptjs.compare(data.password, user.password)) {
            return res.status(401).json({message: 'Password incorrect', status: 'error'});
        }

        const user_data = user.toObject();
        delete user_data.password;

        await res.status(200).json({message: 'User authenticated', status: 'ok', user: user_data});

    } catch(error) {
        res.status(500).json({message: error.message, status: 'error'});
        console.error(`Error: ${error.message}`);
    }

    

});

module.exports = router;