const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const serviceAccount = JSON.parse(process.env.VITE_FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

exports.handler = async (event, context) => {
    const db = admin.firestore();
    const usersRef = db.collection('users');
    
    const snapshot = await usersRef.where('allowDailyEmail', '==', true).get();
    
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.VITE_MAILTRAP_USER,
            pass: process.env.VITE_MAILTRAP_PASS
        }
    });

    for (const doc of snapshot.docs) {
        const user = doc.data();
        
        await transporter.sendMail({
            from: '"The Habits Forge" <no-reply@thehabitsforgecompany.com>',
            to: user.email,
            subject: "Tu Recordatorio Diario",
            html: `<p>¡Hola! Este es tu recordatorio diario.</p>`
        });
    }

    return {
        statusCode: 200,
        body: 'Correos enviados exitosamente'
    };
};
