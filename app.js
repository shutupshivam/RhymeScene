const title = document.getElementById("title");
const lyrics = document.getElementById("lyrics");
const analyzeBtn = document.getElementById("analyzeBtn");
const editToggle = document.getElementById("editToggle");
const categoriesEl = document.getElementById("categories");

const titlePh = document.getElementById("titlePh");
const lyricsPh = document.getElementById("lyricsPh");

/* placeholders */
function updatePlaceholders() {
  titlePh.style.display = title.textContent.trim() ? "none" : "block";
  lyricsPh.style.display = lyrics.textContent.trim() ? "none" : "block";
}
title.addEventListener("input", updatePlaceholders);
lyrics.addEventListener("input", updatePlaceholders);
updatePlaceholders();

/* enable analyze */
lyrics.addEventListener("input", () => {
  analyzeBtn.classList.toggle(
    "disabled",
    lyrics.textContent.trim().length === 0
  );
});

/* GPT-5.2 */
async function analyzeLyrics(text) {
  const prompt = `
Return ONLY valid JSON with categories:
Word, Rhyme, Flow, Emotion, Imagery, Cliche, Overview.
Short bullet points only.

Lyrics:
"""${text}"""
`;

  const res = await puter.ai.chat(prompt, {
    model: "gpt-5.2",
    temperature: 0.6
  });

  return JSON.parse(res);
}

/* analyze */
analyzeBtn.onclick = async () => {
  if (analyzeBtn.classList.contains("disabled")) return;

  analyzeBtn.textContent = "Analyzing…";
  analyzeBtn.disabled = true;

  title.contentEditable = false;
  lyrics.contentEditable = false;
  editToggle.classList.remove("hidden");

  categoriesEl.innerHTML = "";

  try {
    const data = await analyzeLyrics(lyrics.textContent.trim());

    Object.entries(data).forEach(([name, items]) => {
      const el = document.createElement("div");
      el.className = "category collapsed";

      el.innerHTML = `
        <div class="category-title">${name}</div>
        <div class="category-content">
          ${Array.isArray(items)
            ? items.map(i => `• ${i}`).join("<br>")
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
  } catch (err) {
    analyzeBtn.textContent = "Error";
    console.error(err);
  }
};

/* edit */
editToggle.onclick = () => {
  title.contentEditable = true;
  lyrics.contentEditable = true;
  editToggle.classList.add("hidden");
};
