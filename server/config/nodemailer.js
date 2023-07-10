const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.nodemailer_email,
        pass: process.env.nodemailer_pass
    }
})

module.exports = {
    transport
}