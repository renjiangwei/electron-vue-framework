<template>
  {{ msg }}
  <button @click="handleClick">close</button>
</template>
<script setup lang="tsx">
import { ipcRenderer } from 'electron' 
const msg = localStorage.getItem('msg')
const handleClick = () => {
  ipcRenderer.invoke('close-dialog')
}
</script>
<style lang="less" scoped></style>