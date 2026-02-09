const title = document.getElementById("title");
const lyrics = document.getElementById("lyrics");
const titlePh = document.getElementById("titlePh");
const lyricsPh = document.getElementById("lyricsPh");

const analyzeBtn = document.getElementById("analyzeBtn");
const lockBtn = document.getElementById("lockBtn");
const resizeHandle = document.getElementById("resizeHandle");
const analysisPanel = document.getElementById("analysisPanel");

const lineIsland = document.getElementById("lineIsland");
const linePanel = document.getElementById("linePanel");
const explainBtn = document.getElementById("explainLine");
const replaceBtn = document.getElementById("replaceLine");

/* PLACEHOLDERS */
function updatePH() {
  titlePh.style.display = title.textContent.trim() ? "none" : "block";
  lyricsPh.style.display = lyrics.textContent.trim() ? "none" : "block";
}
title.addEventListener("input", updatePH);
lyrics.addEventListener("input", updatePH);
updatePH();

/* ENABLE ANALYZE */
lyrics.addEventListener("input", () => {
  analyzeBtn.classList.remove("disabled");
  if (state.locked) unlockLyrics();
});

/* ANALYZE */
analyzeBtn.onclick = async () => {
  if (analyzeBtn.classList.contains("disabled")) return;

  analyzeBtn.textContent = "Analyzing…";
  lockLyrics();

  await puter.ai.chat("Analyze these lyrics briefly", {
    model: "gpt-5.2"
  });

  analyzeBtn.textContent = "Analyzed";
};

/* LOCK / EDIT */
lockBtn.onclick = () => {
  state.locked ? unlockLyrics() : lockLyrics();
};

function lockLyrics() {
  state.locked = true;
  lyrics.contentEditable = false;
  lockBtn.textContent = "Edit";
  lockBtn.classList.remove("hidden");
  wrapLines();
}

function unlockLyrics() {
  state.locked = false;
  lyrics.contentEditable = true;
  lockBtn.textContent = "Lock";
  unwrapLines();
  lineIsland.classList.add("hidden");
  linePanel.classList.add("hidden");
}

/* LINE WRAP */
function wrapLines() {
  const lines = lyrics.innerText.split("\n");
  lyrics.innerHTML = lines.map(l =>
    `<span>${l || "&nbsp;"}</span>`
  ).join("");
  lyrics.classList.add("locked");

  lyrics.querySelectorAll("span").forEach(span => {
    span.onclick = () => {
      state.selectedLine = span.innerText;
      lineIsland.classList.remove("hidden");
    };
  });
}

function unwrapLines() {
  lyrics.innerText = lyrics.innerText;
  lyrics.classList.remove("locked");
}

/* LINE ACTIONS */
explainBtn.onclick = async () => {
  linePanel.classList.remove("hidden");
  const res = await puter.ai.chat(
    `Explain this line briefly: "${state.selectedLine}"`,
    { model: "gpt-5.2" }
  );
  linePanel.innerHTML = `<b>${state.selectedLine}</b><br>${res}`;
};

replaceBtn.onclick = async () => {
  linePanel.classList.remove("hidden");
  const res = await puter.ai.chat(
    `Suggest 3 replacements for this line preserving rhyme and flow: "${state.selectedLine}"`,
    { model: "gpt-5.2" }
  );
  linePanel.innerHTML = `<b>Replacements</b><br>${res}`;
};

/* RESIZE PANEL */
resizeHandle.onmousedown = e => {
  document.onmousemove = e => {
    const newW = window.innerWidth - e.clientX;
    analysisPanel.style.width = `${Math.min(520, Math.max(260, newW))}px`;
  };
  document.onmouseup = () => {
    document.onmousemove = null;
  };
};
