const title = document.getElementById("title");
const lyrics = document.getElementById("lyrics");
const analyzeBtn = document.getElementById("analyzeBtn");
const editToggle = document.getElementById("editToggle");
const categoriesEl = document.getElementById("categories");

const titlePh = document.getElementById("titlePh");
const lyricsPh = document.getElementById("lyricsPh");

let analyzed = false;

/* PLACEHOLDERS */
function updatePlaceholders() {
  titlePh.style.display = title.textContent.trim() ? "none" : "block";
  lyricsPh.style.display = lyrics.textContent.trim() ? "none" : "block";
}
title.addEventListener("input", updatePlaceholders);
lyrics.addEventListener("input", updatePlaceholders);
updatePlaceholders();

/* ENABLE / RESET ANALYZE */
lyrics.addEventListener("input", () => {
  analyzeBtn.classList.toggle(
    "disabled",
    lyrics.textContent.trim().length === 0
  );

  if (analyzed) {
    analyzeBtn.textContent = "Analyze";
    analyzeBtn.disabled = false;
    analyzed = false;
  }
});

/* GPT-5.2 */
async function runAI(lyricsText) {
  const prompt = `
Return ONLY valid JSON.

{
  "Word": [{ "target": "", "suggestions": [] }],
  "Rhyme": [{ "line": "", "suggestions": [] }],
  "Flow": [],
  "Emotion": [],
  "Imagery": [],
  "Cliché": [],
  "Overview": []
}

Rules:
- No explanations
- Suggestions only

Lyrics:
"""${lyricsText}"""
`;

  const res = await puter.ai.chat(prompt, {
    model: "gpt-5.2",
    temperature: 0.6
  });

  return JSON.parse(res);
}

/* RENDER */
function renderCategories(data) {
  categoriesEl.innerHTML = "";

  Object.entries(data).forEach(([name, content]) => {
    const el = document.createElement("div");
    el.className = "category";

    let html = "";

    if (name === "Word") {
      html = content.map(item =>
        `<div><b>${item.target}</b> ${
          item.suggestions.map(s => `<span class="chip">${s}</span>`).join("")
        }</div>`
      ).join("");
    } 
    else if (name === "Rhyme") {
      html = content.map(item =>
        `<div><i>${item.line}</i><br>${
          item.suggestions.map(s => `• ${s}`).join("<br>")
        }</div>`
      ).join("");
    } 
    else {
      html = content.map(i => `• ${i}`).join("<br>");
    }

    el.innerHTML = `
      <div class="category-title">${name}</div>
      <div class="category-content">${html}</div>
    `;

    el.onclick = () => el.classList.toggle("expanded");

    categoriesEl.appendChild(el);
  });
}

/* ANALYZE */
analyzeBtn.onclick = async () => {
  if (analyzeBtn.classList.contains("disabled")) return;

  analyzeBtn.textContent = "Analyzing…";
  analyzeBtn.disabled = true;
  analyzed = true;

  title.contentEditable = false;
  lyrics.contentEditable = false;
  editToggle.classList.remove("hidden");

  const data = await runAI(lyrics.textContent.trim());
  renderCategories(data);

  analyzeBtn.textContent = "Analyzed";
};

/* EDIT */
editToggle.onclick = () => {
  title.contentEditable = true;
  lyrics.contentEditable = true;
  editToggle.classList.add("hidden");
};
