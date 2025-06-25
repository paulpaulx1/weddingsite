const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, attending, guests, dietary, song } = JSON.parse(event.body);

  // Email setup (you'll need to add your email credentials)
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const emailContent = `
New RSVP from ${name}

Email: ${email}
Attending: ${attending}
Number of guests: ${guests}
Dietary restrictions: ${dietary || 'None'}
Song request: ${song || 'None'}
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'bessie@yourdomain.com', // Bessie's email
      subject: `RSVP: ${name}`,
      text: emailContent
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'RSVP sent successfully!' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send RSVP' })
    };
  }
};