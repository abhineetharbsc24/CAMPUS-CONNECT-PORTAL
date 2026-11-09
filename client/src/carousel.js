export default function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots = Array.from(document.querySelectorAll('#carouselDots .dot'));

  if (!track || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.children);
  let index = 0;
  let timer = null;

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle('active-slide', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active-dot', i === index));
  };

  const goTo = (target) => {
    index = (target + slides.length) % slides.length;
    render();
  };

  const startAuto = () => {
    stopAuto();
    timer = setInterval(() => goTo(index + 1), 5000);
  };

  const stopAuto = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  prevBtn.addEventListener('click', () => { goTo(index - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { goTo(index + 1); startAuto(); });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); startAuto(); });
  });

  render();
  startAuto();
}
