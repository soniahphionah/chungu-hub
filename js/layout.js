const navHTML = `
  <nav class="navbar">
    <a href="index.html" class="brand">🏺 Chungu Hub</a>
    <button class="nav-toggle" id="navToggle" aria-label="Open menu">☰</button>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html">Home</a></li>
      <li><a href="index.html#shops">Shops</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="news.html">News</a></li>
      <li><a href="feedback.html">Feedback</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
  </nav>`;

const footerHTML = `
  <footer class="site-footer">
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

// Highlight the current page in the menu
let currentPage = location.pathname.split("/").pop() || "index.html";
if (currentPage === "shop.html") currentPage = "index.html";
document.querySelectorAll("#navLinks a").forEach(a => {
  if (a.getAttribute("href") === currentPage) a.classList.add("active");
});

// Mobile menu
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));