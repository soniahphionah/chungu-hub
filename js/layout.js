const navHTML = `
  <nav class="navbar">
    <a href="index.html" class="brand">🏺 Chungu Hub</a>
    <button class="nav-toggle" id="navToggle" aria-label="Open menu">☰</button>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html">Home</a></li>
      <li><a href="shops.html">Shops</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="news.html">News</a></li>
      <li><a href="feedback.html">Feedback</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
  </nav>`;

const footerHTML = `
  <footer class="site-footer">
    <div class="footer-brand">🏺 Chungu Hub</div>
    <p class="footer-tag">Find Kenya's potters. Call, visit, order.</p>
    <div class="socials">
      <a href="https://instagram.com/chunguhub" target="_blank" rel="noopener">Instagram</a>
      <a href="https://facebook.com/chunguhub" target="_blank" rel="noopener">Facebook</a>
      <a href="https://tiktok.com/@chunguhub" target="_blank" rel="noopener">TikTok</a>
      <a href="https://x.com/chunguhub" target="_blank" rel="noopener">X</a>
      <a href="https://wa.me/254700000000" target="_blank" rel="noopener">WhatsApp</a>
    </div>
    <p>&copy; 2026 Chungu Hub. All rights reserved.</p>
  </footer>`;

document.getElementById("site-nav").innerHTML = navHTML;
document.getElementById("site-footer").innerHTML = footerHTML;

// Highlight the current page in the menu (shop.html counts as Shops)
let currentPage = location.pathname.split("/").pop() || "index.html";
if (currentPage === "shop.html") currentPage = "shops.html";
document.querySelectorAll("#navLinks a").forEach(a => {
  if (a.getAttribute("href") === currentPage) a.classList.add("active");
});

// Mobile menu
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));

// ---------- Photo fix ----------
// Background photos set through --img / --bg would otherwise be looked up
// relative to css/style.css. This turns them into correct full addresses,
// and hides the 🏺 placeholder once a real photo has loaded.
function fixBgUrls(root) {
  root.querySelectorAll('[style*="--img"], [style*="--bg"]').forEach(el => {
    ["--img", "--bg"].forEach(prop => {
      const value = el.style.getPropertyValue(prop);
      const match = value && value.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
      if (!match || /^(https?:|data:|\/)/.test(match[1])) return;
      const full = new URL(match[1], document.baseURI).href;
      el.style.setProperty(prop, `url("${full}")`);
      const probe = new Image();
      probe.onload = () => el.classList.add("has-photo");
      probe.src = full;
    });
  });
}
fixBgUrls(document);
new MutationObserver(() => fixBgUrls(document)).observe(document.body, { childList: true, subtree: true });