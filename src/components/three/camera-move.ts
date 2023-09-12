import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0,0,0)
const app = document.querySelector('#app')

const light = new THREE.AmbientLight(new THREE.Color(10,10,10), 1)
// light.position.set(10, 10, -10)
// light.lookAt(0, 0, 0)
light.castShadow = true
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10)
const lambertMaterial = new THREE.MeshLambertMaterial({
  side: THREE.DoubleSide,
})
const planeMesh = new THREE.Mesh(planeGeometry, lambertMaterial)
planeMesh.rotation.x = Math.PI / 2
planeMesh.position.x = 0
planeMesh.position.y = 0
planeMesh.position.z = 0
planeMesh.receiveShadow = true
scene.add(planeMesh)
scene.add(light)



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.y = 1;
camera.position.z = 4;
camera.position.x = 0;
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0)
controls.enabled = true

const animation = () => {
  controls.update()
  requestAnimationFrame(animation);
  renderer.render(scene, camera);
}
app?.appendChild(renderer.domElement)
animation()

const moveCameraTo = (key: 'w'|'s'|'a'|'d') => {
  const nowPos = camera.position.clone()
  const map = {
    w: {
      x: 0,
      z: -1,
    },
    s: {
      x: 0,
      z: +1,
    },
    a: {
      x: -1,
      z: 0,
    },
    d: {
      x: +1,
      z: 0,
    }
  }
  const targetPos = new THREE.Vector3(nowPos.x + map[key].x, nowPos.y, nowPos.z + map[key].z)
  camera.position.x = targetPos.x
  camera.position.y = targetPos.y
  camera.position.z = targetPos.z
  const l = camera.position.clone().add(new THREE.Vector3(0, 0, -1))
  camera.lookAt(l)
  camera.updateMatrix()
}

window.addEventListener('keydown', (e) => {
  console.log(e, 'e')
  if (['w', 'a', 's', 'd'].includes(e.key)) {
    moveCameraTo(e.key as 'w'|'s'|'a'|'d')
  }
})
