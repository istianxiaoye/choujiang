<template>
  <RouterView />
</template>
<script setup lang="ts">
import autofit from "autofit.js";
import { onMounted } from "vue";
onMounted(() => {
  autofit.init({
    dh: 1080,
    dw: 1920,
    el: "#app",
    resize: true,
  });
});
</script>
<style scped>
@font-face {
  font-family: "DIN-Bold";
  src: url("/fonts/din-bold.otf");
}

body {
  min-width: 1450px;
}

/* 字体名称 */
.ff-DIN-Bold {
  font-family: "DIN-Bold";
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
