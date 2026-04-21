<template>
    <div class="tag-group">
        <el-tag v-for="(item, index) in tags" :key="index" :type="item.active ? 'primary' : 'info'" effect="light" round
            class="clickable-tag" :class="{ 'is-active': item.active }" @click="handleTagClick(index)">
            {{ item.label }}
        </el-tag>
    </div>
</template>

<script setup lang="ts">
import type { TagItem } from '../types'

interface Props {
    tags: TagItem[]
}

interface Emits {
    (e: 'change', index: number, item: TagItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleTagClick = (index: number) => {
    // 修复1：先检查 index 是否有效
    if (index < 0 || index >= props.tags.length) return

    // 修复2：获取当前项，并检查是否存在
    const currentItem = props.tags[index]
    if (!currentItem) return

    // 更新选中状态
    props.tags.forEach((item, i) => {
        item.active = i === index
    })

    emit('change', index, currentItem)
}
</script>

<style lang="less" scoped>
.tag-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.clickable-tag {
    cursor: pointer;
    margin: 5px;
    transition: all 0.3s ease;
    border: 1px solid transparent;

    &:hover:not(.is-active) {
        transform: translateY(-2px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}

.is-active {
    background-color: #ecf5ff !important;
    color: #409eff !important;
    border-color: #b3d8ff !important;
    font-weight: bold;
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}
</style>