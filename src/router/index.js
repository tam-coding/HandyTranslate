//router文件夹下新建index.js文件
import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'

//注册路由
const routes = [
    {
        path: '/',
        redirect: '/home'
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
            }
        ]
    },


];





const router = createRouter({
// createWebHashHistory()是使用hash模式路由
// createWebHistory()是使用history模式路由
    history: createWebHashHistory(),
    routes
});

export default router;
