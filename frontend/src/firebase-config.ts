// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration will be populated here
const firebaseConfig = {
  apiKey: "AIzaSyDJFFXqfDSBZ4yoGAjaA3p60fg4fAONpSg",
  authDomain: "careercopilot-staging.firebaseapp.com",
  projectId: "careercopilot-staging",
  storageBucket: "careercopilot-staging.firebasestorage.app",
  messagingSenderId: "473068119033",
  appId: "1:473068119033:web:d5d5c8582c6912c8a21328"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you need
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
