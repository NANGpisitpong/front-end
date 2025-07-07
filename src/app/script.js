function randomBg() {
  const images = [
    "url('https://picsum.photos/800/600?random=1')",
    "url('https://picsum.photos/800/600?random=2')",
    "url('https://picsum.photos/800/600?random=3')",
    "url('https://picsum.photos/800/600?random=4')"
  ];

  const random = images[Math.floor(Math.random() * images.length)];
  document.body.style.backgroundImage = random;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";
}
