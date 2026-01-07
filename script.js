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
   TEXTURES
========================= */
function Texture(width, height, rects) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  rects.forEach(r => ctx.fillRect(r.x, r.y, r.w, r.h));

  return new THREE.CanvasTexture(canvas);
}

const carFrontTexture = Texture(40, 80, [{ x: 0, y: 10, w: 30, h: 60 }]);
const carBackTexture = Texture(40, 80, [{ x: 10, y: 10, w: 30, h: 60 }]);
const carRightSideTexture = Texture(110, 40, [
  { x: 10, y: 0, w: 50, h: 30 },
  { x: 70, y: 0, w: 30, h: 30 },
]);
const carLeftSideTexture = Texture(110, 40, [
  { x: 10, y: 10, w: 50, h: 30 },
  { x: 70, y: 10, w: 30, h: 30 },
]);

const truckFrontTexture = Texture(30, 30, [{ x: 5, y: 0, w: 10, h: 30 }]);
const truckRightSideTexture = Texture(25, 30, [{ x: 15, y: 5, w: 10, h: 10 }]);
const truckLeftSideTexture = Texture(25, 30, [{ x: 15, y: 15, w: 10, h: 10 }]);

/* =========================
   CANVAS + RENDERER (FIX)
========================= */
function Renderer() {
  let canvas = document.querySelector("canvas.game");

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.className = "game";
    document.body.prepend(canvas);
  }

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
   INITIALIZE GAME
========================= */
const scoreDOM = document.getElementById("score");
const resultDOM = document.getElementById("result-container");
const finalScoreDOM = document.getElementById("final-score");

function initializeGame() {
  initializePlayer();
  initializeMap();
  if (scoreDOM) scoreDOM.innerText = "0";
  if (resultDOM) resultDOM.style.visibility = "hidden";
}

/* =========================
   START RENDER LOOP
========================= */
const renderer = Renderer();
renderer.setAnimationLoop(animate);

function animate() {
  animateVehicles();
  animatePlayer();
  hitTest();
  renderer.render(scene, camera);
}

/* =========================
   START GAME
========================= */
initializeGame();
