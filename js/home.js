const slides = document.querySelectorAll(".slide");
const dotsBox = document.getElementById("dots");
let current = 0;
let timer;

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
  dot.addEventListener("click", () => { showSlide(i); restartTimer(); });
  dotsBox.appendChild(dot);
});

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("active", i === current));
  [...dotsBox.children].forEach((d, i) => d.classList.toggle("active", i === current));
}

function restartTimer() {
  clearInterval(timer);
  timer = setInterval(() => showSlide(current + 1), 5000);
}

document.getElementById("prevSlide").addEventListener("click", () => { showSlide(current - 1); restartTimer(); });
document.getElementById("nextSlide").addEventListener("click", () => { showSlide(current + 1); restartTimer(); });
showSlide(0);
restartTimer();