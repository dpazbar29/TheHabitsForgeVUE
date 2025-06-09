import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import Home from '../views/Home.vue'
import Contacto from '../views/Contact.vue'
import Perfil from '../views/Profile.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import HabitDetails from '../views/HabitsDetails.vue'
import { useUserStore } from '../stores/user'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/contacto', name: 'Contacto', component: Contacto },
    { path: '/perfil', name: 'Perfil', component: Perfil, meta: { requiresAuth: true } },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/habits/:id', name: 'HabitDetails', component: HabitDetails, meta: { requiresAuth: true } },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const userStore = useUserStore()

    if (!userStore.authReady) {
        await userStore.checkAuth()
    }

    if (requiresAuth && !userStore.userData) {
        next('/login')
    } else if ((to.path === '/login' || to.path === '/register') && userStore.userData) {
        next('/')
    } else {
        next()
    }
})

export default router
