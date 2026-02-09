const title = document.getElementById("title");
const lyrics = document.getElementById("lyrics");
const titlePh = document.getElementById("titlePh");
const lyricsPh = document.getElementById("lyricsPh");

const analyzeBtn = document.getElementById("analyzeBtn");
const lockBtn = document.getElementById("lockBtn");
const feedbackBtn = document.getElementById("feedbackBtn");

const feedbackSection = document.getElementById("feedbackSection");
const categories = document.getElementById("categoriesSection");

const panel = document.querySelector(".analysis-panel");
const handle = document.getElementById("resizeHandle");
const lyricsArea = document.querySelector(".lyrics-area");

let analyzed = false;

/* ---------------- PLACEHOLDERS ---------------- */
function updatePH() {
  titlePh.style.display = title.textContent.trim() ? "none" : "block";
  lyricsPh.style.display = lyrics.textContent.trim() ? "none" : "block";
}
title.addEventListener("input", updatePH);
lyrics.addEventListener("input", updatePH);
updatePH();

/* ---------------- ANALYZE ENABLE ---------------- */
lyrics.addEventListener("input", () => {
  analyzeBtn.classList.remove("dim");
  if (analyzed) resetAnalysis();
});

/* ---------------- ANALYZE ---------------- */
analyzeBtn.onclick = async () => {
  if (!lyrics.textContent.trim()) return;

  analyzeBtn.textContent = "Analyzing…";
  analyzeBtn.classList.add("active");
  analyzeBtn.classList.remove("dim");

  lyrics.contentEditable = false;
  lockBtn.classList.remove("hidden");

  const prompt = `
Return STRICT JSON ONLY.
No markdown. No commentary.

{
  feedback:{
    rating,
    verdict,
    industry,
    highlights[],
    weaknesses[],
    direction
  },
  word:{ word:[alts] },
  rhyme:{ word:[alts], insight },
  flow:{ line:[alts] },
  imagery:{ line:[alts] },
  cliche:{ phrase:[alts] },
  emotion:{ line:[alts] },
  refinement:[tips]
}

Lyrics:
"""${lyrics.textContent}"""
`;

  try {
    const res = await puter.ai.chat(prompt, { model: "gpt-5.2" });
    const data = JSON.parse(res);

    /* ---------- SAFE NORMALIZATION ---------- */
    const feedback   = data.feedback   || {};
    const word       = data.word       || {};
    const rhyme      = data.rhyme      || {};
    const flow       = data.flow       || {};
    const imagery    = data.imagery    || {};
    const cliche     = data.cliche     || {};
    const emotion    = data.emotion    || {};
    const refinement = data.refinement || [];

    renderFeedback(feedback);

    renderCategory(0, word, "Word replacements");
    renderCategory(1, rhyme.word || {}, rhyme.insight);
    renderCategory(2, flow, "Flow alternatives");
    renderCategory(3, imagery, "Imagery upgrades");
    renderCategory(4, cliche, "Cliché alternatives");
    renderCategory(5, emotion, "Emotional depth");
    renderListCategory(6, refinement);

    categories.classList.remove("hidden");
    feedbackBtn.classList.remove("dim");

    analyzeBtn.textContent = "Analyzed";
    analyzed = true;

  } catch (err) {
    console.error("AI error:", err);
    alert("Analysis failed. Try again.");

    resetAnalysis();
  }
};

/* ---------------- FEEDBACK TOGGLE ---------------- */
feedbackBtn.onclick = () => {
  const open = feedbackBtn.classList.toggle("active");
  feedbackBtn.classList.toggle("dim", !open);
  feedbackSection.classList.toggle("hidden", !open);
  categories.style.display = open ? "none" : "block";
};

/* ---------------- CATEGORY TOGGLE ---------------- */
document.querySelectorAll(".category-title").forEach(t => {
  t.onclick = () => t.parentElement.classList.toggle("open");
});

/* ---------------- RENDER HELPERS ---------------- */
function renderFeedback(f) {
  feedbackSection.innerHTML = `
    <b>Rating:</b> ${f.rating ?? "–"}/10<br><br>
    <b>Verdict:</b><br>${f.verdict ?? "No verdict yet."}<br><br>
    <b>Industry:</b> ${f.industry ?? "—"}<br><br>
    <b>Highlights:</b><br>${(f.highlights || []).map(x=>"• "+x).join("<br>") || "—"}<br><br>
    <b>Weak Points:</b><br>${(f.weaknesses || []).map(x=>"• "+x).join("<br>") || "—"}<br><br>
    <b>Direction:</b><br>${f.direction ?? "—"}
  `;
}

function renderCategory(index, obj, insight = "") {
  const el = document.querySelectorAll(".category-content")[index];

  if (!obj || Object.keys(obj).length === 0) {
    el.innerHTML = `<div class="muted">Suggestions will appear here</div>`;
    return;
  }

  el.innerHTML = Object.entries(obj).map(
    ([key, values]) =>
      `<div>
        <strong>${key}</strong>
        ${values.map(v => `<span class="pill">${v}</span>`).join("")}
      </div>`
  ).join("");

  if (insight) {
    el.innerHTML += `<div class="insight">${insight}</div>`;
  }
}

function renderListCategory(index, list) {
  const el = document.querySelectorAll(".category-content")[index];

  if (!list || list.length === 0) {
    el.innerHTML = `<div class="muted">Refinement tips will appear here</div>`;
    return;
  }

  el.innerHTML = list.map(x => `• ${x}`).join("<br>");
}

/* ---------------- RESET ---------------- */
function resetAnalysis() {
  analyzed = false;
  analyzeBtn.textContent = "Analyze";
  analyzeBtn.classList.remove("active");
  analyzeBtn.classList.add("dim");
}

/* ---------------- RESIZE PANEL ---------------- */
if (handle) {
  handle.addEventListener("mousedown", () => {
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  });
}

function resize(e) {
  const newWidth = window.innerWidth - e.clientX;
  if (newWidth < 300 || newWidth > 520) return;

  panel.style.width = newWidth + "px";
  lyricsArea.style.marginRight = newWidth + "px";
  handle.style.right = newWidth + "px";
}

function stopResize() {
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
}
