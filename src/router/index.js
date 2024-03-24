//router文件夹下新建index.js文件
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/user';
import { showToast } from 'vant';

//注册路由
const routes = [
    {
        path: '/',
        redirect: '/my'
    },
    {
        path: '/home',
        component: () => import('@/views/home.vue'),
        children: [
            {
                path: '/chat',
                component: () => import('../views/chat.vue')
            },
            {
                path: '/shot',
                component: () => import('@/views/shot.vue')
            },
            {
                path: '/text',
                component: () => import('@/views/text.vue')
            },
            {
                path: '/textDetail/:id?',
                component: () => import('@/views/textDetail.vue')
            },
            {
                path: '/shotScan',
                component: () => import('@/views/shotScan.vue')
            },
            {
                path: '/my',
                component: () => import('@/views/my.vue')
            }
        ]
    },
    {
        path: '/index',
        redirect: '/my',
        component: () => import('@/views/index.vue')
    },
    {
        path: '/register',
        component: () => import('@/views/register.vue')
    },
    {
        path: '/picHistory',
        component: () => import('@/views/picHistory.vue')
    },
  
];





const router = createRouter({
    // createWebHashHistory()是使用hash模式路由
    // createWebHistory()是使用history模式路由
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const userStore = useUserStore()
    const email = userStore.user.email
    if (to.path !== '/register' && !token) {
        showToast('请先登录')
        next('/register')
    }
    next()
})

export default router;


