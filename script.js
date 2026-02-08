const signinBtn = document.getElementById("signinBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");
const lyricsEl = document.getElementById("lyrics");

// Update UI based on auth state
function updateUI() {
  const user = checkAuthState();

  if (user) {
    statusEl.textContent =
      `Signed in as ${user.email || user.username || "user"}`;
    signinBtn.disabled = true;
    analyzeBtn.disabled = false;
  } else {
    statusEl.textContent = "Not signed in.";
    signinBtn.disabled = false;
    analyzeBtn.disabled = true;
  }
}

// Explicit sign-in (must be user-triggered)
signinBtn.onclick = async () => {
  statusEl.textContent = "Opening sign-in…";
  outputEl.textContent = "";

  try {
    await puter.auth.signIn({
      attempt_temp_user_creation: true
    });
  } catch (err) {
    statusEl.textContent = "Sign-in failed or blocked.";
    return;
  }

  // Give SDK a moment, then check auth
  setTimeout(() => {
    const user = checkAuthState();
    if (user) {
      updateUI();
    } else {
      statusEl.textContent =
        "Sign-in not detected. Try again.";
    }
  }, 500);
};

// AI analysis
analyzeBtn.onclick = async () => {
  if (!appState.signedIn) {
    statusEl.textContent = "Please sign in first.";
    return;
  }

  const lyrics = lyricsEl.value.trim();
  if (!lyrics) return;

  outputEl.textContent = "Analyzing…";

  try {
    const res = await puter.ai.chat(
      `You are a songwriting assistant.
Analyze the lyrics and suggest improvements.

Lyrics:
${lyrics}`,
      { model: "gpt-5-nano" }
    );

    outputEl.textContent = res;
  } catch (err) {
    outputEl.textContent = "AI request failed.";
  }
};

// Initial auth check on load
updateUI();
