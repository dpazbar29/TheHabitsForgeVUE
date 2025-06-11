<script setup>
import { ref } from 'vue';
import { useHabitsStore } from '../stores/habits';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { editHabitSchema } from '../validation/editHabitSchema';

const daysOfWeek = [
    { name: 'Lun', value: 1 },
    { name: 'Mar', value: 2 },
    { name: 'Mié', value: 3 },
    { name: 'Jue', value: 4 },
    { name: 'Vie', value: 5 },
    { name: 'Sáb', value: 6 },
    { name: 'Dom', value: 0 }
];

const props = defineProps({
    habit: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['close']);
const habitsStore = useHabitsStore();
const errorMessage = ref('');

const initialValues = ref({
    name: props.habit.name,
    type: props.habit.type,
    targetValue: props.habit.targetValue,
    frequencyType: getInitialFrequencyType(props.habit.scheduledDays),
    customDays: props.habit.scheduledDays || [],
    durationDays: props.habit.durationDays
});

function getInitialFrequencyType(scheduledDays) {
    if (!scheduledDays || scheduledDays.length === 0) return 'daily';
    if (scheduledDays.length === 7) return 'weekly';
    return 'custom';
}

const handleSubmit = async (values) => {
    try {
        const updatedData = {
            name: values.name,
            type: values.type,
            targetValue: values.type === 'quantitative' ? values.targetValue : 1,
            scheduledDays: getScheduledDays(values),
            durationDays: values.durationDays
        };

        await habitsStore.updateHabit(props.habit.id, updatedData);
        emit('close');
    } catch (error) {
        errorMessage.value = error.message;
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
        <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">Editar Hábito</h3>
        <Form 
            :validation-schema="toTypedSchema(editHabitSchema)" 
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
                />
                <ErrorMessage name="name" class="text-red-500 text-sm" />
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-200 mb-2">Tipo de hábito</label>
                <div class="flex gap-4">
                    <label class="flex items-center text-gray-700 dark:text-gray-200">
                        <Field 
                            type="radio" 
                            name="type" 
                            value="binary" 
                            class="mr-2 accent-blue-700 dark:accent-blue-400" 
                        />
                        Sí/No
                    </label>
                    <label class="flex items-center text-gray-700 dark:text-gray-200">
                        <Field 
                            type="radio" 
                            name="type" 
                            value="quantitative" 
                            class="mr-2 accent-blue-700 dark:accent-blue-400" 
                        />
                        Cuantitativo
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
                    <option value="daily">Diario (todos los días)</option>
                    <option value="weekly">Semanal (todos los días de la semana)</option>
                    <option value="custom">Días específicos</option>
                </Field>
                <ErrorMessage name="frequencyType" class="text-red-500 text-sm" />
            </div>

            <div class="mb-4" v-if="values.frequencyType === 'custom'">
                <label class="block text-gray-700 dark:text-gray-200 mb-2">Selecciona días</label>
                <div class="grid grid-cols-7 gap-2">
                    <label 
                        v-for="day in daysOfWeek" 
                        :key="day.value"
                        class="flex flex-col items-center text-sm cursor-pointer"
                    >
                        <Field 
                            type="checkbox" 
                            name="customDays" 
                            :value="day.value" 
                            class="hidden peer"
                        />
                        <div class="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white transition-colors">
                            {{ day.name }}
                        </div>
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

            <div class="flex justify-end gap-4">
                <button 
                    type="button"
                    @click="emit('close')"
                    class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    class="px-4 py-2 bg-blue-700 dark:bg-blue-800 text-white rounded hover:bg-blue-800 dark:hover:bg-blue-900 transition"
                >
                    Guardar Cambios
                </button>
            </div>
        </Form>
    </div>
</template>