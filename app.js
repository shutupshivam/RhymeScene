const title = document.getElementById("title");
const lyrics = document.getElementById("lyrics");

const titlePh = document.getElementById("titlePlaceholder");
const lyricsPh = document.getElementById("lyricsPlaceholder");

const analyzeBtn = document.getElementById("analyzeBtn");
const editToggle = document.getElementById("editToggle");

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");

const themeSelect = document.getElementById("themeSelect");
const fontSize = document.getElementById("fontSize");
const lineHeight = document.getElementById("lineHeight");

/* PLACEHOLDERS */
function updatePlaceholders() {
  titlePh.style.display = title.textContent.trim() ? "none" : "block";
  lyricsPh.style.display = lyrics.textContent.trim() ? "none" : "block";
}
title.addEventListener("input", updatePlaceholders);
lyrics.addEventListener("input", updatePlaceholders);
updatePlaceholders();

/* ANALYZE ENABLE */
function updateAnalyze() {
  const hasText = lyrics.textContent.trim().length > 0;
  analyzeBtn.classList.toggle("disabled", !hasText);
}
lyrics.addEventListener("input", updateAnalyze);
updateAnalyze();

/* ANALYZE */
analyzeBtn.onclick = () => {
  if (analyzeBtn.classList.contains("disabled")) return;

  state.locked = true;
  title.contentEditable = false;
  lyrics.contentEditable = false;

  editToggle.classList.remove("hidden");
};

/* EDIT */
editToggle.onclick = () => {
  state.locked = false;
  title.contentEditable = true;
  lyrics.contentEditable = true;

  editToggle.classList.add("hidden");
};

/* SETTINGS */
settingsBtn.onclick = () => {
  settingsPanel.style.display =
    settingsPanel.style.display === "block" ? "none" : "block";
};

themeSelect.value = state.theme;
themeSelect.onchange = e => {
  state.theme = e.target.value;
  document.body.className = state.theme;
  localStorage.setItem("theme", state.theme);
};

fontSize.oninput = e => {
  lyrics.style.fontSize = e.target.value + "px";
};

lineHeight.oninput = e => {
  lyrics.style.lineHeight = e.target.value;
};

/* KEYBOARD */
document.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    analyzeBtn.click();
  }
  if (e.key === "Escape") {
    editToggle.click();
  }
});
