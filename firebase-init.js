import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCjlR_DL_i5L8D9tO82pdyBdob0WsrD_7M",
  authDomain: "maestro-kitchen-pos.firebaseapp.com",
  projectId: "maestro-kitchen-pos",
  storageBucket: "maestro-kitchen-pos.firebasestorage.app",
  messagingSenderId: "385416907121",
  appId: "1:385416907121:web:3d833cb46c9b6d36e0ced0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
