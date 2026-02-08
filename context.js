// Global app state
window.appState = {
  signedIn: false,
  user: null
};

// Safe auth check
window.checkAuthState = function () {
  try {
    if (puter.auth.isSignedIn()) {
      const user = puter.auth.getUser();
      appState.signedIn = true;
      appState.user = user;
      return user;
    }
  } catch (e) {
    // ignored
  }
  appState.signedIn = false;
  appState.user = null;
  return null;
};
