import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCpW3EGSQ4HAumrWXWKQXkGoG9J9uwjZhw",
  authDomain: "trailguard-869d0.firebaseapp.com",
  projectId: "trailguard-869d0",
  storageBucket: "trailguard-869d0.appspot.com",
  messagingSenderId: "117692785864",
  appId: "1:117692785864:android:b1be9f8b6e8b94e93f71fd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
