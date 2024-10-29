const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// Sends a email from GMAIL USER
const sendEmail = (recipient, subject, html) => {
    return new Promise((resolve) => {
        const mailOptions = {
            from: `"Stock Tracker" <${process.env.GMAIL_USER}>`,
            to: recipient,
            subject: subject,
            html: html,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('Error:', err.message);
                resolve(false);
            } else {
                console.log('Email sent:', info.messageId);
                resolve(true);
            }
        });
    });
};


module.exports = { sendEmail };