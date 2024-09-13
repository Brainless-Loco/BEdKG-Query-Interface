import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';


const firebaseConfig = {
  apiKey: "AIzaSyBO9LLB9C18f-WdeJscrYUNW5nbU99Lboo",
  authDomain: "virtuoso-query-interface.firebaseapp.com",
  projectId: "virtuoso-query-interface",
  storageBucket: "virtuoso-query-interface.appspot.com",
  messagingSenderId: "432807463355",
  appId: "1:432807463355:web:cb118de2c0ee48147c9c9e",
  measurementId: "G-DFQT2BCNWE"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
// const analytics = getAnalytics(app);