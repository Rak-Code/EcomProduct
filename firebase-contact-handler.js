// firebase-contact-handler.js
// Handles sending emails for Contact Us form using Nodemailer and SMTP credentials from .env.local

const nodemailer = require('nodemailer');

/**
 * Sends a contact email using SMTP credentials from environment variables.
 * @param {Object} data - The contact form data
 * @param {string} data.name - Name of the sender
 * @param {string} data.email - Email of the sender
 * @param {string} data.message - Message content
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function sendContactEmail({ name, email, message }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `\"${name}\" <${email}>`,
      to: process.env.SMTP_USER, // Send to your own email
      subject: `Contact Us Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { sendContactEmail };
