import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const app = document.querySelector('#app')

const orthographicCamera = new THREE.OrthographicCamera(
  -window.innerWidth / 50, window.innerWidth / 50, window.innerHeight / 50, -window.innerHeight / 50, 0.01, 100
);
orthographicCamera.position.z = 10;
// orthographicCamera.position.y = 3;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0,0,0)

const ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1), 1)

scene.add(ambientLight)

const bufferAttribute = new THREE.BufferAttribute(new Float32Array([
  0, 0, 0,
  10, 10, 0,
  0, 10, 0,
  0, 0, 0,
  0, 10, 0,
  -3, 10, 0,
]), 3)
const bufferGeometry = new THREE.BufferGeometry()
bufferGeometry.setAttribute('position', bufferAttribute)

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/three/earth.jpg')
const mesh = new THREE.Mesh(
  bufferGeometry,
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture
  })
)

mesh.name = '123'
const s = new THREE.SphereGeometry(1, 64, 64)
const m = new THREE.Mesh(
  s,
  new THREE.MeshPhongMaterial({
    map: texture,
  })
)
m.name = '444'
console.log(s.attributes.uv, ' s.attributes.uv')
scene.add(mesh)
scene.add(m)

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
app!.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(orthographicCamera, renderer.domElement)
orbitControls.target.set(0, 0, 0)
orbitControls.enabled = true
scene.traverse((obj) => {
  console.log(obj, 'obj')
})
function animation () {
  orbitControls.update()
  if (texture.offset.x < 1) {
    texture.offset.x += 0.01
  } else {
    texture.offset.x = 0
  }
  texture.wrapS = THREE.RepeatWrapping
  renderer.render(scene, orthographicCamera);
}