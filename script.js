let records = [];
let selected = null;

const input = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const list = document.getElementById("suggestions-root");
const btn = document.getElementById("downloadBtn");

fetch("./map.json")
  .then(r => r.json())
  .then(d => {
    records = d;
    console.log("✅ records loaded:", records.length);
  });

function normalize(v) {
  return v.toLowerCase()
    .replace(/\b(mr|mrs|ms|miss|dr|prof)\b\.?/g,"")
    .replace(/[^a-z\s]/g,"")
    .replace(/\s+/g," ")
    .trim();
}

input.addEventListener("input", () => {
  list.innerHTML = "";
  selected = null;
  btn.disabled = true;

  const val = input.value;
  if (val.length < 4) return;

  const q = normalize(val);

  const matches = records.filter(r =>
    normalize(r.name).includes(q)
  ).slice(0,6);

  console.log("🔍 matches:", matches.length);

  if (!matches.length) return;

  const rect = input.getBoundingClientRect();
  list.style.top = rect.bottom + window.scrollY + "px";
  list.style.left = rect.left + "px";

  matches.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r.name;
    li.onclick = () => {
      input.value = r.name;
      list.innerHTML = "";
      selected = r;
      btn.disabled = false;
    };
    list.appendChild(li);
  });
});

emailInput.addEventListener("input", () => {
  emailInput.value = emailInput.value.toLowerCase().trim();
  btn.disabled = false;
});

btn.addEventListener("click", () => {
  if (!selected) {
    const email = emailInput.value;
    const match = records.find(r => r.normalized_email2 === email);
    if (!match) {
      alert("Email not found");
      return;
    }
    selected = match;
  }

  window.location.href =
    `https://payveo.in/api/download.php?uid=${selected.userid}`;
});
