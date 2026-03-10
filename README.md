# Rezsi

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "rezsi")
4. Enable/disable Google Analytics (optional)
5. Click "Create project"

### 3. Enable Authentication

1. In Firebase Console, go to "Authentication" in the sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click "Google" provider
5. Toggle "Enable"
6. Add your email as project support email
7. Click "Save"

### 4. Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (we'll deploy rules separately)
4. Select database location (choose closest to your users)
5. Click "Done"

### 5. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon `</>`
4. Register app with nickname "rezsi-web"
5. Copy the `firebaseConfig` object
6. Open `src/auth-prod.js` and replace the placeholder config with your values:
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

### 6. Configure Authorized Domains

1. In Firebase Console, go to "Authentication" > "Settings" tab
2. Scroll to "Authorized domains"
3. Add your domains:
   - `localhost` (should already be there)
   - `faragodavid.github.io` (for GitHub Pages)
   - Or your custom domain

### 7. Deploy Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database → Rules tab
4. Replace the default rules with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       function isAllowedUser() {
         return request.auth != null && request.auth.token.email == 'YOUR_EMAIL@gmail.com';
       }

       match /users/{userId} {
         allow read, write: if isAllowedUser() && request.auth.uid == userId;
       }

       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

5. Replace `YOUR_EMAIL@gmail.com` with your actual email
6. Click "Publish"

## Development

### Run Development Server

```bash
npm run dev
```

Opens development server at `http://localhost:8000` with:

- **Mock authentication** (auto sign-in as "Local Dev User")
- **Hot module reload** for instant updates
- No Firebase authentication required

### Build for Production

```bash
npm run build
```

Builds optimized files to `docs/` directory with:

- **Real Firebase authentication**
- **Minified assets**
- **Production-ready code**

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally before deploying.

## Deployment to GitHub Pages

The app deploys automatically via GitHub Actions when you push to `main`.

### Initial Setup

1. Go to repository Settings → Pages
2. Source: **GitHub Actions** (not "Deploy from a branch")
3. Save

### Deploy

GitHub Actions will:

1. Install dependencies
2. Build the app (`npm run build`)
3. Deploy to GitHub Pages automatically

App available at: `https://faragodavid.github.io/rezsi/`

## How It Works

### Development Mode (`npm run dev`)

- Loads `auth-dev.js` with mock authentication
- Auto-signs in as "Local Dev User"
- No Firebase required
- Hot module reload for fast development

### Production Mode (`npm run build`)

- Loads `auth-prod.js` with real Firebase authentication
- Requires Google sign-in
- Protected by Firestore security rules
- Optimized and minified assets
