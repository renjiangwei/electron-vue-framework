import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'

const s = new Stats()
const clock = new THREE.Clock()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2
camera.position.y = 0.6
const app = document.getElementById('app')

const ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1), 1)


const geometry = new THREE.BoxGeometry()


const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 })

const cube = new THREE.Mesh(geometry, material)
cube.name = 'Box'
scene.add(cube)
scene.add(ambientLight)
scene.add(camera)

const posKF = new THREE.KeyframeTrack('Box.position', [0, 1, 3, 5], [0, 0, 0, 1,1,1, -1, 1, -1, 0,0,0])
const animationClip = new THREE.AnimationClip('Box', 5, [posKF])
const mixer = new THREE.AnimationMixer(cube)
mixer.clipAction(animationClip).play()

const animate = () => {
  requestAnimationFrame(animate)
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  const t = clock.getDelta()
  mixer.update(t)
  s.update();
  renderer.render(scene, camera)
}


const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.setAnimationLoop(animate);
animate()
app?.appendChild(renderer.domElement)
app?.appendChild(s.dom)