import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// addons/controls/OrbitControls
const app = document.querySelector('#app')

const orthographicCamera = new THREE.OrthographicCamera(
  -window.innerWidth / 50, window.innerWidth / 50, window.innerHeight / 50, -window.innerHeight / 50, 0.01, 100
);

orthographicCamera.position.z = 10;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0,0,0)

const ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1), 1)
const pointLight = new THREE.PointLight(0xffffff, 2)
const lightHelper = new THREE.PointLightHelper(pointLight)
pointLight.position.set(0, 0, 0)



const solar = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshPhongMaterial({
    color: 0xfff1d7,
  })
)
solar.position.set(0, 0, 0)

const loader = new THREE.TextureLoader();
const texture = loader.load('/three/earth4.jpg', () => {});
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshPhongMaterial({
    map: texture,
  })
)
earth.position.set(4, 0, 0)
earth.rotation.z = -0.5

const points = new THREE.Path().absellipse(0 ,0, 4, 5, 0, Math.PI * 2, true, 0).getSpacedPoints(5000)
let g = new THREE.BufferGeometry().setFromPoints(
  points,
  // new THREE.Path().absarc(0, 0, 4, 0, Math.PI * 2, true).getSpacedPoints(50)
);
let m = new THREE.LineBasicMaterial({color: "aqua"});
const v3Points = points.map(v2 => {
  return new THREE.Vector3(v2.x, 0, v2.y)
})
let earthCircle = new THREE.Line(g, m);
earthCircle.rotation.x = Math.PI / 2

scene.add(earthCircle);
scene.add(ambientLight)
scene.add(pointLight)
scene.add(lightHelper)
scene.add(solar)
scene.add(earth)


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
app!.appendChild(renderer.domElement);


// 创建控件并将其绑定到摄像机上
const controls = new OrbitControls(orthographicCamera, renderer.domElement);

// 设置目标点为(0, 10, 0)
controls.target.set(0, 0, 0);

// 启用控件
controls.enabled = true;
// controls.autoRotate = true

// animation
function animation(time) {
  controls.update()
  // spotLight.position.set(10, 10, 0)


  // round 极坐标转直角坐标
  // const theta = (time / 1400) % (2 * Math.PI)
  // const r = 6
  // const x = r * Math.cos(theta)
  // const z = r * Math.sin(theta)
  // spotLight.position.set(x, 14, z)
  // spotLight.lookAt(0, 0, 0)
  // x 0 y 4 z 15
  // perspectiveCamera.position.x = 
  // perspectiveCamera.position.z = 
  // perspectiveCamera.rotation.setFromVector3(new THREE.Vector3(0,0,0))
  // perspectiveCamera.rotateY(0.2)
  const v3 = v3Points[Math.floor((time / 10) % (v3Points.length -1))]
  // const v3 = testpoints[Math.floor((time / 10) % (v3Points.length -1))]
  earth.position.set(v3.x, v3.y, v3.z)
  earth.rotateY(0.01)
  renderer.render(scene, orthographicCamera);
}

