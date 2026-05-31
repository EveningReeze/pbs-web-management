<template>
    <!-- 绑定 finalOption 和所有透传属性 -->
    <VChart :option="finalOption" :autoresize="autoresize" :loading="loading" @click="handleClick" class="base-chart"
        :style="{ width, height }" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
// 1. 确保从 echarts 引入类型
import type { EChartsOption } from 'echarts';

// 2. 直接使用 EChartsOption 定义 Props，避免类型冲突
interface Props {
    /** 图表配置项 */
    option: EChartsOption;
    /** 图表宽度 */
    width?: string;
    /** 图表高度 */
    height?: string;
    /** 是否自动调整大小 */
    autoresize?: boolean;
    /** 是否显示加载状态 */
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    width: '100%',
    height: '100%',
    autoresize: true,
    loading: false,
});

// Emits 定义
interface Emits {
    /** 图表点击事件 */
    (e: 'click', params: any): void;
}

const emit = defineEmits<Emits>();

// 计算最终配置
const finalOption = computed(() => props.option);

// 事件处理
const handleClick = (params: any) => {
    emit('click', params);
};
</script>

<style scoped>
.base-chart {
    display: block;
}
</style>