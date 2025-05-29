import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import Home from '../views/Home.vue'
import Contacto from '../views/Contacto.vue'
import Perfil from '../views/Perfil.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/contacto', name: 'Contacto', component: Contacto },
    { path: '/perfil', name: 'Perfil', component: Perfil, meta: { requiresAuth: true } },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const user = auth.currentUser

    if (requiresAuth && !user) {
        next('/login')
    } else {
        next()
    }
})

export default router
