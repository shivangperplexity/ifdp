let records = [];
let selectedRecord = null;

fetch("map.json")
  .then(res => res.json())
  .then(data => records = data);

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\b(mr|mrs|ms|miss|dr|prof)\b\.?/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function showSuggestions() {
  const input = document.getElementById("nameInput").value;
  const list = document.getElementById("suggestions");
  list.innerHTML = "";
  selectedRecord = null;
  document.getElementById("downloadBtn").disabled = true;

  const q = normalizeName(input);
  if (!q) return;

  const matches = records
    .filter(r => r.normalized.includes(q))
    .slice(0, 6);

  matches.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r.name;
    li.onclick = () => selectSuggestion(r);
    list.appendChild(li);
  });
}

function selectSuggestion(record) {
  document.getElementById("nameInput").value = record.name;
  document.getElementById("suggestions").innerHTML = "";
  selectedRecord = record;
  document.getElementById("downloadBtn").disabled = false;
}

function downloadCertificate() {
  if (!selectedRecord) {
    alert("Please select your name from the list.");
    return;
  }

  window.location.href =
    `https://payveo.in/api/download.php?uid=${selectedRecord.userid}`;
}
