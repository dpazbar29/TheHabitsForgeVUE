<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { contactSchema } from '../validation/contactSchema'
import { ref } from 'vue'

const successMsg = ref('')
const errorMsg = ref('')

const onSubmit = async (values, { resetForm }) => {
    try {
        successMsg.value = '¡Mensaje enviado correctamente!'
        errorMsg.value = ''
        resetForm()
    } catch (error) {
        errorMsg.value = 'No se pudo enviar el mensaje. Intenta de nuevo.'
        successMsg.value = ''
    }
}
</script>

<template>
    <section class="flex items-center justify-center min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <div class="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 transition-colors">
            <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-6 text-center">Contacto</h2>
            <Form :validation-schema="toTypedSchema(contactSchema)" @submit="onSubmit">
                <div class="mb-4">
                    <label for="name" class="block mb-1 font-medium text-blue-700 dark:text-blue-300">Nombre</label>
                    <Field
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Tu nombre"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                    />
                    <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="mb-4">
                    <label for="email" class="block mb-1 font-medium text-blue-700 dark:text-blue-300">Email</label>
                    <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                    />
                    <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="mb-4">
                    <label for="topic" class="block mb-1 font-medium text-blue-700 dark:text-blue-300">Tema</label>
                    <Field
                        as="select"
                        id="topic"
                        name="topic"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                    >
                        <option value="">Selecciona un tema</option>
                        <option value="soporte">Soporte técnico</option>
                        <option value="sugerencia">Sugerencia</option>
                        <option value="colaboracion">Colaboración</option>
                        <option value="otro">Otro</option>
                    </Field>
                    <ErrorMessage name="topic" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="mb-4">
                    <span class="block mb-1 font-medium text-blue-700 dark:text-blue-300">Urgencia</span>
                    <div class="flex gap-4">
                        <label class="flex items-center text-gray-700 dark:text-gray-200">
                            <Field type="radio" name="urgency" value="baja" class="w-4 h-4 accent-blue-600 dark:accent-blue-400" />
                            <span class="ml-2">Baja</span>
                        </label>
                        <label class="flex items-center text-gray-700 dark:text-gray-200">
                            <Field type="radio" name="urgency" value="media" class="w-4 h-4 accent-blue-600 dark:accent-blue-400" />
                            <span class="ml-2">Media</span>
                        </label>
                        <label class="flex items-center text-gray-700 dark:text-gray-200">
                            <Field type="radio" name="urgency" value="alta" class="w-4 h-4 accent-blue-600 dark:accent-blue-400" />
                            <span class="ml-2">Alta</span>
                        </label>
                    </div>
                    <ErrorMessage name="urgency" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="mb-4">
                    <label for="message" class="block mb-1 font-medium text-blue-700 dark:text-blue-300">Mensaje</label>
                    <Field
                        as="textarea"
                        id="message"
                        name="message"
                        rows="4"
                        placeholder="Escribe tu mensaje aquí..."
                        class="w-full p-2.5 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-colors"
                    />
                    <ErrorMessage name="message" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="mb-4 flex items-center">
                    <Field type="checkbox" id="accept" name="accept" class="w-4 h-4 accent-blue-600 dark:accent-blue-400" />
                    <label for="accept" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Acepto la política de privacidad</label>
                </div>
                <ErrorMessage name="accept" class="text-red-500 text-sm mb-4" />
                <div v-if="successMsg" class="text-green-600 dark:text-green-400 text-center mb-4">{{ successMsg }}</div>
                <div v-if="errorMsg" class="text-red-500 text-center mb-4">{{ errorMsg }}</div>
                <button
                type="submit"
                class="w-full py-2 px-4 bg-blue-700 dark:bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-900 transition-colors"
                >
                    Enviar mensaje
                </button>
            </Form>
        </div>
    </section>
</template>

