<template>
  <div class="page-back" @click="$router.back()">&lt; 返回首页</div>
</template>

<style lang="less" scoped>
.page-back {
  display: inline-block;
  background-color: #000;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  color: #b4b8cd;
  font-weight: 700;
  margin-bottom: 20px;
  &:hover {
    color: #fff;
  }
}
</style>
