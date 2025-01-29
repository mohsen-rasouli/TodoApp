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
            password: bcryptjs.hashSync(user.password, 10), //user.password,
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


module.exports = router;