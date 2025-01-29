const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

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

router.get('/', (req, res) => {
    const data = {
        message: 'Users',
        status: 'ok'
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
        user_data.token = jwt.sign(user_data, token_secret, {expiresIn: '1h'});

        await res.status(200).json({message: 'User authenticated', status: 'ok', user: user_data});

    } catch(error) {
        res.status(500).json({message: error.message, status: 'error'});
        console.error(`Error: ${error.message}`);
    }


});

router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({message: 'Token verified', status: 'ok', user: req.user});
});

router.get('/headers', (req, res) => {
    const headers = req.headers;

    res.status(200).json({message: 'Headers', status: 'ok', headers});
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

module.exports = router;