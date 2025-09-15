document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("bannerVideo");
  const btn = document.getElementById("unmuteBtn");

  btn.addEventListener("click", () => {
    video.muted = false;
    video.play();
    btn.style.display = "none"; // hide button after unmuting
  });
});
