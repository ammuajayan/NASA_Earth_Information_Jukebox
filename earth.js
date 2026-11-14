// earth.js - Three.js Interactive 3D Earth Globe with GPS Pins & Orbit Markers
let earth3DInitialized = false;
let pinElements = [];
let earthGroupRef = null;
let cameraRef = null;

const earthPins = [
  { id: 0, title: "Pacific Ocean Warming", lat: 0.00, lon: -160.00, color: "#00ffcc" },
  { id: 1, title: "Mauna Loa CO₂ Observatory", lat: 19.54, lon: -155.56, color: "#f3e600" },
  { id: 2, title: "Antarctic Sea Ice Station", lat: -75.25, lon: 0.07, color: "#38bdf8" }
];

function init3DEarth() {
  const container = document.getElementById("earth-canvas-container");
  if (!container) return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3.2;
  cameraRef = camera;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
  const earthSpecular = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
  const earthClouds = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);
  earthGroupRef = earthGroup;

  const earthMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({
      map: earthTexture,
      specularMap: earthSpecular,
      roughness: 0.5,
      metalness: 0.1
    })
  );
  earthGroup.add(earthMesh);

  const cloudMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.015, 64, 64),
    new THREE.MeshStandardMaterial({
      map: earthClouds,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    })
  );
  earthGroup.add(cloudMesh);

  earthGroup.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.04, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.12, side: THREE.BackSide })
  ));

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight.position.set(5, 3, 5);
  scene.add(dirLight);

  createPinDOMMarkers(container);

  let isDragging = false, prevMouse = { x: 0, y: 0 };
  container.addEventListener("mousedown", (e) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
  window.addEventListener("mouseup", () => { isDragging = false; });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    earthGroup.rotation.y += (e.clientX - prevMouse.x) * 0.005;
    earthGroup.rotation.x += (e.clientY - prevMouse.y) * 0.005;
    prevMouse = { x: e.clientX, y: e.clientY };
  });

  function animate() {
    requestAnimationFrame(animate);
    if (!isDragging) {
      earthGroup.rotation.y += 0.0015;
      cloudMesh.rotation.y += 0.002;
    }
    updatePinPositions();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  return new THREE.Vector3(x, y, z);
}

function createPinDOMMarkers(container) {
  pinElements = earthPins.map(pin => {
    const el = document.createElement("div");
    el.className = "earth-gps-pin";
    el.innerHTML = `
      <div class="pin-dot" style="background: ${pin.color}; box-shadow: 0 0 12px ${pin.color};"></div>
      <div class="pin-label"><span>📍 ${pin.title}</span></div>
    `;
    el.onclick = () => {
      goToStage('stage-jukebox');
      renderPlaylist();
      selectEvent(pin.id, true);
    };
    container.appendChild(el);
    return { el, lat: pin.lat, lon: pin.lon };
  });
}

function updatePinPositions() {
  if (!earthGroupRef || !cameraRef) return;
  const widthHalf = window.innerWidth / 2;
  const heightHalf = window.innerHeight / 2;

  pinElements.forEach(item => {
    const pos = latLonToVector3(item.lat, item.lon, 1.02);
    pos.applyEuler(earthGroupRef.rotation);
    pos.project(cameraRef);

    const checkVector = latLonToVector3(item.lat, item.lon, 1);
    checkVector.applyEuler(earthGroupRef.rotation);
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(earthGroupRef.matrixWorld);
    const worldNormal = checkVector.clone().applyMatrix3(normalMatrix).normalize();
    const cameraDir = cameraRef.position.clone().sub(earthGroupRef.position).normalize();
    const isVisible = worldNormal.dot(cameraDir) > -0.15;

    if (isVisible && pos.z < 1) {
      const x = (pos.x * widthHalf) + widthHalf;
      const y = -(pos.y * heightHalf) + heightHalf;
      item.el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      item.el.style.opacity = "1";
      item.el.style.pointerEvents = "auto";
    } else {
      item.el.style.opacity = "0";
      item.el.style.pointerEvents = "none";
    }
  });
}