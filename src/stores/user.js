import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '../firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth'
import router from '../router'

export const useUserStore = defineStore('user', () => {
    const userData = ref(null)
    const loadingUser = ref(false)
    const authReady = ref(false)

    //Verificar autenticación
    function checkAuth() {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, (user) => {
                userData.value = user ? { email: user.email, uid: user.uid } : null
                authReady.value = true
                resolve(user)
            })
        })
    }

    // Registrar usuario
    async function registerUser(email, password) {
        loadingUser.value = true
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password)
            userData.value = { email: user.email, uid: user.uid }
            router.push('/')
        } catch (error) {
            userData.value = null
            alert(error.message)
        } finally {
            loadingUser.value = false
        }
    }

    // Login usuario
    async function loginUser(email, password) {
        loadingUser.value = true
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password)
            userData.value = { 
                email: user.email, 
                uid: user.uid,
            }
            router.push('/')
        } catch (error) {
            userData.value = null
            alert(error.message)
        } finally {
            loadingUser.value = false
        }
    }

    // Logout usuario
    async function logoutUser() {
        try {
            await signOut(auth)
            userData.value = null
            router.push('/login')
        } catch (error) {
            alert(error.message)
        }
    }

    // Mantener estado de autenticación al refrescar
    onAuthStateChanged(auth, (user) => {
        userData.value = user ? { 
            email: user.email, 
            uid: user.uid
        } : null
    })

    return {
        userData,
        loadingUser,
        authReady,
        checkAuth,
        registerUser,
        loginUser,
        logoutUser
    }
})
