<template>
    <!-- 文章 -->
    <div class="article-card">
        <img :src="article.cover || defaultImg" :alt="article.title" />
        <div class="article-card-body">
            <p class="article-card-title">{{ article.title }}</p>
            <p class="article-card-text">{{ article.introduce }}</p>
            <div class="article-card-footer">
                <div class="article-card-footer-left">
                    <p style="font-weight: 300;font-size: 14px;">{{ getLabelNameById(article.label) }}</p>

                    <p>{{ formatDate(article.moment) }}</p>
                </div>
                <div class="article-card-footer-button">
                    <el-icon @click="handleView">
                        <View />
                    </el-icon>
                    <el-icon @click="handleEdit">
                        <Edit />
                    </el-icon>
                    <el-icon @click="handleDelete">
                        <Delete />
                    </el-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { View, Edit, Delete } from '@element-plus/icons-vue'
import type { ArticleItem } from '../types'
import defaultImg from '@/assets/img/userimg.jpg'
import { useArticleList } from '../hooks/useArticleList'



interface Props {
    article: ArticleItem
}

interface Emits {
    (e: 'view', article: ArticleItem): void
    (e: 'edit', article: ArticleItem): void
    (e: 'delete', article: ArticleItem): void
}
const {
    labelTags,

} = useArticleList()
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
// 创建 Map 映射表，提高查询性能（O(1) 复杂度）
const labelMap = computed(() => {
    const map = new Map<number, string>();
    labelTags.value.forEach((item: any) => {
        console.log('标签项:', item);
        map.set(item.value, item.label);
    });
    return map;
});

// 根据 ID 获取标签名称（优化版）
const getLabelNameById = (id: string): string => {
    console.log(1);

    // 处理空值情况
    if (!id || id === 'undefined' || id === 'null') {
        return '未分类';
    }

    // 统一转换为字符串处理
    const idStr = String(id);
    console.log(2);

    // 处理单个 ID
    if (!idStr.includes(',')) {
        const numId = parseInt(idStr);
        console.log(3, labelMap.value.get(numId));
        let str = "#" + labelMap.value.get(numId)
        // 修复：确保 labelMap 的 key 是 number 类型
        return str || '未分类';
    }

    // 处理多个 ID（例如："2,4" 或 "2, 4"）
    const ids = idStr.split(',').map(i => parseInt(i.trim()));
    const names = ids
        .map(numId => labelMap.value.get(numId))
        .filter((name): name is string => !!name)
        .map(name => `#${name}`);
    console.log(4, names);

    return names.length > 0 ? names.join(' ') : '未分类';
}

// 格式化日期函数
const formatDate = (date: string) => {
    if (!date) return '未知日期';
    return new Date(date).toLocaleDateString('zh-CN');
}
const handleView = () => emit('view', props.article)
const handleEdit = () => emit('edit', props.article)
const handleDelete = () => emit('delete', props.article)
</script>

<style lang="less" scoped>
.article-card {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    img {
        width: 150px;
        height: 150px;
        border-radius: 10px;
        margin: 5px;
        object-fit: cover;
    }

    .article-card-body {
        flex: 1;
        margin: 0px 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .article-card-title {
            font-size: 16px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .article-card-text {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            text-overflow: ellipsis;
            text-indent: 2em;
            line-height: 1.5;
        }

        .article-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .article-card-footer-left {
                display: flex;
                gap: 20px;

                p {
                    margin: 0;
                }
            }

            .article-card-footer-button {
                display: flex;
                gap: 20px;

                .el-icon {
                    cursor: pointer;
                    font-size: 18px;
                    transition: color 0.2s;

                    &:hover {
                        color: #409eff;
                    }
                }
            }
        }
    }
}
</style>