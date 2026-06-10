<template>
    <div class="analysis-container" v-loading="loading">
        <div class="analysis-header">
            <h2>博客文章数据分析</h2>
            <el-button :icon="Refresh" @click="refreshData" size="small">刷新数据</el-button>
        </div>

        <!-- 统计卡片 -->
        <StatCards :cards="statCards" />

        <!-- 图表区域 - 第一行 -->
        <el-row :gutter="20">
            <el-col :span="12">
                <ChartCard title="各分组文章数量统计" subtitle="按分组统计文章分布" :option="groupChartOption" :chart-key="chartKey"
                    :visible="!!chartKey" @click="onChartClick" />
            </el-col>
            <el-col :span="12">
                <ChartCard title="文章标签分布" subtitle="各标签使用情况" :option="labelChartOption" :chart-key="chartKey"
                    :visible="!!chartKey" @click="onChartClick" />
            </el-col>
        </el-row>

        <!-- 图表区域 - 第二行 -->
        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="12">
                <ChartCard title="文章浏览量排行" subtitle="TOP 10 文章浏览量" :option="viewsChartOption" :chart-key="chartKey"
                    :visible="!!chartKey" @click="onChartClick" />
            </el-col>
            <el-col :span="12">
                <ChartCard title="各分组浏览量统计" subtitle="分组总浏览量对比" :option="groupViewsChartOption" :chart-key="chartKey"
                    :visible="!!chartKey" @click="onChartClick" />
            </el-col>
        </el-row>

        <!-- 图表区域 - 第三行 -->
        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="12">
                <ChartCard title="各标签浏览量统计" subtitle="标签总浏览量对比" :option="labelViewsChartOption" :chart-key="chartKey"
                    :visible="!!chartKey" @click="onChartClick" />
            </el-col>
            <el-col :span="12">
                <ChartCard title="文章发布时间趋势" subtitle="按时间统计发布数量" :option="timelineOption" :chart-key="chartKey"
                    :visible="!!chartKey" @click="onChartClick" />
            </el-col>
        </el-row>

        <!-- 分组详细数据表格 -->
        <DataTable title="分组详细数据" :data="groupData" search-key="groupName" search-placeholder="分组名称"
            :loading="tableLoading" v-model:search="groupSearch">
            <el-table-column prop="groupName" label="分组名称" width="200">
                <template #default="{ row }">
                    <div class="group-info">
                        <span class="group-name">{{ row?.groupName || '-' }}</span>
                        <span class="group-id">(ID: {{ row?.groupId || '-' }})</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="articleCount" label="文章数量" sortable width="120">
                <template #default="{ row }">
                    <span class="count-number">{{ row?.articleCount || 0 }} 篇</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalViews" label="总浏览量" sortable width="150">
                <template #default="{ row }">
                    <span class="view-number">{{ formatNumber(row?.totalViews || 0) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="avgViews" label="平均浏览量" sortable width="150">
                <template #default="{ row }">
                    <span>{{ formatNumber(Math.round(row?.avgViews || 0)) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="labels" label="包含标签" min-width="250">
                <template #default="{ row }">
                    <template v-if="row?.labels?.length">
                        <el-tag v-for="label in row.labels" :key="label" size="small" style="margin: 2px"
                            :type="getLabelTagType(label)">
                            {{ getTagName(label) }}
                        </el-tag>
                    </template>
                    <span v-else class="text-muted">-</span>
                </template>
            </el-table-column>
            <el-table-column prop="articles" label="文章列表" width="100">
                <template #default="{ row }">
                    <ArticlePopover :articles="row?.articles || []" :format-date="formatDate">
                        <template #extraColumns>
                            <el-table-column prop="label" label="标签" width="100">
                                <template #default="{ row: articleRow }">
                                    <el-tag size="small">{{ getTagName(articleRow?.label) }}</el-tag>
                                </template>
                            </el-table-column>
                        </template>
                    </ArticlePopover>
                </template>
            </el-table-column>
        </DataTable>

        <!-- 标签详细数据表格 -->
        <DataTable title="标签详细数据" :data="tagData" search-key="tagName" search-placeholder="标签名称" :loading="tableLoading"
            v-model:search="tagSearch" style="margin-top: 20px;">
            <el-table-column prop="tagName" label="标签名称" width="200">
                <template #default="{ row }">
                    <el-tag :type="getLabelTagType(row?.tagId)" size="large">
                        {{ row?.tagName || '-' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="articleCount" label="文章数量" sortable width="120">
                <template #default="{ row }">
                    <span class="count-number">{{ row?.articleCount || 0 }} 篇</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalViews" label="总浏览量" sortable width="150">
                <template #default="{ row }">
                    <span class="view-number">{{ formatNumber(row?.totalViews || 0) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="avgViews" label="平均浏览量" sortable width="150">
                <template #default="{ row }">
                    <span>{{ formatNumber(Math.round(row?.avgViews || 0)) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="groups" label="所属分组" min-width="200">
                <template #default="{ row }">
                    <template v-if="row?.groups?.length">
                        <el-tag v-for="group in row.groups" :key="group" size="small" style="margin: 2px" type="info">
                            {{ getGroupName(group) }}
                        </el-tag>
                    </template>
                    <span v-else class="text-muted">-</span>
                </template>
            </el-table-column>
            <el-table-column prop="articles" label="文章列表" width="100">
                <template #default="{ row }">
                    <ArticlePopover :articles="row?.articles || []" :format-date="formatDate">
                        <template #extraColumns>
                            <el-table-column prop="subset_id" label="分组" width="100">
                                <template #default="{ row: articleRow }">
                                    {{ getGroupName(articleRow?.subset_id) }}
                                </template>
                            </el-table-column>
                        </template>
                    </ArticlePopover>
                </template>
            </el-table-column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { Refresh } from '@element-plus/icons-vue';
import { useArticleData } from '@/hooks/useArticleData';
import {
    createGroupBarChart,
    createLabelPieChart,
    createViewsBarChart,
    createGroupViewsChart,
    createLabelViewsChart,
    createTimelineChart
} from '@/utils/chartOptions';
import StatCards from './components/StatCards.vue';
import ChartCard from './components/ChartCard.vue';
import DataTable from './components/DataTable.vue';
import ArticlePopover from './components/ArticlePopover.vue';

// 使用组合式函数
const {
    loading,
    tableLoading,
    chartKey,
    totalArticles,
    totalViews,
    groupCount,
    tagCount,
    getTagName,
    getGroupName,
    getLabelTagType,
    formatDate,
    formatNumber,
    processGroupData,
    processTagData,
    getChartStats,
    fetchData,
    refreshData
} = useArticleData();

// 本地状态
const groupSearch = ref('');
const tagSearch = ref('');
const groupData = ref<any[]>([]);
const tagData = ref<any[]>([]);

// 图表选项
const groupChartOption = createGroupBarChart();
const labelChartOption = createLabelPieChart();
const viewsChartOption = createViewsBarChart();
const groupViewsChartOption = createGroupViewsChart();
const labelViewsChartOption = createLabelViewsChart();
const timelineOption = createTimelineChart();

// 统计卡片数据
const statCards = computed(() => [
    { title: '总文章数', value: totalArticles.value, icon: 'Document', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: '总浏览量', value: totalViews.value, icon: 'View', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { title: '分组数量', value: groupCount.value, icon: 'Folder', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { title: '标签数量', value: tagCount.value, icon: 'PriceTag', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
]);

// 更新图表数据
const updateCharts = () => {
    const stats = getChartStats();

    // 更新分组柱状图
    (groupChartOption.series as any[])[0].data = stats.groupStats.map(item => item.value);
    groupChartOption.xAxis = { ...groupChartOption.xAxis, data: stats.groupStats.map(item => item.name) };

    // 更新标签饼图
    (labelChartOption.series as any[])[0].data = stats.labelStats;

    // 更新浏览量排行
    (viewsChartOption.series as any[])[0].data = stats.viewsRanking.map(item => item.value);
    viewsChartOption.yAxis = { ...viewsChartOption.yAxis, data: stats.viewsRanking.map(item => item.name) };

    // 更新分组浏览量
    (groupViewsChartOption.series as any[])[0].data = stats.groupViews.totals;
    (groupViewsChartOption.series as any[])[1].data = stats.groupViews.avgs;
    groupViewsChartOption.xAxis = { ...groupViewsChartOption.xAxis, data: stats.groupViews.names };

    // 更新标签浏览量
    (labelViewsChartOption.series as any[])[0].data = stats.labelViews.totals;
    (labelViewsChartOption.series as any[])[1].data = stats.labelViews.avgs;
    labelViewsChartOption.xAxis = { ...labelViewsChartOption.xAxis, data: stats.labelViews.names };

    // 更新时间线
    timelineOption.xAxis = { ...timelineOption.xAxis, data: stats.timeline.months };
    (timelineOption.series as any[])[0].data = stats.timeline.counts;
};

// 加载数据
const loadData = async () => {
    const success = await fetchData();
    if (success) {
        groupData.value = processGroupData();
        tagData.value = processTagData();
        updateCharts();
    }
};

// 图表点击事件
const onChartClick = (params: any) => {
    if (params?.componentType === 'series') {
    }
};

// 监听数据变化
watch([() => groupData.value, () => tagData.value], () => {
    // 数据变化时的处理
});

onMounted(() => {
    loadData();
});
</script>

<style scoped>
.analysis-container {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

.analysis-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 10px;
}

.analysis-header h2 {
    margin: 0;
    color: #303133;
    font-size: 24px;
}

.group-info {
    display: flex;
    align-items: center;
    gap: 6px;
}

.group-name {
    font-weight: 500;
}

.group-id {
    font-size: 12px;
    color: #909399;
}

.count-number {
    font-weight: 500;
}

.view-number {
    color: #e6a23c;
    font-weight: 500;
}

.text-muted {
    color: #909399;
    font-size: 12px;
}
</style>