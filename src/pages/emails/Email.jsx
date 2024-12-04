import React, { useRef, useState } from 'react';
import './email.css';

const Email = () => {
  const form = useRef();
  const [recipients, setRecipients] = useState('');

  // Basic email validation function
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  // Handle form submission
  const sendEmail = async (e) => {
    e.preventDefault();

    // Split recipients by commas and trim spaces
    const recipientList = recipients.split(',').map((email) => email.trim());

    // Validate each recipient's email
    for (let email of recipientList) {
      if (!validateEmail(email)) {
        alert(`Invalid email address: ${email}`);
        return; // Stop sending if there's an invalid email
      }
    }

    try {
      // Send email data to the backend
      const response = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients,
          to_name: form.current.to_name.value,
          from_name: form.current.from_name.value,
          message: form.current.message.value,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Success message
      } else {
        alert('Failed to send emails: ' + data.message); // Error message
      }
    } catch (error) {
      console.error('Failed to send emails:', error);
      alert('There was an error sending the emails.');
    }
  };

  return (
    <div className="email-container">
      <form ref={form} onSubmit={sendEmail}>
        <label htmlFor="from_name">Your Name</label>
        <input
          type="text"
          id="from_name"
          name="from_name"
          placeholder="Enter your name"
          required
        />

        <label htmlFor="recipients">Email (comma-separated for multiple emails)</label>
        <input
          type="text"
          id="recipients"
          name="recipients"
          placeholder="Enter recipient emails, separated by commas"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          required
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          placeholder="Enter your message"
          required
        />

        <input type="submit" value="Send" />
      </form>
    </div>
  );
};

export default Email;
