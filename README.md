# Rezsi - Secure Firebase Auth App

## Prerequisites

- Google account
- Firebase account (free tier available)
- Node.js and npm (optional, only if using Firebase CLI)

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "rezsi")
4. Enable/disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication" in the sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click "Google" provider
5. Toggle "Enable"
6. Add your email as project support email
7. Click "Save"

### 3. Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (we'll deploy rules separately)
4. Select database location (choose closest to your users)
5. Click "Done"

### 4. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon `</>`
4. Register app with nickname "rezsi-web"
5. Copy the `firebaseConfig` object
6. Open `app.js` and replace the placeholder config with your values:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY_HERE",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef",
   };
   ```

### 5. Configure Authorized Domains

1. In Firebase Console, go to "Authentication" > "Settings" tab
2. Scroll to "Authorized domains"
3. Add your domains:
   - `localhost` (should already be there)
   - `faragodavid.github.io` (for GitHub Pages)
   - Or your custom domain

### 6. Deploy Firestore Security Rules

**Option A: Via Firebase Console** (easiest, no CLI needed)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database → Rules tab
4. Copy-paste contents of `firestore.rules` into the editor
5. Click "Publish"

**Option B: Via Firebase CLI**

```bash
npm install -g firebase-tools
firebase login
firebase use --add  # Select your project
firebase deploy --only firestore:rules
```

### 7. Test Locally

```bash
npx http-server -p 8000
```

Open `http://localhost:8000` and test sign-in.

### 8. Deploy to GitHub Pages

```bash
git add .
git commit -m "Add Firebase authentication"
git push origin main
```

Enable GitHub Pages in repository settings → Pages → branch `main` → folder `/root` → Save

Your app will be available at: `https://faragodavid.github.io/rezsi/`

## Project Structure

```
rezsi/
├── index.html         # Main HTML file
├── styles.css         # UI styling
├── app.js             # Firebase auth (ES modules)
├── firestore.rules    # Security rules
├── firebase.json      # Firebase config
└── README.md          # This file
```

## How It Works

### Secure Authentication Flow

1. User clicks "Sign in with Google"
2. Firebase opens OAuth popup
3. Firebase validates with Google servers
4. Firebase issues secure session token
5. User data saved to Firestore (authenticated)
6. Auth state persisted automatically

### Why This is Secure

- ✅ **Server-side validation**: JWT verified by Firebase
- ✅ **Security rules**: Database enforces access control
- ✅ **Cannot be bypassed**: localStorage manipulation won't grant Firestore access
- ✅ **Token management**: Automatic expiration & refresh
- ✅ **Audit trail**: Firebase logs all auth events

### Security Rules Explained

From `firestore.rules`:

```javascript
// Users can only access their own data
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Private collections per user
match /private/{userId}/{document=**} {
  allow read, write: if request.auth.uid == userId;
}
```

These rules are enforced by Firebase servers - impossible to bypass from client.

## Adding Protected Data

Example - saving user-specific notes:

```javascript
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Save note - requires authentication
async function saveNote(noteText) {
  const notesRef = collection(db, `private/${currentUser.uid}/notes`);
  await addDoc(notesRef, {
    text: noteText,
    createdAt: new Date(),
  });
}

// Get user's notes - security rules ensure only owner can read
async function getNotes() {
  const notesRef = collection(db, `private/${currentUser.uid}/notes`);
  const snapshot = await getDocs(notesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
```

Even if someone manipulates the frontend, Firestore rules block unauthorized access.

## Cost

Firebase Spark (free):

- **Authentication**: Unlimited
- **Firestore**: 50K reads/day, 20K writes/day, 1GB storage
- **No credit card required**

## Troubleshooting

### Sign-in popup blocked

Allow popups in browser settings or use redirect flow

### "Permission denied" in Firestore

- Check `firestore.rules` syntax
- Deploy: `firebase deploy --only firestore:rules`
- View in Firebase Console → Firestore → Rules

### "auth/configuration-not-found"

- Verify `firebaseConfig` in `app.js`
- Check Authentication is enabled in Firebase Console

### Works locally but not on deployed site

- Add domain to Firebase authorized domains
- Verify Firebase config is correct
- Check browser console

## Next Steps

- Update security rules for your data model
- Add actual app features using Firestore
- Set up indexes for complex queries
- Configure custom domain (optional)

## License

MIT
