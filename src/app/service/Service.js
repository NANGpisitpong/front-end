// เพิ่มลูกเล่นกราฟ/การเลื่อนของแพ็กเกจ

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.plan-card');

  cards.forEach((card) => {
    // Parallax effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 12;
      const rotateY = (x - centerX) / 12;
      card.style.transform = `scale(1.05) translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1) translateY(0) rotateX(0deg) rotateY(0deg)';
    });

    // Ripple effect
    card.addEventListener('click', function(e) {
      let ripple = card.querySelector('.ripple');
      if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        card.appendChild(ripple);
      }
      ripple.style.left = `${e.clientX - card.getBoundingClientRect().left}px`;
      ripple.style.top = `${e.clientY - card.getBoundingClientRect().top}px`;
      ripple.classList.add('show');
      setTimeout(() => ripple.classList.remove('show'), 600);
    });
  });
});
