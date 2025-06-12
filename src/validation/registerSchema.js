import * as yup from 'yup';

export const registerSchema = yup.object({
    email: yup.string().required('El email es obligatorio').email('Email no válido'),
    password: yup
        .string()
        .required('La contraseña es obligatoria')
        .min(8, 'Mínimo 8 caracteres')
        .matches(/[A-Z]/, 'Debe contener una mayúscula')
        .matches(/[a-z]/, 'Debe contener una minúscula')
        .matches(/\d/, 'Debe contener un número'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirma tu contraseña'),
    allowDailyEmail: yup.boolean(),
});