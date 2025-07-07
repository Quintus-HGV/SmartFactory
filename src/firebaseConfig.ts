import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9rEuhPhI3baLey3iFnnDemovzb_AqN5A",
  authDomain: "idp-3c0e1.firebaseapp.com",
  databaseURL: "https://idp-3c0e1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "idp-3c0e1",
  storageBucket: "idp-3c0e1.firebasestorage.app",
  messagingSenderId: "975500230295",
  appId: "1:975500230295:web:09df76063518004b0a73d2",
  measurementId: "G-XR6K2KQRW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database service
export const db = getDatabase(app);
