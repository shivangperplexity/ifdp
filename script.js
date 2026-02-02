let records = [];
let selected = null;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("./map.json");
    records = await res.json();
    console.log("✅ map.json loaded:", records.length);
  } catch (e) {
    alert("❌ map.json failed to load");
  }

  document.getElementById("nameInput").addEventListener("input", showSuggestions);
  document.getElementById("emailInput").addEventListener("input", handleEmail);
  document.getElementById("downloadBtn").addEventListener("click", download);
});

function normalize(v) {
  return v
    .toLowerCase()
    .replace(/\b(mr|mrs|ms|miss|dr|prof)\b\.?/g, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function showSuggestions() {
  const input = document.getElementById("nameInput").value;
  const list = document.getElementById("nameSuggestions");
  list.innerHTML = "";
  selected = null;
  document.getElementById("downloadBtn").disabled = true;

  if (input.length < 4) return;

  const q = normalize(input);

  let matches = records.filter(r =>
    normalize(r.name).includes(q)
  );

  console.log("🔍 Matches:", matches.length);

  matches.slice(0, 6).forEach(r => {
    const li = document.createElement("li");
    li.textContent = r.name;
    li.onclick = () => {
      selected = r;
      document.getElementById("nameInput").value = r.name;
      list.innerHTML = "";
      document.getElementById("downloadBtn").disabled = false;
    };
    list.appendChild(li);
  });
}

function handleEmail() {
  const el = document.getElementById("emailInput");
  el.value = el.value.toLowerCase().trim();
  selected = null;
  document.getElementById("downloadBtn").disabled = false;
}

function download() {
  if (!selected) {
    const email = document.getElementById("emailInput").value;
    const match = records.find(r => r.normalized_email2 === email);
    if (!match) {
      alert("Email not found");
      return;
    }
    selected = match;
  }

  window.location.href =
    `https://payveo.in/api/download.php?uid=${selected.userid}`;
}
