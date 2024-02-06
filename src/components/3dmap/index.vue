<template>
  <div id="map"></div>
</template>
<script setup lang="tsx">
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
// import { Reflector } from 'three/examples/jsm/objects/Reflector'
import * as d3 from 'd3';
import { createSpriteWithData, createCylinder } from './utils';

// 常量
const DEPTH = 1;
const r = 10
// 摄像机
const orthographicCamera = new THREE.OrthographicCamera(
  -window.innerWidth / r, window.innerWidth / r, window.innerHeight / r, -window.innerHeight / r, 0.01, 200
);
orthographicCamera.position.y = 100;

// 场景
const scene = new THREE.Scene();
// 16, 39, 53
scene.background = new THREE.Color(0x102737)
const ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

// 地图厚边纹理
const texture = new THREE.TextureLoader().load('three/a.png');
texture.needsUpdate = true;
texture.wrapS = THREE.RepeatWrapping;

// 根据点数组生成line和mesh
const drawExtrudeMesh = (polygon, color, projection) => {
  const points: THREE.Vector3[] = [];
  const shape = new THREE.Shape();
  // console.log(polygon, projection);
  polygon.forEach((row, i) => {
    const [x, y] = projection(row);
    // console.log(row, [x, y]);
    if (i === 0) {
      // 创建起点,使用moveTo方法
      // 因为计算出来的y是反过来，所以要进行颠倒
      shape.moveTo(x, -y);
    }
    shape.lineTo(x, -y);
    points.push(new THREE.Vector3(x, -y, DEPTH));
  });

  // 拉伸
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: false,
  });
  // 64, 186, 244
  // 随机颜色
  const randomColor = (0.5 + Math.random() * 0.5) * 0xffffff;
  const c = 0x3eb6ef;
  const material = new THREE.MeshBasicMaterial({
    color: '#40bbf5',
    transparent: true,
    opacity: 0.5,
    // map: texture,
    side: THREE.DoubleSide,
  });
  const material2 = new THREE.MeshPhongMaterial({
    map: texture,
    color: '#ffffff',
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
  })
  // const material2 = new THREE.ShaderMaterial({
  //   side: THREE.DoubleSide,
  // })
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({
    color: 0xffffff,
  }));
  const mesh = new THREE.Mesh(geometry, [material, material2])
  return {
    line,
    mesh,
  };
}

// 旋转光圈效果
const textureLoader = new THREE.TextureLoader()
const texture1 = textureLoader.load('three/rotate-1.png')
const rotatePlane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshBasicMaterial({
    color: 0x1e5079,
    transparent: true,
    map: texture1,
    side: THREE.DoubleSide,
  })
)
rotatePlane.rotateX(Math.PI / 2)
rotatePlane.position.y = -0.1
rotatePlane.scale.set(2.2, 2.2, 2.2)
scene.add(rotatePlane)

// 旋转光圈效果2
const texture2 = textureLoader.load('three/rotate-2.png')
const rotatePlane2 = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshBasicMaterial({
    color: 0x1e5079,
    transparent: true,
    map: texture2,
    side: THREE.DoubleSide,
  })
)
rotatePlane2.rotateX(Math.PI / 2)
rotatePlane2.position.y = -0.2
rotatePlane2.scale.set(2.2, 2.2, 2.2)
scene.add(rotatePlane2)

// json绘制地图和线框
const map = new THREE.Object3D();
const loader = new THREE.FileLoader();
const loadJSON = () => {
  loader.load('geo/100000_full.json', (data: string) => {
    const json = JSON.parse(data);
    const projection = d3.geoMercator().center([105, 39]).translate([0, 0]);
    const features = json.features;
    
    // const c = features[0].geometry.coordinates;
    // const { mesh:m, line } = drawExtrudeMesh(c[0][0], null, projection);
    // const province = new THREE.Object3D();
    // m.rotateX(-Math.PI / 2);
    // m.position.y = -10;
    // line.rotateX(-Math.PI / 2);
    // province.add(line);
    // province.add(m);
    // map.add(province);

    features.forEach((feature) => {
      const province = new THREE.Object3D();
      const coordinates = feature.geometry.coordinates;
      const color = "#99ff99";
      if (feature.geometry.type === "MultiPolygon") {
        coordinates.forEach((coordinate) => {
          coordinate.forEach((rows) => {
            const { mesh, line } = drawExtrudeMesh(rows, color, projection);
            mesh.name = feature.properties.name;
            mesh.rotateX(-Math.PI / 2);
            line.rotateX(-Math.PI / 2);
            province.add(line);
            province.add(mesh);
          });
        })
      }
      if (feature.geometry.type === "Polygon") {
        coordinates.forEach((coordinate) => {
        const { mesh, line } = drawExtrudeMesh(coordinate, color, projection);
          mesh.name = feature.properties.name;
          mesh.rotateX(-Math.PI / 2);
          line.rotateX(-Math.PI / 2);
          province.add(line);
          province.add(mesh);
        });
      }
      map.add(province);
    })
    map.scale.set(1, 1, 1)
    scene.add(map);

    // 地图文字
    const list = [
      {
        name: '北京',
        value: '北京市',
        position: [116.403694,39.91737]
      },
      {
        name: '上海',
        value: '上海市',
        position: [121.474216,31.236176]
      },
      {
        name: '广州',
        value: '广州市',
        position: [113.274879,23.143046]
      },
      {
        name: '深圳',
        value: '深圳市',
        position: [114.068576,22.549257]
      },
    ]
    const center: number[] = []
    list.forEach((item, index) => {
      const res = projection(item.position)!
      if (index == 0) {
        center.push(res[0], 10, res[1])
      } else {
        const target = [res[0], 10, res[1]]
        const x = (target[0] + center[0]) / 2 
        const z = (target[2] + center[2]) / 2
        const y = 40;
        
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(...center),
          new THREE.Vector3(x, y, z),
          new THREE.Vector3(...target)
        );

        // const points = curve.getPoints( 50 );
        // const geometry = new THREE.BufferGeometry().setFromPoints( points );
        // const material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 4, } );
        // const curveObject = new THREE.Line( geometry, material );
        // scene.add(curveObject);

        const c = new THREE.Shape()
        c.arc(0, 0, 0.5, 0, Math.PI * 2, true);
        const g = new THREE.ExtrudeGeometry(c, {
          steps: 200,
          extrudePath: curve,
        })

        const canvas = document.createElement('canvas')
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#000088';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const t = new THREE.Texture(canvas);
        t.needsUpdate = true
        t.repeat.set(1, 1)
        
        const m = new THREE.MeshBasicMaterial({
          color: 0x9fdcf9,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
        })

        const m2 = new THREE.MeshBasicMaterial({
          color: '#ffffff',
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide,
          map: t,
        })
        const mesh = new THREE.Mesh(g, [m, m2]);
        scene.add(mesh);
        
      }
      const sp = createSpriteWithData(item.name)
      sp.scale.set(27,6,1)
      sp.position.set(res[0], 34 + index * 0.001, res[1]);
      scene.add(sp);

      const cylinderGroup = createCylinder()
      cylinderGroup.position.set(res[0], 20 + index * 0.001, res[1]);
      scene.add(cylinderGroup);

      
    })
    
  })
}
loadJSON()
// 添加文字
const fontLoader = new FontLoader()
fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
  const geo = new TextGeometry('China', {
    font,
    size: 10,
    height: 0,
  })

  geo.computeBoundingBox();
  // 镜面
  // const reflector = new Reflector(new THREE.PlaneGeometry(255, 255), {
  //   color: 0xb5b5b5,
  //   textureWidth: window.innerWidth * window.devicePixelRatio,
  //   textureHeight: window.innerHeight * window.devicePixelRatio,
  //   clipBias: 1,
  // })
  // reflector.rotateX(-Math.PI / 2)
  // reflector.position.y = 0.5;
  // scene.add(reflector)


  const materials = [
    new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
  ]
  const m = 
    new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          float opacity = 0.6 - vUv.y / 16.0;
          vec3 color = vec3(1.0);
          gl_FragColor = vec4(color, opacity);
        }
      `
    })

  const mesh = new THREE.Mesh(geo, materials);
  mesh.position.x = -20;
  mesh.position.y = 4;
  mesh.position.z = 80;
  scene.add(mesh);
  const mesh2 = new THREE.Mesh(geo, m);
  mesh2.position.copy(mesh.position);
  mesh2.position.y = -4;
  mesh2.rotateX(Math.PI);
  scene.add(mesh2);
})




// 坐标轴
const axes = new THREE.AxesHelper(100)
scene.add(axes)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);

// 处理hover事件
let intersected: THREE.Object3D<THREE.Event> | null;
const handleHover = (e: MouseEvent) => {
  // console.log('click', e.clientX, e.clientY, e.offsetX, e.offsetY)
  const dom = document.querySelector('#map')
  const raycaster = new THREE.Raycaster()
  const move = new THREE.Vector2()
  move.x = (e.offsetX / dom?.clientWidth!) * 2 - 1
  move.y = -(e.offsetY / dom?.clientHeight!) * 2 + 1
  raycaster.setFromCamera(move, orthographicCamera)
  const intersects = raycaster.intersectObjects(scene.children, true)
  const meshes = intersects.filter(i => i.object.type == 'Mesh' && Array.isArray(i.object.material))
  if (meshes.length > 0) {
    if (intersected != meshes[0].object) {
      if (intersected) intersected.material[0].color = intersected.curColor;
      intersected = meshes[0].object;
      intersected.curColor = intersected.material[0].color;
      (intersected.material[0] as THREE.MeshStandardMaterial).color = new THREE.Color(0x4af0ff)
    }
  } else {
    if (intersected!= null) {
      intersected.material[0].color = intersected.curColor;
    }
    intersected = null
  }
}
renderer.domElement.addEventListener('mousemove', handleHover) // 可模拟hover

// 相机控制 阻尼效果
const orbit = new OrbitControls(orthographicCamera, renderer.domElement)
orbit.enableDamping = true
orbit.dampingFactor = 0.1
onMounted(() => {
  const app = document.querySelector('#map')
  app!.appendChild(renderer.domElement);
})
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
function animation() {
  renderer.render(scene, orthographicCamera);
  if (texture.offset.y < 1) {
    texture.offset.y += 0.01;
  } else {
    texture.offset.y = 0
  }
  orbit.update();

  // rotate
  rotatePlane.rotation.z -= 0.001;
  rotatePlane2.rotation.z += 0.002;
}
</script>
<style lang="less" scoped></style>