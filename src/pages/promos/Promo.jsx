import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { collection, addDoc, getDocs, Timestamp, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import './promo.css'; // For custom styles
import { Link } from 'react-router-dom';

const Promo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);

  // Fetch users and their FCM tokens from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  // Function to handle form submission
  const sendPromotion = async (e) => {
    e.preventDefault();
    if (title === '' || description === '' || startDate === '' || endDate === '') {
      toast.warning('Please fill in all fields!');
      return;
    }
    if (!image) {
      toast.warning('Please upload an image for the promotion!');
      return;
    }
    setSending(true);

    try {
      // Fetch existing promotions to calculate the next sequential ID
      const promotionsSnapshot = await getDocs(collection(db, 'promotions'));
      let nextPromoId = 1; // Default ID

      // Find the maximum ID in the existing promotions
      promotionsSnapshot.docs.forEach((doc) => {
        const promoId = doc.data().id;
        if (promoId >= nextPromoId) {
          nextPromoId = promoId + 1; // Increment for next available ID
        }
      });

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `promotions/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // You can add progress logic here if needed
        },
        (error) => {
          toast.error('Image upload failed.');
          setSending(false);
        },
        async () => {
          // Get the download URL of the image after it's uploaded
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          // Add promotion to Firestore with the image URL, date range, and sequential ID
          await setDoc(doc(db, 'promotions', nextPromoId.toString()), {
            id: nextPromoId, // Use the sequential promotion ID here
            title,
            description,
            imageUrl: url,
            startDate: Timestamp.fromDate(new Date(startDate)),
            endDate: Timestamp.fromDate(new Date(endDate)),
            createdAt: Timestamp.now(),
          });

          // Send notifications to all users
          for (const user of users) {
            if (user.fcmToken) {
              await sendFCMNotification(user.fcmToken, title, description);
            }
          }

          toast.success('Promotion sent successfully!');
          setTitle('');
          setDescription('');
          setImage(null);
          setStartDate('');
          setEndDate('');
        }
      );
    } catch (error) {
      toast.error('Failed to send promotion. Try again later.');
      console.error('Error sending promotion: ', error);
    }
    setSending(false);
  };

  // Function to send FCM notification (this should interact with your backend or FCM service)
  const sendFCMNotification = async (token, title, body) => {
    const payload = {
      to: token,
      notification: {
        title: title,
        body: body,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
    };

    await fetch('YOUR_SERVER_FCM_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer YOUR_SERVER_KEY`,
      },
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="promo-container">
      <h2>Promotion Notification</h2>
      <form onSubmit={sendPromotion} className="promo-form">
        <div className="form-group">
          <label htmlFor="promo-title">Promotion Title:</label>
          <input
            type="text"
            id="promo-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter promotion title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="promo-description">Promotion Description:</label>
          <textarea
            id="promo-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter promotion details"
            required
          />
        </div>


        <div className="form-group">
          <label htmlFor="promo-image">Upload Image:</label>
          <input
            type="file"
            id="promo-image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <div className="buttonnss">
          <div className="promp-btn">
            <Link to="/prevpromos" className="promo-btnnn">
              <button type="button" className="previous-promotions-btn">Previous Promotions</button>
            </Link>
          </div>
          <div className="send-btnn">
            <button type="submit" className="send-btn" disabled={sending}>
              {sending ? 'Sending...' : 'Send Promotion'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Promo;
