// Scene and Renderer Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // White background

const canvas = document.getElementById('bgCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Enable Gamma Correction
renderer.gammaFactor = 2.2;
renderer.gammaOutput = true;

// Tone Mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// Fallback Camera
const tempCam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
tempCam.position.set(0, 1, 5);
scene.add(tempCam);

// Lights
const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
sunLight.position.set(50, 100, 50);
sunLight.castShadow = true;
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Visible Sun Sphere
const sunGeo = new THREE.SphereGeometry(5, 32, 32);
const sunMat = new THREE.MeshStandardMaterial({
  color: 0xffdd88,
  emissive: 0xffdd88,
  roughness: 0.5,
  metalness: 0.1
});
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
sunMesh.position.copy(sunLight.position);
scene.add(sunMesh);

// Shadow Quality
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.1;
sunLight.shadow.camera.far = 200;

// Mouse and Rotation Variables
let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let baseRotation = { x: 0, y: 0 }; // <- new

// Update target rotation on mouse move
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   targetRotation.x = mouse.y * 0.2; // Vertical sensitivity
  targetRotation.y = mouse.x * 0.1; // Horizontal sensitivity
});

// Load GLB Model
const loader = new THREE.GLTFLoader();
let realCamera;

loader.load('./models/Restaurant3.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  const craio = model.getObjectByName('craio');
  if (craio) {
    realCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.add(realCamera);

    craio.updateMatrixWorld();
    craio.getWorldPosition(realCamera.position);

    const forward = new THREE.Vector3();
    craio.getWorldDirection(forward);
    forward.add(realCamera.position);
    realCamera.lookAt(forward);

    realCamera.rotation.y = THREE.MathUtils.degToRad(-60);

    // Store base rotation after initial setup
    baseRotation.x = realCamera.rotation.x;
    baseRotation.y = realCamera.rotation.y;

  } else {
    console.warn('Object named "craio" not found in model.');
  }
  
}, undefined, (error) => {
  console.error('Error loading model:', error);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  const cam = realCamera || tempCam;

  // Smooth camera rotation follow, relative to base rotation
  cam.rotation.x += ((baseRotation.x + targetRotation.x) - cam.rotation.x) * 0.05;
  cam.rotation.y += ((baseRotation.y + targetRotation.y) - cam.rotation.y) * 0.05;

  renderer.render(scene, cam);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
  const cam = realCamera || tempCam;
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('load', () => {
  // Animate Navbar from top
  gsap.from(".navbar", {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
  });

  // Animate Hero Section from left
  gsap.from(".hero", {
    x: -100,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power4.out"
  });

  // Animate Footer from bottom
  gsap.from(".footer-strip", {
    y: 100,
    opacity: 0,
    duration: 1,
    delay: 1,
    ease: "power4.out"
  });
});
