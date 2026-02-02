let records = [];
let selected = null;

fetch("./map.json")
  .then(r => r.json())
  .then(d => records = d);

function normalizeName(v) {
  return v.toLowerCase()
    .replace(/\b(mr|mrs|ms|miss|dr|prof)\b\.?/g,"")
    .replace(/\s+/g," ")
    .trim();
}

function normalizeEmailInput() {
  const el = document.getElementById("emailInput");
  el.value = el.value.toLowerCase().trim();
  selected = null;
  document.getElementById("downloadBtn").disabled = false;
}

function showNameSuggestions() {
  const input = document.getElementById("nameInput").value;
  const list = document.getElementById("nameSuggestions");
  list.innerHTML = "";
  selected = null;
  document.getElementById("downloadBtn").disabled = true;

  if (input.length < 5) return;

  const q = normalizeName(input);

  records
    .filter(r => r.normalized_name.includes(q))
    .slice(0, 6)
    .forEach(r => {
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

function downloadCertificate() {
  if (!selected) {
    const email = document.getElementById("emailInput").value;
    if (!email) {
      alert("Select your name or enter registered email");
      return;
    }

    const match = records.find(
      r => r.normalized_email2 === email
    );

    if (!match) {
      alert("Email not found");
      return;
    }

    selected = match;
  }

  window.location.href =
    `https://payveo.in/api/download.php?uid=${selected.userid}`;
}
