
// earth.js - Interactive 3D Earth with GPS Pins and Orbit Markers

let earth3DInitialized = false;
let pinElements = [];
let earthGroupRef = null;
let cameraRef = null;
let rendererRef = null;
let animationFrameId = null;
let resizeHandler = null;

const earthPins = [
  {
    id: 0,
    title: "Pacific Ocean Warming",
    lat: 0.00,
    lon: -160.00,
    color: "#00ffcc"
  },
  {
    id: 1,
    title: "Mauna Loa CO₂ Observatory",
    lat: 19.54,
    lon: -155.56,
    color: "#f3e600"
  },
  {
    id: 2,
    title: "Antarctic Sea Ice Station",
    lat: -75.25,
    lon: 0.07,
    color: "#38bdf8"
  }
];

function init3DEarth() {
  const container = document.getElementById("earth-canvas-container");

  if (!container) {
    console.error("Earth container not found!");
    return;
  }

  if (earth3DInitialized) {
    resizeEarth();
    return;
  }

  if (!window.THREE) {
    console.error("Three.js is not loaded. Check the Three.js script in index.html.");
    return;
  }

  const THREE = window.THREE;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.1,
    1000
  );

  camera.position.z = 3.2;
  cameraRef = camera;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";

  container.appendChild(renderer.domElement);
  rendererRef = renderer;

  // Load Earth textures
  const textureLoader = new THREE.TextureLoader();

  const earthTexture = textureLoader.load(
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
  );

  const earthSpecular = textureLoader.load(
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"
  );

  const earthClouds = textureLoader.load(
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"
  );

  // Earth group
  const earthGroup = new THREE.Group();
  scene.add(earthGroup);
  earthGroupRef = earthGroup;

  // Earth surface
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

  // Rotating cloud layer
  const cloudMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.015, 64, 64),
    new THREE.MeshStandardMaterial({
      map: earthClouds,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );

  earthGroup.add(cloudMesh);

  // Atmosphere glow
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.04, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    })
  );

  earthGroup.add(atmosphere);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight.position.set(5, 3, 5);
  scene.add(dirLight);

  // GPS markers
  createPinDOMMarkers(container);

  // Mouse rotation
  let isDragging = false;
  let previousMouse = { x: 0, y: 0 };

  container.addEventListener("mousedown", (event) => {
    isDragging = true;

    previousMouse = {
      x: event.clientX,
      y: event.clientY
    };
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  container.addEventListener("mouseleave", () => {
    isDragging = false;
  });

  container.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    earthGroup.rotation.y +=
      (event.clientX - previousMouse.x) * 0.005;

    earthGroup.rotation.x +=
      (event.clientY - previousMouse.y) * 0.005;

    previousMouse = {
      x: event.clientX,
      y: event.clientY
    };
  });

  // Animation
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (!isDragging) {
      earthGroup.rotation.y += 0.0015;
      cloudMesh.rotation.y += 0.002;
    }

    updatePinPositions();

    renderer.render(scene, camera);
  }

  animate();

  // Responsive resizing
  resizeHandler = resizeEarth;
  window.addEventListener("resize", resizeHandler);

  earth3DInitialized = true;

  console.log("3D Earth initialized successfully!");
}

function resizeEarth() {
  const container = document.getElementById("earth-canvas-container");

  if (!container || !cameraRef || !rendererRef) return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  cameraRef.aspect = width / height;
  cameraRef.updateProjectionMatrix();

  rendererRef.setSize(width, height);

  updatePinPositions();
}

function latLonToVector3(lat, lon, radius) {
  const THREE = window.THREE;

  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

function createPinDOMMarkers(container) {
  const THREE = window.THREE;

  // Prevent duplicate markers
  container.querySelectorAll(".earth-gps-pin").forEach(pin => pin.remove());

  pinElements = earthPins.map(pin => {
    const element = document.createElement("div");

    element.className = "earth-gps-pin";

    element.innerHTML = `
      <div class="pin-dot"
        style="
          background:${pin.color};
          box-shadow:0 0 12px ${pin.color};
        ">
      </div>

      <div class="pin-label">
        <span>📍 ${pin.title}</span>
      </div>
    `;

    element.addEventListener("click", () => {
      if (typeof window.goToStage === "function") {
        window.goToStage("stage-jukebox");
      }

      if (typeof window.selectEvent === "function") {
        window.selectEvent(pin.id, true);
      } else {
        console.error("selectEvent function is not available.");
      }
    });

    container.appendChild(element);

    return {
      el: element,
      lat: pin.lat,
      lon: pin.lon
    };
  });
}

function updatePinPositions() {
  if (!earthGroupRef || !cameraRef) return;

  const THREE = window.THREE;
  const container = document.getElementById("earth-canvas-container");

  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  if (!width || !height) return;

  const widthHalf = width / 2;
  const heightHalf = height / 2;

  earthGroupRef.updateMatrixWorld(true);

  pinElements.forEach(item => {
    const position = latLonToVector3(
      item.lat,
      item.lon,
      1.02
    );

    position.applyEuler(earthGroupRef.rotation);
    position.project(cameraRef);

    const checkVector = latLonToVector3(
      item.lat,
      item.lon,
      1
    );

    checkVector.applyEuler(earthGroupRef.rotation);

    const normalMatrix = new THREE.Matrix3()
      .getNormalMatrix(earthGroupRef.matrixWorld);

    const worldNormal = checkVector
      .clone()
      .applyMatrix3(normalMatrix)
      .normalize();

    const cameraDirection = cameraRef.position
      .clone()
      .sub(earthGroupRef.position)
      .normalize();

    const isVisible =
      worldNormal.dot(cameraDirection) > -0.15;

    if (isVisible && position.z < 1) {
      const x = (position.x * widthHalf) + widthHalf;
      const y = -(position.y * heightHalf) + heightHalf;

      item.el.style.transform =
        `translate(-50%, -50%) translate(${x}px, ${y}px)`;

      item.el.style.opacity = "1";
      item.el.style.pointerEvents = "auto";
    } else {
      item.el.style.opacity = "0";
      item.el.style.pointerEvents = "none";
    }
  });
}

// Connect earth.js to app.js
window.EarthExperience = {
  initialize: init3DEarth,
  resize: resizeEarth
};

// Optional cleanup
window.EarthExperience.destroy = function () {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }

  if (rendererRef) {
    rendererRef.dispose();
    rendererRef.domElement.remove();
  }

  const container = document.getElementById("earth-canvas-container");

  if (container) {
    container.querySelectorAll(".earth-gps-pin").forEach(pin => pin.remove());
  }

  pinElements = [];
  earthGroupRef = null;
  cameraRef = null;
  rendererRef = null;
  animationFrameId = null;
  resizeHandler = null;
  earth3DInitialized = false;
};
