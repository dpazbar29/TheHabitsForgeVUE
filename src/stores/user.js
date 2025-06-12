import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '../firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth'
import router from '../router'
import { useHabitsStore } from './habits'
import { db } from '../firebase'
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', () => {
    const userData = ref(null)
    const loadingUser = ref(false)
    const authReady = ref(false)
    const deleteLoading = ref(false)
    const deleteError = ref(null)

    function checkAuth() {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (user) => {
                if(user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    
                    userData.value = { 
                        email: user.email, 
                        uid: user.uid,
                        allowDailyEmail: docSnap.exists() ? docSnap.data().allowDailyEmail : false
                    }
                } else {
                    userData.value = null
                }
                authReady.value = true
                resolve(user)
            })
        })
    }

    async function registerUser(email, password, allowDailyEmail = false) {
    loadingUser.value = true
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            allowDailyEmail: allowDailyEmail
        });

        userData.value = { 
            email: user.email, 
            uid: user.uid,
            allowDailyEmail: allowDailyEmail 
        }
        router.push('/')
    } catch (error) {
        userData.value = null
        alert(error.message)
    } finally {
        loadingUser.value = false
    }
}

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

    async function logoutUser() {
        try {
            await signOut(auth)
            userData.value = null
            router.push('/login')
        } catch (error) {
            alert(error.message)
        }
    }

    async function deleteAccount(password) {
        deleteLoading.value = true;
        deleteError.value = null;
        
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No hay usuario autenticado');

            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            await deleteDoc(doc(db, "users", user.uid));

            const habitsStore = useHabitsStore();
            await habitsStore.deleteAllUserHabits(user.uid);

            await user.delete();

            userData.value = null;
            habitsStore.clearLocalData();
            localStorage.clear();
            router.push('/login');
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                deleteError.value = 'Contraseña incorrecta';
            } else {
                deleteError.value = mapAuthError(error.code);
            }
            throw error;
        } finally {
            deleteLoading.value = false;
        }
    }

    function mapAuthError(code) {
        const errors = {
            'auth/wrong-password': 'Contraseña incorrecta',
            'auth/requires-recent-login': 'Debes volver a iniciar sesión para realizar esta acción',
            'auth/user-not-found': 'Usuario no encontrado',
            'auth/too-many-requests': 'Demasiados intentos. Intenta nuevamente más tarde',
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
        }
        return errors[code] || 'Error al eliminar la cuenta'
    }

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
        deleteLoading,
        deleteError,
        checkAuth,
        registerUser,
        loginUser,
        logoutUser,
        deleteAccount
    }
})
