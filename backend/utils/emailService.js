
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const sendResetEmail = async (email, resetLink) => {
  const info = await transporter.sendMail({
    // await transporter.sendMail({
        from: `"Kiriwawula TripMate" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your Kiriwawula TripMate Password",
        html: `
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password.</p>
            <p>Click the link below to choose a new password:</p>
            <p><a href="${resetLink}">Reset My Password</a></p>
            <p>This link should only be used once and will expire shortly.</p>
            <p>If you did not request this, you can ignore this email.</p>
        `,
    });
    console.log("Email accepted by SMTP:", info.accepted);
    console.log("Email rejected by SMTP:", info.rejected);
};

module.exports = { sendResetEmail };
