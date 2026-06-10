<!-- components/ChartCard.vue -->
<template>
    <div class="chart-card" v-if="visible">
        <div class="chart-header">
            <span class="chart-title">{{ title }}</span>
            <span class="chart-subtitle">{{ subtitle }}</span>
        </div>
        <AdvancedChart :key="`${title}-${chartKey}`" :option="option" width="100%" height="400px" @click="onClick" />
    </div>
</template>

<script setup lang="ts">
import AdvancedChart from '@/components/charts/AdvancedChart.vue';
import type { EChartsOption } from 'echarts';

defineProps<{
    title: string;
    subtitle: string;
    option: EChartsOption;
    chartKey?: number;
    visible?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click', params: any): void;
}>();

const onClick = (params: any) => {
    emit('click', params);
};
</script>

<style scoped>
.chart-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.3s;
}

.chart-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.chart-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #ebeef5;
}

.chart-title {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
}

.chart-subtitle {
    font-size: 12px;
    color: #909399;
    margin-left: 10px;
}
</style>