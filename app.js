const home = document.getElementById("home");
const app = document.getElementById("app");

const signinBtn = document.getElementById("signinBtn");
const newUserBtn = document.getElementById("newUserBtn");
const drawer = document.getElementById("newUserInfo");

const accountBtn = document.getElementById("accountBtn");
const accountMenu = document.getElementById("accountMenu");

// ---------- VIEW SWITCH ----------
function showApp() {
  home.classList.remove("active");
  app.classList.add("active");
}

function showHome() {
  app.classList.remove("active");
  home.classList.add("active");
}

// ---------- AUTH ----------
signinBtn.onclick = async () => {
  if (checkAuth()) {
    showApp();
    return;
  }

  try {
    await puter.auth.signIn();
    if (checkAuth()) showApp();
  } catch {}
};

newUserBtn.onclick = () => {
  drawer.style.display =
    drawer.style.display === "block" ? "none" : "block";
};

// ---------- DRAWER ----------
window.closeDrawer = () => {
  drawer.style.display = "none";
};

window.goToPuter = () => {
  window.location.href = "https://puter.com";
};

// ---------- ACCOUNT ----------
accountBtn.onclick = () => {
  accountMenu.style.display =
    accountMenu.style.display === "block" ? "none" : "block";
};

// ---------- INIT ----------
if (checkAuth()) {
  showApp();
} else {
  showHome();
}
