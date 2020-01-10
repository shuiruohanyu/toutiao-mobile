<template>
  <div id="app">
    <!-- 放置一个容器 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>
<style lang="less">
</style>
