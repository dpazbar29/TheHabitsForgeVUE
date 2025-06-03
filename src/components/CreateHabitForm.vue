<script setup>
import { ref } from 'vue';
import { useHabitsStore } from '../stores/habits';
import { useUserStore } from '../stores/user';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

const schema = yup.object({
    name: yup.string().required('El nombre es obligatorio'),
    type: yup.string().required('Selecciona el tipo').oneOf(['binary', 'quantitative']),
    targetValue: yup.number().when('type', {
        is: 'quantitative',
        then: (schema) => schema.required('Ingresa un valor objetivo').min(1, 'Mínimo 1')
    }),
    frequencyType: yup.string().required('Selecciona frecuencia').oneOf(['daily', 'weekly', 'custom']),
    customDays: yup.array().when('frequencyType', {
        is: 'custom',
        then: (schema) => schema.min(1, 'Selecciona al menos un día'),
        otherwise: (schema) => schema.notRequired()
    }),
    durationDays: yup.number()
        .required('La duración es obligatoria')
        .min(1, 'Mínimo un día')
        .integer('Debe ser un número entero')
});

const initialValues = {
    name: '',
    type: 'binary',
    targetValue: 1,
    frequencyType: 'daily',
    customDays: [],
    durationDays: 30
};

const habitsStore = useHabitsStore();
const userStore = useUserStore();
const errorMessage = ref('');
const emit = defineEmits(['habit-created']);

const handleSubmit = async (values) => {
    try {
        const habitData = {
            userId: userStore.userData.uid,
            name: values.name,
            type: values.type,
            targetValue: values.type === 'quantitative' ? values.targetValue : 1,
            frequency: {
                type: values.frequencyType,
                days: values.frequencyType === 'custom' ? values.customDays : []
            },
            durationDays: values.durationDays,
            history: [],
            currentStreak: 0,
            longestStreak: 0,
            createdAt: new Date()
        };

        await habitsStore.createHabit(habitData);
        emit('habit-created')
        errorMessage.value = '';
    } catch (error) {
        errorMessage.value = error.message;
    }
};
</script>

<template>
    <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8 transition-colors">
        <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">Nuevo Hábito</h3>
        <Form 
            :validation-schema="schema" 
            :initial-values="initialValues" 
            @submit="handleSubmit"
            v-slot="{ values }"
        >
            <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-200 mb-2">Nombre del hábito</label>
                <Field 
                    name="name" 
                    type="text" 
                    class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                    placeholder="Ej: Beber agua"
                />
                <ErrorMessage name="name" class="text-red-500 text-sm" />
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-200 mb-2">Tipo de hábito</label>
                <div class="flex gap-4">
                    <label class="flex items-center text-gray-700 dark:text-gray-200">
                        <Field type="radio" name="type" value="binary" class="mr-2 accent-blue-700 dark:accent-blue-400" />
                        Sí/No (Ej: ¿Hiciste ejercicio?)
                    </label>
                    <label class="flex items-center text-gray-700 dark:text-gray-200">
                        <Field type="radio" name="type" value="quantitative" class="mr-2 accent-blue-700 dark:accent-blue-400" />
                        Cuantitativo (Ej: Vasos de agua)
                    </label>
                </div>
                <ErrorMessage name="type" class="text-red-500 text-sm" />
            </div>

            <div class="mb-4" v-if="values.type === 'quantitative'">
                <label class="block text-gray-700 dark:text-gray-200 mb-2">Valor objetivo diario</label>
                <Field 
                    name="targetValue" 
                    type="number" 
                    class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                    min="1"
                />
                <ErrorMessage name="targetValue" class="text-red-500 text-sm" />
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-200 mb-2">Frecuencia</label>
                <Field 
                    as="select" 
                    name="frequencyType"
                    class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="custom">Días específicos</option>
                </Field>
                <ErrorMessage name="frequencyType" class="text-red-500 text-sm" />
            </div>

            <div class="mb-4" v-if="values.frequencyType === 'custom'">
                <label class="block text-gray-700 dark:text-gray-200 mb-2">Selecciona días</label>
                <div class="flex flex-wrap gap-4">
                    <label v-for="day in ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']" 
                        :key="day" 
                        class="flex items-center text-gray-700 dark:text-gray-200">
                        <Field 
                            type="checkbox" 
                            name="customDays" 
                            :value="day.toLowerCase()" 
                            class="mr-2 accent-blue-700 dark:accent-blue-400"
                        />
                        {{ day }}
                    </label>
                </div>
                <ErrorMessage name="customDays" class="text-red-500 text-sm" />
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-200 mb-2">Duración (días)</label>
                <Field 
                    name="durationDays" 
                    type="number" 
                    class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                    min="1"
                    step="1"
                />
                <ErrorMessage name="durationDays" class="text-red-500 text-sm" />
            </div>

            <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
            <button 
                type="submit" 
                class="w-full bg-blue-700 dark:bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-800 dark:hover:bg-blue-900 transition"
            >
                Crear Hábito
            </button>
        </Form>
    </div>
</template>
