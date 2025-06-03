import * as yup from 'yup';

export const contactSchema = yup.object({
    name: yup.string().required('El nombre es obligatorio'),
    email: yup.string().email('Email no válido').required('El email es obligatorio'),
    topic: yup.string().required('Selecciona un tema'),
    urgency: yup.string().required('Selecciona la urgencia'),
    message: yup.string().min(10, 'El mensaje debe tener al menos 10 caracteres').required('El mensaje es obligatorio'),
    accept: yup.boolean().oneOf([true], 'Debes aceptar la política de privacidad'),
});
