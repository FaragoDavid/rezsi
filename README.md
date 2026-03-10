# Rezsi

## Prerequisites

Before you can use this app, you need to set up Google OAuth credentials.

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application" as the application type
   - Add authorized JavaScript origins:
     - For local development: `http://localhost:8000` or `http://127.0.0.1:8000`
     - For GitHub Pages: `https://YOUR_USERNAME.github.io`
   - Add authorized redirect URIs (same as origins):
     - `http://localhost:8000`
     - `https://YOUR_USERNAME.github.io`
   - Click "Create"
4. Copy the Client ID

### 2. Configure the Application

1. Open `index.html`
2. Find the line with `data-client_id="YOUR_GOOGLE_CLIENT_ID"`
3. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID

### 3. Test Locally

You can test the application locally using a simple HTTP server:

```bash
npx http-server -p 8000
```

Then open your browser and navigate to `http://localhost:8000`

### 4. Deploy to GitHub Pages

1. Create a new repository on GitHub or use the current one
2. Push your code:
   ```bash
   git add .
   git commit -m "Initial commit: Google Auth web app"
   git push origin main
   ```
3. Enable GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages" in the sidebar
   - Under "Source", select the branch (usually `main`) and folder (usually `/root`)
   - Click "Save"
4. Your app will be available at: `https://YOUR_USERNAME.github.io/rezsi/`

**Important**: Don't forget to add your GitHub Pages URL to the authorized JavaScript origins and redirect URIs in the Google Cloud Console (as mentioned in step 1).

## Project Structure

```
rezsi/
├── index.html    # Main HTML file with Google Sign-In button
├── styles.css    # Styling for the application
├── app.js        # JavaScript for handling authentication
└── README.md     # This file
```

## How It Works

1. The app uses Google's Identity Services library for authentication
2. When a user signs in, Google returns a JWT token containing user information
3. The app decodes the JWT to extract user details (name, email, profile picture)
4. User information is stored in localStorage for session persistence
5. On subsequent visits, the app checks localStorage and auto-logs in the user
6. Users can sign out, which clears the localStorage and requires re-authentication

## Security Notes

- Never commit your actual Google Client ID to a public repository if it has sensitive access
- For this use case (frontend-only with Google Sign-In), the Client ID is considered public
- Don't use this pattern for apps that need to make authenticated API calls on behalf of users (you'd need a backend for that)
- GitHub Pages serves content over HTTPS, which is required for production use of Google Sign-In

## Customization

- Modify `styles.css` to change the look and feel
- Update the app title and welcome message in `index.html`
- Extend `app.js` to add more functionality after authentication

## Browser Support

This app works in all modern browsers that support:

- ES6 JavaScript
- localStorage
- Fetch API

## Troubleshooting

### "Invalid Client ID" error

- Make sure you've replaced `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID
- Verify that the current URL is listed in the authorized JavaScript origins in Google Cloud Console

### Sign-in button doesn't appear

- Check the browser console for errors
- Ensure the Google Identity Services library is loading correctly
- Verify your internet connection

### Sign-in works locally but not on GitHub Pages

- Add your GitHub Pages URL to the authorized origins in Google Cloud Console
- Wait a few minutes for changes to propagate
- Clear your browser cache

## License

MIT License - Feel free to use this for your own projects!
