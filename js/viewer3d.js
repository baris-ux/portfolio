import * as THREE from 'https://esm.sh/three@0.155.0';
import { GLTFLoader } from 'https://esm.sh/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three@0.155.0/examples/jsm/controls/OrbitControls.js';

function initViewer(wrap) {
  if (wrap._initialized) return;
  wrap._initialized = true;

  const canvas  = wrap.querySelector('.viewer3d-canvas');
  const hint    = wrap.querySelector('.viewer3d-hint');
  const loading = wrap.querySelector('.viewer3d-loading');
  const modelUrl   = wrap.dataset.model;
  const accentHex  = wrap.dataset.accent || '#FF3CAC';
  const hasAnim    = wrap.dataset.animated === 'true';

  const W = wrap.clientWidth  || 680;
  const H = wrap.clientHeight || 300;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping      = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, W / H, 0.01, 1000);
  camera.position.set(0, 0.5, 4);

  // Lumières
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const sun = new THREE.DirectionalLight(0xffffff, 1.4);
  sun.position.set(4, 6, 4);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(parseInt(accentHex.replace('#',''), 16), 0.5);
  fill.position.set(-4, -2, -3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.3);
  rim.position.set(0, -4, -4);
  scene.add(rim);

  // OrbitControls (drag + zoom)
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping    = true;
  controls.dampingFactor    = 0.08;
  controls.autoRotate       = true;
  controls.autoRotateSpeed  = 1.8;
  controls.enablePan        = false;
  controls.minDistance      = 1;
  controls.maxDistance      = 10;

  // Stop auto-rotate on user interaction
  canvas.addEventListener('pointerdown', () => { controls.autoRotate = false; });

  let mixer = null;

  new GLTFLoader().load(modelUrl, gltf => {
    loading.style.display = 'none';
    hint.style.opacity    = '1';

    const model = gltf.scene;
    const box    = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale  = 2.2 / maxDim;
    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
    scene.add(model);

    controls.target.set(0, 0, 0);
    controls.update();

    if (hasAnim && gltf.animations?.length) {
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach(clip => mixer.clipAction(clip).play());
    }

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      if (mixer) mixer.update(clock.getDelta());
      renderer.render(scene, camera);
    }
    animate();

  }, undefined, () => {
    loading.textContent = '⚠ Modèle introuvable';
  });

  // Resize quand la modale change de taille
  const ro = new ResizeObserver(() => {
    const nW = wrap.clientWidth;
    const nH = wrap.clientHeight;
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });
  ro.observe(wrap);
}

// Initialise les viewers dans les modales au clic sur leur bouton
document.querySelectorAll('.act-read-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
    setTimeout(() => {
      const modal = document.getElementById(modalId);
      if (modal) modal.querySelectorAll('.viewer3d-modal').forEach(initViewer);
    }, 50);
  });
});

// Viewers dans les cartes
document.querySelectorAll('.viewer3d-wrap').forEach(initViewer);
