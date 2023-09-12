import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { planeGeometry } from './geometry'
import {
  meshStandardMaterial,

} from './material'
// addons/controls/OrbitControls
const app = document.querySelector('#app')
const orthographicCamera = new THREE.OrthographicCamera(
  -window.innerWidth / 50, window.innerWidth / 50, window.innerHeight / 50, -window.innerHeight / 50, 0.01, 100
);

orthographicCamera.position.z = 10;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0,0,0)

const plane = new THREE.Mesh(planeGeometry, meshStandardMaterial)
plane.receiveShadow = true
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1.5;

const ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1), 1)
const pointLight = new THREE.PointLight(0xffffff, 2)
const lightHelper = new THREE.PointLightHelper(pointLight)
pointLight.position.set(0, 10, 0)
//three/addons/loaders/GLTFLoader.js
const loader = new GLTFLoader()
loader.load('three/a.glb', (gltf) => {
  scene.add(gltf.scene)
})
scene.add(plane)
scene.add(pointLight)
scene.add(ambientLight)
scene.add(lightHelper)


const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(orthographicCamera, renderer.domElement);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
app!.appendChild(renderer.domElement);

controls.target.set(0, 0, 0);

// 启用控件
controls.enabled = true;
function animation(time) {
  controls.update()
  renderer.render(scene, orthographicCamera);
}
