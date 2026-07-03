import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'MCQ Bot'} <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.htmlMessage, // Optional: send HTML instead of plain text
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
