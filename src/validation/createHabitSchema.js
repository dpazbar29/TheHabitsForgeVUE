import * as yup from 'yup';

export const createHabitSchema = yup.object({
    name: yup.string().required('El nombre es obligatorio'),
    type: yup.string().required('Selecciona el tipo').oneOf(['binary', 'quantitative']),
    targetValue: yup.number().when('type', {
        is: 'quantitative',
        then: (schema) => schema.required('Ingresa un valor objetivo').min(1, 'Mínimo 1')
    }),
    frequencyType: yup.string()
        .required('Selecciona frecuencia')
        .oneOf(['daily', 'weekly', 'custom']),
    customDays: yup.array()
        .of(yup.number().min(0).max(6))
        .when('frequencyType', {
            is: 'custom',
            then: (schema) => schema.min(1, 'Selecciona al menos un día'),
            otherwise: (schema) => schema.notRequired()
        }),
    durationDays: yup.number()
        .required('La duración es obligatoria')
        .min(1, 'Mínimo un día')
        .integer('Debe ser un número entero')
});
