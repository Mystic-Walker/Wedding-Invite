//loading
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});


document.addEventListener("DOMContentLoaded", () => {
  // Ensure all images lazy-load
  document.querySelectorAll('img').forEach(img => {
    try {
      img.loading = 'lazy';
      img.decoding = 'async';
    } catch (e) {}
  });

  const music = document.getElementById("bg-music");
  const toggleBtn = document.getElementById("music-toggle");

  const startMusic = () => {
    music.play().catch(err => console.log("Autoplay blocked:", err));
    document.removeEventListener("click", startMusic);
    document.removeEventListener("keydown", startMusic);
  };

  document.addEventListener("click", startMusic);
  document.addEventListener("keydown", startMusic);

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

// Navbar
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.getAttribute('href').startsWith("#")) {
      e.preventDefault(); // Prevent default jump

      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // ✅ Adjust offset based on screen size
        const yOffset = window.innerWidth < 768 ? -100 : -60; 
        const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }

    if (window.innerWidth < 768) {
      menu.style.display = 'none';
    }
  });
});

//Hamburger icon
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
// Carousel (improved: pause-on-hold, swipe, no catch-up, single interval)
// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');

    // Get initial slides
    let slides = carousel.querySelectorAll('.carousel-slide');
    if (!slides || slides.length === 0) {
      console.warn("No .carousel-slide elements found in carousel:", carousel);
      return; // stop if no slides
    }

    // Clone first & last slides for infinite loop
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.id = "first-clone";
    lastClone.id = "last-clone";

    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    // Re-query slides (now includes clones)
    slides = carousel.querySelectorAll('.carousel-slide');

    // State
    let index = 1; // start at first real slide
    let intervalId = null;
    let slideWidth = carousel.clientWidth;

    // Set initial position
    track.style.transform = `translateX(-${slideWidth * index}px)`;

    // Move functions
    function moveToNext() {
      if (index >= slides.length - 1) return;
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

    // After transition, reset if on clone
    track.addEventListener('transitionend', () => {
      if (slides[index].id === "first-clone") {
        track.style.transition = "none";
        index = 1;
        track.style.transform = `translateX(-${slideWidth * index}px)`;
      }
      if (slides[index].id === "last-clone") {
        track.style.transition = "none";
        index = slides.length - 2;
        track.style.transform = `translateX(-${slideWidth * index}px)`;
      }
    });

    // Button handlers
    if (nextBtn) nextBtn.addEventListener('click', () => { moveToNext(); resetSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { moveToPrev(); resetSlide(); });

    // Autoplay
    function startSlide() {
      if (intervalId !== null) return;
      intervalId = setInterval(moveToNext, 4000);
    }

    function pauseSlide() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function resetSlide() {
      pauseSlide();
      startSlide();
    }

    startSlide();

    // Recalculate width on resize
    window.addEventListener('resize', () => {
      slideWidth = carousel.clientWidth;
      track.style.transition = "none";
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', pauseSlide);
    carousel.addEventListener('mouseleave', startSlide);

    // Pointer/touch swipe handling
    let pointerDown = false;
    let startX = 0;
    let moved = false;
    const SWIPE_THRESHOLD = 50;

    carousel.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointerDown = true;
      startX = e.clientX;
      moved = false;
      pauseSlide();
      try { e.target.setPointerCapture(e.pointerId); } catch (err) {}
    });

    carousel.addEventListener('pointermove', (e) => {
      if (!pointerDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 10) moved = true;
    });

    carousel.addEventListener('pointerup', (e) => {
      if (!pointerDown) return;
      pointerDown = false;
      const delta = e.clientX - startX;
      try { e.target.releasePointerCapture(e.pointerId); } catch (err) {}
      if (moved && Math.abs(delta) > SWIPE_THRESHOLD) {
        if (delta > 0) moveToPrev(); else moveToNext();
        resetSlide();
      } else {
        startSlide();
      }
    });

    carousel.addEventListener('pointercancel', () => {
      pointerDown = false;
      startSlide();
    });

    // Touch fallback (for older browsers)
    carousel.addEventListener('touchstart', (e) => {
      if (window.PointerEvent) return;
      startX = e.touches[0].clientX;
      moved = false;
      pauseSlide();
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      if (window.PointerEvent) return;
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 10) moved = true;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      if (window.PointerEvent) return;
      const delta = (e.changedTouches && e.changedTouches[0]) 
        ? e.changedTouches[0].clientX - startX 
        : 0;
      if (moved && Math.abs(delta) > SWIPE_THRESHOLD) {
        if (delta > 0) moveToPrev(); else moveToNext();
        resetSlide();
      } else {
        startSlide();
      }
    });
  });
});


//Wish Messages
// Auto-expand textarea
const textarea = document.getElementById('message');
textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
});

const form = document.getElementById('wishForm');

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const params = new URLSearchParams(formData);

  fetch("https://script.google.com/macros/s/AKfycbzLEvFG8MdChUP9L-uuXYK0UYGgSskCS498-DrqqoZtPIiKLUS2K7HUrAOe-dYXqxAB/exec", { 
    method: "POST", 
    body: params 
  })
  .then(response => response.json())
  .then(data => {
    if(data.result === "success"){
      showCustomAlert("Thank you for your wish! 💖");
      form.reset();
    }
  })
  .catch(error => showCustomAlert("Error sending message ❌"));
});

// ✅ Custom Alert Function
function showCustomAlert(message) {
  let alertBox = document.getElementById("custom-alert");

  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "custom-alert";
    document.body.appendChild(alertBox);
  }

  alertBox.textContent = message;
  alertBox.style.display = "block";
  setTimeout(() => alertBox.classList.add("show"), 10);
  setTimeout(() => {
    alertBox.classList.remove("show");
    setTimeout(() => (alertBox.style.display = "none"), 600);
  }, 2500);
}

