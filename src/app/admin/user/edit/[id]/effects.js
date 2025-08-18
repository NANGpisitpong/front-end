// edit-effects.js
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.edit-wrapper');
  if (wrapper) setTimeout(() => wrapper.classList.add('loaded'), 300);

  // Parallax card movement
  document.addEventListener('mousemove', (e) => {
    const card = document.querySelector('.edit-card');
    if (!card) return;
    const x = (window.innerWidth / 2 - e.pageX) / 40;
    const y = (window.innerHeight / 2 - e.pageY) / 40;
    card.style.transform = `perspective(1200px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
});
