const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.VITE_FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

exports.handler = async () => {
    const db = admin.firestore();
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('allowDailyEmail', '==', true).get();

    if (snapshot.empty) {
        return {
            statusCode: 200,
            body: 'No hay usuarios para enviar correos.'
        };
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.VITE_GMAIL_USER,
            pass: process.env.VITE_GMAIL_PASS
        }
    });

    for (const doc of snapshot.docs) {
        const user = doc.data();
        try {
            await transporter.sendMail({
                from: `"The Habits Forge" <${process.env.VITE_GMAIL_USER}>`,
                to: user.email,
                subject: "Tu Recordatorio Diario",
                html: `<p>¡Hola! Este es tu recordatorio diario.</p>`
            });
        } catch (err) {
            console.error(`Error enviando a ${user.email}:`, err);
        }
    }

    return {
        statusCode: 200,
        body: 'Correos enviados exitosamente'
    };
};
