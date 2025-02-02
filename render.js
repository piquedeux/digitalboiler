import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// WebGL-Kompatibilität prüfen
if (!window.WebGLRenderingContext) {
  alert("WebGL wird von deinem Gerät nicht unterstützt.");
}

// Szene, Kamera, Renderer einrichten
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 20, 30);

// Container für das Canvas erstellen
const container = document.createElement('div');
container.style.position = 'absolute';
container.style.top = '0';
container.style.left = '0';
container.style.width = '100vw';
container.style.height = '100vh';
document.body.appendChild(container);

const renderer = new THREE.WebGLRenderer({ antialias: false }); // AA deaktiviert für Mobile-Performance
renderer.setPixelRatio(window.devicePixelRatio); // DPR optimieren
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Orbit Controls (mit Touch-Unterstützung)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Sanfte Bewegungen
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 100;
controls.enableZoom = true; // Pinch-to-Zoom aktivieren
controls.enableRotate = true; // Rotation per Touch aktivieren
controls.enablePan = true; // Verschieben erlauben

// Raumgröße & Texturen
const roomSize = 50; // Kleinere Szene für bessere mobile Performance
const textureLoader = new THREE.TextureLoader();

// PBR-Texturen
const albedo = textureLoader.load('https://raw.githubusercontent.com/moritzgauss/digitalboiler/refs/heads/main/texture/gross-dirty-tiles_albedo.png');
const roughness = textureLoader.load('https://raw.githubusercontent.com/moritzgauss/digitalboiler/refs/heads/main/texture/gross-dirty-tiles_roughness.png');
const metalness = textureLoader.load('https://raw.githubusercontent.com/moritzgauss/digitalboiler/refs/heads/main/texture/gross-dirty-tiles_metallic.png');

// Material für die Wände (leichter für mobile Performance)
const tileMaterial = new THREE.MeshStandardMaterial({
  map: albedo,
  roughnessMap: roughness,
  metalnessMap: metalness,
  metalness: 0.6, // Reduziert für bessere Performance
  roughness: 0.5,
  side: THREE.BackSide
});

// Raum-Geometrie
const geometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize);
const room = new THREE.Mesh(geometry, tileMaterial);
scene.add(room);

// Lichtquellen
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3); // Heller für Mobile
scene.add(ambientLight);

// Animationsfunktion
function animate() {
  requestAnimationFrame(animate);

  // Leichte Lichtvariation für Dynamik
  ambientLight.intensity = 0.3 + Math.sin(Date.now() * 0.001) * 0.1;

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