import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeQj1L5eCk1-FVKH5CaIeyuAgnFzKvm80",
  authDomain: "chat-sky-36760.firebaseapp.com",
  projectId: "chat-sky-36760",
  storageBucket: "chat-sky-36760.appspot.com",
  messagingSenderId: "526955274821",
  appId: "1:526955274821:web:73c3a32f43dd0b6e8db92c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
 const db = getFirestore(app);

 export {app,auth,db}