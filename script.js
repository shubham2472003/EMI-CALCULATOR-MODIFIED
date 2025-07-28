const text = "💰 EMI Calculator";
let idx = 0;
function typeText() {
  const el = document.getElementById("typed-text");
  if (idx < text.length) {
    el.textContent += text.charAt(idx);
    idx++;
    setTimeout(typeText, 100);
  }
}
document.addEventListener("DOMContentLoaded", typeText);

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

let chart;
document.getElementById("calculateBtn").addEventListener("click", calculateEMI);
function calculateEMI() {
  const amount = parseFloat(document.getElementById("loanAmount").value);
  const term = parseFloat(document.getElementById("loanTerm").value);
  const rate = parseFloat(document.getElementById("interestRate").value);
  if (!amount || !term || !rate || amount <= 0 || term <= 0 || rate <= 0) {
    showToast("⚠️ Enter valid positive values!");
    return;
  }
  const monthly = rate / (12 * 100);
  const emi =
    (amount * monthly * Math.pow(1 + monthly, term)) /
    (Math.pow(1 + monthly, term) - 1);
  const total = emi * term;
  const interest = total - amount;
  document.getElementById("result").innerHTML = `📌 EMI: ₹${emi.toFixed(
    2
  )}<br>💸 Interest: ₹${interest.toFixed(2)}<br>💼 Total: ₹${total.toFixed(2)}`;

  const ctx = document.getElementById("emiChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Principal", "Interest"],
      datasets: [
        { data: [amount, interest], backgroundColor: ["#4caf50", "#ff9800"] },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          labels: {
            color: document.body.classList.contains("dark") ? "#eee" : "#222",
          },
        },
      },
    },
  });
}

document.getElementById("downloadPDF").addEventListener("click", () => {
  const result = document.getElementById("result");
  if (!result.textContent.trim()) {
    showToast("📌 Calculate first!");
    return;
  }
  const div = document.createElement("div");
  div.innerHTML = `<h3>EMI Report</h3>${result.innerHTML}`;
  html2pdf()
    .set({
      margin: 0.5,
      filename: "emi-report.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4" },
    })
    .from(div)
    .save();
});

setInterval(() => {
  for (let i = 0; i < 5; i++) {
    const d = document.createElement("div");
    d.className = "flash-text";
    d.textContent = "Shubham";
    d.style.left = Math.random() * 100 + "vw";
    d.style.top = Math.random() * 100 + "vh";
    d.style.color = ["#ff4081", "#673ab7", "#e91e63", "#ff9800", "#00bcd4"][
      Math.floor(Math.random() * 5)
    ];
    d.style.fontSize = Math.random() * 20 + 20 + "px";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 1000);
  }
}, 500);

const musicBtn = document.getElementById("toggle-music"),
  bg = document.getElementById("bg-music");
musicBtn.addEventListener("click", () => {
  if (bg.paused) {
    bg.play();
    musicBtn.textContent = "🔇 Mute";
  } else {
    bg.pause();
    musicBtn.textContent = "🔊 Unmute";
  }
});

const themeBtn = document.getElementById("toggle-theme");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
  if (chart) {
    chart.options.plugins.legend.labels.color =
      document.body.classList.contains("dark") ? "#eee" : "#222";
    chart.update();
  }
});
