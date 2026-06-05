import './style.css';
import * as THREE from 'three';

// ============================================================
// KINGDOM FINANCIAL SERVICES — CINEMATIC WEBGL SCENE
// Adapted from the Fireship Three.js scroll demo structure.
// Scroll position drives the camera through the 3D space.
// ============================================================

// ---- Setup ----
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);
camera.position.setX(-3);

// ---- Color palette ----
const GOLD       = 0xc9a84c;
const GOLD_LIGHT = 0xe8c97a;
const DARK       = 0x0a0a0b;

scene.fog = new THREE.FogExp2(DARK, 0.02);

// ---- Lights ----
const pointLight = new THREE.PointLight(GOLD_LIGHT, 1.2);
pointLight.position.set(8, 8, 8);

const fillLight = new THREE.PointLight(0xffffff, 0.4);
fillLight.position.set(-10, -5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(pointLight, fillLight, ambientLight);

// ---- Hero geometry: a slowly rotating faceted icosahedron ("the core") ----
const coreGeometry = new THREE.IcosahedronGeometry(8, 1);
const coreMaterial = new THREE.MeshStandardMaterial({
  color: GOLD,
  metalness: 0.7,
  roughness: 0.25,
  wireframe: false,
  flatShading: true,
});
const core = new THREE.Mesh(coreGeometry, coreMaterial);
core.position.set(14, 0, 0);
scene.add(core);

// Wireframe shell around the core for depth
const shellGeometry = new THREE.IcosahedronGeometry(10, 1);
const shellMaterial = new THREE.MeshBasicMaterial({
  color: GOLD_LIGHT,
  wireframe: true,
  transparent: true,
  opacity: 0.12,
});
const shell = new THREE.Mesh(shellGeometry, shellMaterial);
shell.position.copy(core.position);
scene.add(shell);

// ---- Particle field (gold "constellation") ----
function addParticle(material) {
  const geometry = new THREE.SphereGeometry(0.08, 8, 8);
  const particle = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(140));
  particle.position.set(x, y, z);
  scene.add(particle);
  return particle;
}

const particleMaterial = new THREE.MeshStandardMaterial({
  color: GOLD_LIGHT,
  emissive: GOLD,
  emissiveIntensity: 0.4,
});
const particles = Array(350).fill().map(() => addParticle(particleMaterial));

// ---- Chapter objects (revealed as you scroll) ----

// Credit chapter — a torus ring (represents the credit "cycle")
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(4, 1.1, 16, 80),
  new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.6, roughness: 0.3 })
);
ring.position.set(-16, -40, -10);
scene.add(ring);

// Debt chapter — a torus knot (represents complexity untangling)
const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(3, 0.9, 100, 16),
  new THREE.MeshStandardMaterial({ color: GOLD_LIGHT, metalness: 0.5, roughness: 0.35 })
);
knot.position.set(18, -80, -12);
scene.add(knot);

// Business chapter — stacked boxes (represents building/structure)
const businessGroup = new THREE.Group();
for (let i = 0; i < 4; i++) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 2.2, 2.2),
    new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? GOLD : GOLD_LIGHT,
      metalness: 0.6,
      roughness: 0.3,
    })
  );
  box.position.y = i * 2.6;
  box.rotation.y = i * 0.4;
  businessGroup.add(box);
}
businessGroup.position.set(-16, -124, -10);
scene.add(businessGroup);

// ---- Scroll-driven camera movement ----
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  // Camera glides downward and shifts as you scroll through chapters
  camera.position.z = 30 + t * -0.01;
  camera.position.y = t * 0.012;
  camera.position.x = -3 + t * -0.0015;
  camera.rotation.y = t * -0.0001;

  // Chapter objects rotate based on scroll for life
  ring.rotation.z = t * 0.001;
  knot.rotation.y = t * 0.0015;
  businessGroup.rotation.y = t * 0.0008;

  // Update progress bar
  const scrollable = document.body.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / scrollable) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
}
document.body.onscroll = moveCamera;
moveCamera();

// ---- Mouse parallax (subtle camera drift) ----
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ---- Animation loop ----
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  // Core breathes and rotates
  core.rotation.x += 0.002;
  core.rotation.y += 0.003;
  shell.rotation.x -= 0.001;
  shell.rotation.y -= 0.0015;
  core.position.y = Math.sin(elapsed * 0.5) * 0.8;
  shell.position.y = core.position.y;

  // Chapter objects idle-spin
  ring.rotation.x += 0.004;
  knot.rotation.x += 0.005;
  businessGroup.children.forEach((box, i) => {
    box.rotation.y += 0.003 + i * 0.0005;
  });

  // Subtle mouse parallax on the base camera position
  camera.position.x += (mouseX * 1.5 - (camera.position.x + 3 + document.body.getBoundingClientRect().top * 0.0015)) * 0.02;

  renderer.render(scene, camera);
}
animate();

// ---- Responsive resize ----
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---- Footer year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Lead form handler — submits to Netlify Forms ----
const form = document.getElementById('lead-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const formData = new FormData(form);
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    });
    btn.textContent = "Thank you — we'll be in touch.";
    btn.style.opacity = '0.75';
    form.querySelectorAll('input, select').forEach((el) => (el.disabled = true));
  } catch (err) {
    btn.textContent = 'Something went wrong — call (201) 989-7108';
    btn.disabled = false;
  }
});
