// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANPZeV0TqYtvi5KjIC6d6iBpsQD9WmIog",
  authDomain: "occasionos.firebaseapp.com",
  projectId: "occasionos",
  storageBucket: "occasionos.firebasestorage.app",
  messagingSenderId: "341928426002",
  appId: "1:341928426002:web:bbf753cc724ec90c17b6cb",
  measurementId: "G-9K3FL93EQS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
