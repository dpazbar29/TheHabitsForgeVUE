<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { registerSchema } from '../validation/registerSchema'
import { useUserStore } from '../stores/user'
import { ref } from 'vue'

const userStore = useUserStore()
const errorMsg = ref('')

const onSubmit = async (values, { resetForm }) => {
    errorMsg.value = ''
    try {
        await userStore.registerUser(values.email, values.password)
        resetForm()
    } catch (error) {
        errorMsg.value = error.message || 'Error al registrar usuario'
    }
}
</script>

<template>
    <Form :validation-schema="toTypedSchema(registerSchema)" @submit="onSubmit">
        <div>
            <label for="email">Email</label>
            <Field id="email" name="email" type="email" placeholder="Email" />
            <ErrorMessage name="email" class="text-red-500" />
        </div>
        <div>
            <label for="password">Contraseña</label>
            <Field id="password" name="password" type="password" placeholder="Contraseña" />
            <ErrorMessage name="password" class="text-red-500" />
        </div>
        <div>
            <label for="confirmPassword">Repite contraseña</label>
            <Field id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirma contraseña" />
            <ErrorMessage name="confirmPassword" class="text-red-500" />
        </div>
        <div v-if="errorMsg" class="text-red-500 mt-2">{{ errorMsg }}</div>
        <button type="submit" :disabled="userStore.loadingUser">
            <span v-if="userStore.loadingUser">Registrando...</span>
            <span v-else>Registrarse</span>
        </button>
    </Form>
</template>
