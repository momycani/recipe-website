import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASeBWf7-HmdbS5c5E0AGjT8ZPyKcGtPGw",
  authDomain: "recipe-website-ffcdd.firebaseapp.com",
  projectId: "recipe-website-ffcdd",
  storageBucket: "recipe-website-ffcdd.firebasestorage.app",
  messagingSenderId: "703785199899",
  appId: "1:703785199899:web:46a429e1fbec4f074f8bbe",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);