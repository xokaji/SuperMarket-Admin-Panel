import React, { useState, useEffect } from 'react';
import './profile.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from "../../firebase"; // Make sure to configure Firebase and import db and auth from your Firebase config
import { signOut } from 'firebase/auth'; // Import signOut from Firebase auth
import { storage } from '../../firebase'; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ScaleLoader from 'react-spinners/ScaleLoader'; // Import the spinner
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Profile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    nic: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    // Fetch admin data from Firestore
    const fetchAdminData = async () => {
      try {
        const docRef = doc(db, 'admin', '1'); // Use '1' as the DocumentID
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAdminData({
            firstName: data.fname,
            lastName: data.lname,
            email: data.emailAddress,
            phone: data.phone,
            address: data.address,
            nic: data.nic,
            profilePicture: data.profilePicture || 'https://via.placeholder.com/150', // Use actual image or placeholder
            lastLogin: 'Last sign in 4 minutes ago', // Replace with actual last login if available
          });
          setFormData({
            firstName: data.fname,
            lastName: data.lname,
            email: data.emailAddress,
            phone: data.phone,
            address: data.address,
            nic: data.nic,
          });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!profileImage) return;

    setUploadingImage(true);

    const storageRef = ref(storage, `profileImages/${profileImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, profileImage);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Image upload failed:', error);
          setUploadingImage(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadingImage(false);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSaveChanges = async () => {
    try {
      let profilePictureUrl = adminData.profilePicture;

      if (profileImage) {
        profilePictureUrl = await uploadImage();
      }

      const docRef = doc(db, 'admin', '1'); // Use '1' as the DocumentID
      await updateDoc(docRef, {
        fname: formData.firstName,
        lname: formData.lastName,
        emailAddress: formData.email,
        phone: formData.phone,
        address: formData.address,
        nic: formData.nic,
        profilePicture: profilePictureUrl,
      });

      setAdminData({ ...formData, profilePicture: profilePictureUrl });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleLogout = async () => {
    toast.info(
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            border: '4px solid rgba(190, 37, 40, 1)',
            borderRadius: '50%',
            borderTop: '4px solid #3498db',
            width: '24px',
            height: '24px',
            marginRight: '10px',
            animation: 'spin 1s linear infinite',
          }}
        ></div>
        <span>Logging out...</span>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );

    // Wait for a short delay to show the spinner
    setTimeout(async () => {
      try {
        await signOut(auth); // Sign out from Firebase
        toast.dismiss(); // Dismiss the toast
        navigate('/'); // Redirect to root path
      } catch (error) {
        toast.error('Error signing out:', { autoClose: 3000 });
        console.error('Error signing out:', error);
      }
    }, 5000); // Adjust the delay as needed (5000ms in this case)
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <ScaleLoader color="#36D7B7" loading={loading} />
      </div>
    );
  }

  if (!adminData) {
    return <p>No admin data available</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <img
          src={adminData.profilePicture}
          alt="Profile"
          className="profile-picture"
        />
        <p className="name">{adminData.firstName} {adminData.lastName}</p>
        <p className="email">Administry</p>

        <div className="button-row">
          {isEditing ? (
            <button className="save-btn" onClick={handleSaveChanges}>
              {uploadingImage ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            
          )}
        </div>

        <div className="dlt-btn">
          <button className="delete-user-btn">Change Password</button>
        </div>
        
        <button className="block-user-btn" onClick={handleLogout}>Log Out</button>
        
      </div>

      <div className="profile-details">
        <div className="personal-info">
          <h2>Personal Information</h2>

          {/* First Name */}
          <div className="info-row">
            <label>First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            ) : (
              <p>{adminData.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="info-row">
            <label>Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            ) : (
              <p>{adminData.lastName}</p>
            )}
          </div>

          {/* Profile Image */}
          <div className="info-row">
            <label>Profile Image</label>
            {isEditing ? (
              <input type="file" accept="image/*" onChange={handleImageChange} />
            ) : null}
          </div>

          {/* Rest of the fields (Address, NIC, etc.) */}
          {/* Address */}
          <div className="info-row">
            <label>Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            ) : (
              <p>{adminData.address}</p>
            )}
          </div>

          {/* NIC */}
          <div className="info-row">
            <label>NIC Number</label>
            {isEditing ? (
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleInputChange}
              />
            ) : (
              <p>{adminData.nic}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="info-row">
            <label>Email Address</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            ) : (
              <p>{adminData.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="info-row">
            <label>Phone</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            ) : (
              <p>{adminData.phone}</p>
            )}
          </div>

          {/* Last login information */}
          <div className="info-row">
            <label>Last Login</label>
            <p>{adminData.lastLogin}</p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
