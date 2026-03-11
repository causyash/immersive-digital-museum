const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    // Dummy login
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        res.json({ token: 'dummy_jwt_token', user: { id: 1, name: 'Admin' } });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
