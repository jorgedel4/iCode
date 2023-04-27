// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite' //desde lite para solo tomar las funcionalidades que queremos
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1UD0Z07WbnGxRIYm0XYpwYKzQZUQz_7s",
    authDomain: "mindscript-e7745.firebaseapp.com",
    projectId: "mindscript-e7745",
    storageBucket: "mindscript-e7745.appspot.com",
    messagingSenderId: "590166154286",
    appId: "1:590166154286:web:d0c3c372e6523db3b093bf"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseDB = getFirestore(FirebaseApp);