// Shops listing page (shops.html)
const grid = document.getElementById("shopGrid");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("regionFilter");
const classesOnly = document.getElementById("classesOnly");
const resultCount = document.getElementById("resultCount");

// Fill the region dropdown from the shop data
[...new Set(shops.map(s => s.region))].sort().forEach(region => {
  const opt = document.createElement("option");
  opt.value = region;
  opt.textContent = region;
  regionFilter.appendChild(opt);
});

// Allow links like shops.html?q=planters or shops.html?classes=1
const params = new URLSearchParams(location.search);
if (params.get("q")) searchInput.value = params.get("q");
if (params.get("region")) regionFilter.value = params.get("region");
if (params.get("classes")) classesOnly.checked = true;

function renderShops() {
  const query = searchInput.value.trim().toLowerCase();
  const region = regionFilter.value;

  const filtered = shops.filter(shop => {
    if (region && shop.region !== region) return false;
    if (classesOnly.checked && !shop.classes) return false;
    const text = [shop.name, shop.tagline, shop.area, shop.region, shop.description, ...shop.makes]
      .join(" ").toLowerCase();
    return text.includes(query);
  });

  resultCount.textContent = `${filtered.length} shop${filtered.length === 1 ? "" : "s"} found`;

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="empty">No shops match your search.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(shop => `
    <a class="card" href="shop.html?id=${shop.id}">
      <div class="card-img" style="--img:url('${shop.image}')"><span>🏺</span></div>
      <div class="card-body">
        <h3>${shop.name}</h3>
        <span class="area-tag">${shop.area}, ${shop.region}</span>
        ${shop.classes ? '<span class="area-tag alt-tag">Classes</span>' : ""}
        <p class="tagline">${shop.tagline}</p>
        <p class="blurb">${shop.description.slice(0, 120).trim()}…</p>
        <span class="more">View shop &rarr;</span>
      </div>
    </a>
  `).join("");
}

searchInput.addEventListener("input", renderShops);
regionFilter.addEventListener("change", renderShops);
classesOnly.addEventListener("change", renderShops);
renderShops();