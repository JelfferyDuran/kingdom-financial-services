import './style.css';
import * as THREE from 'three';

// ============================================================
// KINGDOM FINANCIAL SERVICES — CINEMATIC WEBGL SCENE
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

// ---- Hero geometry: icosahedron "core" ----
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

// ---- Particle field ----
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

// ---- Chapter objects ----
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(4, 1.1, 16, 80),
  new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.6, roughness: 0.3 })
);
ring.position.set(-16, -40, -10);
scene.add(ring);

const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(3, 0.9, 100, 16),
  new THREE.MeshStandardMaterial({ color: GOLD_LIGHT, metalness: 0.5, roughness: 0.35 })
);
knot.position.set(18, -80, -12);
scene.add(knot);

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

// ---- Scroll-driven camera ----
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = 30 + t * -0.01;
  camera.position.y = t * 0.012;
  camera.position.x = -3 + t * -0.0015;
  camera.rotation.y = t * -0.0001;
  ring.rotation.z = t * 0.001;
  knot.rotation.y = t * 0.0015;
  businessGroup.rotation.y = t * 0.0008;
  const scrollable = document.body.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / scrollable) * 100;
  document.getElementById('progress-bar').style.width = progress + '%';
}
document.body.onscroll = moveCamera;
moveCamera();

// ---- Mouse parallax ----
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ---- Main animation loop ----
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  core.rotation.x += 0.002;
  core.rotation.y += 0.003;
  shell.rotation.x -= 0.001;
  shell.rotation.y -= 0.0015;
  core.position.y = Math.sin(elapsed * 0.5) * 0.8;
  shell.position.y = core.position.y;
  ring.rotation.x += 0.004;
  knot.rotation.x += 0.005;
  businessGroup.children.forEach((box, i) => {
    box.rotation.y += 0.003 + i * 0.0005;
  });
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

// ---- Lead form — Web3Forms ----
const form = document.getElementById('lead-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  try {
    const formData = new FormData(form);
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      btn.textContent = "Thank you — we'll be in touch.";
      btn.style.opacity = '0.75';
      form.querySelectorAll('input, select').forEach((el) => (el.disabled = true));
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    btn.textContent = 'Something went wrong — call (201) 989-7108';
    btn.disabled = false;
  }
});


// ============================================================
// PORTAL ORB — 3D interactive client portal bubble
// ============================================================

const orbCanvas = document.getElementById('portal-orb');
if (orbCanvas) {
  const orbScene = new THREE.Scene();
  const orbCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  orbCamera.position.z = 3.2;

  const orbRenderer = new THREE.WebGLRenderer({
    canvas: orbCanvas,
    antialias: true,
    alpha: true,
  });
  orbRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  orbRenderer.setSize(100, 100);

  // Gold metallic sphere
  const sphereMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 5),
    new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      metalness: 0.85,
      roughness: 0.12,
      emissive: 0x3d2200,
      emissiveIntensity: 0.5,
    })
  );
  orbScene.add(sphereMesh);

  // Orbital ring 1
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.38, 0.033, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0xe8c97a, transparent: true, opacity: 0.85 })
  );
  ring1.rotation.x = Math.PI / 4;
  orbScene.add(ring1);

  // Orbital ring 2
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.38, 0.018, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.45 })
  );
  ring2.rotation.x = -Math.PI / 3.5;
  ring2.rotation.y = Math.PI / 3;
  orbScene.add(ring2);

  // Lights
  const orbKey = new THREE.PointLight(0xffd060, 4, 20);
  orbKey.position.set(3, 3, 3);
  orbScene.add(orbKey);
  const orbFill = new THREE.PointLight(0x4040ff, 0.6, 10);
  orbFill.position.set(-3, -2, 1);
  orbScene.add(orbFill);
  orbScene.add(new THREE.AmbientLight(0xffffff, 0.5));

  // Animation state
  let hovering = false;
  let zooming  = false;
  let zoomT    = 0;
  const orbClk = new THREE.Clock();

  function renderOrb() {
    requestAnimationFrame(renderOrb);
    const t = orbClk.getElapsedTime();

    sphereMesh.rotation.y = t * 0.55;
    sphereMesh.rotation.x = Math.sin(t * 0.28) * 0.18;
    ring1.rotation.z = t * 0.8;
    ring2.rotation.z = -t * 0.55;

    // Hover pulse
    const ts = hovering ? 1.12 : 1.0;
    sphereMesh.scale.setScalar(THREE.MathUtils.lerp(sphereMesh.scale.x, ts, 0.1));
    orbKey.intensity = THREE.MathUtils.lerp(orbKey.intensity, hovering ? 9 : 4, 0.07);

    // Zoom-in on click then open portal
    if (zooming) {
      zoomT = THREE.MathUtils.lerp(zoomT, 1, 0.075);
      orbCamera.position.z = 3.2 - zoomT * 3.15;
      if (zoomT > 0.94) {
        window.open('https://www.secureclientaccess.com/login', '_blank', 'noopener,noreferrer');
        zooming = false;
        zoomT   = 0;
        orbCamera.position.z = 3.2;
        document.getElementById('portal-orb-wrapper')?.classList.remove('orb-zooming');
      }
    }

    orbRenderer.render(orbScene, orbCamera);
  }
  renderOrb();

  // Pointer events
  const wrapper = document.getElementById('portal-orb-wrapper');
  orbCanvas.addEventListener('mouseenter', () => { hovering = true; });
  orbCanvas.addEventListener('mouseleave', () => { hovering = false; });
  orbCanvas.addEventListener('click', () => {
    zooming = true;
    wrapper?.classList.add('orb-zooming');
  });
  orbCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    zooming = true;
    wrapper?.classList.add('orb-zooming');
  }, { passive: false });
}
