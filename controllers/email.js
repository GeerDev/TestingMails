const nodemailer = require('nodemailer');
require ('dotenv').config();
const fs = require('fs');
const path = require('path');
const pug = require('pug');

const emailPost = async(req, res) => {
    const templatePath = path.join(__dirname, '..', 'templates', req.body.file)
    const fileExtensionHtml = /\.html$/;
    const fileExtensionPug = /\.pug$/;
    if (!fileExtensionHtml.test(req.body.file) && !fileExtensionPug.test(req.body.file)) {
        res.status(400).send("Insert a valid file format")
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        post: 465,
            secure: true,
            auth: {
                user: process.env.nodemailerUser,
                pass: process.env.nodemailerPass
            }
        });
    
    const sendEmail = (content) => {
        transporter.sendMail(content, (error, info) => {
            if (error){
                res.status(500).send(error.message);
            } else {
                console.log('Mail send', info.messageId);
                res.status(200).send(`Mail sent correctly with ${req.body.file} template`);
            }
        });  
    } 
        
    fs.readFile(templatePath, 'utf8', (error, data) => {
        if (error) {
        console.error(error);
        res.send('Error reading the template');
        } else {
            const mailOptions = {
                from: process.env.MailFrom,
                to: process.env.MailTo,
                subject: 'Subject',
                html: fileExtensionHtml.test(req.body.file) ? data : pug.renderFile(templatePath)
            };   
            
            sendEmail(mailOptions);
        };
    });
};

module.exports = { emailPost }