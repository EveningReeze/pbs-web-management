<!-- components/ArticlePopover.vue -->
<template>
    <el-popover placement="left" :width="500" trigger="click" :disabled="!articles?.length">
        <template #reference>
            <el-button link type="primary" size="small" :disabled="!articles?.length">
                查看详情 ({{ articles?.length || 0 }})
            </el-button>
        </template>
        <div class="article-popover">
            <el-table :data="articles" size="small" border>
                <el-table-column prop="title" label="标题" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="views" label="浏览量" width="80" align="center"></el-table-column>
                <slot name="extraColumns" />
                <el-table-column prop="moment" label="发布时间" width="150">
                    <template #default="{ row }">
                        {{ formatDate(row?.moment) }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-popover>
</template>

<script setup lang="ts">
import type { Article } from '@/types/article';

defineProps<{
    articles: Article[];
    formatDate: (date: string) => string;
}>();
</script>

<style scoped>
.article-popover {
    max-height: 400px;
    overflow: auto;
}
</style>