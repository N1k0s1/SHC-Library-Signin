// DEPRECATED: This file is no longer used as the backend has been migrated to Node.js/PostgreSQL on Railway.
// It is kept here for reference only.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // uncomment if you need auth

const firebaseConfig = {
  apiKey: 'AIzaSyD99Kbj0Ur8fHN6KNCRRDbNrY8bGJm0ti8',
  authDomain: 'shc-library-signin.firebaseapp.com',
  projectId: 'shc-library-signin',
  storageBucket: 'shc-library-signin.firebasestorage.app',
  messagingSenderId: '532256995224',
  appId: '1:532256995224:web:1e7e7bff23b1a3c2bc5ded',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
// export const auth = getAuth(app);
export default app;