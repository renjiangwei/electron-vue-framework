<template>

</template>
<script setup lang="tsx">
let matrix = [
  0b0000000000,
  0b0000000000,
  0b0000000000,
  0b0000000000,
  0b0000000000,
  0b0000000000,
  0b0000000000,
  0b0000000000,
]

let blocks = [
  [
    0b0100,
    0b0100,
    0b0100,
    0b0100,
  ],
  [
    0b0110,
    0b0110,
    0b0000,
    0b0000,
  ],
]

let block = blocks[Math.floor(Math.random() * blocks.length)]
console.log(block, 'block')

let addBlockToScene = () => {
  matrix
}

</script>
<style lang="less" scoped></style>