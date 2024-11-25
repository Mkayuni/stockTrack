const {sendEmail} = require('../middleware/emailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Sends an email to the user that generates a code -- Return the code for frontend to verify
const sendAuthEmail = async (req, res) => {
    const { email } = req.params;

    const code = crypto.randomBytes(4).toString('hex');
    const hashed = await bcrypt.hash(code, 12);

    const subject = 'Verification Code';
    const html = '<b>Stock Track Verification Test</b> Code: ' + code;

    const result = await sendEmail(email, subject, html);


    if (result) {
        return res.json({code: hashed});
    } else {
        return res.status(500).json({ error: 'Failed to send email due to a server error.' });
    }


}

module.exports = {sendAuthEmail};