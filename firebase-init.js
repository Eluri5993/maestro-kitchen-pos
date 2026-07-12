import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// REPLACE THESE DUMMY VALUES WITH YOUR ACTUAL FIREBASE PROJECT KEYS
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "maestro-kitchen-pos.firebaseapp.com",
  projectId: "maestro-kitchen-pos",
  storageBucket: "maestro-kitchen-pos.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
