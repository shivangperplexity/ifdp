let records = [];

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

function downloadCertificate() {
  const input = document.getElementById("nameInput").value;
  const normalized = normalizeName(input);

  const match = records.find(r => r.normalized === normalized);

  if (!match) {
    alert("Certificate not found. Please check spelling.");
    return;
  }

  window.location.href =
    `https://payveo.com/api/download.php?uid=${match.userid}`;
}
