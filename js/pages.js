const newsGrid = document.getElementById("newsGrid");
if (newsGrid) {
  newsGrid.innerHTML = news.map(n => `
    <article class="news-card">
      <span class="area-tag">${n.tag}</span>
      <h3>${n.title}</h3>
      <small>${n.date}</small>
      <p>${n.text}</p>
    </article>
  `).join("");
}

const quotesBox = document.getElementById("testimonials");
if (quotesBox) {
  quotesBox.innerHTML = testimonials.map(t => `
    <blockquote class="quote">
      <p>“${t.text}”</p>
      <footer>${t.name} · ${t.shop}</footer>
    </blockquote>
  `).join("");
}

document.querySelectorAll(".ajax-form").forEach(form => {
  const status = form.querySelector(".form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (form.action.includes("YOUR_FORM_ID")) {
      status.textContent = "Form not connected yet. Add your Formspree ID.";
      return;
    }

    status.textContent = "Sending...";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (res.ok) {
        status.textContent = "Thank you! Your message was sent.";
        form.reset();
      } else {
        status.textContent = "Something went wrong. Please try again.";
      }
    } catch {
      status.textContent = "Network error. Please try again.";
    }
  });
});