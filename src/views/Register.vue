<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { registerSchema } from '../validation/registerSchema'
import { useUserStore } from '../stores/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const errorMsg = ref('')
const router = useRouter()
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const onSubmit = async (values, { resetForm }) => {
    errorMsg.value = ''
    try {
        await userStore.registerUser(values.email, values.password)
        resetForm()
        router.push('/login')
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            errorMsg.value = 'El correo ya está registrado.'
        } else if (error.code === 'auth/invalid-email') {
            errorMsg.value = 'El email no es válido.'
        } else if (error.code === 'auth/weak-password') {
            errorMsg.value = 'La contraseña es demasiado débil.'
        } else {
            errorMsg.value = error.message || 'Error al registrar usuario'
        }
    }
}
</script>

<template>
    <section class="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-blue-100">
        <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-blue-800 mb-6 text-center">Crear cuenta</h2>
            <Form :validation-schema="toTypedSchema(registerSchema)" @submit="onSubmit">
                <div class="mb-4">
                    <label for="email" class="block mb-1 font-medium text-blue-700">Email</label>
                    <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="mb-4">
                    <label for="password" class="block mb-1 font-medium text-blue-700">Contraseña</label>
                    <div class="relative">
                        <Field
                            :type="showPassword ? 'text' : 'password'"
                            id="password"
                            name="password"
                            placeholder="Contraseña"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                        />
                        <button
                            type="button"
                            class="absolute right-2 top-2 text-blue-700 hover:text-blue-900"
                            tabindex="-1"
                            @click="showPassword = !showPassword"
                            aria-label="Mostrar u ocultar contraseña"
                        >
                            <font-awesome-icon :icon="showPassword ? 'fa-eye' : 'fa-eye-slash'" />
                        </button>
                    </div>
                    <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="mb-4">
                    <label for="confirmPassword" class="block mb-1 font-medium text-blue-700">Repite contraseña</label>
                    <div class="relative">
                        <Field
                            :type="showConfirmPassword ? 'text' : 'password'"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirma contraseña"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                        />
                        <button
                            type="button"
                            class="absolute right-2 top-2 text-blue-700 hover:text-blue-900"
                            tabindex="-1"
                            @click="showConfirmPassword = !showConfirmPassword"
                            aria-label="Mostrar u ocultar confirmación de contraseña"
                        >
                            <font-awesome-icon :icon="showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'" />
                        </button>
                    </div>
                    <ErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1" />
                </div>
                <div v-if="errorMsg" class="text-red-500 text-center mb-4">{{ errorMsg }}</div>
                <button
                    type="submit"
                    :disabled="userStore.loadingUser"
                    class="w-full py-2 px-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-60"
                >
                    <span v-if="userStore.loadingUser">Registrando...</span>
                    <span v-else>Registrarse</span>
                </button>
                <div class="text-center mt-4">
                    <router-link to="/login" class="text-blue-600 hover:underline text-sm">
                        ¿Ya tienes cuenta? Inicia sesión
                    </router-link>
                </div>
            </Form>
        </div>
    </section>
</template>
