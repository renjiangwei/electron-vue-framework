import * as THREE from 'three'

/**
 * @description 用canvas绘制精灵纹理
 * @returns {THREE.Sprite}
 */
const createSpriteWithData = (label: string) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = 270
  canvas.height = 60
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  // ctx.fillRect(0, 0, 100, 60)
  ctx.beginPath()
  ctx.moveTo(0, 60);
  ctx.quadraticCurveTo(-10, 0, 40, 0);
  ctx.lineTo(250, 0)
  ctx.arc(234, 30, 30, -Math.PI / 2, Math.PI / 2, false);
  ctx.lineTo(0, 60);
  ctx.fill();
  ctx.closePath()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 40px Arial'
  ctx.fillText(label, 30, 45)

  ctx.fillStyle = '#7efbf6'
  ctx.shadowColor = '#7efbf6'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.font = 'bold 36px Arial'
  ctx.fillText('2', 220, 43)
  const t = new THREE.Texture(canvas)
  t.needsUpdate = true
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, }))
  return sp;
}

/**
 * 创建圆柱体
 * @returns {THREE.Group}
 */
const createCylinder = () => {
  const g = new THREE.Group();
  const geo = new THREE.CylinderGeometry(0.8, 0.8, 20, 32, 32, false, 0, Math.PI * 2);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      // height: {
      //   value: 10.0,
      // },
    },
    transparent: true,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      // uniform float height;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        float y = uv.y;

        // 31, 91, 119
        // float r = y * 0.878 + 0.122;
        // float g = y * 0.643 + 0.357;
        // float b = y * 0.233 + 0.767;

        // 254, 249, 158
        float r = y * 0.006 + 0.997;
        float g = y * 0.0470 + 0.9765;
        float b = y * 0.7608 + 0.6196;
        if (y > 0.5) {
          r = 1.0;
          g = 1.0;
          b = 1.0;
        }
        gl_FragColor = vec4(r, g, b, 0.8);
      }
    `,
  })
  const material2 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    opacity: 0.5,
  })
  const mesh = new THREE.Mesh(geo, [material, material2]);
  g.add(mesh)

  const planeGeo = new THREE.PlaneGeometry(4.0, 20, 32, 32);
  // const texture = new THREE.TextureLoader().load('three/light.png');
  // const material3 = new THREE.MeshStandardMaterial({
  //   emissive: 0xff0000,
  //   map: texture,
  //   transparent: true,
  //   side: THREE.DoubleSide,
  //   opacity: 0.3,
  // })
  const material3 = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      opacity: {
        value: 0.8,
      }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float opacity;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        float x = uv.x;
        float y = uv.y;
        float o;
        if (x < 0.5) {
          o = uv.x * opacity;
        } else {
          o = -opacity * x + opacity;
        }
        if (y < 0.5) {
          o = o - 0.4 * (0.5 - y);
        }
        gl_FragColor = vec4(1.0, 1.0, 1.0, o);
      }
    `,
  })

  const planeMesh = new THREE.Mesh(
    planeGeo,
    material3,
  );
  g.add(planeMesh)

  
  const planeMesh2 = new THREE.Mesh(
    planeGeo,
    material3,
  );
  planeMesh2.rotateY(-Math.PI / 3)
  g.add(planeMesh2)
  const planeMesh3 = new THREE.Mesh(
    planeGeo,
    material3,
  );
  planeMesh3.rotateY(Math.PI / 3)
  g.add(planeMesh3)

  // 底部圆环
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!;
  canvas.width = 100;
  canvas.height = 100;

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(50, 50, 50, 0, Math.PI * 2);
  ctx.moveTo(50 - 10, 50);
  ctx.arc(50, 50, 40, 0, Math.PI * 2, true);
  ctx.fill();
  
  ctx.clip()
  
  
  const ring = new THREE.PlaneGeometry(10, 10);
  const t = new THREE.Texture(canvas);
  t.needsUpdate = true;
  const ringMat = new THREE.MeshBasicMaterial({
    transparent: true,
    map: t,
    side: THREE.DoubleSide,
  })
  const ringMesh = new THREE.Mesh(ring, ringMat);
  ringMesh.rotateX(-Math.PI / 2);
  ringMesh.position.y = -9.9;
  g.add(ringMesh)
  // 底部旋转
  const r = () => {
    ringMesh.rotation.z += 0.01;
    requestAnimationFrame(r)
  }
  r();
  return g;
}

export {
  createSpriteWithData,
  createCylinder
}