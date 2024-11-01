// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC8rDDRKFLRnFTN4VqyoshY4ZWnCvuZ5Rw",
  authDomain: "parkvue-a2738.firebaseapp.com",
  projectId: "parkvue-a2738",
  storageBucket: "parkvue-a2738.firebasestorage.app",
  messagingSenderId: "184433069550",
  appId: "1:184433069550:web:59a2e8df778d71a3d4d2ff",
  measurementId: "G-ZCRFFW4RLD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  db,
  auth,
  createUserWithEmailAndPassword,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  onAuthStateChanged,
  signOut,
  updateDoc,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  setDoc,
  getDoc,
  sendPasswordResetEmail,
};
export const storage = getStorage(app);
