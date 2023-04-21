<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { useAppFullContent } from '@/hooks/useAppFullContent';
// import { ipcRenderer } from 'electron'
useAppFullContent()


</script>

<style scoped></style>
