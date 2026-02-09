const lyricsEl = document.getElementById("lyrics");
const analyzeBtn = document.getElementById("analyzeBtn");
const lockBtn = document.getElementById("lockBtn");
const linePanel = document.getElementById("linePanel");
const linePanelContent = document.getElementById("linePanelContent");
const analysisPanel = document.getElementById("analysisPanel");
const resizeHandle = document.getElementById("resizeHandle");

/* ENABLE ANALYZE */
lyricsEl.addEventListener("input", () => {
  analyzeBtn.classList.remove("disabled");
});

/* ANALYZE */
analyzeBtn.onclick = () => {
  if (analyzeBtn.classList.contains("disabled")) return;

  lockLyrics();
  analyzeBtn.textContent = "Analyzed";
  lockBtn.classList.remove("hidden");
};

/* LOCK / EDIT */
lockBtn.onclick = () => {
  if (state.locked) unlockLyrics();
  else lockLyrics();
};

function lockLyrics() {
  state.locked = true;
  lyricsEl.contentEditable = false;
  lockBtn.textContent = "Edit";
  wrapLines();
}

function unlockLyrics() {
  state.locked = false;
  lyricsEl.contentEditable = true;
  lockBtn.textContent = "Lock";
  unwrapLines();
}

/* LINE WRAP */
function wrapLines() {
  const lines = lyricsEl.innerText.split("\n");
  lyricsEl.innerHTML = lines.map(l =>
    `<span>${l || "&nbsp;"}</span>`
  ).join("");
  lyricsEl.classList.add("locked");

  lyricsEl.querySelectorAll("span").forEach(span => {
    span.onmouseenter = () => {
      span.innerHTML += `<small> Replace · Explain</small>`;
    };
    span.onclick = () => showLineExplanation(span.innerText);
  });
}

function unwrapLines() {
  lyricsEl.innerText = lyricsEl.innerText;
  lyricsEl.classList.remove("locked");
}

/* LINE EXPLANATION */
function showLineExplanation(line) {
  linePanel.classList.remove("hidden");
  linePanelContent.innerHTML = `
    <b>${line}</b>
    <p>This line expresses emotion or imagery related to the song’s theme.</p>
  `;
}

/* RESIZE PANEL */
resizeHandle.onmousedown = e => {
  document.onmousemove = e => {
    const newWidth = window.innerWidth - e.clientX;
    analysisPanel.style.width = `${newWidth}px`;
  };
  document.onmouseup = () => {
    document.onmousemove = null;
  };
};
