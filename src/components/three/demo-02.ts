import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

console.log('demo-02')
const scene = new THREE.Scene();
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const arcCurve = new THREE.ArcCurve(4, 4, 2, 0, Math.PI * 2, true);
const points = arcCurve.getPoints(50);

const geo = new THREE.BufferGeometry().setFromPoints(points);
const mat = new THREE.LineBasicMaterial({ color: 'aqua' });
const line = new THREE.Line(geo, mat);
scene.add(line);

const plane = new THREE.PlaneGeometry(10, 10, 10, 10);
const mat2 = new THREE.MeshPhongMaterial({ color: 'red', side: THREE.DoubleSide });
const planeMesh = new THREE.Mesh(plane, mat2);
planeMesh.rotation.x = -Math.PI * 0.5;
scene.add(planeMesh);

const loader = new GLTFLoader();
loader.load('three/a.glb', (gltf) => {
  gltf.scene.getObjectByName('Cube')!.position.set(4, 4, 0);
  scene.add(gltf.scene);
})

const app = document.querySelector('#app');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 10;
camera.position.y = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
const orbitControls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 10;
renderer.setSize(window.innerWidth, window.innerHeight);
app!.appendChild(renderer.domElement);




scene.background = new THREE.Color(0,0,0)
const animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate()