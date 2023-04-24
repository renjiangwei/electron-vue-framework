import * as THREE from 'three'

console.log(THREE, 're')
const app = document.querySelector('#app')

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 1;

const scene = new THREE.Scene();

const boxGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2, 2, 2, 3);

const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh(boxGeometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
app!.appendChild(renderer.domElement);

// animation

function animation(time) {
  mesh.rotation.x = time / 1000;
  mesh.rotation.y = time / 500;
  renderer.render(scene, camera);
}

