// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDFsKb1fvVEkkHxuq4yxvX0eCY91inSiIY",
    authDomain: "parkvue-48dcc.firebaseapp.com",
    projectId: "parkvue-48dcc",
    storageBucket: "parkvue-48dcc.appspot.com",
    messagingSenderId: "419852219763",
    appId: "1:419852219763:web:8f3e0bce11ceb94b6dc106"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
