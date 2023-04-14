<template>
  <div class="app">
    <div style="opacity: 0.9;background-color: #21212D; position: absolute; top: 0; left: 0; height: 100%;width: 100%; z-index: 10;"></div>
    <div class="screen-container"
      :style="{ transform: `scale(${state.screen.scale}) translateX(-50%)`, transformOrigin: 'left top',
        position: 'relative', left: '50%', zIndex: 20}"
      >
      <WarnMask :visible="state.screen.raidWarning"></WarnMask>
      <!-- left -->
      <div class="screen-left">
        <div class="screen-left-header">
          <span>本台生安眼累计运行时长：<span class="screen-left-header-time">{{ state.screen.duration }}</span></span>
        </div>
        <div class="screen-left-body">
          <div class="device-title">
            <div style="display: flex; align-items: center;margin-left: 10px;">
              <img src="../assets/screen/radar.svg" alt="" width="42" height="42">
              <span class="device-title-text">设备序列号</span>
            </div>
            <div class="device-title-size">
              {{ state.screen.model }}
            </div>
          </div>
          <div class="device-sn">
            <span class="device-sn-text user-select">{{ state.screen.sn }}</span>
            <span class="device-sn-status">{{ staticState.statusText }}</span>
          </div>
          <div class="device-info">
            <div class="device-info-title">
              生安眼信息
            </div>
            <div class="device-info-body">
              <div class="device-info-item">
                <span class="device-info-item-label">设备型号：</span>
                <span class="device-info-item-value user-select">{{ state.screen.spec }}</span>
              </div>
              <!-- <div class="device-info-item">
                <span class="device-info-item-label">设备序列号：</span>
                <span class="device-info-item-value">{{ sn }}</span>
              </div> -->
              <div class="device-info-item">
                <span class="device-info-item-label">镜像版本号：</span>
                <span class="device-info-item-value user-select">{{ state.screen.version }}</span>
              </div>
              <div class="device-info-item">
                <span class="device-info-item-label">IP地址：</span>
                <span class="device-info-item-value user-select">{{ state.screen.ip }}</span>
              </div>
            </div>
          </div>
          <div class="device-info">
            <div class="device-info-title">
              宿主机信息
            </div>
            <div class="device-info-body">
              <div class="device-info-item">
                <span class="device-info-item-label">宿主机：</span>
                <span class="device-info-item-value">{{ state.screen.cores }}</span>
              </div>
              <div class="device-info-item">
                <span class="device-info-item-label">宿主机内存：</span>
                <span class="device-info-item-value">{{ state.screen.totalMem }}</span>
              </div>
              <div class="device-info-item">
                <span class="device-info-item-label">宿主机硬盘：</span>
                <span class="device-info-item-value">{{ state.screen.diskSize }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- right -->
      <div class="screen-right">
        <div class="screen-right-header">
          <div>
            <img src="../assets/screen/network.png" alt="" v-if="state.screen.net">
            <img src="../assets/screen/no-network.png" alt="" v-else>
            <span class="screen-right-header-time">{{ staticState.nowFormat }}</span>
          </div>
        </div>
        <!-- 设备运行 -->
        <div class="screen-right-device-status">
          <div class="screen-right-title">设备运行</div>
          <div class="device-status-list">
            <!-- 第一个Card -->
            <div class="device-status-card">
              <div class="device-status-card-circle">
                <div style="width:144px; margin: 0 auto;position: relative;">
                  <div class="rotate-circle-img">
                    <img src="../assets/screen/circle-rotate.png" alt="">
                  </div>
                  <svg view-box="0 0 144 144" width="144" height="144" style="transform: rotate(-90deg)">
                    <circle cx="72" cy="72" r="58" stroke="#f2f6fe" stroke-width="8px" fill="transparent" />
                    <circle cx="72" cy="72" r="58" stroke="#efff05" stroke-width="8px" fill="transparent"
                      :stroke-dasharray="Math.PI * 2 * 58" :stroke-dashoffset="cpuDashOffset" class="round-bar"
                      />
                  </svg>
                  <div class="device-percent">
                    <span>{{ state.screen.cpuUsage }}</span>
                    <span style="font-weight:400;font-size:14px;color:#dce0e7;position:relative;top: -12px;">
                      宿主机CPU
                    </span>
                  </div>
                </div>
              </div>
              <div style="display: flex;justify-content: space-around;">
                <div style="text-align: center;">
                  <div class="device-label">{{ state.screen.cpuUsage }}</div>
                  <span class="device-description">CPU利用率</span>
                </div>
                <div style="text-align: center;">
                  <div class="device-label">{{ state.screen.cores }}</div>
                  <span class="device-description">宿主机全部CPU</span>
                </div>
              </div>
            </div>
            <!-- 第二个Card -->
            <div class="device-status-card">
              <div class="device-status-card-circle">
                <div style="width:144px; margin: 0 auto;position: relative;">
                  <div class="rotate-circle-img">
                    <img src="../assets/screen/circle-rotate.png" alt="">
                  </div>
                  <svg view-box="0 0 144 144" width="144" height="144" style="transform: rotate(-90deg)">
                    <circle cx="72" cy="72" r="58" stroke="#f2f6fe" stroke-width="8px" fill="transparent" />
                    <circle cx="72" cy="72" r="58" stroke="#ff7897" stroke-width="8px" fill="transparent"
                      :stroke-dasharray="Math.PI * 2 * 58" :stroke-dashoffset="memoryDashOffset" class="round-bar"
                      />
                  </svg>
                  <div class="device-percent">
                    <span>{{ state.screen.memUsage }}</span>
                    <span style="font-weight:400;font-size:14px;color:#dce0e7;position:relative;top: -12px;">
                      宿主机内存
                    </span>
                  </div>
                </div>
              </div>
              <div style="display: flex;justify-content: space-around;">
                <div style="text-align: center;">
                  <div class="device-label">{{ state.screen.memUsed }}</div>
                  <span class="device-description">已用内存</span>
                </div>
                <div style="text-align: center;">
                  <div class="device-label">{{ state.screen.totalMem }}</div>
                  <span class="device-description">宿主机全部内存</span>
                </div>
              </div>
            </div>
            <!-- 第三个Card -->
            <div class="device-status-card">
              <div class="device-status-card-circle">
                <div style="width:144px; margin: 0 auto;position: relative;">
                  <div class="rotate-circle-img">
                    <img src="../assets/screen/circle-rotate.png" alt="">
                  </div>
                  <svg view-box="0 0 144 144" width="144" height="144" style="transform: rotate(-90deg)">
                    <circle cx="72" cy="72" r="58" stroke="#f2f6fe" stroke-width="8px" fill="transparent" />
                    <circle cx="72" cy="72" r="58" stroke="#6483f7" stroke-width="8px" fill="transparent"
                      :stroke-dasharray="Math.PI * 2 * 58" :stroke-dashoffset="diskDashOffset" class="round-bar"
                      />
                  </svg>
                  <div class="device-percent">
                    <span>{{ state.screen.diskUsage }}</span>
                    <span style="font-weight:400;font-size:14px;color:#dce0e7;position:relative;top: -12px;">
                      宿主机硬盘
                    </span>
                  </div>
                </div>
              </div>
              <div style="display: flex;justify-content: space-around;">
                <div style="text-align: center;">
                  <div class="device-label">{{ state.screen.diskUsed }}</div>
                  <span class="device-description">已用硬盘</span>
                </div>
                <div style="text-align: center;">
                  <div class="device-label">{{ state.screen.diskSize }}</div>
                  <span class="device-description">宿主机全部硬盘</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 实验室安全监控 -->
        <div class="screen-right-lab">
          <div class="screen-right-title">实验室安全监控</div>
          <div class="lab-list">
            <div class="lab-list-card">
              <img src="../assets/screen/2.png" alt="">
              <div class="lab-label">
                <img src="../assets/screen/radar.svg" alt="" width="20" height="20">
                <span>AI视频 监控中</span>
              </div>
            </div>
            <div class="lab-list-card">
              <img src="../assets/screen/1.png" alt="">
              <div class="lab-label">
                <img src="../assets/screen/radar.svg" alt="" width="20" height="20">
                <span>实验环境 监控中</span>
              </div>
            </div>
            <div class="lab-list-card">
              <img src="../assets/screen/3.png" alt="">
              <div class="lab-label">
                <img src="../assets/screen/radar.svg" alt="" width="20" height="20">
                <span>门禁进出 监控中</span>
              </div>
            </div>
            <div class="lab-list-card">
              <img src="../assets/screen/4.png" alt="">
              <div class="lab-label">
                <img src="../assets/screen/radar.svg" alt="" width="20" height="20">
                <span>设备安全 监控中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import WarnMask from './warn-mask.vue'
const app = document.querySelector('#app')! as HTMLElement
const w = window.innerWidth
const h = window.innerHeight
app.style.width = `${w}px`
app.style.height = `${h}px`
app.style.overflow = 'hidden'
window.addEventListener('resize', () => {
  const w = window.innerWidth
  const h = window.innerHeight
  app.style.width = `${w}px`
  app.style.height = `${h}px`
  app.style.overflow = 'hidden'
})
const staticState = reactive({
  nowFormat: '00:00', // 现在时间
  nowTimer: null as null | NodeJS.Timer,
  scaleTimer: null as null | NodeJS.Timer,
  getDataTimer: null as null | NodeJS.Timer,
  statusText: '未知',
})
const state = reactive({
  screen: {
    raidWarning: false, // raid卡告警 请求抛异常555
    duration: '未知', // 累计运行时长
    net: false, // 在线状态
    scale: 1,
    
    model: '未知',
    sn: '未知',

    spec: '未知',
    version: '未知',
    ip: '未知',

    cores: '未知',
    cpuUsage: '0',

    totalMem: '未知',
    memUsed: '未知',
    memUsage: '0',

    diskSize: '未知',
    diskUsed: '未知',
    diskUsage: '0',
  }
})

const cpuDashOffset = computed(() => {
  const dasharray = Math.PI * 2 * 58
  return dasharray * (100 - parseFloat(state.screen.cpuUsage)) / 100
})
const memoryDashOffset = computed(() => {
  const dasharray = Math.PI * 2 * 58
  return dasharray * (100 - parseFloat(state.screen.memUsage)) / 100
})
const diskDashOffset = computed(() => {
  const dasharray = Math.PI * 2 * 58
  return dasharray * (100 - parseFloat(state.screen.diskUsage)) / 100
})

const updateNowTime = () => {
  const now = new Date()
  let h: string | number = now.getHours()
  let m: string | number = now.getMinutes()
  if (h < 10) {
    h = '0' + h
  }
  if (m < 10) {
    m = '0' + m
  }
  staticState.nowFormat = h + ':' + m
}

const setNowTimer = () => {
  clearNowTimer()
  updateNowTime()
  staticState.nowTimer = setInterval(() => {
    updateNowTime()
  }, 1000)
}
const clearNowTimer = () => {
  if (staticState.nowTimer) {
    clearTimeout(staticState.nowTimer);
    staticState.nowTimer = null;
  }
}
const setScaleTimer = () => {
  clearScaleTimer()
  staticState.scaleTimer = setTimeout(() => {
    const width = document.body.clientWidth
    const height = document.body.clientHeight
    const wScale = width / 1920
    const hScale = height / 1080
    state.screen.scale = Math.min(wScale, hScale)
  }, 300)
}

const getData = () => {
  const xhr = new XMLHttpRequest()
  // xhr.open('get', 'http://localhost:3000')
  xhr.open('get', 'http://192.168.131.167:81/api/dashboard/state')
  xhr.send()
  xhr.addEventListener('load', function () {
    const result = JSON.parse(this.response)
    console.log(this.response)
    if (result.code >= 200 && result.code <= 300) {
      state.screen = result.data
      state.screen.cpuUsage = (result.data.cpuUsage * 100).toFixed(2) + '%'
      state.screen.memUsage = (result.data.memUsage * 100).toFixed(2) + '%'
      state.screen.diskUsage = (result.data.diskUsage * 100).toFixed(2) + '%'
      staticState.statusText = '运行中'
      state.screen.raidWarning = false
    } else if (result.code === 555) {
      state.screen.raidWarning = true
    }
  })
  xhr.addEventListener('error', function () {
    console.error('xhr error!')
  })
}
const clearGetDataTimer = () => {
  if (staticState.getDataTimer) {
    clearInterval(staticState.getDataTimer)
    staticState.getDataTimer = null
  }
}
const setGetDataTimer = () => {
  clearGetDataTimer()
  staticState.getDataTimer = setInterval(getData, 1000)
}
onMounted(() => {
  getData()
  setGetDataTimer()
  setNowTimer()
  const width = document.body.clientWidth
  const height = document.body.clientHeight
  const wScale = width / 1920
  const hScale = height / 1080
  state.screen.scale = Math.min(wScale, hScale)
  window.addEventListener('resize', setScaleTimer)
})
onBeforeUnmount(() => {
  clearNowTimer()
  clearScaleTimer()
  clearGetDataTimer()
})
const clearScaleTimer = () => {
  if (staticState.scaleTimer) {
    clearTimeout(staticState.scaleTimer);
    staticState.scaleTimer = null;
  }
}
</script>

<style scoped lang="less">

.user-select {
  user-select: text;
}
.app {
  background-image: url('../assets/screen/screen-bg.gif');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
.screen-container {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  // background-image: url('../assets/screen/screen-bg.gif');
  // background-repeat: no-repeat;
  // background-size: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.screen-left {
  flex-basis: 637px; // 33%
  margin-left: 60px;
  &-header {
    height: 117px;
    font-size: 20px;
    color: #e0e0e0;
    font-weight: 400;
    line-height: 117px;
    > span {
      margin-left: 30px;
    }
    &-time {
      color: #fff;
      font-weight: 500;
    }
  }

  &-body {
    height: 863px;
    background-image: url('../assets/screen/left-bg.svg');
    padding: 30px 25px;
    border-radius: 32px;
  }
}
.device-title {
  display: flex;
  justify-content: space-between;
  img {
    position: relative;
    margin-right: 10px;
  }
  &-text {
    font-family: HarmonyOS_Sans_SC;
    font-weight: 400;
    font-size: 24px;
    color: rgba(184,186,192,1);
  }
  &-size {
    width: 164px;
    height: 53px;
    border-radius: 1px;
    background: linear-gradient(90deg,#0051d8, #171a23);
    font-family: SourceHanSansSC;
    font-weight: 900;
    font-size: 36px;
    color: #fff;
    text-align: center;
    margin-right: 10px;
  }
}
.device-sn {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  &-text {
    font-family: HarmonyOS_Sans_SC;
    font-weight: 700;
    font-size: 48px;
    color: rgba(255,255,255,1);
    margin-left: 52px;
  }
  &-status {
    font-family: SourceHanSansSC;
    font-weight: 400;
    font-size: 36px;
    color: rgb(184, 186, 192);
    margin-right: 38px;
    display: flex;
    align-items: center;
  }
}

.device-info {
  height: 327px;
  background-image: url('../assets/screen/rect-bg2.png'), url('../assets/screen/tube.png');
  background-repeat: no-repeat, no-repeat;
  background-position: 0 0, 450px 196px;
  padding: 48px 75px;
  &-title {
    font-family: SourceHanSansSC;
    font-weight: 400;
    font-size: 18px;
    color: rgba(5,255,203,1);
  }
  &-body {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-top: 20px;
    height: calc(~'100% - 60px');
  }
}

.device-info-item {
  &-label {
    font-family: HarmonyOS_Sans_SC;
    font-weight: 400;
    font-size: 24px;
    color: rgba(184,186,192,1);
  }
  &-value {
    font-family: HarmonyOS_Sans_SC;
    font-weight: 700;
    font-size: 24px;
    color: rgba(255,255,255,1);
  }
}



.screen-right {
  flex-basis: 1053px; // 55%
  margin-right: 60px;
  &-header {    
    height: 117px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    img {
      position: relative;
      top: 4px;
      margin-right: 27px;
    }
    &-time {
      font-family: HarmonyOS_Sans_SC;
      font-weight: 400;
      font-size: 28px;
      color: #fff;
    }
  }
  &-device-status {
    height: 430px;
    background-image: url('../assets/screen/right-top-bg.svg');
    padding: 25px 45px;
    border-radius: 32px;
  }

  &-lab {
    height: 430px;
    background-image: url('../assets/screen/right-bottom-bg.svg');
    padding: 25px 45px;
    border-radius: 32px;
    margin-top: 12px;
  }
  &-title {
    font-family: SourceHanSansSC;
    font-weight: 400;
    font-size: 20px;
    color: rgb(5, 255, 203);
  }
}

.device-status-list {
  display: flex;
  justify-content: space-between;
  margin-top: 35px;
}
.device-status-card {
  background-image: url('../assets/screen/rect-bg.png');
  width: 306px;
  height: 262px;
  &-circle {
    height: 144px;
    margin-top: 35px;
  }
}

.rotate-circle-img {
  position:absolute;
  top:0;
  left:0;
  animation-name: spinning;
  animation-timing-function: linear;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
.device-percent {
  position: absolute;
  text-align: center;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  font-family: SourceHanSansSC;
  font-weight: 700;
  font-size: 28px;
  color: #fff;
  > span {
    display: inline-block;
  }
}
.round-bar {
  transition: 1s;
}
@keyframes spinning {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}

.device-label {
  font-family: SourceHanSansSC;
  font-weight: 700;
  font-size: 20px;
  color: rgb(255, 255, 255);
}
.device-description {
  display: inline-block;
  margin-top: 6px;
  font-family: SourceHanSansSC;
  font-weight: 400;
  font-size: 14px;
  color: rgb(184, 186, 192);
}

.lab-list {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin-top: 40px;
  text-align: center;
  &-card {

  }
  .lab-label {
    margin-top: 30px;
    img {
      position: relative;
      top: -4px;
    }
    span {
      margin-left: 10px;
      color: rgba(221, 252, 253, 100);
      font-size: 20px;
      font-family: HarmonyOS_Sans_SC-bold;
    }
  }
}
</style>