import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Sanfte Bewegungen
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 200;

// Raumgröße & Texturen
const roomSize = 100;
const textureLoader = new THREE.TextureLoader();

// PBR-Texturen
const albedo = textureLoader.load('https://raw.githubusercontent.com/moritzgauss/digitalboiler/refs/heads/main/texture/gross-dirty-tiles_albedo.png');
const roughness = textureLoader.load('https://raw.githubusercontent.com/moritzgauss/digitalboiler/refs/heads/main/texture/gross-dirty-tiles_roughness.png');
const metalness = textureLoader.load('https://raw.githubusercontent.com/moritzgauss/digitalboiler/refs/heads/main/texture/gross-dirty-tiles_metallic.png');

// Material für die Wände
const tileMaterial = new THREE.MeshStandardMaterial({
  map: albedo,
  roughnessMap: roughness,
  metalnessMap: metalness,
  metalness: 0.9,
  roughness: 0.4,
  side: THREE.BackSide
});

// Raum-Geometrie
const geometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize);
const room = new THREE.Mesh(geometry, tileMaterial);
scene.add(room);

// Lichtquellen
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(ambientLight);

// Kameraposition
camera.position.set(20, 20, 30);

function animate() {
  requestAnimationFrame(animate);

  ambientLight.intensity = 0.2 + Math.sin(Date.now() * 0.001) * (0.2 + Math.random() * 0.05);

  // OrbitControls aktualisieren
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
