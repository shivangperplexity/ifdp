// Developer credit (console only)
console.log(
  "%cDeveloped by Shivang Gupta\nContact: shivangperplexity@gmail.com",
  "color:#2563eb;font-size:14px;font-weight:bold;"
);

let records = [];
let selected = null;

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const list = document.getElementById("suggestions-root");
const btn = document.getElementById("downloadBtn");

fetch("./map.json")
  .then(r => r.json())
  .then(d => records = d);

function normalize(v) {
  return v.toLowerCase()
    .replace(/\b(mr|mrs|ms|miss|dr|prof)\b\.?/g,"")
    .replace(/[^a-z\s]/g,"")
    .replace(/\s+/g," ")
    .trim();
}

nameInput.addEventListener("input", () => {
  list.innerHTML = "";
  selected = null;
  btn.disabled = true;

  const val = nameInput.value;
  if (val.length < 4) return;

  const q = normalize(val);

  const matches = records
    .filter(r => r.search_key.includes(q))
    .slice(0, 6);

  if (!matches.length) return;

  const rect = nameInput.getBoundingClientRect();
  list.style.top = rect.bottom + window.scrollY + "px";
  list.style.left = rect.left + "px";

  matches.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r.name;
    li.onclick = () => {
      nameInput.value = r.name;
      list.innerHTML = "";
      selected = r;
      btn.disabled = false;
    };
    list.appendChild(li);
  });
});

emailInput.addEventListener("input", () => {
  emailInput.value = emailInput.value.toLowerCase().trim();
  selected = null;
  btn.disabled = false;
});

btn.addEventListener("click", () => {
  if (!selected) {
    const email = emailInput.value;
    const match = records.find(r => r.normalized_email2 === email);
    if (!match) {
      alert("Details not found. Please check and try again.");
      return;
    }
    selected = match;
  }

  window.location.href =
    `https://payveo.in/api/download.php?uid=${selected.userid}`;
});
