useEffect(() => {
  if (!loading && showWelcome) {
    const title = document.getElementById('animatedTitle');
    const audio = new Audio('/sounds/type.mp3'); // ต้องมีไฟล์เสียง

    if (title) {
      const text = title.textContent || '';
      title.innerHTML = '';

      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.animation = `glowIn 0.5s ease forwards`;
        span.style.animationDelay = `${index * 0.1}s`;
        title.appendChild(span);

        setTimeout(() => audio.play(), index * 100); // เสียงทีละตัว
      });
    }
  }
}, [loading, showWelcome]);
