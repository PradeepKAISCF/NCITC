import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDrLmxVYg40Wq30hr9XhXJ1FZDfwrqgwHw",
  authDomain: "twitter-clone-d9196.firebaseapp.com",
  projectId: "twitter-clone-d9196",
  storageBucket: "twitter-clone-d9196.appspot.com",
  messagingSenderId: "917100327917",
  appId: "1:917100327917:web:26175ee7ce48e7df4b2de4",
  measurementId: "G-S1FG1126PG"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export default app;
