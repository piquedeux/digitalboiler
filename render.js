import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const loadTexture = (path) => {
  const tex = textureLoader.load(path);
  tex.minFilter = THREE.LinearFilter;
  return tex;
};

// PBR-Texturen
const tileMaterial = new THREE.MeshStandardMaterial({
  map: loadTexture('texture/gross-dirty-tiles_albedo.png'),
  roughnessMap: loadTexture('texture/gross-dirty-tiles_roughness.png'),
  metalnessMap: loadTexture('texture/gross-dirty-tiles_metallic.png'),
  metalness: 1,
  roughness: 0.2,
  side: THREE.BackSide
});

// Raumgeometrie
const room = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 200), tileMaterial);
scene.add(room);

// Beleuchtung
scene.add(new THREE.AmbientLight(0xFFFFFF, 0.03));

const spotLight = new THREE.SpotLight(0xFFFFFF, 0.9, 50, Math.PI / 4, 0.5, 2);
spotLight.position.set(0, 100, 0);
spotLight.castShadow = true;
scene.add(spotLight);

// Flackernde Lichter
const flickeringLights = Array.from({ length: 50 }, () => {
  const light = new THREE.PointLight(0xFFFFFF, Math.random() * 2, 200);
  light.position.set(...Array(3).fill().map(() => (Math.random() - 0.5) * 200));
  scene.add(light);
  return light;
});

// Kamerabewegung
let cameraAngle = 0;
function animate() {
  requestAnimationFrame(animate);

  flickeringLights.forEach(light => light.intensity = Math.random() * 3);

  camera.position.set(50 * Math.cos(cameraAngle), 50, 50 * Math.sin(cameraAngle));
  camera.lookAt(0, 0, 0);
  cameraAngle += 0.005;

  renderer.render(scene, camera);
}

animate();

// Fenstergröße anpassen
window.addEventListener('resize', () => {
  requestAnimationFrame(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
