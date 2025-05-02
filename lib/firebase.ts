import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB1827uYTOf6TPxHBjgOQyrDaftW9SRvrY",
  authDomain: "ai-chat-app-8ffca.firebaseapp.com",
  projectId: "ai-chat-app-8ffca",
  storageBucket: "ai-chat-app-8ffca.firebasestorage.app",
  messagingSenderId: "764444935867",
  appId: "1:764444935867:web:2ba187e650ce0bbae40b9e",
  measurementId: "G-083VMSNXK7",
  databaseURL: "https://ai-chat-app-8ffca-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { database };
