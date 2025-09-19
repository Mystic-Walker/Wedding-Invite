// loading
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});


document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bg-music");
  const toggleBtn = document.getElementById("music-toggle");

  // Start music after first interaction
  const startMusic = () => {
    music.play().catch(err => console.log("Autoplay blocked:", err));
    document.removeEventListener("click", startMusic);
    document.removeEventListener("keydown", startMusic);
  };

  document.addEventListener("click", startMusic);
  document.addEventListener("keydown", startMusic);

  // Toggle music on button click
  toggleBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      toggleBtn.textContent = "🔊"; // Sound on
      toggleBtn.classList.remove("paused");
    } else {
      music.pause();
      toggleBtn.textContent = "🔇"; // Sound off
      toggleBtn.classList.add("paused");
    }
  });
});

// Hamburger icon
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});

// Carousel
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const prevBtn = carousel.querySelector('.prev');
  const nextBtn = carousel.querySelector('.next');

  let index = 1;
  let interval;

  // Clone first & last
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  firstClone.id = "first-clone";
  lastClone.id = "last-clone";

  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  let slideWidth = slides[0].clientWidth;
  track.style.transform = `translateX(-${slideWidth * index}px)`;

  function moveToNext() {
    if (index >= track.children.length - 1) return;
    index++;
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  function moveToPrev() {
    if (index <= 0) return;
    index--;
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  track.addEventListener('transitionend', () => {
    const allSlides = carousel.querySelectorAll('.carousel-slide');
    if (track.children[index].id === firstClone.id) {
      track.style.transition = "none";
      index = 1;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
    if (track.children[index].id === lastClone.id) {
      track.style.transition = "none";
      index = allSlides.length - 2;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
  });

  nextBtn.addEventListener('click', () => {
    moveToNext();
    resetSlide();
  });

  prevBtn.addEventListener('click', () => {
    moveToPrev();
    resetSlide();
  });

  function startSlide() {
    interval = setInterval(moveToNext, 3000);
  }

  function resetSlide() {
    clearInterval(interval);
    startSlide();
  }

  startSlide();

  // Responsive: recalc slideWidth on window resize
  window.addEventListener('resize', () => {
    slideWidth = slides[0].clientWidth;
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  });

  // Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(interval));
  carousel.addEventListener('mouseleave', () => startSlide());
});

