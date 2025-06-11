import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useHabitsStore = defineStore('habits', {
    state: () => ({
        habits: JSON.parse(localStorage.getItem('habits')) || [],
        pendingSync: JSON.parse(localStorage.getItem('pendingSync')) || false
    }),
    getters: {
        getHabitById: (state) => (id) => {
            return state.habits.find(habit => habit.id === id);
        },
        
        activeHabits: (state) => {
            return state.habits.filter(habit => !habit.archived);
        },
        
        archivedHabits: (state) => {
            return state.habits.filter(habit => habit.archived);
        },
        
        todaysCompletionStatus: (state) => {
            const today = new Date().toISOString().split('T')[0];
            return state.habits.reduce((acc, habit) => {
                acc[habit.id] = habit.history.some(h => h.date === today && h.status === 'completed');
                return acc;
            }, {});
        },
        
        habitsByCategory: (state) => {
            return state.habits.reduce((acc, habit) => {
                const category = habit.category || 'Sin categoría';
                if (!acc[category]) acc[category] = [];
                acc[category].push(habit);
                return acc;
            }, {});
        }
    },
    actions: {
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

        async deleteHabit(habitId) {
            try {
                this.habits = this.habits.filter(h => h.id !== habitId);
                this.persistHabits();
            } catch (error) {
                throw new Error('Error eliminando hábito: ' + error.message);
            }
        },

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

        async toggleArchiveHabit(habitId) {
            try {
                const habit = this.habits.find(h => h.id === habitId);
                if (!habit) throw new Error('Hábito no encontrado');
                
                habit.archived = !habit.archived;
                this.persistHabits();
                return habit;
            } catch (error) {
                throw new Error('Error archivando hábito: ' + error.message);
            }
        },

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

        persistHabits() {
            localStorage.setItem('habits', JSON.stringify(this.habits));
            this.pendingSync = true;
            localStorage.setItem('pendingSync', JSON.stringify(true));
        },

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

                this.habits.forEach(habit => {
                    const habitRef = doc(collection(db, 'habits'), habit.id);
                    batch.set(habitRef, habit);
                });

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
            const newQueue = [];
            
            for (const item of queue) {
                try {
                    const { db } = await import('../firebase');
                    const { collection, doc, writeBatch, getDocs, query, where } = await import('firebase/firestore');
                    
                    const batch = writeBatch(db);
                    const localIds = new Set(item.habits.map(h => h.id));

                    item.habits.forEach(habit => {
                        const habitRef = doc(collection(db, 'habits'), habit.id);
                        batch.set(habitRef, habit);
                    });

                    const userId = item.habits[0]?.userId;
                    if (!userId) throw new Error('Usuario no identificado en los hábitos en cola');

                    const q = query(
                        collection(db, 'habits'),
                        where('userId', '==', userId)
                    );
                    
                    const snapshot = await getDocs(q);
                    snapshot.docs.forEach(docSnapshot => {
                        if (!localIds.has(docSnapshot.id)) {
                            batch.delete(docSnapshot.ref);
                        }
                    });

                    await batch.commit();
                    console.log('Sincronización retry exitosa para:', item.timestamp);
                } catch (error) {
                    console.error('Error en reintento:', error);
                    newQueue.push(item);
                    
                    if (!item.retryCount) item.retryCount = 1;
                    else item.retryCount++;
                    
                    if (item.retryCount > 5) {
                        console.error('Reintentos agotados para:', item.timestamp);
                        continue;
                    }
                }
            }

            localStorage.setItem('syncQueue', JSON.stringify(newQueue));
            
            if (newQueue.length > 0) {
                this.pendingSync = true;
                localStorage.setItem('pendingSync', JSON.stringify(true));
            }
        }

    }
});
