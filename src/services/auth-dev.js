// Development mock authentication
import { showUserSection, showLoginSection } from '../components/login.js';

let currentUser = null;

const mockUser = {
  displayName: 'Local Dev User',
  email: 'dev@localhost',
  uid: 'local-dev-user-id',
};

function handleMockSignIn() {
  console.log('Mock sign-in triggered');
  currentUser = mockUser;
  showUserSection(mockUser);
}

function handleMockSignOut() {
  console.log('Mock sign-out triggered');
  currentUser = null;
  showLoginSection();
}

export function initialize() {
  console.log('Initializing mock authentication (DEVELOPMENT)');

  const signInButton = document.getElementById('google-signin-button');

  signInButton.addEventListener('click', handleMockSignIn);

  // Auto sign-in for convenience in development
  handleMockSignIn();
}

export { currentUser };
