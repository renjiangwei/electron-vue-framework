<template>
  <div style="height: 100vh;width: 100vw;">
    home
  </div>
</template>
<script setup lang="tsx">
import { useRoute } from 'vue-router';
import { login } from '@/api/login';
login({
  username: 'r',
  password: 'as'
}).then(res => {
  console.log(res, 'requ')
})
const route = useRoute()
</script>
<style lang="less" scoped></style>