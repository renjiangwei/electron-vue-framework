<template>
  hello world
  <button @click="handleClick">show sub window</button>
</template>
<script setup lang="tsx">
import { ipcRenderer } from 'electron'
const handleClick = () => {
  ipcRenderer.invoke('show-dialog')
}
</script>
<style lang="less" scoped></style>