const title = document.getElementById("title");
const lyrics = document.getElementById("lyrics");
const titlePh = document.getElementById("titlePh");
const lyricsPh = document.getElementById("lyricsPh");

const analyzeBtn = document.getElementById("analyzeBtn");
const lockBtn = document.getElementById("lockBtn");

const feedbackBtn = document.getElementById("feedbackBtn");
const feedbackSection = document.getElementById("feedbackSection");
const categoriesSection = document.getElementById("categoriesSection");

let analyzed = false;

/* placeholders */
function updatePH() {
  titlePh.style.display = title.textContent.trim() ? "none" : "block";
  lyricsPh.style.display = lyrics.textContent.trim() ? "none" : "block";
}
title.addEventListener("input", updatePH);
lyrics.addEventListener("input", updatePH);
updatePH();

/* enable analyze */
lyrics.addEventListener("input", () => {
  analyzeBtn.classList.remove("disabled");
  analyzeBtn.classList.add("glow-idle");
  if (analyzed) resetAnalysis();
});

/* analyze */
analyzeBtn.onclick = async () => {
  if (analyzeBtn.classList.contains("disabled")) return;

  analyzeBtn.textContent = "Analyzing…";
  analyzeBtn.classList.remove("glow-idle");
  analyzeBtn.classList.add("analyzing");

  lockLyrics();

  const prompt = `
Return STRICT JSON:
{
 feedback:{rating,verdict,industry,highlights[],weaknesses[],direction},
 word[], rhyme[], flow[], imagery[]
}
Lyrics:
"""${lyrics.textContent}"""
`;

  const res = await puter.ai.chat(prompt, { model: "gpt-5.2" });
  const data = JSON.parse(res);

  renderFeedback(data.feedback);
  renderCategory("word", data.word);
  renderCategory("rhyme", data.rhyme);
  renderCategory("flow", data.flow);
  renderCategory("imagery", data.imagery);

  analyzeBtn.textContent = "Analyzed";
  analyzeBtn.classList.remove("analyzing");
  analyzed = true;
};

/* lock / edit */
function lockLyrics() {
  lyrics.contentEditable = false;
  lockBtn.textContent = "Edit";
  lockBtn.classList.remove("hidden");
}

lockBtn.onclick = () => {
  lyrics.contentEditable = true;
  lockBtn.classList.add("hidden");
};

/* reset */
function resetAnalysis() {
  analyzed = false;
  analyzeBtn.textContent = "Analyze";
  analyzeBtn.classList.add("glow-idle");
}

/* feedback toggle */
feedbackBtn.onclick = () => {
  const open = feedbackBtn.classList.toggle("active");
  feedbackSection.classList.toggle("hidden", !open);
  categoriesSection.style.display = open ? "none" : "block";
};

/* render */
function renderFeedback(f) {
  feedbackSection.innerHTML = `
<b>Rating:</b> ${f.rating}/10<br><br>
<b>Verdict:</b><br>${f.verdict}<br><br>
<b>Industry:</b> ${f.industry}<br><br>
<b>Highlights:</b><br>${f.highlights.map(l=>"• "+l).join("<br>")}<br><br>
<b>Weak Points:</b><br>${f.weaknesses.map(l=>"• "+l).join("<br>")}<br><br>
<b>Direction:</b><br>${f.direction}
`;
}

/* categories */
document.querySelectorAll(".category-title").forEach(t => {
  t.onclick = () => t.parentElement.classList.toggle("open");
});

function renderCategory(name, items) {
  const el = document.querySelector(`.category[data-cat="${name}"] .category-content`);
  el.innerHTML = items.map(i => `<span class="pill">${i}</span>`).join("");
}
