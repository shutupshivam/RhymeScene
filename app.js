const lyricsEl = document.getElementById("lyrics");
const actionBtn = document.getElementById("actionBtn");
const panelContent = document.getElementById("panelContent");
const resizeHandle = document.getElementById("resizeHandle");
const panel = document.querySelector(".analysis-panel");
const lyricsArea = document.querySelector(".lyrics-area");

let analyzed = false;
let locked = false;
let currentLine = "";

/* Enable analyze */
lyricsEl.addEventListener("input", () => {
  actionBtn.classList.toggle("disabled", !lyricsEl.textContent.trim());
  if (analyzed) resetAnalyze();
});

/* Button logic */
actionBtn.onclick = async () => {
  if (actionBtn.classList.contains("disabled")) return;

  if (!analyzed) {
    await analyzeSong();
  } else if (locked) {
    unlockLyrics();
  } else {
    lockLyrics();
  }
};

/* Analyze */
async function analyzeSong() {
  analyzed = true;
  lockLyrics();
  actionBtn.textContent = "Edit";
}

/* Lock */
function lockLyrics() {
  locked = true;
  actionBtn.textContent = "Edit";
  lyricsEl.contentEditable = false;
  renderLines();
}

/* Unlock */
function unlockLyrics() {
  locked = false;
  actionBtn.textContent = "Lock";
  lyricsEl.contentEditable = true;
  unwrapLines();
}

/* Reset */
function resetAnalyze() {
  analyzed = false;
  locked = false;
  actionBtn.textContent = "Analyze";
  panelContent.innerHTML = `<div class="empty-state">Select a line…</div>`;
}

/* Render lines */
function renderLines() {
  const lines = lyricsEl.innerText.split("\n");
  lyricsEl.innerHTML = lines.map(line =>
    `<div class="line locked">
      ${line}
      <span class="line-actions">
        <span data-act="replace">Replace</span>
        <span data-act="explain">Explain</span>
      </span>
    </div>`
  ).join("");
}

/* Unwrap */
function unwrapLines() {
  lyricsEl.innerText = Array.from(lyricsEl.querySelectorAll(".line"))
    .map(l => l.innerText.replace("ReplaceExplain", "").trim())
    .join("\n");
}

/* Line click */
lyricsEl.addEventListener("click", async e => {
  if (!locked) return;

  const lineEl = e.target.closest(".line");
  if (!lineEl) return;

  const line = lineEl.childNodes[0].textContent.trim();
  currentLine = line;

  if (e.target.dataset.act === "replace") {
    showReplace(line);
  } else {
    showExplain(line);
  }
});

/* Explain */
async function showExplain(line) {
  panelContent.innerHTML = `<b>Line explanation</b><br><br>${line}<br><br>Loading…`;

  const res = await puter.ai.chat(
    `Explain this song line briefly:\n"${line}"`,
    { model: "gpt-5.2", temperature: 0.4 }
  );

  panelContent.innerHTML = `<b>Explanation</b><br><br>${res}`;
}

/* Replace */
async function showReplace(line) {
  panelContent.innerHTML = `<b>Replace line</b><br><br>Loading…`;

  const res = await puter.ai.chat(
    `Suggest 5 alternative lines keeping rhyme, rhythm and meaning:\n"${line}"`,
    { model: "gpt-5.2", temperature: 0.7 }
  );

  panelContent.innerHTML =
    `<b>Suggestions</b><br><br>` +
    res.split("\n").map(l => `• ${l}`).join("<br>");
}

/* Resize logic */
let resizing = false;

resizeHandle.onmousedown = () => {
  resizing = true;
  document.body.style.cursor = "ew-resize";
};

document.onmouseup = () => {
  resizing = false;
  document.body.style.cursor = "default";
};

document.onmousemove = e => {
  if (!resizing) return;
  const w = Math.min(Math.max(window.innerWidth - e.clientX, 280), 520);
  panel.style.width = w + "px";
  lyricsArea.style.marginRight = w + "px";
};
