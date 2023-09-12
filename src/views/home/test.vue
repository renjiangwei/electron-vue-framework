<template>
  <div class="container">
    <div class="header">
      <button @click="handleClick">按钮</button>
    </div>
    <div class="content">
      <div class="left">123</div>
      <div class="right">
        <div class="top"></div>
        <div class="bottom">
          <div style="height: 90px; background-color: #f8f8f8;"></div>
          <div style="height: calc(100% - 90px);background-color: aquamarine; overflow-y: auto;">
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
// import fs from 'fs'
// import mqtt from 'mqtt'
// console.log(mqtt, 'mqtt')
import { ipcRenderer } from 'electron'
// ipcRenderer.send('open-win')
// const a = mqtt.connect('ws://192.168.131.16:8083/mqtt')
// a.on('connect', () => {
//   console.log('connect')
// })
// fs.readFile('./index.vue',{}, (err, data) => {
//   console.log(data, 'data')
// })


const handleClick = () => {
  console.log('ad')
  ipcRenderer.invoke('show-dialog', 'msg')
  localStorage.setItem('msg', 'msgffdffggg')
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  .header {
    height: 90px;
    background-color: #dd8800;
  }
}
.content {
  height: calc(100% - 90px);
  display: flex;
  .left {
    width: 70%;
  }
  .right {
    width: 30%;
    display: flex;
    flex-direction: column;
    .top {
      height: 500px;
      flex-shrink: 0;
    }
    .bottom {
      flex-grow: 1;
      background-color: aqua;
      // overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>