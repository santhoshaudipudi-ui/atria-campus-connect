import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // You need this import

const firebaseConfig = {
  apiKey: "AIzaSyCoceOyZDNvXpymAP-CUogSghlWbyHaTQ8",
  authDomain: "atria-campus-connect.firebaseapp.com",
  projectId: "atria-campus-connect",
  storageBucket: "atria-campus-connect.firebasestorage.app",
  messagingSenderId: "214973037312",
  appId: "1:214973037312:web:3405c2522a6037d4b291e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the database connection
export const db = getFirestore(app);