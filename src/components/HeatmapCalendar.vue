<script setup>
import { computed } from 'vue'

const props = defineProps({
    history: { type: Array, required: true }
})

// 1. Generar matriz de fechas del heatmap
const heatmapDates = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Calcular fecha inicial (domingo hace 52 semanas)
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - (today.getDay() + 52 * 7))
    
    // Generar 53 semanas x 7 días
    const dates = []
    for (let week = 0; week < 53; week++) {
        const weekDates = []
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(startDate)
            currentDate.setDate(startDate.getDate() + (week * 7 + day))
            weekDates.push(currentDate.toISOString().split('T')[0])
        }
        dates.push(weekDates)
    }
    return dates
})

// 2. Contar completados por fecha
const completionCounts = computed(() => {
    const counts = {}
    props.history.forEach(entry => {
        if (entry.status === 'completed') {
            counts[entry.date] = (counts[entry.date] || 0) + 1
        }
    })
    return counts
})

// 3. Lógica de color mejorada
const getSquareColor = (date) => {
    const count = completionCounts.value[date] || 0
    if (count === 0) return 'bg-gray-200 dark:bg-gray-700'
    if (count === 1) return 'bg-green-300 dark:bg-green-900'
    if (count === 2) return 'bg-green-400 dark:bg-green-800'
    return 'bg-green-500 dark:bg-green-700'
}

// 4. Generar etiquetas de meses precisas
const monthLabels = computed(() => {
    const months = []
    let currentMonth = null
    
    heatmapDates.value.flat().forEach((date, index) => {
        const month = new Date(date).toLocaleString('default', { month: 'short' })
        if (month !== currentMonth) {
            currentMonth = month
            months.push({
                month,
                position: Math.floor(index / 7)
            })
        }
    })
    
    return months
})
</script>

<template>
    <div class="heatmap-container overflow-x-auto pb-4">
        <div class="inline-flex flex-col gap-1">
            <!-- Leyenda de meses -->
            <div class="flex justify-start text-xs text-gray-500 mb-2 ml-14">
                <span 
                    v-for="label in monthLabels" 
                    :key="label.month"
                    :style="{ marginLeft: `${label.offset}px` }"
                    class="inline-block"
                >
                    {{ label.month }}
                </span>
            </div>

            <div class="flex">
                <!-- Días de la semana -->
                <div class="flex flex-col gap-1 mr-2 text-xs text-gray-500">
                    <div v-for="(_, dayIndex) in 7" :key="dayIndex" class="h-4">
                        {{ ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][dayIndex] }}
                    </div>
                </div>

                <!-- Semanas -->
                <div class="flex gap-1">
                    <div 
                        v-for="(weekDates, weekIndex) in heatmapDates" 
                        :key="weekIndex" 
                        class="flex flex-col gap-1"
                    >
                        <div 
                            v-for="(date, dayIndex) in weekDates" 
                            :key="dayIndex"
                            class="w-4 h-4 rounded-sm transition-all hover:scale-125 cursor-pointer"
                            :class="getSquareColor(date)"
                            :title="`Fecha: ${date} | Completado: ${completionCounts[date] || 0} veces`"
                        ></div>
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
