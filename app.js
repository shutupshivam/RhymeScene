const title = document.getElementById("title");
const lyrics = document.getElementById("lyrics");
const titlePh = document.getElementById("titlePh");
const lyricsPh = document.getElementById("lyricsPh");

const analyzeBtn = document.getElementById("analyzeBtn");
const lockBtn = document.getElementById("lockBtn");
const resizeHandle = document.getElementById("resizeHandle");
const analysisPanel = document.getElementById("analysisPanel");

const lineIsland = document.getElementById("lineIsland");
const lineOutput = document.getElementById("lineOutput");
const explainBtn = document.getElementById("explainLine");
const replaceBtn = document.getElementById("replaceLine");

/* PLACEHOLDERS */
function updatePlaceholders() {
  titlePh.style.display = title.textContent.trim() ? "none" : "block";
  lyricsPh.style.display = lyrics.textContent.trim() ? "none" : "block";
}
title.addEventListener("input", updatePlaceholders);
lyrics.addEventListener("input", updatePlaceholders);
updatePlaceholders();

/* ANALYZE ENABLE */
lyrics.addEventListener("input", () => {
  analyzeBtn.classList.remove("disabled");
  if (state.locked) unlockLyrics();
});

/* ANALYZE */
analyzeBtn.onclick = async () => {
  if (analyzeBtn.classList.contains("disabled")) return;

  analyzeBtn.textContent = "Analyzing…";
  lockLyrics();

  try {
    await puter.ai.chat("Analyze the lyrics briefly", {
      model: "gpt-5.2"
    });
  } catch {}

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
  bindLineClicks();
}

function unlockLyrics() {
  state.locked = false;
  lyrics.contentEditable = true;
  lockBtn.textContent = "Lock";
  lineIsland.classList.add("hidden");
  lineOutput.classList.add("hidden");
}

/* LINE SELECTION */
function bindLineClicks() {
  const lines = lyrics.innerText.split("\n");
  lyrics.innerHTML = lines.map(l => `<div class="line">${l}</div>`).join("");

  lyrics.querySelectorAll(".line").forEach(line => {
    line.onclick = () => {
      state.selectedLine = line.innerText;
      lineIsland.classList.remove("hidden");
    };
  });
}

/* LINE ACTIONS */
explainBtn.onclick = async () => {
  lineOutput.classList.remove("hidden");
  const res = await puter.ai.chat(
    `Explain this line briefly: "${state.selectedLine}"`,
    { model: "gpt-5.2" }
  );
  lineOutput.innerHTML = `<b>${state.selectedLine}</b><br>${res}`;
};

replaceBtn.onclick = async () => {
  lineOutput.classList.remove("hidden");
  const res = await puter.ai.chat(
    `Suggest 3 better replacements for this line: "${state.selectedLine}"`,
    { model: "gpt-5.2" }
  );
  lineOutput.innerHTML = `<b>Replacements</b><br>${res}`;
};

/* RESIZE PANEL */
resizeHandle.onmousedown = () => {
  document.onmousemove = e => {
    const newWidth = window.innerWidth - e.clientX;
    analysisPanel.style.width =
      Math.max(280, Math.min(520, newWidth)) + "px";
  };
  document.onmouseup = () => {
    document.onmousemove = null;
  };
};
