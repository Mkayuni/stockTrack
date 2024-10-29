const express = require('express');
const router = express.Router();

const { sendAuthEmail } = require('../controllers/emailController')

router.get('/send-code', sendAuthEmail);

module.exports = router;