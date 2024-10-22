import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './email.css'; // For custom styles

const Email = () => {
  const form = useRef();
  const [recipients, setRecipients] = useState(''); // State to hold the recipient emails

  const sendEmail = (e) => {
    e.preventDefault();

    // Split recipients by comma to handle multiple emails
    const recipientList = recipients.split(',').map(email => email.trim());

    // Send email to each recipient
    recipientList.forEach((recipient) => {
      const emailData = {
        to_name: form.current.to_name.value,
        from_name: form.current.from_name.value,
        message: form.current.message.value,
        recipient: recipient,
      };

      emailjs
        .send('service_g8lx61p', 'template_7x8hu7w', emailData, 'Ts5X_CtbR5xawWzDo')
        .then(
          () => {
            console.log(`Email sent to ${recipient}`);
          },
          (error) => {
            console.error(`Failed to send email to ${recipient}`, error.text);
          },
        );
    });

    alert('Emails sent successfully!');
  };

  return (
    <div className="email-container">

    
    <form ref={form} onSubmit={sendEmail} >
      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="to_name" placeholder="Enter Company Name" required />

      <label htmlFor="email">Email (comma separated for multiple emails)</label>
      <input
        type="text"
        id="email"
        name="recipients"
        placeholder="Enter recipient emails, separated by commas"
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)} // Update state
        required
      />

      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" placeholder="Enter your message" required />

      <input type="submit" value="Send" />
    </form>
    </div>
  );
};

export default Email;
