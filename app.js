const title = document.getElementById("title");
const lyrics = document.getElementById("lyrics");
const titlePh = document.getElementById("titlePh");
const lyricsPh = document.getElementById("lyricsPh");

const analyzeBtn = document.getElementById("analyzeBtn");
const lockBtn = document.getElementById("lockBtn");
const feedbackBtn = document.getElementById("feedbackBtn");

const feedbackSection = document.getElementById("feedbackSection");
const categories = document.getElementById("categoriesSection");

let analyzed = false;

/* placeholders */
function updatePH() {
  titlePh.style.display = title.textContent.trim() ? "none" : "block";
  lyricsPh.style.display = lyrics.textContent.trim() ? "none" : "block";
}
title.addEventListener("input", updatePH);
lyrics.addEventListener("input", updatePH);
updatePH();

/* analyze enable */
lyrics.addEventListener("input", () => {
  analyzeBtn.classList.remove("dim");
  if (analyzed) reset();
});

/* analyze */
analyzeBtn.onclick = async () => {
  if (lyrics.textContent.trim() === "") return;

  analyzeBtn.textContent = "Analyzing…";
  analyzeBtn.classList.add("active");
  analyzeBtn.classList.remove("dim");

  lyrics.contentEditable = false;
  lockBtn.classList.remove("hidden");

  const prompt = `
Return STRICT JSON:
{
 feedback:{rating,verdict,industry,highlights[],weaknesses[],direction},
 word:{word:[alts]},
 rhyme:{word:[alts], insight},
 flow:[],
 imagery:[],
 cliche:[],
 emotion:[],
 refinement:[]
}
Lyrics:
"""${lyrics.textContent}"""
`;

  const res = await puter.ai.chat(prompt,{ model:"gpt-5.2" });
  const data = JSON.parse(res);

  renderFeedback(data.feedback);
  renderCategory(0,data.word);
  renderCategory(1,data.rhyme.word);
  renderCategory(2,data.flow);
  renderCategory(3,data.imagery);
  renderCategory(4,data.cliche);
  renderCategory(5,data.emotion);
  renderCategory(6,data.refinement);

  categories.classList.remove("hidden");
  feedbackBtn.classList.remove("dim");
  analyzeBtn.textContent = "Analyzed";
  analyzed = true;
};

/* feedback toggle */
feedbackBtn.onclick = () => {
  const open = feedbackBtn.classList.toggle("active");
  feedbackBtn.classList.toggle("dim",!open);
  feedbackSection.classList.toggle("hidden",!open);
  categories.style.display = open ? "none":"block";
};

/* categories toggle */
document.querySelectorAll(".category-title").forEach(t=>{
  t.onclick=()=>t.parentElement.classList.toggle("open");
});

/* helpers */
function renderFeedback(f){
  feedbackSection.innerHTML = `
<b>Rating:</b> ${f.rating}/10<br><br>
<b>Verdict:</b><br>${f.verdict}<br><br>
<b>Industry:</b> ${f.industry}<br><br>
<b>Highlights:</b><br>${f.highlights.map(x=>"• "+x).join("<br>")}<br><br>
<b>Weak Points:</b><br>${f.weaknesses.map(x=>"• "+x).join("<br>")}<br><br>
<b>Direction:</b><br>${f.direction}
`;
}

function renderCategory(i,obj){
  const el=document.querySelectorAll(".category-content")[i];
  el.innerHTML=Object.entries(obj).map(
    ([k,v])=>`<div>${k} ${v.map(x=>`<span class="pill">${x}</span>`).join("")}</div>`
  ).join("");
}

function reset(){
  analyzed=false;
  analyzeBtn.textContent="Analyze";
  analyzeBtn.classList.remove("active");
  analyzeBtn.classList.add("dim");
}
