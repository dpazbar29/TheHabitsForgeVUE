import { defineStore } from 'pinia';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';

export const useHabitsStore = defineStore('habits', {
    state: () => ({
        habits: [],
    }),
    actions: {
        // Crear nuevo hábito
        async createHabit(habitData) {
            try {
                await addDoc(collection(db, 'habits'), habitData);
            } catch (error) {
                throw new Error('Error creando hábito: ' + error.message);
            }
        },

        // Eliminar hábito
        async deleteHabit(habitId) {
            try {
                await deleteDoc(doc(db, 'habits', habitId));
            } catch (error) {
                throw new Error('Error eliminando hábito: ' + error.message);
            }
        },

        // Suscripción a hábitos del usuario
        subscribeToUserHabits(userId) {
            const q = query(collection(db, 'habits'), where('userId', '==', userId));
            return onSnapshot(q, (snapshot) => {
                this.habits = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            });
        }
    }
});
