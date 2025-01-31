document.body.addEventListener("click", () => {
  startDiscoEffect();
});

function startDiscoEffect() {
  let flickerInterval;

  function changeColor() {
    // Generate a **random bright color**
    const r = Math.floor(150 + Math.random() * 106); // Between 150-255
    const g = Math.floor(150 + Math.random() * 106);
    const b = Math.floor(150 + Math.random() * 106);
    const randomColor = `rgb(${r}, ${g}, ${b})`;

    // **Random opacity** for flicker effect
    const intensity = Math.random() * 0.5 + 0.5; // Between 0.5 and 1

    // Apply styles
    document.body.style.backgroundColor = randomColor;
    document.body.style.opacity = intensity;
  }

  function startFlickering() {
    changeColor();
    
    // **Random flicker speed** (between 50ms - 500ms)
    const flickerSpeed = Math.random() * 450 + 50;
    
    flickerInterval = setTimeout(startFlickering, flickerSpeed);
  }

  // Stop after a few seconds
  startFlickering();
  setTimeout(() => clearTimeout(flickerInterval), Math.random() * 5000 + 3000); // Run for 3-8s
}