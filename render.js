import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);  // Set canvas to full screen
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const loadTexture = (path) => {
  const tex = textureLoader.load(path);
  tex.minFilter = THREE.LinearFilter;
  return tex;
};

// PBR-Texturen (Adjusted for wall surfaces)
const tileMaterial = new THREE.MeshStandardMaterial({
  map: loadTexture('texture/gross-dirty-tiles_albedo.png'),
  roughnessMap: loadTexture('texture/gross-dirty-tiles_roughness.png'),
  metalnessMap: loadTexture('texture/gross-dirty-tiles_metallic.png'),
  metalness: 1,
  roughness: 0.2,
  side: THREE.FrontSide
});

// Create the walls of the room (6 walls)
const wallGeometry = new THREE.PlaneGeometry(200, 200); // Planes for walls
const wallMaterials = Array(6).fill(tileMaterial); // Same material for all walls

// Create walls (front, back, left, right, top, bottom)
const walls = [
  new THREE.Mesh(wallGeometry, wallMaterials[0]), // Front wall
  new THREE.Mesh(wallGeometry, wallMaterials[1]), // Back wall
  new THREE.Mesh(wallGeometry, wallMaterials[2]), // Left wall
  new THREE.Mesh(wallGeometry, wallMaterials[3]), // Right wall
  new THREE.Mesh(wallGeometry, wallMaterials[4]), // Top wall
  new THREE.Mesh(wallGeometry, wallMaterials[5]), // Bottom wall
];

// Position the walls correctly to form a box
walls[0].position.set(0, 0, 100); // Front
walls[1].position.set(0, 0, -100); // Back
walls[2].rotation.y = Math.PI / 2; walls[2].position.set(100, 0, 0); // Left
walls[3].rotation.y = Math.PI / 2; walls[3].position.set(-100, 0, 0); // Right
walls[4].rotation.x = Math.PI / 2; walls[4].position.set(0, 100, 0); // Top
walls[5].rotation.x = Math.PI / 2; walls[5].position.set(0, -100, 0); // Bottom

// Add walls to the scene
walls.forEach(wall => scene.add(wall));

// Lighting - Flickering light inside the room
const flickeringLight = new THREE.PointLight(0xFFFFFF, 1, 50);
flickeringLight.position.set(0, 50, 0); // Place the light inside the room
scene.add(flickeringLight);

// Set up a camera
camera.position.set(0, 50, 200); // Position the camera inside the room, looking towards the center
camera.lookAt(0, 0, 0);

let lightIntensity = 1;

// Flickering effect for the light
function flickerLight() {
  lightIntensity = Math.random() * 2; // Random flicker effect
  flickeringLight.intensity = lightIntensity;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Flicker light every frame
  flickerLight();

  renderer.render(scene, camera);
}

animate();

// Window resize handler
window.addEventListener('resize', () => {
  requestAnimationFrame(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
