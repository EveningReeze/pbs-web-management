<template>
    <!-- 文章 -->
    <div class="article-card">
        <img :src="article.cover || defaultImg" :alt="article.title" />
        <div class="article-card-body">
            <p class="article-card-title">{{ article.title }}</p>
            <p class="article-card-text">{{ article.introduce }}</p>
            <div class="article-card-footer">
                <div class="article-card-footer-left">
                    <p style="font-weight: 600">{{ article.label || '未分类' }}</p>
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
import { View, Edit, Delete } from '@element-plus/icons-vue'
import type { ArticleItem } from '../types'
import defaultImg from '@/assets/img/userimg.jpg'



interface Props {
    article: ArticleItem
}

interface Emits {
    (e: 'view', article: ArticleItem): void
    (e: 'edit', article: ArticleItem): void
    (e: 'delete', article: ArticleItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formatDate = (date: string) => {
    if (!date) return ''
    return date.split(' ')[0] // 只显示日期部分
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