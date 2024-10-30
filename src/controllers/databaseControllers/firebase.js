// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdR7rt7_Z0khHVLLeZA7mc_AtR2Ht2_pI",
  authDomain: "bar-man-pro.firebaseapp.com",
  projectId: "bar-man-pro",
  storageBucket: "bar-man-pro.appspot.com",
  messagingSenderId: "881467597393",
  appId: "1:881467597393:web:1716bf6fa59de10ad5ce70",
  measurementId: "G-CC6Y2PTC1H"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const myFirestoreDb = getFirestore(app); // Firestore reference