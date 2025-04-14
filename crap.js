// Scene and Renderer Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const canvas = document.getElementById('bgCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
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

// Mouse Interaction
let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let baseRotation = { x: 0, y: 0 };

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  targetRotation.y = mouse.x * 0.1;
});

// Load GLB Model
const loader = new THREE.GLTFLoader();
let realCamera;

loader.load('./models/Restaurant3.glb', (gltf) => {
  const model = gltf.scene;
  const modelGroup = new THREE.Group();
  modelGroup.add(model);
  modelGroup.visible = false;
  scene.add(modelGroup);

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
    baseRotation.x = realCamera.rotation.x;
    baseRotation.y = realCamera.rotation.y;
  }

  // Animate materials
  modelGroup.visible = true;
  let delay = 0.2;
  modelGroup.traverse(child => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0;

      gsap.to(child.material, {
        opacity: 1,
        duration: 1,
        delay: delay,
        ease: "powe1.out",
        onUpdate: () => child.material.needsUpdate = true
      });

      delay += 0.05;
    }
  });

  runEntranceAnimations();
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  const cam = realCamera || tempCam;
  cam.rotation.x += ((baseRotation.x + targetRotation.x) - cam.rotation.x) * 0.05;
  cam.rotation.y += ((baseRotation.y + targetRotation.y) - cam.rotation.y) * 0.05;

  renderer.render(scene, cam);
}
animate();

// Resize Handling
window.addEventListener('resize', () => {
  const cam = realCamera || tempCam;
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// GSAP UI Entrance
function runEntranceAnimations() {
  const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });

  tl.from(".navbar", { y: -80, opacity: 0 });

  tl.from(".nav-links li", {
    y: -20,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8
  }, "-=1");

  tl.from(".hero", {
    x: -80,
    opacity: 0
  }, "-=0.8");

  tl.from(".footer-strip", {
    y: 60,
    opacity: 0
  }, "-=0.6");
}