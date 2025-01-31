document.body.addEventListener("click", () => {
  document.body.classList.add("flicker-active");

  // Stop after a few seconds
  setTimeout(() => {
    document.body.classList.remove("flicker-active");
  }, Math.random() * 5000 + 2000); // Flicker lasts 2-7s
});