<!-- components/StatCards.vue -->
<template>
    <el-row :gutter="20" class="stat-cards">
        <el-col :span="6" v-for="card in cards" :key="card.title">
            <div class="stat-card" :style="{ background: card.gradient }">
                <div class="stat-icon">
                    <el-icon>
                        <component :is="card.icon" />
                    </el-icon>
                </div>
                <div class="stat-info">
                    <div class="stat-title">{{ card.title }}</div>
                    <div class="stat-value">{{ card.value }}</div>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { Document, View, Folder, PriceTag } from '@element-plus/icons-vue';

interface StatCard {
    title: string;
    value: number;
    icon: any;
    gradient: string;
}

defineProps<{
    cards: StatCard[];
}>();
</script>

<style scoped>
.stat-cards {
    margin-bottom: 20px;
}

.stat-card {
    border-radius: 12px;
    padding: 20px;
    color: white;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    cursor: pointer;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-icon {
    font-size: 40px;
}

.stat-info {
    flex: 1;
}

.stat-title {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
}

.stat-value {
    font-size: 28px;
    font-weight: bold;
}
</style>