<!-- components/DataTable.vue -->
<template>
    <div class="data-table">
        <div class="table-header">
            <h3>{{ title }}</h3>
            <el-input v-model="search" :placeholder="`搜索${searchPlaceholder}`" prefix-icon="Search" size="small"
                style="width: 200px" clearable />
        </div>
        <el-table :data="filteredData" border stripe style="width: 100%" v-loading="loading">
            <slot />
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    title: string;
    data: any[];
    searchKey: string;
    searchPlaceholder?: string;
    loading?: boolean;
}>();

const search = defineModel<string>('search', { default: '' });

const filteredData = computed(() => {
    if (!search.value || !props.searchKey) return props.data;
    const keyword = search.value.toLowerCase();
    return props.data.filter(item =>
        item[props.searchKey]?.toLowerCase().includes(keyword)
    );
});
</script>

<style scoped>
.data-table {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.table-header h3 {
    margin: 0;
    color: #303133;
    font-size: 18px;
}
</style>