window.appState = {
  signedIn: false
};

window.checkAuth = () => {
  try {
    return puter.auth.isSignedIn();
  } catch {
    return false;
  }
};
