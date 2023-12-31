import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/index-page',
    },

    {
      path: '/index-page',
      name: 'index-page',
      component: () => import('@/views/IndexPage/index.vue'),
      meta: {
        title: 'lucky-draws',
      },
    },
    {
      path: '/scrolls',
      name: 'scrolls',
      component: () => import('@/views/Scrolls/index.vue'),
      meta: {
        title: 'scrolls',
      },
    },
  ],
});

router.afterEach((to) => {
  // → 设置标题
  if (to.path !== '/favicon.icon') {
    document.title = to.meta.title ? (to.meta.title as string) : '';
  }
  // → 滚动
  window.scrollTo(0, 0);
});
export default router;
