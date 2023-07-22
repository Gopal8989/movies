const sgMail = require('@sendgrid/mail');
const config = require('../config/index.js');

const {
    sendGrid: { skdSendGrid, email },
} = config;

/**
 * Send gmail using send grid
 */
module.exports.sendGridEmail = async (obj) => {
    try {
        const { message, subject, to, bcc, cc, attachments } = obj;
        const mailOptions = {
            from: email,
            to,
            subject,
            html: message,
        };
        // BCC users
        if (bcc) {
            mailOptions.bcc = bcc;
        }

        // CC users
        if (cc) {
            mailOptions.cc = cc;
        }

        // Attachment file
        if (attachments) {
            mailOptions.attachments = attachments;
        }
        sgMail.setApiKey(skdSendGrid);
        sgMail.send(mailOptions).then(
            () => { },
            (error) => {
                if (error.response) {
                }
            }
        );
        return true;
    } catch (error) {
        throw Error(error);
    }
};
