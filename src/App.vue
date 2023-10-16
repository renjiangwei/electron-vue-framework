<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { useAppFullContent } from '@/hooks/useAppFullContent';
// import { ipcRenderer } from 'electron'
import { a } from 'test-module'
console.log(a, 'a')
useAppFullContent()


</script>

<style scoped></style>
