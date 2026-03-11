import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { showUserSection, showLoginSection } from '../components/login.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDSTU9z5semoU5SxG1VENfUnTuZBYMWZhA',
  authDomain: 'rezis-25e67.firebaseapp.com',
  projectId: 'rezis-25e67',
  storageBucket: 'rezis-25e67.firebasestorage.app',
  messagingSenderId: '634921157857',
  appId: '1:634921157857:web:8fde4968550640406ea3a0',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let currentUser = null;

async function saveUserToFirestore(user) {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        lastLogin: new Date().toISOString(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

async function handleGoogleSignIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    try {
      await saveUserToFirestore(user);
    } catch (error) {
      if (error.code === 'permission-denied' || error.message.includes('permission')) {
        await firebaseSignOut(auth);
        alert('Access denied. You do not have permission to use this application.');
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    alert(`Sign-in failed: ${error.message}`);
  }
}

async function handleSignOut() {
  try {
    await firebaseSignOut(auth);
    currentUser = null;
    showLoginSection();
  } catch (error) {
    console.error('Error during sign-out:', error);
    alert(`Sign-out failed: ${error.message}`);
  }
}

export function initialize() {
  console.log('Initializing Firebase authentication (PRODUCTION)');

  const signInButton = document.getElementById('google-signin-button');

  signInButton.addEventListener('click', handleGoogleSignIn);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      showUserSection(user);
    } else {
      currentUser = null;
      showLoginSection();
    }
  });
}

export { currentUser };
