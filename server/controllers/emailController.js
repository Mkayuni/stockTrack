const {sendEmail} = require('../middleware/emailSender');

// Sends an email to the user that generates a code -- Return the code for frontend to verify
const sendAuthEmail = async (req, res) => {
    const { email } = req.body;

    const code = 55;

    const subject = 'Verification Code';
    const html = '<b>Stock Track Verification Test</b> Code: ' + code;

    const result = await sendEmail(email, subject, html);

    if (result) {
        res.json({code: code});
    } else {
        return res.status(500).json({ error: 'Failed to send email due to a server error.' });
    }

}

module.exports = {sendAuthEmail};