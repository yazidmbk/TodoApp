// firebaseConfig.ts
import { firebase } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA69XmCQqJnVJTF0MFiKJzwzm3mXMSdMX8",
  authDomain: "todo-37395.firebaseapp.com",
  projectId: "todo-37395",
  storageBucket: "todo-37395.appspot.com",
  messagingSenderId: "250510306231",
  appId: "1:250510306231:web:bbc6fae0236baaa5459632",
  measurementId: "G-247R0Z7WJM"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, firestore };
