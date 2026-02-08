const home = document.getElementById("home");
const app = document.getElementById("app");

const signinBtn = document.getElementById("signinBtn");
const newUserBtn = document.getElementById("newUserBtn");

const modal = document.getElementById("infoModal");

const accountBtn = document.getElementById("accountBtn");
const accountMenu = document.getElementById("accountMenu");
const toggleTheme = document.getElementById("toggleTheme");
const logoutBtn = document.getElementById("logoutBtn");

// ---------- VIEW ----------
function showApp() {
  home.classList.add("hidden");
  app.classList.remove("hidden");
}

function showHome() {
  app.classList.add("hidden");
  home.classList.remove("hidden");
}

// ---------- AUTH ----------
signinBtn.onclick = async () => {
  if (checkAuth()) {
    showApp();
    return;
  }

  // CONFIRM EXISTING ACCOUNT ONLY
  try {
    await puter.auth.signIn();
    if (checkAuth()) showApp();
  } catch {
    // do nothing
  }
};

newUserBtn.onclick = () => {
  modal.classList.remove("hidden");
};

// ---------- MODAL ----------
window.closeModal = () => {
  modal.classList.add("hidden");
};

window.goToPuter = () => {
  window.location.href = "https://puter.com";
};

// ---------- ACCOUNT MENU ----------
accountBtn.onclick = () => {
  accountMenu.classList.toggle("hidden");
};

toggleTheme.onclick = () => {
  appState.theme = appState.theme === "dark" ? "light" : "dark";
  document.body.className = appState.theme;
  localStorage.setItem("theme", appState.theme);
};

logoutBtn.onclick = () => {
  alert("Log out from Puter.com");
};

// ---------- INIT ----------
if (checkAuth()) {
  showApp();
} else {
  showHome();
}
