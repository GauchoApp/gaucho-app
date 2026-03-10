import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAoOJYrEE8mlG7i62p7KXu49wqC7S8dh9Q",
  authDomain: "gaucho-app-fc957.firebaseapp.com",
  projectId: "gaucho-app-fc957",
  storageBucket: "gaucho-app-fc957.firebasestorage.app",
  messagingSenderId: "623516402239",
  appId: "1:623516402239:web:54c4d989a2ea8cc5486e8a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
};
