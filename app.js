const home = document.getElementById("home");
const app = document.getElementById("app");

const signinBtn = document.getElementById("signinBtn");
const homeStatus = document.getElementById("homeStatus");

const accountBtn = document.getElementById("accountBtn");
const accountMenu = document.getElementById("accountMenu");
const toggleTheme = document.getElementById("toggleTheme");
const logoutBtn = document.getElementById("logoutBtn");

// ---------- VIEW SWITCH ----------
function showApp() {
  home.classList.add("hidden");
  app.classList.remove("hidden");
}

function showHome() {
  app.classList.add("hidden");
  home.classList.remove("hidden");
}

// ---------- AUTH ----------
signinBtn.onclick = () => {
  if (checkAuth()) {
    showApp();
    return;
  }

  homeStatus.innerHTML = `
    No Puter account detected.<br>
    <a href="https://puter.com/signup" target="_blank">Create account</a>
    or
    <a href="https://puter.com/login" target="_blank">Sign in</a>
  `;
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
  alert("Log out via Puter.com for now.");
};

// ---------- INIT ----------
if (checkAuth()) {
  showApp();
} else {
  showHome();
}
