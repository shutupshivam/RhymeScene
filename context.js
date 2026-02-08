window.state = {
  locked: false,
  theme: localStorage.getItem("theme") || "dark"
};

document.body.className = state.theme;
