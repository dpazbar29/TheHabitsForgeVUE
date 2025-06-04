/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.syncHabits = functions.https.onRequest(async (req, res) => {
  const {userId, habits} = req.body;

  try {
    const db = admin.firestore();
    const batch = db.batch();

    // Sincronizar hábitos locales
    habits.forEach((habit) => {
      const ref = db.collection("habits").doc(habit.id);
      batch.set(ref, habit);
    });

    // Eliminar hábitos remotos no existentes
    const remoteHabits = await db.collection("habits")
        .where("userId", "==", userId)
        .get();

    const localIds = new Set(habits.map((h) => h.id));
    remoteHabits.forEach((doc) => {
      if (!localIds.has(doc.id)) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();
    res.status(200).send("OK");
  } catch (error) {
    console.error("Error en Cloud Function:", error);
    res.status(500).send("Error");
  }
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
