const galleryButtons = [
  ...document.querySelectorAll(".print-open")
];

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxMedia = document.querySelector(".lightbox-media");
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");
const counter = document.querySelector(".lightbox-counter");

let currentIndex = 0;
let lastFocusedButton = null;
let startX = 0;
let startY = 0;
let isTouchGesture = false;

// Open the lightbox when a thumbnail is clicked.
galleryButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    currentIndex = index;
    lastFocusedButton = button;

    updateImage();
    lightbox.showModal();
    closeButton.focus();
  });
});

// Update the enlarged image and its counter.
function updateImage() {
  const button = galleryButtons[currentIndex];
  const thumbnail = button.querySelector("img");

  lightboxImage.src = button.dataset.full;
  lightboxImage.alt = thumbnail.alt;

  counter.textContent =
    `${currentIndex + 1} / ${galleryButtons.length}`;
}

// Move between images, looping at either end.
function navigate(direction) {
  currentIndex =
    (currentIndex + direction + galleryButtons.length)
    % galleryButtons.length;

  updateImage();
}

prevButton.addEventListener("click", () => navigate(-1));
nextButton.addEventListener("click", () => navigate(1));

// Close the lightbox.
closeButton.addEventListener("click", () => {
  lightbox.close();
});

// Clicking the backdrop closes the lightbox too.
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

// Restore focus to the thumbnail that opened it.
lightbox.addEventListener("close", () => {
  lastFocusedButton?.focus();
});

// Keyboard navigation: left, right and Escape.
document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    navigate(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    navigate(1);
  }
});

// Touch gestures on the enlarged image.
lightboxMedia.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "touch") return;

  isTouchGesture = true;
  startX = event.clientX;
  startY = event.clientY;
});

lightboxMedia.addEventListener("pointerup", (event) => {
  if (!isTouchGesture) return;

  isTouchGesture = false;

  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;

  const threshold = 60;

  // Only act when the movement is clearly a swipe.
  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < threshold) {
    return;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Swipe left = next; swipe right = previous.
    navigate(deltaX < 0 ? 1 : -1);
  } else {
    // Swipe up or down = close.
    lightbox.close();
  }
});

lightboxMedia.addEventListener("pointercancel", () => {
  isTouchGesture = false;
});

// Keep the copyright year current without changing the HTML each January.
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}
