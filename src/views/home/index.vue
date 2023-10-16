<template>
  <!-- <Test></Test> -->
  <PixelDrawer></PixelDrawer>
  <button @click="$router.push({name: 't'})"></button>
</template>
<script setup lang="tsx">
import { computed, unref } from 'vue';
import Test from './test.vue'
import PixelDrawer from './PixelDrawer.vue'
// import { connect } from 'mqtt'
// console.log(connect, 'df')
// import '@/components/three/test'
// import '@/components/three/solar-system'
// import '@/components/three/gltf'

// import '@/components/three/buffer-attribute'
// import '@/components/three/camera-move'
// import '@/components/three/animation'
// import '@/components/three/demo-02'
// import { matrix, multiply, det, inv } from 'mathjs'
// console.log(matrix, 'math')

// const a = matrix([[18], [9], [1]])

// const x1 = matrix([[1, 0, 0], [0, 1, -10], [0, 0, 1]])
// const x2 = matrix([[1, 0, 0], [0, -1, 0], [0, 0, 1]])
// const x3 = matrix([[1 / 20, 0, 0], [0, 1 / 10, 0], [0, 0, 1]])
// const x4 = matrix([[16, 0, 0], [0, 9, 0], [0, 0, 1]])

// let combine = multiply(x4, multiply(x3, multiply(x2, x1)))

// const res = multiply(combine, a);
// console.log(res, 'res', combine, 'combine')

// const res1 = multiply(inv(combine), res) // 求逆矩阵并 逆向求原始坐标
// console.log(res1, 'res1')

// const m1 = matrix([
//   [-3, 2, -5],
//   [-1, 0, -2],
//   [3, -4, 1]
// ])
// /*
// i want to get m1 adjoint matrix
// */
// const m1Det = det(m1)
// console.log(m1Det, 'm1Det')
// const m1Adj = inv(m1).map((item, index) => {
//   console.log(item, index, 'item')
//   return item * m1Det
// })
// console.log(m1Adj, 'm1Adj')

// const adjoint = multiply(det(m1), inv(m1))
// console.log(adjoint, 'adjoint')






</script>
<style lang="less" scoped></style>