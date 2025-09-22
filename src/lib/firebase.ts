// file: src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- Import Firestore

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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app); // <-- Initialize Firestore

export { auth, db }; // <-- Export db