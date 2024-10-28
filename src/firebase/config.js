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

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyDFsKb1fvVEkkHxuq4yxvX0eCY91inSiIY",
//     authDomain: "parkvue-48dcc.firebaseapp.com",
//     projectId: "parkvue-48dcc",
//     storageBucket: "parkvue-48dcc.appspot.com",
//     messagingSenderId: "419852219763",
//     appId: "1:419852219763:web:8f3e0bce11ceb94b6dc106"
// };
const firebaseConfig = {
  apiKey: "AIzaSyCL4EWTi-0lyIN6b0cBuay-3kLwLRKmoGQ",
  authDomain: "parkvue-c18db.firebaseapp.com",
  databaseURL:
    "https://parkvue-c18db-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkvue-c18db",
  storageBucket: "parkvue-c18db.appspot.com",
  messagingSenderId: "277540950422",
  appId: "1:277540950422:web:8942da1274b1c726784db7",
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
