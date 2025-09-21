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

//Navbar
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.getAttribute('href').startsWith("#")) {
      e.preventDefault(); // Prevent default jump
      
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const yOffset = -60; // adjust for sticky navbar height
        const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }

    // Collapse menu on mobile
    if (window.innerWidth < 768) { 
      menu.style.display = 'none';
    }
  });
});


// Hamburger icon
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});

// Close menu when a link is clicked (on mobile)
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) { 
      menu.style.display = 'none';
    }
  });
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
    interval = setInterval(moveToNext, 4000);
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

  // ✅ Swipe Support
  let startX = 0;
  let endX = 0;

  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const threshold = 50; // min swipe distance
    if (endX - startX > threshold) {
      moveToPrev();
      resetSlide();
    } else if (startX - endX > threshold) {
      moveToNext();
      resetSlide();
    }
  }
});

//Wish Messages

// Auto-expand functionality
const textarea = document.getElementById('message');
textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';        // Reset height
  textarea.style.height = textarea.scrollHeight + 'px'; // Adjust to content
});

const form = document.getElementById('wishForm');
form.addEventListener('submit', e => {
  e.preventDefault();


  const formData = new FormData(form);
  const params = new URLSearchParams(formData);

  fetch("https://script.google.com/macros/s/AKfycbxDjEUxBc__2-NMb8LtgkoxFSygC5_R8wV2CR1flsIaebKvhGA3Vm782UvzQGJXwdTlpQ/exec", { 
    method: "POST", 
    body: params 
  })
  .then(response => response.json())
  .then(data => {
    if(data.result === "success"){
      alert("Thank you for your wish!");
      form.reset();
    }
  })
  .catch(error => alert("Error sending message: " + error));
});



