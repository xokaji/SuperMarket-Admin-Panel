// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4Qb9modAF9Q9tr49Rm4vR8FEgfPW6CIY",
  authDomain: "superm-492d3.firebaseapp.com",
  projectId: "superm-492d3",
  storageBucket: "superm-492d3.appspot.com",
  messagingSenderId: "928936467721",
  appId: "1:928936467721:web:21337f046520bd19dfc7d8",
  measurementId: "G-PCQJSK3XJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
