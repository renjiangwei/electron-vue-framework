<template>
  <div class="warn-mask" v-if="visible">
    <div class="warn-container">
      <div class="warn-radar">
        <img src="../assets/screen/warn-radar.png" alt="" width="250">
      </div>
      <div class="warn-center">
        <div>
          <img src="../assets/screen/warn-icon.png" alt="">
        </div>
        <div class="warn-text-container">
          <div>WARNING</div>
          <div>RAID降级！</div>
          <div>请尽快联系运维人员</div>
        </div>
      </div>
      <div class="warn-radar">
        <img src="../assets/screen/warn-radar.png" alt="" width="250">
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    default: false,
  }
})
</script>
<style lang="less" scoped>
.warn-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(50, 35, 35, 0.9);
  display: flex;
  justify-content: center;
}

.warn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
}
.warn-radar > img {
  animation-name: spinning;
  animation-timing-function: linear;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}
.warn-center {
  width: 1121px;
  height: 485px;
  background-image: url('../assets/screen/warn-card-bg.png');
  position: relative;
  top: 10px;
  padding: 50px 180px;
  display: flex;
  align-items: center;
  > div {
    animation-name: fade-in;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .warn-text-container {
    width: 502px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 28px;
    color: #fb083f;
    font-family: SourceHanSansSC;
    div:nth-of-type(1) {
      font-weight: 700;
      font-size: 72px;
      margin-left: 24px;
    }
    div:nth-of-type(2) {
      font-weight: 900;
      font-size: 90px;
    }
    div:nth-of-type(3) {
      font-weight: 400;
      font-size: 36px;
      margin-left: 46px;
    }
  }
}

@keyframes spinning {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}

@keyframes fade-in {
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
      opacity: 0;
  }
}
</style>