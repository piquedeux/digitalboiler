import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Raumgeometrie mit PBR-Texturen für die Wände
const roomSize = 200;  // Noch größerer Raum
const textureLoader = new THREE.TextureLoader();

// PBR-Texturen für die Fliesen
const albedo = textureLoader.load('texture/gross-dirty-tiles_albedo.png'); // Albedo-Textur (Farbe)
const roughness = textureLoader.load('texture/gross-dirty-tiles_roughness.png'); // Rauheits-Textur
const metalness = textureLoader.load('https://example.com/tile_metallic.png'); // Metallizitäts-Textur

// Texturgröße anpassen durch Skalierung (kleiner machen)
albedo.minFilter = THREE.LinearFilter;  // Verhindert MipMap Probleme
roughness.minFilter = THREE.LinearFilter;
metalness.minFilter = THREE.LinearFilter;

// Material für die Fliesen (reflektierender gemacht)
const tileMaterial = new THREE.MeshStandardMaterial({
  map: albedo,
  roughnessMap: roughness,
  metalnessMap: metalness,
  metalness: 1.9, // Erhöht für mehr Reflektion
  roughness: 0.2, // Glattere Oberfläche
  side: THREE.BackSide
});

// Raumgeometrie
const geometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize);
const room = new THREE.Mesh(geometry, tileMaterial);
scene.add(room);

// Reduziere Umgebungslicht für dunkleren Raum
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.03); // Sehr schwaches Umgebungslicht
scene.add(ambientLight);

// Spot Light (rundes Licht von oben)
const spotLight = new THREE.SpotLight(0xFFFFFF, 0.9, 50, Math.PI / 4, 0.5, 2);
spotLight.position.set(0, roomSize / 2, 0);  // Direkt oben
spotLight.castShadow = true;
scene.add(spotLight);

// Flackernde Lichter, die den Raum schwach beleuchten (größer und sichtbarer)
const flickeringLights = [];
for (let i = 0; i < 50; i++) { // Mehr flackernde Lichter
  const light = new THREE.PointLight(0xFFFFFF, Math.random() * 2, roomSize);
  light.position.set(
    (Math.random() - 0.5) * roomSize,
    (Math.random() - 0.5) * roomSize,
    (Math.random() - 0.5) * roomSize
  );
  light.scale.set(200, 200, 200); // Größere Lichter
  scene.add(light);
  flickeringLights.push(light);
}

// Kameraposition und Bewegung
camera.position.set(50, 50, 100);
let cameraAngle = 0;

function animate() {
  requestAnimationFrame(animate);

  // Flackernde Lichter
  flickeringLights.forEach(light => {
    light.intensity = Math.random() * 3; // Flackernde Intensität
  });

  // Kamera sanft bewegen
  camera.position.x = 50 * Math.cos(cameraAngle);
  camera.position.z = 50 * Math.sin(cameraAngle);
  camera.lookAt(0, 0, 0);  // Immer auf den Raum fokussieren
  cameraAngle += 0.001;

  // Rendering der Szene
  renderer.render(scene, camera);
}

animate();

// Fenstergröße anpassen
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
