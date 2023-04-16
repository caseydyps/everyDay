// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCdOn9jjONX2yPN3b-7o0ZaYmPCxHnxmUs',
  authDomain: 'everyday-3f9fe.firebaseapp.com',
  projectId: 'everyday-3f9fe',
  storageBucket: 'everyday-3f9fe.appspot.com',
  messagingSenderId: '622295035625',
  appId: '1:622295035625:web:5705bf2b5c2fbf7d2fca78',
  measurementId: 'G-DM8J3FTHWC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db: any = getFirestore(app);
export const storage = getStorage(app);
export default firebaseConfig;
export const auth = getAuth(app);
