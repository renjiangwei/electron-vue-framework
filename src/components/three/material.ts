import * as THREE from 'three';

const meshNormalMaterial = new THREE.MeshNormalMaterial();
const meshPhongMaterial = new THREE.MeshPhongMaterial({
  color: 0x4e94c4
});
const meshLambertMaterial = new THREE.MeshLambertMaterial({
  color: 0x4e94c4
});

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/three/earth4.jpg', (tex) => {
  console.log(tex.image.width, tex.image.height)
});
const textureLoader2 = new THREE.TextureLoader();
const texture2 = textureLoader2.load('/three/earth_cloud.png', (tex) => {
  console.log(tex.image.width, tex.image.height)
});
const meshLambertMaterial2 = new THREE.MeshLambertMaterial({
  color: 0x4e94c4,
  map: texture,
  transparent: true,
  bumpScale: 0.1,
  bumpMap: texture2,
  // shininess: 5,
});

const meshPhongMaterial2 = new THREE.MeshPhongMaterial({
  color: 0x4e94c4,
  map: texture,
  transparent: true,
  bumpScale: 0.1,
  bumpMap: texture2,
  shininess: 5,
});

// texture.mapping = THREE.EquirectangularRefractionMapping;
// texture.wrapS = THREE.ClampToEdgeWrapping;
// texture.wrapT = THREE.ClampToEdgeWrapping;
// texture.flipY = true
// meshLambertMaterial2.map = texture
const lineBasicMaterial = new THREE.LineBasicMaterial({
  color: '#f0f'
})

const lineDashedMaterial = new THREE.LineDashedMaterial({

})

const meshStandardMaterial = new THREE.MeshStandardMaterial({color: 0xaaaaaa})

export {
  meshNormalMaterial,
  lineBasicMaterial,
  meshLambertMaterial,
  meshLambertMaterial2,
  meshPhongMaterial,
  meshPhongMaterial2,
  meshStandardMaterial
}