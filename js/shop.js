const container = document.getElementById("shopDetail");
const id = new URLSearchParams(window.location.search).get("id");
const shop = shops.find(s => s.id === id);

if (!shop) {
  container.innerHTML = `
    <a class="back-btn" href="shops.html">&larr; Back to all shops</a>
    <p class="empty">Shop not found.</p>`;
} else {
  document.title = `${shop.name} | Chungu Hub`;

  const mapQ = shop.mapQuery || `${shop.name} ${shop.area} Kenya`;
  const mapLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(mapQ);
  const mapEmbed = "https://www.google.com/maps?q=" + encodeURIComponent(mapQ) + "&output=embed";

  const buttons = [];
  if (shop.phone) buttons.push(`<a class="btn btn-call" href="tel:${shop.phone}">📞 Call ${shop.phoneDisplay}</a>`);
  if (shop.phone2) buttons.push(`<a class="btn btn-call" href="tel:${shop.phone2}">📞 Call ${shop.phone2Display}</a>`);
  if (shop.whatsapp) buttons.push(`<a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/${shop.whatsapp}?text=${encodeURIComponent("Hello " + shop.name + ", I found you on Chungu Hub.")}">WhatsApp</a>`);
  if (shop.email) buttons.push(`<a class="btn btn-outline" href="mailto:${shop.email}?subject=${encodeURIComponent("Enquiry from Chungu Hub")}">✉️ Email</a>`);
  if (shop.website) buttons.push(`<a class="btn btn-outline" target="_blank" rel="noopener" href="${shop.website}">🌐 Website</a>`);
  if (shop.instagram) buttons.push(`<a class="btn btn-outline" target="_blank" rel="noopener" href="${shop.instagram}">Instagram</a>`);
  if (shop.facebook) buttons.push(`<a class="btn btn-outline" target="_blank" rel="noopener" href="${shop.facebook}">Facebook</a>`);
  buttons.push(`<a class="btn btn-outline" target="_blank" rel="noopener" href="${mapLink}">📍 Directions</a>`);

  const info = [
    shop.address ? `<li>📍 ${shop.address}</li>` : "",
    shop.hours ? `<li>🕒 ${shop.hours}</li>` : "",
    shop.phone ? `<li>📞 ${shop.phoneDisplay}${shop.phone2 ? " / " + shop.phone2Display : ""}</li>` : "",
    shop.email ? `<li>✉️ ${shop.email}</li>` : ""
  ].join("");

  const products = shop.products && shop.products.length ? `
    <h3 class="products-title">Products</h3>
    <div class="product-list">
      ${shop.products.map(p => `
        <div class="product">
          <div class="product-img" style="--img:url('${p.image || ""}')"><span>🏺</span></div>
          <div class="product-body">
            <strong>${p.name}</strong>
            ${p.price ? `<div class="price">KES ${p.price.toLocaleString()}</div>` : ""}
          </div>
        </div>`).join("")}
    </div>` : "";

  container.innerHTML = `
    <a class="back-btn" href="shops.html">&larr; Back to all shops</a>

    <div class="detail">
      <div class="detail-img" style="--img:url('${shop.image}')"><span>🏺</span></div>

      <h2>${shop.name}</h2>
      <span class="area-tag">${shop.area}, ${shop.region}</span>
      ${shop.classes ? '<span class="area-tag alt-tag">Offers classes</span>' : ""}
      <p class="lead">${shop.tagline}</p>

      <div class="detail-cols">
        <div>
          <h3>About this shop</h3>
          <p class="desc">${shop.description}</p>

          <h3>What they make</h3>
          <div class="chips">${shop.makes.map(m => `<span class="chip">${m}</span>`).join("")}</div>

          ${shop.note ? `<p class="note-box">ℹ️ ${shop.note}</p>` : ""}
        </div>

        <div>
          <h3>Visit &amp; contact</h3>
          <ul class="info-list">${info}</ul>
          <div class="actions">${buttons.join("")}</div>
        </div>
      </div>

      ${products}

      <h3>Location</h3>
      <iframe class="map" loading="lazy" title="Map of ${shop.name}" src="${mapEmbed}"></iframe>

      <a class="back-btn bottom" href="shops.html">&larr; Back to all shops</a>
    </div>
  `;
}