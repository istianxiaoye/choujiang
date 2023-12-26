<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
<template>
  <div class="page">
    <div class="wrapper">
      <nav>
        <RouterLink to="/scrolls">
          <img class="logo" src="@/assets/logo.jpeg" width="125" height="125" />
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page {
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  margin-right: 20px;
  border-radius: 20px;
}
</style>
