// server.js
const express = require('express');
const emailjs = require('@emailjs/browser'); // or use the emailjs package for backend

const app = express();
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { recipients, to_name, from_name, message } = req.body;

  try {
    const recipientList = recipients.split(',').map(email => email.trim());

    await Promise.all(
      recipientList.map((recipient) =>
        emailjs.send('service_g8lx61p', 'template_7x8hu7w', {
          to_name,
          from_name,
          message,
          recipient,
        }, 'Ts5X_CtbR5xawWzDo')
      )
    );

    res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Failed to send emails:', error);
    res.status(500).json({ message: 'Failed to send emails' });
  }
});

const PORT = 8000; // Choose any available port
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
