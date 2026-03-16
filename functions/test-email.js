require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'sadebowale092@gmail.com', // Using the email seen in logs
  from: 'smartestatenotifications@gmail.com', // Sender email used in functions
  subject: 'SendGrid API Test',
  text: 'This is a direct test of the new SendGrid API key.',
  html: '<strong>This is a direct test of the new SendGrid API key.</strong>',
};

async function test() {
    try {
        console.log("Sending email...");
        await sgMail.send(msg);
        console.log("Success: Email sent!");
    } catch (error) {
        console.error("Failed to send email:");
        if (error.response) {
            console.error(JSON.stringify(error.response.body, null, 2));
        } else {
            console.error(error);
        }
    }
}

test();
