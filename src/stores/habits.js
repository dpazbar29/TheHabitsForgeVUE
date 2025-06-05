import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useHabitsStore = defineStore('habits', {
    state: () => ({
        habits: JSON.parse(localStorage.getItem('habits')) || [],
        pendingSync: JSON.parse(localStorage.getItem('pendingSync')) || false
    }),
    actions: {
        // Crear nuevo hábito
        async createHabit(habitData) {
            try {
                const newHabit = {
                    id: uuidv4(),
                    scheduledDays: [],
                    ...habitData,
                    createdAt: new Date().toISOString()
                };
                
                this.habits.push(newHabit);
                this.persistHabits();
            } catch (error) {
                throw new Error('Error creando hábito: ' + error.message);
            }
        },

        // Eliminar hábito
        async deleteHabit(habitId) {
            try {
                this.habits = this.habits.filter(h => h.id !== habitId);
                this.persistHabits();
            } catch (error) {
                throw new Error('Error eliminando hábito: ' + error.message);
            }
        },

        //Actualizar hábito
        async updateHabit(habitId, updatedData) {
            try {
                const index = this.habits.findIndex(h => h.id === habitId);
                if (index === -1) throw new Error('Hábito no encontrado');
                
                this.habits[index] = {
                    ...this.habits[index],
                    ...updatedData,
                    updatedAt: new Date().toISOString()
                };
                
                this.persistHabits();
                return this.habits[index];
            } catch (error) {
                throw new Error('Error actualizando hábito: ' + error.message);
            }
        },

        // Marcar hábito
        async markHabit(habitId, value) {
            try {
                const today = new Date().toISOString().split('T')[0];
                const habit = this.habits.find(h => h.id === habitId);
                
                habit.history.push({
                    date: today,
                    value: value,
                    status: value > 0 ? 'completed' : 'failed'
                });
                
                this.calculateStreak(habit);
                this.persistHabits();
            } catch (error) {
                throw new Error('Error actualizando hábito: ' + error.message);
            }
        },

        // Persistir en Local Storage
        persistHabits() {
            localStorage.setItem('habits', JSON.stringify(this.habits));
            this.pendingSync = true;
            localStorage.setItem('pendingSync', JSON.stringify(true));
        },

        // Calcular rachas
        calculateStreak(habit) {
            const sortedHistory = [...habit.history].sort((a, b) => new Date(a.date) - new Date(b.date));
            
            let currentStreak = 0;
            let longestStreak = 0;
            let previousDate = null;

            sortedHistory.forEach(entry => {
                if (entry.status === 'completed') {
                    const entryDate = new Date(entry.date);

                    if (!previousDate || entryDate.getTime() - previousDate.getTime() === 86400000) {
                        currentStreak++;
                    } else {
                        currentStreak = 1;
                    }

                    longestStreak = Math.max(longestStreak, currentStreak);
                    previousDate = entryDate;
                } else {
                    currentStreak = 0;
                    previousDate = null;
                }
            });

            habit.currentStreak = currentStreak;
            habit.longestStreak = Math.max(habit.longestStreak, longestStreak);
        },

        async syncWithFirestore(userId) {
            try {
                const { db } = await import('../firebase');
                const { collection, doc, writeBatch } = await import('firebase/firestore');
                
                const batch = writeBatch(db);
                const localIds = new Set(this.habits.map(h => h.id));

                // Paso 1: Sincronizar hábitos locales
                this.habits.forEach(habit => {
                    const habitRef = doc(collection(db, 'habits'), habit.id);
                    batch.set(habitRef, habit);
                });

                // Paso 2: Obtener hábitos remotos y eliminar los que no existen localmente
                const remoteHabits = await this.getRemoteHabits(userId);
                remoteHabits.forEach(remoteHabit => {
                    if (!localIds.has(remoteHabit.id)) {
                        const habitRef = doc(collection(db, 'habits'), remoteHabit.id);
                        batch.delete(habitRef);
                    }
                });

                await batch.commit();
                this.pendingSync = false;
                localStorage.removeItem('pendingSync');

            } catch (error) {
                console.error('Error de sincronización:', error);
                this.queueFailedSync();
            }
        },

        async getRemoteHabits(userId) {
            const { db } = await import('../firebase');
            const { collection, getDocs, query, where } = await import('firebase/firestore');
            
            const q = query(
                collection(db, 'habits'),
                where('userId', '==', userId)
            );
            
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        async queueFailedSync() {
            const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
            queue.push({ timestamp: Date.now(), habits: this.habits });
            localStorage.setItem('syncQueue', JSON.stringify(queue));
        },

        async retryFailedSyncs() {
            const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
            while (queue.length > 0) {
                const { habits } = queue.shift();
                // Implementar lógica de reintento
            }
            localStorage.removeItem('syncQueue');
        }
    }
});
