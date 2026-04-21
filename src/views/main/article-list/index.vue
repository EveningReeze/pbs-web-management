<template>
    <div class="article-list">
        <!-- 标题区域 -->
        <div class="container-title">
            <el-row :gutter="20">
                <el-col :span="18">
                    <h2>博客文章</h2>
                </el-col>
                <el-col :span="6" class="search-col">
                    <el-input v-model="search" class="responsive-input" placeholder="请输入...." :prefix-icon="Search"
                        clearable @clear="handleSearch" />
                </el-col>
            </el-row>
        </div>

        <!-- 分类和操作区域 -->
        <div class="container">
            <el-row :gutter="20">
                <el-col :span="18">
                    <TagGroup :tags="categoryTags" @change="handleCategoryChange" />
                </el-col>
                <el-col :span="6">
                    <div class="container-button">
                        <CreatePopconfirm title="新建分组" placeholder="请输入分组名称" v-model="groupingValue"
                            @confirm="handleCreateGroup" />
                        <el-button key="primary" type="primary" :icon="Setting" text @click="openDialog('subset')">
                            管理分组
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 内容区域 -->
        <div class="container-content">
            <el-row :gutter="20">
                <!-- 左侧文章列表 -->
                <el-col :span="18">
                    <div class="container-content-left">
                        <div v-if="loading" class="loading-wrapper">
                            <el-skeleton :rows="5" animated />
                        </div>
                        <template v-else>
                            <ArticleCard v-for="article in articles" :key="article.id" :article="article"
                                @view="handleViewArticle" @edit="handleEditArticle" @delete="handleDeleteArticle" />
                            <div v-if="articles.length === 0" class="empty-wrapper">
                                <el-empty description="暂无文章" />
                            </div>
                        </template>
                    </div>
                </el-col>

                <!-- 右侧标签云 -->
                <el-col :span="6">
                    <div class="container-content-right">
                        <div class="right-title">
                            <h4>标签</h4>
                            <div>
                                <CreatePopconfirm title="新建标签" placeholder="请输入标签名称" button-text="新建"
                                    v-model="labelValue" @confirm="handleCreateLabel" />
                                <el-button key="primary" type="primary" :icon="Setting" text
                                    @click="openDialog('label')">
                                    管理标签
                                </el-button>
                            </div>
                        </div>
                        <div class="right-content">
                            <TagGroup :tags="labelTags" @change="handleLabelChange" />
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

    </div>
    <el-dialog v-model="dialogVisible" :title="title" width="800" destroy-on-closes>
        <el-table :data="gridData.slice(1)" height="350">
            <el-table-column property="id" label="id" width="150" />
            <el-table-column property="label" label="名称" width="200" />
            <el-table-column property="moment" label="创建时间" />
            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #default="scope">
                    <el-button link type="danger" size="small" @click="handleDelete(scope.row.id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>

<script setup lang="ts">
import { Search, Setting } from '@element-plus/icons-vue'
import TagGroup from './components/TagGroup.vue'
import ArticleCard from './components/ArticleCard.vue'
import CreatePopconfirm from './components/CreatePopconfirm.vue'
import { useArticleList } from './hooks/useArticleList'
import type { TagItem, ArticleItem } from './types'
import { ref } from 'vue'

const title = ref("")

const {
    search,
    loading,
    articles,
    categoryTags,
    labelTags,
    groupingValue,
    labelValue,
    dialogVisible,
    handleCategoryChange,
    handleLabelChange,
    handleCreateGroup,
    handleCreateLabel,
    handleViewArticle,
    handleEditArticle,
    handleDeleteArticle,
    handleDeleteGroup,
    handleDeleteLabel,
    handleSearch
} = useArticleList()


const gridData = ref<any[]>([])
const openDialog = (value: string) => {
    gridData.value = []
    title.value = ""
    if (value == "subset") {
        title.value = "管理分组"
        gridData.value = categoryTags.value
        dialogVisible.value = true
    } else {
        title.value = "管理标签"
        gridData.value = labelTags.value
        dialogVisible.value = true
    }
}
const handleDelete = async (id: number | string) => {
    if (title.value == "管理分组") {
        const success = await handleDeleteGroup(id)
        if (success) {
            // 刷新表格数据，过滤掉已删除的项
            gridData.value = categoryTags.value
        }
    } else {
        const success = await handleDeleteLabel(id)
        if (success) {
            gridData.value = labelTags.value.filter(item => item.id !== id)
        }
    }


}


</script>

<style lang="less" scoped>
.responsive-input {
    width: 240px;
    background-color: #f3f3f3;
    border-radius: 12px;
}

.search-col {
    display: flex;
    flex-direction: row-reverse;
}

.container {
    width: 100%;
    border-radius: 10px;
    padding: 3px;
    margin: 10px 0px;
    background-color: #fff;

    .container-button {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
}

.el-button {
    font-size: 12px;
}

.container-content {
    .container-content-left {
        background-color: #fff;
        padding: 10px;
        border-radius: 10px;
    }

    .container-content-right {
        background-color: #fff;
        padding: 15px;
        border-radius: 10px;

        .right-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .right-content {
            display: flex;
            flex-wrap: wrap;
        }
    }
}

.loading-wrapper,
.empty-wrapper {
    padding: 40px;
    text-align: center;
}
</style>