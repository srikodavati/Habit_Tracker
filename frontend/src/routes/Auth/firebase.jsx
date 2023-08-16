import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

import axios from 'axios';

const firebaseConfig = {
  apiKey: 'AIzaSyB00jSarZ7zNHbDC0c0gQnAcBNhQ1vd3TQ',
  authDomain: 'habit-tracker-fed3e.firebaseapp.com',
  projectId: 'habit-tracker-fed3e',
  storageBucket: 'habit-tracker-fed3e.appspot.com',
  messagingSenderId: '126255856200',
  appId: '1:126255856200:web:5fc1358fd3a2ae520a367d',
  measurementId: 'G-02945VRQ8M',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const BASE_URL = 'https://habit-tracker-k1wh.onrender.com';

const logIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return [true, ''];
  } catch (err) {
    return [false, err.message];
  }
};

const register = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      username,
      authProvider: 'local',
      email,
    });
    await axios.post(`${BASE_URL}/api/users`, {
      userName: username,
      email: email,
    });
    return [true, ''];
  } catch (err) {
    return [false, err.message];
  }
};

const logout = () => {
  signOut(auth);
};

export { auth, db, logIn, register, logout };
