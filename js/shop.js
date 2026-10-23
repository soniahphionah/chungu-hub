const container = document.getElementById("shopDetail");
const id = new URLSearchParams(window.location.search).get("id");
const shop = shops.find(s => s.id === id);

function imgOrIcon(src, alt) {
  if (!src) return "🏺";
  return `<img src="${src}" alt="${alt}" onerror="this.parentElement.textContent='🏺'">`;
}

if (!shop) {
  container.innerHTML = `<p class="empty">Shop not found. <a href="index.html"><strong>Back to all shops</strong></a></p>`;
} else {
  document.title = `${shop.name} | Chungu Hub`;

  const mapUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(shop.name + " " + shop.address);

  function whatsappLink(message) {
    return `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  container.innerHTML = `
    <div class="detail">
      <div class="detail-img">${imgOrIcon(shop.image, shop.name)}</div>

      <h2>${shop.name}</h2>
      <span class="area-tag">${shop.area}</span>
      <p class="desc">${shop.description}</p>

      <ul class="info-list">
        <li>📍 ${shop.address}</li>
        <li>🕒 ${shop.hours}</li>
        <li>📞 ${shop.phone}</li>
      </ul>

      <div class="actions">
        <a class="btn btn-call" href="tel:${shop.phone}">Call shop</a>
        <a class="btn btn-whatsapp" target="_blank" rel="noopener"
           href="${whatsappLink(`Hello ${shop.name}, I found you on Chungu Hub and would like to place an order.`)}">
          WhatsApp
        </a>
        <a class="btn btn-map" target="_blank" rel="noopener" href="${mapUrl}">View on map</a>
      </div>

      <h3 class="products-title">What ${shop.name} sells</h3>
      <div class="product-list">
        ${shop.products.map(p => `
          <div class="product">
            <div class="product-img">${imgOrIcon(p.image, p.name)}</div>
            <div class="product-body">
              <strong>${p.name}</strong>
              <div class="price">KES ${p.price.toLocaleString()}</div>
              <a class="btn btn-whatsapp" target="_blank" rel="noopener"
                 href="${whatsappLink(`Hello ${shop.name}, I would like to order: ${p.name} (KES ${p.price}).`)}">
                Order
              </a>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}