// src/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDJFFXqfDSBZ4yoGAjaA3p60fg4fAONpSg",
  authDomain: "careercopilot-staging.firebaseapp.com",
  projectId: "careercopilot-staging",
  storageBucket: "careercopilot-staging.firebasestorage.app",
  messagingSenderId: "473068119033",
  appId: "1:473068119033:web:d5d5c8582c6912c8a21328"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
