import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace these values with your Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "atria-campus-connect.firebaseapp.com",
  projectId: "atria-campus-connect",
  storageBucket: "atria-campus-connect.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);