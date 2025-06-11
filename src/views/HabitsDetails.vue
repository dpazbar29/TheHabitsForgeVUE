<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHabitsStore } from '../stores/habits'

const route = useRoute()
const habitsStore = useHabitsStore()
const habitId = route.params.id

const habit = computed(() => 
    habitsStore.getHabitById(habitId)
)

const heatmapDates = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - (today.getDay() + 52 * 7))
    
    const weeks = []
    for (let week = 0; week < 53; week++) {
        const weekDates = []
        for (let day = 0; day < 7; day++) {
            const d = new Date(startDate)
            d.setDate(startDate.getDate() + week * 7 + day)
            weekDates.push(d.toISOString().split('T')[0])
        }
        weeks.push(weekDates)
    }
    return weeks
})

const completionCounts = computed(() => {
    const counts = {}
    habit.value.history.forEach(entry => {
        if (entry.status === 'completed') {
            counts[entry.date] = (counts[entry.date] || 0) + 1
        }
    })
    return counts
})

const getSquareColor = (date) => {
    const count = completionCounts.value[date] || 0
    if (count === 0) return 'bg-gray-200 dark:bg-gray-700'
    if (count === 1) return 'bg-green-300 dark:bg-green-900'
    if (count === 2) return 'bg-green-400 dark:bg-green-800'
    return 'bg-green-500 dark:bg-green-700'
}

const monthLabels = computed(() => {
    const labels = []
    let lastMonth = null
    heatmapDates.value.forEach((weekDates, weekIdx) => {
        const firstDayOfWeek = weekDates[0]
        const month = new Date(firstDayOfWeek).toLocaleString('default', { month: 'short' })
        if (month !== lastMonth) {
            labels.push({ month, weekIdx })
            lastMonth = month
        }
    })
    return labels
})
</script>

<template>
    <div class="max-w-4xl mx-auto p-6 min-h-screen">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {{ habit.name }}
            </h1>
            <button 
                @click="$router.go(-1)"
                class="px-4 py-2 bg-blue-700 dark:bg-blue-800 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-900 transition-colors"
            >
                ← Volver
            </button>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 class="text-sm text-gray-500 mb-1">Racha actual</h3>
                <p class="text-2xl font-bold text-green-500">
                    {{ habit.currentStreak }} días
                </p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 class="text-sm text-gray-500 mb-1">Récord</h3>
                <p class="text-2xl font-bold text-blue-500">
                    {{ habit.longestStreak }} días
                </p>
            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div class="heatmap-container overflow-x-auto pb-4">
                <div class="inline-flex flex-col gap-1">
                    <div class="flex mb-2 ml-12 relative" style="height: 16px;">
                        <span
                            v-for="(label, idx) in monthLabels"
                            :key="label.month + label.weekIdx"
                            :style="{ 
                                position: 'absolute', 
                                left: `calc(${label.weekIdx} * 1.25rem)`,
                                zIndex: 10
                            }"
                            class="text-xs text-gray-500 dark:text-gray-400 bg-background"
                        >
                            {{ label.month }}
                        </span>
                    </div>

                    <div class="flex">
                        <div class="flex flex-col gap-1 mr-2 text-xs text-gray-500 dark:text-gray-400">
                            <div 
                                v-for="(dayName, dayIndex) in ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']" 
                                :key="dayName" 
                                class="h-5 flex items-center"
                            >
                                {{ dayName }}
                            </div>
                        </div>

                        <div class="flex gap-1">
                            <div 
                                v-for="(weekDates, weekIndex) in heatmapDates" 
                                :key="weekIndex" 
                                class="flex flex-col gap-1"
                            >
                                <div 
                                    v-for="(date, dayIndex) in weekDates" 
                                    :key="dayIndex"
                                    class="w-5 h-5 rounded-sm transition-all hover:scale-125 cursor-pointer"
                                    :class="getSquareColor(date)"
                                    :title="`Fecha: ${date} | Completado: ${completionCounts[date] || 0} veces`"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.heatmap-container::-webkit-scrollbar {
    height: 8px;
    background-color: #f5f5f5;
}

.heatmap-container::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 4px;
}

.dark .heatmap-container::-webkit-scrollbar {
    background-color: #1a1a1a;
}

.dark .heatmap-container::-webkit-scrollbar-thumb {
    background-color: #4b4b4b;
}
</style>
