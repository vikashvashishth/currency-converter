//real logic

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let code in countryList) {
    const opt = document.createElement("option");
    opt.value = code;
    opt.innerText = code;
    if (select.name === "from" && code === "USD") opt.selected = true;
    if (select.name === "to" && code === "INR") opt.selected = true;
    select.append(opt);
  }
  select.addEventListener("change", evt => updateFlag(evt.target));
}

function updateFlag(el) {
  const cc = countryList[el.value];
  const img = el.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${cc}/flat/64.png`;
}

async function updateExchangeRate() {
  const inp = document.querySelector(".amount input");
  let amt = parseFloat(inp.value);
  if (isNaN(amt) || amt <= 0) {
    amt = 1;
    inp.value = "1";
  }

  const base = fromcurr.value;
  const target = tocurr.value;
  const url = `https://open.er-api.com/v6/latest/${base}`;

  try {
    console.log("Fetching:", url);
    const res = await fetch(url);
    console.log("HTTP Status:", res.status);
    const data = await res.json();
    console.log("API Response:", data);

    if (res.status !== 200 || data.result !== "success") {
      throw new Error(data["error-type"] || `HTTP ${res.status}`);
    }

    const rate = data.rates[target];
    if (rate == null) throw new Error(`Rate not found for ${target}`);

    const converted = (amt * rate).toFixed(4);
    msg.innerText = `${amt} ${base} = ${converted} ${target}`;
  } catch (e) {
    console.error("Error:", e);
    msg.innerText = `⚠️ ${e.message}`;
  }
}

// Event listeners
btn.addEventListener("click", e => {
  e.preventDefault();
  updateExchangeRate();
});
window.addEventListener("load", updateExchangeRate);
