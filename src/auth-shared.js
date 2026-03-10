// Shared UI logic for authentication
import { loadUtilityData } from "./data-handler.js";

export function showUserSection(user) {
  const loginSection = document.getElementById("login-section");
  const userSection = document.getElementById("user-section");

  document.getElementById("user-email").textContent = user.email || "";

  loginSection.classList.add("hidden");
  userSection.classList.remove("hidden");

  // Load utility data
  loadUtilityData();
}

export function showLoginSection() {
  const loginSection = document.getElementById("login-section");
  const userSection = document.getElementById("user-section");

  loginSection.classList.remove("hidden");
  userSection.classList.add("hidden");
}
