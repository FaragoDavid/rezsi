let currentUser = null;

const firebaseConfig = {
  apiKey: "AIzaSyDSTU9z5semoU5SxG1VENfUnTuZBYMWZhA",
  authDomain: "rezis-25e67.firebaseapp.com",
  projectId: "rezis-25e67",
  storageBucket: "rezis-25e67.firebasestorage.app",
  messagingSenderId: "634921157857",
  appId: "1:634921157857:web:8fde4968550640406ea3a0"
};

function handleCredentialResponse(response) {
  const responsePayload = decodeJwtResponse(response.credential);

  currentUser = {
    id: responsePayload.sub,
    name: responsePayload.name,
    email: responsePayload.email,
    picture: responsePayload.picture,
  };

  localStorage.setItem("user", JSON.stringify(currentUser));

  showUserSection();
}

function decodeJwtResponse(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

function showUserSection() {
  const loginSection = document.getElementById("login-section");
  const userSection = document.getElementById("user-section");

  document.getElementById("user-name").textContent = currentUser.name;
  document.getElementById("user-email").textContent = currentUser.email;
  document.getElementById("user-picture").src = currentUser.picture;

  loginSection.classList.add("hidden");
  userSection.classList.remove("hidden");
}

function showLoginSection() {
  const loginSection = document.getElementById("login-section");
  const userSection = document.getElementById("user-section");

  loginSection.classList.remove("hidden");
  userSection.classList.add("hidden");
}

function signOut() {
  currentUser = null;
  localStorage.removeItem("user");

  google.accounts.id.disableAutoSelect();

  showLoginSection();
}

function initializeApp() {
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showUserSection();
  }

  const signOutButton = document.getElementById("signout-button");
  signOutButton.addEventListener("click", signOut);
}

window.addEventListener("load", initializeApp);
