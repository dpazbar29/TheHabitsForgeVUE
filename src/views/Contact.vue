<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { contactSchema } from '../validation/contactSchema'
import { ref } from 'vue'

const successMsg = ref('')
const errorMsg = ref('')

const onSubmit = async (values, { resetForm }) => {
  // Aquí podrías enviar los datos a tu backend, email, etc.
  try {
    // Simula éxito
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
    <section class="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-blue-100">
        <div class="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-blue-800 mb-6 text-center">Contacto</h2>
            <Form :validation-schema="toTypedSchema(contactSchema)" @submit="onSubmit">
                <div class="mb-4">
                    <label for="name" class="block mb-1 font-medium text-blue-700">Nombre</label>
                    <Field
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Tu nombre"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
                </div>
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
                    <label for="topic" class="block mb-1 font-medium text-blue-700">Tema</label>
                    <Field
                        as="select"
                        id="topic"
                        name="topic"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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
                    <span class="block mb-1 font-medium text-blue-700">Urgencia</span>
                    <div class="flex gap-4">
                        <label class="flex items-center">
                            <Field type="radio" name="urgency" value="baja" class="w-4 h-4 text-blue-600" />
                            <span class="ml-2">Baja</span>
                        </label>
                        <label class="flex items-center">
                            <Field type="radio" name="urgency" value="media" class="w-4 h-4 text-blue-600" />
                            <span class="ml-2">Media</span>
                        </label>
                        <label class="flex items-center">
                            <Field type="radio" name="urgency" value="alta" class="w-4 h-4 text-blue-600" />
                            <span class="ml-2">Alta</span>
                        </label>
                    </div>
                    <ErrorMessage name="urgency" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="mb-4">
                    <label for="message" class="block mb-1 font-medium text-blue-700">Mensaje</label>
                    <Field
                        as="textarea"
                        id="message"
                        name="message"
                        rows="4"
                        placeholder="Escribe tu mensaje aquí..."
                        class="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="message" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="mb-4 flex items-center">
                    <Field type="checkbox" id="accept" name="accept" class="w-4 h-4 text-blue-600" />
                    <label for="accept" class="ml-2 text-sm text-gray-700">Acepto la política de privacidad</label>
                </div>
                <ErrorMessage name="accept" class="text-red-500 text-sm mb-4" />
                <div v-if="successMsg" class="text-green-600 text-center mb-4">{{ successMsg }}</div>
                <div v-if="errorMsg" class="text-red-500 text-center mb-4">{{ errorMsg }}</div>
                <button
                type="submit"
                class="w-full py-2 px-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                    Enviar mensaje
                </button>
            </Form>
        </div>
    </section>
</template>
