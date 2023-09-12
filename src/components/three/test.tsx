import * as THREE from 'three'
import {
  boxGeometry, boxGeometry2, coneGeometry, circleGeometry, ringGeometry, dodecahedronGeometry, tubeGeometry,
  edgesGeometry, bufferGeometry, planeGeometry, sphereGeometry
} from './geometry'
import {
  meshNormalMaterial, lineBasicMaterial, meshPhongMaterial, meshPhongMaterial2, meshLambertMaterial, meshLambertMaterial2,
  meshStandardMaterial
} from './material'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// addons/controls/OrbitControls
const app = document.querySelector('#app')

const perspectiveCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
const orthographicCamera = new THREE.OrthographicCamera(
  -window.innerWidth / 50, window.innerWidth / 50, window.innerHeight / 50, -window.innerHeight / 50, 0.01, 100
);
perspectiveCamera.position.z = 15;
perspectiveCamera.position.y = 4;

orthographicCamera.position.z = 10;

const scene = new THREE.Scene();
// scene.background = new THREE.Color(0.8, 0.8, 0.8)
scene.background = new THREE.Color(0,0,0)

const mesh = new THREE.Mesh(tubeGeometry, meshLambertMaterial);
mesh.castShadow = true
const mesh2 = new THREE.Mesh(boxGeometry, meshLambertMaterial);
mesh2.castShadow = true
const mesh3 = new THREE.Mesh(boxGeometry2, meshLambertMaterial);
mesh3.castShadow = true
mesh3.position.x = 4
const mesh4 = new THREE.Mesh(sphereGeometry, meshPhongMaterial2);

mesh4.castShadow = true
mesh4.position.set(0, 4, 4)

const line = new THREE.LineSegments(bufferGeometry, lineBasicMaterial);
const plane = new THREE.Mesh(planeGeometry, meshStandardMaterial)
plane.receiveShadow = true
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1.5;
const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-10, 0, 10),
  new THREE.Vector3(-5, 5, 5),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(5, -5, 5),
  new THREE.Vector3(10, 0, 10)
]);

// 创建线条
const points = curve.getPoints(50);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line2 = new THREE.Line(geometry, lineBasicMaterial);

const ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1), 1)
const spotLight = new THREE.SpotLight( 0xffffff, 2 )
spotLight.position.set( 10, 10, 4 );
spotLight.lookAt(0, 0, 0)
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 1;
spotLight.decay = 1;
spotLight.distance = 36;


spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 100;
spotLight.shadow.focus = 1;
const lightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(ambientLight)
scene.add(spotLight)
scene.add(lightHelper)
scene.add(mesh);
scene.add(mesh2);
scene.add(mesh3);
scene.add(mesh4);
scene.add(plane);
scene.add(line);
// scene.add(line2);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
app!.appendChild(renderer.domElement);


// 创建控件并将其绑定到摄像机上
const controls = new OrbitControls(perspectiveCamera, renderer.domElement);

// 设置目标点为(0, 10, 0)
controls.target.set(0, 0, 0);

// 启用控件
controls.enabled = true;
// controls.autoRotate = true

// animation
function animation(time) {
  mesh2.rotation.x = time / 1000;
  mesh2.rotation.y = time / 500;
  // mesh.rotation.z = time / 500;
  // line.rotation.x = time / 1000;
  // line.rotation.y = time / 500;
  mesh.position.x += 0.1
  if (mesh.position.x > 10) {
    mesh.position.x = -5
  }
  controls.update()
  // spotLight.position.set(10, 10, 0)
  const theta = (time / 1400) % (2 * Math.PI)
  const r = 6
  const x = r * Math.cos(theta)
  const z = r * Math.sin(theta)
  spotLight.position.set(x, 14, z)
  spotLight.lookAt(0, 0, 0)
  // x 0 y 4 z 15
  // perspectiveCamera.position.x = 
  // perspectiveCamera.position.z = 
  // perspectiveCamera.rotation.setFromVector3(new THREE.Vector3(0,0,0))
  // perspectiveCamera.rotateY(0.2)
  renderer.render(scene, perspectiveCamera);
  
}

