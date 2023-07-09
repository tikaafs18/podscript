const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tikafatiha18@gmail.com',
        pass: 'kyghaweburxqnaju'
    }
})

module.exports = {
    transport
}