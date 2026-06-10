<template>
    <div class="article-detail-container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading">加载中...</div>

        <!-- 文章主体 -->
        <div v-else-if="article" class="article-box">
            <!-- 封面图 -->
            <img v-if="article.cover" :src="article.cover" alt="文章封面" class="article-cover" />

            <!-- 标题 -->
            <h1 class="article-title">{{ article.title }}</h1>

            <!-- 元信息：时间、浏览量、标签 -->
            <div class="article-meta">
                <span class="meta-item">发布时间：{{ formatDate(article.moment) }}</span>
                <span class="meta-item">浏览量：{{ article.views }}</span>
                <div class="tag-group" v-if="tagList.length">
                    <span class="tag" v-for="tag in tagList" :key="tag">{{ getTagName(tag) }}</span>
                </div>
            </div>

            <!-- 文章简介 -->
            <div class="article-intro" v-if="article.introduce">
                {{ article.introduce }}
            </div>

            <!-- 文章正文 -->
            <div class="article-content" v-html="article.content"></div>
        </div>

        <!-- 无数据 -->
        <div v-else class="empty">文章不存在</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Article } from '@/types/article'
import { getArticleDetail } from '@/api/index'
import { useArticleData } from '@/hooks/useArticleData';

const {
    fetchLabelList,
    getTagName,
    formatDate
} = useArticleData();
// 路由实例，获取路由参数中的文章ID
const route = useRoute()
const articleId = ref<number>(Number(route.params.id))

// 状态
const loading = ref<boolean>(false)
const article = ref<Article | null>(null)

// 标签数组（后端标签是逗号分隔字符串，转为数组）
const tagList = computed<string[]>(() => {
    if (!article.value?.label) return []
    return article.value.label.split(',')
})

// 获取文章详情
const fetchArticleDetail = async () => {
    let articleId = route.params.id

    if (!articleId) return
    loading.value = true
    try {
        const res = await getArticleDetail({ id: articleId })
        if (res.code === 200 && res.data.length) {
            article.value = res.data[0]
        }
    } catch (err) {
        console.error('获取文章详情失败：', err)
    } finally {
        loading.value = false
    }
}

// 页面挂载时请求数据（打开页面自动触发浏览量+1）
onMounted(() => {
    fetchArticleDetail()
    fetchLabelList()
})
</script>

<style scoped>
.article-detail-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 16px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

.article-box {
    background: #fff;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
}

/* 封面图 */
.article-cover {
    width: 100%;
    max-height: 420px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 28px;
}

/* 标题 */
.article-title {
    font-size: 30px;
    color: #1a1a1a;
    line-height: 1.4;
    margin-bottom: 20px;
    text-align: center;
}

/* 头部信息栏 */
.article-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    color: #909399;
    font-size: 14px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 24px;
}

.tag-group {
    display: flex;
    gap: 8px;
}

.tag {
    padding: 4px 12px;
    background: #ecf5ff;
    color: #409eff;
    border-radius: 20px;
}

/* 简介 */
.article-intro {
    padding: 16px;
    background: #f9fafc;
    border-radius: 8px;
    color: #606266;
    font-size: 15px;
    line-height: 1.8;
    margin-bottom: 28px;
}

/* 正文内容 */
.article-content {
    font-size: 17px;
    line-height: 2;
    color: #303133;
}

/* 加载/空状态 */
.loading,
.empty {
    text-align: center;
    padding: 60px 0;
    color: #999;
    font-size: 16px;
}
</style>