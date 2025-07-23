// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANPZeV0TqYtvi5KjIC6d6iBpsQD9WmIog",
  authDomain: "occasionos.firebaseapp.com",
  projectId: "occasionos",
  storageBucket: "occasionos.firebasestorage.app",
  messagingSenderId: "341928426002",
  appId: "1:341928426002:web:bbf753cc724ec90c17b6cb",
  measurementId: "G-9K3FL93EQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const analytics = getAnalytics(app);

export {auth};