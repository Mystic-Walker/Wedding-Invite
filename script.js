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

const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});

document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      menu.style.display = 'none';
    }
  });
});


document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const prevBtn = carousel.querySelector('.prev');
  const nextBtn = carousel.querySelector('.next');

  let slides = carousel.querySelectorAll('.carousel-slide');

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.id = "first-clone";
  lastClone.id = "last-clone";

  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);

  slides = carousel.querySelectorAll('.carousel-slide');

  let index = 1;                 // start at first real slide
  let intervalId = null;         // holds setInterval id
  let slideWidth = track.children[index].clientWidth;

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
    const children = track.children;
    if (children[index].id === firstClone.id) {
      track.style.transition = "none";
      index = 1;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
    if (children[index].id === lastClone.id) {
      track.style.transition = "none";
      index = children.length - 2;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
  });

  if (nextBtn) nextBtn.addEventListener('click', () => { moveToNext(); resetSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { moveToPrev(); resetSlide(); });

  function startSlide() {
    if (intervalId !== null) return; // already running
    intervalId = setInterval(() => {
      moveToNext();
    }, 4000);
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

  window.addEventListener('resize', () => {
    // recompute slideWidth from current visible child (index)
    slideWidth = track.children[index].clientWidth;
    // temporarily disable transition to reposition cleanly
    track.style.transition = "none";
    track.style.transform = `translateX(-${slideWidth * index}px)`;
    // allow transitions again for user interactions
    // (no need to force reflow here)
  });

  carousel.addEventListener('mouseenter', pauseSlide);
  carousel.addEventListener('mouseleave', () => { /* only resume if not pointer down */ startSlide(); });

  let pointerDown = false;
  let startX = 0;
  let moved = false;
  const SWIPE_THRESHOLD = 50; // px

  carousel.addEventListener('pointerdown', (e) => {
    // only handle primary button (mouse) or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointerDown = true;
    startX = e.clientX;
    moved = false;
    // pause autoplay while held
    pauseSlide();

    try { e.target.setPointerCapture(e.pointerId); } catch (err) { /* ignore if unsupported */ }
  });

  carousel.addEventListener('pointermove', (e) => {
    if (!pointerDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 10) moved = true; // small deadzone
  });

  carousel.addEventListener('pointerup', (e) => {
    if (!pointerDown) return;
    pointerDown = false;
    const endX = e.clientX;
    const delta = endX - startX;

    try { e.target.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }

    if (moved && Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) {
        moveToPrev();
      } else {
        moveToNext();
      }
      resetSlide();
    } else {
      startSlide();
    }
  });

  carousel.addEventListener('pointercancel', () => {
    pointerDown = false;
    startSlide();
  });

  carousel.addEventListener('touchstart', (e) => {
    // If pointer events are supported the pointer handlers already did this; this is a safe fallback
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
    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
    const delta = endX - startX;
    if (moved && Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) moveToPrev(); else moveToNext();
      resetSlide();
    } else {
      startSlide();
    }
  });
});

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
      showCustomAlert("Thank you for your wish! 💖");
      form.reset();
    }
  })
  .catch(error => showCustomAlert("Error sending message ❌"));
});

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




