import { defineStore } from 'pinia';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where, arrayUnion, serverTimestamp } from 'firebase/firestore';

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
        },

        // Marcar hábito
        async markHabit(habitId, value) {
            try {
                const habitRef = doc(db, 'habits', habitId)
                //Formato YYYY-MM-DD
                const today = new Date().toISOString().split('T')[0]
                await updateDoc(habitRef, {
                    history: arrayUnion({
                        date: today,
                        value: value,
                        status: value > 0 ? 'completed' : 'failed'
                    })
                });

                await this.calculateStreak(habitRef)
            } catch (error) {
                throw new Error('Error actualizando hábito: ' + error.message)
            }
        },

        // Calcular rachas
        async calculateStreak(habitRef) {
            const habit = this.habits.find(h => h.id === habitRef.id)
            if (!habit) return

            const sortedHistory = [...habit.history].sort((a, b) => new Date(a.date) - new Date(b.date))

            let currentStreak = 0
            let longestStreak = 0
            let previousDate = null

            sortedHistory.forEach(entry => {
                if (entry.status === 'completed') {
                    const entryDate = new Date(entry.date)

                    if (!previousDate || entryDate.getTime() - previousDate.getTime() === 86400000) {
                        currentStreak ++
                    } else {
                        currentStreak = 1
                    }

                    if (currentStreak > longestStreak) {
                        longestStreak = currentStreak
                    }

                    previousDate = entryDate
                } else {
                    currentStreak = 0
                    previousDate = null
                }
            });

            await updateDoc(habitRef, {
                currentStreak,
                longestStreak: Math.max(habit.longestStreak, longestStreak)
            });
        }
    }
});
