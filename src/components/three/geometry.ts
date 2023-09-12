import * as THREE from 'three';

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxGeometry2 = new THREE.BoxGeometry(1, 2, 1);
const coneGeometry = new THREE.ConeGeometry(2, 2);
const circleGeometry = new THREE.CircleGeometry(2, 50, 0);
const ringGeometry = new THREE.RingGeometry(1, 2, 60, 32, 0, 2 * Math.PI);
const dodecahedronGeometry = new THREE.DodecahedronGeometry(2, 0);

class CustomCurve extends THREE.Curve<THREE.Vector3> {
  private scale: number;
	constructor(scale = 1) {
		super();
		this.scale = scale;
	}
	getPoint(t, optionalTarget = new THREE.Vector3()) {
		const tx = t - 0.5;
		// const ty = Math.sin(2 * Math.PI * t);
    const tt = Math.abs(0.25 - tx ** 2)
		const ty = Math.pow(tt, 0.5);
		// const ty = tx ** 2;
		// const ty = Math.tan(Math.PI * t - Math.PI / 2);
		const tz = 0;
		return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
	}
}

const path = new CustomCurve(10);
const tubeGeometry = new THREE.TubeGeometry(path, 100, 0.4, 80, false); // path?

const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);

const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setFromPoints([
  new THREE.Vector3(0, 0, -10),
  new THREE.Vector3(0, 0, 10),
  new THREE.Vector3(0, -10, 0),
  new THREE.Vector3(0, 10, 0),
  new THREE.Vector3(-10, 0, 0),
  new THREE.Vector3(10, 0, 0),
])

const planeGeometry = new THREE.PlaneGeometry(30, 30);

const sphereGeometry = new THREE.SphereGeometry(3, 1024, 1024)



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

export {
  boxGeometry,
  boxGeometry2,
  coneGeometry,
  circleGeometry,
  ringGeometry,
  dodecahedronGeometry,
  tubeGeometry,
  edgesGeometry,
  bufferGeometry,
  planeGeometry,
  sphereGeometry,
}