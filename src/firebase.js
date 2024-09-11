// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyBtj4O0lE24CZITLnoLVHE-uOVcf5moJE8",

  authDomain: "superm-3404a.firebaseapp.com",

  projectId: "superm-3404a",

  storageBucket: "superm-3404a.appspot.com",

  messagingSenderId: "647148332959",

  appId: "1:647148332959:web:c5ef5764b22281a3217faa"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
