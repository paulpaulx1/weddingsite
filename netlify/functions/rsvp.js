const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  try {
    console.log('Function started');
    
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    console.log('Parsing body:', event.body);
    const { name, email, attending, guests, dietary, song } = JSON.parse(event.body);
    
    console.log('Environment vars check:', {
      hasUser: !!process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('Transporter created, sending email...');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'bessie116@gmail.com', // Put Bessie's real email here
      subject: `RSVP: ${name}`,
      text: `New RSVP from ${name}\n\nEmail: ${email}\nAttending: ${attending}\nGuests: ${guests}\nDietary: ${dietary || 'None'}\nSong: ${song || 'None'}`
    });

    console.log('Email sent successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'RSVP sent successfully!' })
    };
  } catch (error) {
    console.error('Full error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};