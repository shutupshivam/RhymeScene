const title = document.getElementById("title");
const lyrics = document.getElementById("lyrics");
const analyzeBtn = document.getElementById("analyzeBtn");
const editToggle = document.getElementById("editToggle");
const categoriesEl = document.getElementById("categories");

const titlePh = document.getElementById("titlePlaceholder");
const lyricsPh = document.getElementById("lyricsPlaceholder");

/* PLACEHOLDERS */
function updatePlaceholders() {
  titlePh.style.display = title.textContent.trim() ? "none" : "block";
  lyricsPh.style.display = lyrics.textContent.trim() ? "none" : "block";
}
title.addEventListener("input", updatePlaceholders);
lyrics.addEventListener("input", updatePlaceholders);
updatePlaceholders();

/* ENABLE ANALYZE */
lyrics.addEventListener("input", () => {
  analyzeBtn.classList.toggle(
    "disabled",
    lyrics.textContent.trim().length === 0
  );
});

/* GPT-5.2 ANALYSIS */
async function runAIAnalysis(text) {
  const prompt = `
Analyze the song lyrics below and return ONLY valid JSON.

Categories:
Word, Rhyme, Flow, Emotion, Imagery, Cliché, Overview

Rules:
- Each category must exist
- Short, useful bullet points
- No long explanations

Lyrics:
"""${text}"""
`;

  const res = await puter.ai.chat(prompt, {
    model: "gpt-5.2",
    temperature: 0.6
  });

  return JSON.parse(res);
}

/* ANALYZE */
analyzeBtn.onclick = async () => {
  if (analyzeBtn.classList.contains("disabled")) return;

  analyzeBtn.textContent = "Analyzing…";
  analyzeBtn.disabled = true;

  title.contentEditable = false;
  lyrics.contentEditable = false;
  editToggle.classList.remove("hidden");

  categoriesEl.innerHTML = "";

  try {
    const data = await runAIAnalysis(lyrics.textContent.trim());

    Object.entries(data).forEach(([name, items]) => {
      const el = document.createElement("div");
      el.className = "category collapsed";

      el.innerHTML = `
        <div class="category-title">${name}</div>
        <div class="category-content">
          ${Array.isArray(items)
            ? items.map(i => `<div>• ${i}</div>`).join("")
            : items}
        </div>
      `;

      el.onclick = () => {
        el.classList.toggle("expanded");
        el.classList.toggle("collapsed");
      };

      categoriesEl.appendChild(el);
    });

    analyzeBtn.textContent = "Analyzed";
  } catch (e) {
    analyzeBtn.textContent = "Analyze failed";
    console.error(e);
  }
};

/* EDIT */
editToggle.onclick = () => {
  title.contentEditable = true;
  lyrics.contentEditable = true;
  editToggle.classList.add("hidden");
};
