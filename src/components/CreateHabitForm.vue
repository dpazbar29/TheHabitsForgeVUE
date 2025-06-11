<script setup>
import { ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { createHabitSchema } from '../validation/createHabitSchema';
import { useHabitsStore } from '../stores/habits';
import { useUserStore } from '../stores/user';

const daysOfWeek = [
    { name: 'Lun', value: 1 },
    { name: 'Mar', value: 2 },
    { name: 'Mié', value: 3 },
    { name: 'Jue', value: 4 },
    { name: 'Vie', value: 5 },
    { name: 'Sáb', value: 6 },
    { name: 'Dom', value: 0 }
];

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
const isSubmitting = ref(false);
const emit = defineEmits(['habit-created']);

const handleSubmit = async (values) => {
    errorMessage.value = '';
    isSubmitting.value = true;
    
    try {
        const habitData = {
            userId: userStore.userData.uid,
            name: values.name,
            type: values.type,
            targetValue: values.type === 'quantitative' ? values.targetValue : 1,
            scheduledDays: getScheduledDays(values),
            frequency: {
                type: values.frequencyType,
                days: values.customDays
            },
            durationDays: values.durationDays,
            history: [],
            currentStreak: 0,
            longestStreak: 0,
            createdAt: new Date().toISOString()
        };

        await habitsStore.createHabit(habitData);
        emit('habit-created');
    } catch (error) {
        errorMessage.value = error.message || 'Error al crear el hábito';
    } finally {
        isSubmitting.value = false;
    }
};

const getScheduledDays = (values) => {
    switch(values.frequencyType) {
        case 'daily': return [];
        case 'weekly': return [0, 1, 2, 3, 4, 5, 6];
        case 'custom': return values.customDays;
        default: return [];
    }
};
</script>

<template>
    <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md transition-colors">
        <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-6">Nuevo Hábito</h3>
        
        <Form 
            :validation-schema="toTypedSchema(createHabitSchema)" 
            :initial-values="initialValues" 
            @submit="handleSubmit"
            v-slot="{ values }"
            class="space-y-4"
        >
            <div>
                <label class="block mb-2 font-medium text-blue-700 dark:text-blue-300">Nombre del hábito</label>
                <Field
                    name="name"
                    type="text"
                    placeholder="Ej: Beber agua"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                />
                <ErrorMessage name="name" class="text-red-500 dark:text-red-400 text-sm mt-1" />
            </div>

            <div>
                <label class="block mb-2 font-medium text-blue-700 dark:text-blue-300">Tipo</label>
                <div class="flex gap-4">
                    <label class="flex items-center">
                        <Field
                            type="radio"
                            name="type"
                            value="binary"
                            class="mr-2 text-blue-600 dark:text-blue-400"
                        />
                        <span class="dark:text-gray-200">Sí/No</span>
                    </label>
                    <label class="flex items-center">
                        <Field
                            type="radio"
                            name="type"
                            value="quantitative"
                            class="mr-2 text-blue-600 dark:text-blue-400"
                        />
                        <span class="dark:text-gray-200">Cantitativo</span>
                    </label>
                </div>
            </div>

            <div v-if="values.type === 'quantitative'">
                <label class="block mb-2 font-medium text-blue-700 dark:text-blue-300">Objetivo diario</label>
                <Field
                    name="targetValue"
                    type="number"
                    min="1"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                />
                <ErrorMessage name="targetValue" class="text-red-500 dark:text-red-400 text-sm mt-1" />
            </div>

            <div>
                <label class="block mb-2 font-medium text-blue-700 dark:text-blue-300">Frecuencia</label>
                <div class="space-y-2">
                    <select 
                        name="frequencyType"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                    >
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="custom">Personalizado</option>
                    </select>
                    
                    <div v-if="values.frequencyType === 'custom'" class="grid grid-cols-3 gap-2">
                        <label
                            v-for="day in daysOfWeek"
                            :key="day.value"
                            class="flex items-center p-2 rounded border border-gray-200 dark:border-gray-700"
                        >
                            <Field
                                type="checkbox"
                                name="customDays"
                                :value="day.value"
                                class="mr-2 text-blue-600 dark:text-blue-400"
                            />
                            <span class="dark:text-gray-200">{{ day.name }}</span>
                        </label>
                    </div>
                    <ErrorMessage name="customDays" class="text-red-500 dark:text-red-400 text-sm mt-1" />
                </div>
            </div>

            <div>
                <label class="block mb-2 font-medium text-blue-700 dark:text-blue-300">Duración (días)</label>
                <Field
                    name="durationDays"
                    type="number"
                    min="1"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                />
                <ErrorMessage name="durationDays" class="text-red-500 dark:text-red-400 text-sm mt-1" />
            </div>

            <div v-if="errorMessage" class="text-red-500 dark:text-red-400 text-center">
                {{ errorMessage }}
            </div>

            <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full py-2 px-4 bg-blue-700 dark:bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-900 transition-colors disabled:opacity-60"
            >
                <span v-if="isSubmitting">Creando hábito...</span>
                <span v-else>Crear Hábito</span>
            </button>
        </Form>
    </div>
</template>
