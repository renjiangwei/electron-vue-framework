<template>
  <div style="position: relative;">
    <div class="home-header">header</div>
    <div class="home-header-placeholder"></div>
    <div class="container">
      <div class="content-container" :style="{transform: `translateY(${-activeValue * 100}%)`}">
        <div class="content-item" v-for="item in list">
          home {{ item.name }}
        </div>
      </div>
      <div class="slide-wrapper">
        <div v-for="(item, index) in list" :class="{'nav-item': true, active: index === activeValue}" @click="navItemClick(index)">
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
// https://www.bytedance.com/zh/products/
import { ref } from 'vue'

const list = ref([
  {
    name: '1',
    label: '11'
  },
  {
    name: '2',
    label: '22'
  },
  {
    name: '3',
    label: '33'
  },
  {
    name: '4',
    label: '44'
  },
])
const activeValue = ref(0)
let wheelTimer: NodeJS.Timer | null = null
window.addEventListener('wheel', (e:WheelEvent) => {
  // todo缺少丝滑的感觉
  if (wheelTimer) {
    clearTimeout(wheelTimer)
    wheelTimer = null
  }
  wheelTimer = setTimeout(() => {
    if (e.deltaY > 0) {
      if (activeValue.value < list.value.length - 1) {
        activeValue.value++
      }
    } else if (e.deltaY < 0) {
      if (activeValue.value > 0) {
        activeValue.value--
      }
    }
  }, 200)
})
const navItemClick = (index: number) => {
  activeValue.value = index
}
</script>
<style lang="less" scoped>
.home-header {
  height: 100px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: dodgerblue;
}

.home-header-placeholder {
  height: 100px;
}
.container {
  position: relative;
  width: 100vw;
  height: calc(100vh - 100px);
}
.content-container {
  height: 100%;
  width: 100%;
  transition: all 0.4s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}
.content-item {
  height: 100%;
  width: 100%;
  // background-color: aqua;
}
.slide-wrapper {
  height: 96%;
  position: absolute;
  top: 5%;
  right: 5%;
  display: flex;
  flex-direction: column;
  .nav-item {
    transition: all 0.3s;
    cursor: pointer;
    &.active {
      transform: scale(1.2);
    }
  }
}


</style>