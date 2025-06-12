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

    const today = new Date().toISOString().split('T')[0];

    for (const userDoc of snapshot.docs) {
        const user = userDoc.data();
        
        try {
            const habitsSnapshot = await db.collection('habits')
                .where('userId', '==', userDoc.id)
                .get();

            const hasPendingHabits = habitsSnapshot.docs.some(doc => {
                const habit = doc.data();
                return !habit.history.some(h => h.date === today && h.status === 'completed');
            });

            if (hasPendingHabits) {
                await transporter.sendMail({
                    from: `"The Habits Forge" <${process.env.VITE_GMAIL_USER}>`,
                    to: user.email,
                    subject: "Tienes hábitos pendientes hoy",
                    html: `<p>¡Hola! Aún tienes hábitos por completar hoy. Acuérdate de comprobarlos a diario para que no se te pasen ¡NO PIERDAS LA RACHA!</p>`
                });
            }
        } catch (err) {
            console.error(`Error procesando usuario ${user.email}:`, err);
        }
    }

    return {
        statusCode: 200,
        body: 'Proceso de envío completado'
    };
};
