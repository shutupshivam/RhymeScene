window.appState = {
  signedIn: false,
  user: null,
  theme: localStorage.getItem("theme") || "dark"
};

document.body.className = appState.theme;

window.checkAuth = () => {
  try {
    if (puter.auth.isSignedIn()) {
      appState.signedIn = true;
      appState.user = puter.auth.getUser();
      return true;
    }
  } catch {}
  appState.signedIn = false;
  appState.user = null;
  return false;
};
