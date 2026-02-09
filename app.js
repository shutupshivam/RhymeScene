const lyrics = document.getElementById("lyrics");
const analyzeBtn = document.getElementById("analyzeBtn");
const lockToggle = document.getElementById("lockToggle");
const categoriesEl = document.getElementById("categories");
const resizeHandle = document.getElementById("resizeHandle");
const analysisPanel = document.querySelector(".analysis-panel");

const lineInspector = document.getElementById("lineInspector");
const lineInspectorContent = document.getElementById("lineInspectorContent");

/* ENABLE ANALYZE */
lyrics.addEventListener("input", () => {
  analyzeBtn.classList.toggle("disabled", lyrics.innerText.trim() === "");
  if (state.analyzed) {
    analyzeBtn.textContent = "Analyze";
    state.analyzed = false;
  }
});

/* ANALYZE */
analyzeBtn.onclick = async () => {
  if (analyzeBtn.classList.contains("disabled")) return;

  analyzeBtn.textContent = "Analyzing…";
  state.analyzed = true;

  lockLyrics(true);
  renderCategories({
    Overview: ["Structure is balanced", "Hook is emotionally strong"],
    Flow: ["Line 3 slightly longer"],
    Emotion: ["Reflective, longing tone"]
  });

  analyzeBtn.textContent = "Analyzed";
};

/* LOCK / EDIT */
function lockLyrics(lock) {
  state.locked = lock;
  lyrics.contentEditable = !lock;
  lyrics.classList.toggle("locked", lock);
  lockToggle.textContent = lock ? "Edit" : "Lock";
  lockToggle.classList.remove("hidden");
  if (lock) prepareLines();
}

lockToggle.onclick = () => lockLyrics(!state.locked);

/* LINE PREP */
function prepareLines() {
  const lines = lyrics.innerText.split("\n");
  lyrics.innerHTML = lines.map(line => `
    <div>
      ${line || "&nbsp;"}
      <span class="line-actions">
        <button onclick="explainLine(this)">Explain</button>
        <button onclick="replaceLine(this)">Replace</button>
      </span>
    </div>
  `).join("");
}

/* LINE ACTIONS */
window.explainLine = btn => {
  const line = btn.parentElement.parentElement.innerText;
  lineInspector.classList.remove("hidden");
  lineInspectorContent.innerText = `Explanation for: "${line}"`;
};

window.replaceLine = btn => {
  const line = btn.parentElement.parentElement.innerText;
  lineInspector.classList.remove("hidden");
  lineInspectorContent.innerText = `Replacement suggestions for: "${line}"`;
};

/* RESIZE PANEL */
let resizing = false;
resizeHandle.onmousedown = () => resizing = true;
document.onmouseup = () => resizing = false;
document.onmousemove = e => {
  if (!resizing) return;
  const width = window.innerWidth - e.clientX;
  analysisPanel.style.width = width + "px";
};

/* CATEGORIES */
function renderCategories(data) {
  categoriesEl.innerHTML = "";
  Object.entries(data).forEach(([name, items]) => {
    const el = document.createElement("div");
    el.className = "category";
    el.innerHTML = `
      <div class="category-title">${name}</div>
      <div class="category-content">${items.join("<br>")}</div>
    `;
    el.onclick = () => el.classList.toggle("expanded");
    categoriesEl.appendChild(el);
  });
}
