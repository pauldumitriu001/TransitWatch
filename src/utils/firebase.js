// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDT_6x-NLHYLW-GQm_pRrEey6zyM8a-PjE",
  authDomain: "transitwatch-9cd1b.firebaseapp.com",
  databaseURL: "https://transitwatch-9cd1b-default-rtdb.firebaseio.com",
  projectId: "transitwatch-9cd1b",
  storageBucket: "transitwatch-9cd1b.appspot.com",
  messagingSenderId: "626899596862",
  appId: "1:626899596862:web:555afe7657e3fef841036f",
  measurementId: "G-JJ3Q8MD5SK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
