// Start scripting here
import * as THREE from "https://esm.sh/three";

/* =========================
   CONSTANTS
========================= */
const minTileIndex = -8;
const maxTileIndex = 8;
const tilesPerRow = maxTileIndex - minTileIndex + 1;
const tileSize = 42;

/* =========================
   PLAYER (MUST COME FIRST)
========================= */
function Player() {
  const player = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 20),
    new THREE.MeshLambertMaterial({ color: "white", flatShading: true })
  );
  body.position.z = 10;
  body.castShadow = true;
  body.receiveShadow = true;
  player.add(body);

  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 2),
    new THREE.MeshLambertMaterial({ color: 0xf0619a, flatShading: true })
  );
  cap.position.z = 21;
  cap.castShadow = true;
  cap.receiveShadow = true;
  player.add(cap);

  const container = new THREE.Group();
  container.add(player);

  return container;
}

/* =========================
   LIGHT
========================= */
function DirectionalLight() {
  const light = new THREE.DirectionalLight();
  light.position.set(-100, -100, 200);
  light.up.set(0, 0, 1);
  light.castShadow = true;
  return light;
}

/* =========================
   CAMERA
========================= */
function Camera() {
  const size = 300;
  const viewRatio = window.innerWidth / window.innerHeight;
  const width = viewRatio < 1 ? size : size * viewRatio;
  const height = viewRatio < 1 ? size / viewRatio : size;

  const camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    100,
    900
  );

  camera.up.set(0, 0, 1);
  camera.position.set(300, -300, 300);
  camera.lookAt(0, 0, 0);

  return camera;
}

/* =========================
   RENDERER
========================= */
function Renderer() {
  const canvas = document.querySelector("canvas.game");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  return renderer;
}
/* =========================
   PLAYER
========================= */
function Player() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 20),
    new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true })
  );
  body.position.z = 10;
  group.add(body);

  return group;
}

/* =========================
   LIGHT
========================= */
function DirectionalLight() {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-100, -100, 200);
  light.castShadow = true;
  return light;
}

/* =========================
   PLACEHOLDER GAME FUNCTIONS
   (prevents crashes)
========================= */
function initializePlayer() {}
function initializeMap() {}
function animateVehicles() {}
function animatePlayer() {}
function hitTest() {}

/* =========================
   SCENE SETUP
========================= */
const scene = new THREE.Scene();
const map = new THREE.Group();
scene.add(map);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const player = Player();
scene.add(player);

const dirLight = DirectionalLight();
dirLight.target = player;
player.add(dirLight);

const camera = Camera();
player.add(camera);

/* =========================
   GAME STATE
========================= */
const metadata = [];
const position = { currentRow: 0, currentTile: 0 };
const movesQueue = [];
const moveClock = new THREE.Clock(false);
const clock = new THREE.Clock();

/* =========================
   UI
========================= */
const scoreDOM = document.getElementById("score");
const resultDOM = document.getElementById("result-container");
const finalScoreDOM = document.getElementById("final-score");

/* =========================
   INIT GAME
========================= */
function initializePlayer() {
  player.position.set(0, 0, 0);
  position.currentRow = 0;
  position.currentTile = 0;
  movesQueue.length = 0;
}

function initializeMap() {
  metadata.length = 0;
  map.clear();
}

function initializeGame() {
  initializePlayer();
  initializeMap();
  if (scoreDOM) scoreDOM.innerText = "0";
  if (resultDOM) resultDOM.style.visibility = "hidden";
}

/* =========================
   ANIMATION LOOP
========================= */
const renderer = Renderer();
renderer.setAnimationLoop(animate);

function animate() {
  renderer.render(scene, camera);
}

/* =========================
   START GAME
========================= */
initializeGame();
