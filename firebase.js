import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBIBVVl1-qah5qPAns6ULaO8QmjfcnugiA",
    authDomain: "ecommerce-7f1e2.firebaseapp.com",
    projectId: "ecommerce-7f1e2",
    storageBucket: "ecommerce-7f1e2.firebasestorage.app",
    messagingSenderId: "1090647740235",
    appId: "1:1090647740235:web:97a023e4b6638f1c7022ce",
    measurementId: "G-JE0WY3T385"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
  auth,
  provider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged
};