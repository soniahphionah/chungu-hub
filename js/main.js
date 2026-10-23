const grid = document.getElementById("shopGrid");
const searchInput = document.getElementById("search");
const areaFilter = document.getElementById("areaFilter");
const resultCount = document.getElementById("resultCount");

// Fill the area dropdown from the shop data
const areas = [...new Set(shops.map(s => s.area))].sort();
areas.forEach(area => {
  const opt = document.createElement("option");
  opt.value = area;
  opt.textContent = area;
  areaFilter.appendChild(opt);
});

function renderShops() {
  const query = searchInput.value.trim().toLowerCase();
  const area = areaFilter.value;

  const filtered = shops.filter(shop => {
    const matchesArea = !area || shop.area === area;
    const text = [shop.name, shop.tagline, shop.area, ...shop.products.map(p => p.name)]
      .join(" ")
      .toLowerCase();
    return matchesArea && text.includes(query);
  });

  resultCount.textContent = `${filtered.length} shop${filtered.length === 1 ? "" : "s"} found`;

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="empty">No shops match your search.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(shop => `
    <a class="card" href="shop.html?id=${shop.id}">
      <div class="card-img">
        ${shop.image ? `<img src="${shop.image}" alt="${shop.name}">` : "🏺"}
      </div>
      <div class="card-body">
        <h3>${shop.name}</h3>
        <span class="area-tag">${shop.area}</span>
        <p>${shop.tagline}</p>
      </div>
    </a>
  `).join("");
}

searchInput.addEventListener("input", renderShops);
areaFilter.addEventListener("change", renderShops);
renderShops();