import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 200;

// Raumgröße
const roomSize = 100;
const textureLoader = new THREE.TextureLoader();

// Standard-Bump-Textur
const defaultBumpTexture = textureLoader.load('https://threejs.org/examples/textures/brick_bump.jpg');

// PBR-Texturen laden
const texturePaths = [
  'gross-dirty-tiles_albedo.png',
  'gross-dirty-tiles_roughness.png',
  'gross-dirty-tiles_metallic.png'
];

const loadTexture = (path) => {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      path,
      texture => resolve(texture),
      undefined,
      () => reject(`Fehler beim Laden: ${path}`)
    );
  });
};

(async function createRoom() {
  let albedo, roughness, metalness;
  try {
    [albedo, roughness, metalness] = await Promise.all(texturePaths.map(path => loadTexture(`https://raw.githubusercontent.com/moritzgauss/digitalboiler/main/texture/${path}`)));
  } catch (error) {
    console.warn(error, 'Nutze Standard-Bump-Textur.');
  }

  // Material wählen
  const tileMaterial = new THREE.MeshStandardMaterial({
    map: albedo || null,
    roughnessMap: roughness || null,
    metalnessMap: metalness || null,
    bumpMap: albedo ? null : defaultBumpTexture,
    metalness: albedo ? 0.9 : 0.5,
    roughness: albedo ? 0.4 : 0.7,
    side: THREE.BackSide
  });

  // Raum-Geometrie
  const room = new THREE.Mesh(new THREE.BoxGeometry(roomSize, roomSize, roomSize), tileMaterial);
  scene.add(room);
})();

// Lichtquellen mit grünem Flackern
const ambientLight = new THREE.AmbientLight(0x00ff00, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(20, 50, 20);
scene.add(pointLight);

// Kamera-Pivot für sanfte Bewegung
const pivot = new THREE.Object3D();
scene.add(pivot);
pivot.add(camera);
camera.position.set(20, 0, 30);
controls.target.set(0, 0, 0);

let time = 0;
// Animationsschleife
function animate() {
  requestAnimationFrame(animate);
  
  // Grün flackerndes Licht
  time += 0.05;
  ambientLight.intensity = 0.4 + Math.sin(time) * 0.4;

  // Kamera-Pivot leicht rotieren für sanfte Bewegung
  pivot.rotation.y = Math.sin(time * 0.1) * 0.1;
  pivot.rotation.x = Math.sin(time * 0.05) * 0.05;

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Fenstergröße anpassen
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
