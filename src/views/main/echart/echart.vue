<template>
    <div class="analysis-container" v-loading="loading">
        <!-- 顶部标题 -->
        <div class="analysis-header">
            <h2>博客文章数据分析</h2>
            <el-button :icon="Refresh" @click="refreshData" size="small">刷新数据</el-button>
        </div>

        <!-- 统计卡片 -->
        <el-row :gutter="20" class="stat-cards">
            <el-col :span="6">
                <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    <div class="stat-icon">
                        <el-icon>
                            <Document />
                        </el-icon>
                    </div>
                    <div class="stat-info">
                        <div class="stat-title">总文章数</div>
                        <div class="stat-value">{{ totalArticles }}</div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                    <div class="stat-icon">
                        <el-icon>
                            <View />
                        </el-icon>
                    </div>
                    <div class="stat-info">
                        <div class="stat-title">总浏览量</div>
                        <div class="stat-value">{{ totalViews }}</div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                    <div class="stat-icon">
                        <el-icon>
                            <Folder />
                        </el-icon>
                    </div>
                    <div class="stat-info">
                        <div class="stat-title">分组数量</div>
                        <div class="stat-value">{{ groupCount }}</div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="stat-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
                    <div class="stat-icon">
                        <el-icon>
                            <PriceTag />
                        </el-icon>
                    </div>
                    <div class="stat-info">
                        <div class="stat-title">标签数量</div>
                        <div class="stat-value">{{ tagCount }}</div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- 图表区域 - 第一行 -->
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="chart-card" v-if="chartKey">
                    <div class="chart-header">
                        <span class="chart-title">各分组文章数量统计</span>
                        <span class="chart-subtitle">按分组统计文章分布</span>
                    </div>
                    <AdvancedChart :key="`group-chart-${chartKey}`" :option="groupChartOption" width="100%"
                        height="400px" @click="onChartClick" />
                </div>
            </el-col>
            <el-col :span="12">
                <div class="chart-card" v-if="chartKey">
                    <div class="chart-header">
                        <span class="chart-title">文章标签分布</span>
                        <span class="chart-subtitle">各标签使用情况</span>
                    </div>
                    <AdvancedChart :key="`label-chart-${chartKey}`" :option="labelChartOption" width="100%"
                        height="400px" @click="onChartClick" />
                </div>
            </el-col>
        </el-row>

        <!-- 图表区域 - 第二行 -->
        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="12">
                <div class="chart-card" v-if="chartKey">
                    <div class="chart-header">
                        <span class="chart-title">文章浏览量排行</span>
                        <span class="chart-subtitle">TOP 10 文章浏览量</span>
                    </div>
                    <AdvancedChart :key="`views-chart-${chartKey}`" :option="viewsChartOption" width="100%"
                        height="400px" @click="onChartClick" />
                </div>
            </el-col>
            <el-col :span="12">
                <div class="chart-card" v-if="chartKey">
                    <div class="chart-header">
                        <span class="chart-title">各分组浏览量统计</span>
                        <span class="chart-subtitle">分组总浏览量对比</span>
                    </div>
                    <AdvancedChart :key="`group-views-chart-${chartKey}`" :option="groupViewsChartOption" width="100%"
                        height="400px" @click="onChartClick" />
                </div>
            </el-col>
        </el-row>

        <!-- 图表区域 - 第三行 -->
        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="12">
                <div class="chart-card" v-if="chartKey">
                    <div class="chart-header">
                        <span class="chart-title">各标签浏览量统计</span>
                        <span class="chart-subtitle">标签总浏览量对比</span>
                    </div>
                    <AdvancedChart :key="`label-views-chart-${chartKey}`" :option="labelViewsChartOption" width="100%"
                        height="400px" @click="onChartClick" />
                </div>
            </el-col>
            <el-col :span="12">
                <div class="chart-card" v-if="chartKey">
                    <div class="chart-header">
                        <span class="chart-title">文章发布时间趋势</span>
                        <span class="chart-subtitle">按时间统计发布数量</span>
                    </div>
                    <AdvancedChart :key="`timeline-chart-${chartKey}`" :option="timelineOption" width="100%"
                        height="400px" @click="onChartClick" />
                </div>
            </el-col>
        </el-row>

        <!-- 详细数据表格 - 分组详情 -->
        <el-row style="margin-top: 20px;">
            <el-col :span="24">
                <div class="data-table">
                    <div class="table-header">
                        <h3>分组详细数据</h3>
                        <el-input v-model="groupSearch" placeholder="搜索分组名称" prefix-icon="Search" size="small"
                            style="width: 200px" clearable />
                    </div>
                    <el-table :data="filteredGroupData" border stripe style="width: 100%" v-loading="tableLoading">
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
                                <template v-if="row?.labels && row.labels.length">
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
                                <el-popover placement="left" :width="500" trigger="click"
                                    :disabled="!row?.articles?.length">
                                    <template #reference>
                                        <el-button link type="primary" size="small" :disabled="!row?.articles?.length">
                                            查看详情 ({{ row?.articles?.length || 0 }})
                                        </el-button>
                                    </template>
                                    <div class="article-popover">
                                        <el-table :data="row?.articles || []" size="small" border>
                                            <el-table-column prop="title" label="标题" width="200"
                                                show-overflow-tooltip></el-table-column>
                                            <el-table-column prop="views" label="浏览量" width="80"
                                                align="center"></el-table-column>
                                            <el-table-column prop="label" label="标签" width="100">
                                                <template #default="{ row: articleRow }">
                                                    <el-tag size="small">{{ getTagName(articleRow?.label) }}</el-tag>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="moment" label="发布时间" width="150">
                                                <template #default="{ row: articleRow }">
                                                    {{ formatDate(articleRow?.moment) }}
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>

        <!-- 详细数据表格 - 标签详情 -->
        <el-row style="margin-top: 20px;">
            <el-col :span="24">
                <div class="data-table">
                    <div class="table-header">
                        <h3>标签详细数据</h3>
                        <el-input v-model="tagSearch" placeholder="搜索标签名称" prefix-icon="Search" size="small"
                            style="width: 200px" clearable />
                    </div>
                    <el-table :data="filteredTagData" border stripe style="width: 100%" v-loading="tableLoading">
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
                                <template v-if="row?.groups && row.groups.length">
                                    <el-tag v-for="group in row.groups" :key="group" size="small" style="margin: 2px"
                                        type="info">
                                        {{ getGroupName(group) }}
                                    </el-tag>
                                </template>
                                <span v-else class="text-muted">-</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="articles" label="文章列表" width="100">
                            <template #default="{ row }">
                                <el-popover placement="left" :width="500" trigger="click"
                                    :disabled="!row?.articles?.length">
                                    <template #reference>
                                        <el-button link type="primary" size="small" :disabled="!row?.articles?.length">
                                            查看详情 ({{ row?.articles?.length || 0 }})
                                        </el-button>
                                    </template>
                                    <div class="article-popover">
                                        <el-table :data="row?.articles || []" size="small" border>
                                            <el-table-column prop="title" label="标题" width="200"
                                                show-overflow-tooltip></el-table-column>
                                            <el-table-column prop="views" label="浏览量" width="80"
                                                align="center"></el-table-column>
                                            <el-table-column prop="subset_id" label="分组" width="100">
                                                <template #default="{ row: articleRow }">
                                                    {{ getGroupName(articleRow?.subset_id) }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="moment" label="发布时间" width="150">
                                                <template #default="{ row: articleRow }">
                                                    {{ formatDate(articleRow?.moment) }}
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, View, Folder, PriceTag, Refresh } from '@element-plus/icons-vue';
import AdvancedChart from '@/components/charts/AdvancedChart.vue';
import type { EChartsOption } from 'echarts';
import { getArticlesApi, getLabelApi, getSubsetApi } from '@/api/index';

interface Article {
    id: number;
    title: string;
    subset_id: number;
    label: string;
    introduce: string;
    content: string;
    cover: string;
    views: number;
    state: number;
    moment: string;
}

interface Tag {
    id: number;
    label_name?: string;
    name?: string;
}

interface Group {
    id: number;
    subset_name?: string;
    name?: string;
}

// 数据状态
const loading = ref(false);
const tableLoading = ref(false);
const articles = ref<Article[]>([]);
const tags = ref<Tag[]>([]);
const groups = ref<Group[]>([]);
const groupSearch = ref('');
const tagSearch = ref('');
const chartKey = ref(0);

// 统计数据
const totalArticles = computed(() => articles.value.length);
const totalViews = computed(() => articles.value.reduce((sum, item) => sum + (item?.views || 0), 0));
const groupCount = computed(() => groups.value.length);
const tagCount = computed(() => tags.value.length);

// 获取标签名称
const getTagName = (tagId: string) => {
    if (!tagId) return '未知标签';
    const tag = tags.value.find(t => t.id?.toString() === tagId?.toString());
    if (tag) {
        return tag.label_name || tag.name || `标签${tagId}`;
    }
    return `标签${tagId}`;
};

// 获取分组名称
const getGroupName = (groupId: number) => {
    if (!groupId && groupId !== 0) return '未知分组';
    const group = groups.value.find(g => g.id === groupId);
    if (group) {
        return group.subset_name || group.name || `分组${groupId}`;
    }
    return `分组${groupId}`;
};

// 获取标签样式
const getLabelTagType = (labelId: string) => {
    if (!labelId) return 'info';
    const colors = ['primary', 'success', 'warning', 'danger', 'info'];
    const index = parseInt(labelId) % colors.length;
    return colors[index];
};

// 格式化日期
const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch (error) {
        return '';
    }
};

// 格式化数字
const formatNumber = (num: number) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
    }
    return num?.toString() || '0';
};

// 图表配置 - 各分组文章数量统计
const groupChartOption = ref<EChartsOption>({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '12%', right: '8%', bottom: '8%', top: '8%', containLabel: true },
    xAxis: { type: 'category', name: '分组名称', axisLabel: { rotate: 30, interval: 0 } },
    yAxis: { type: 'value', name: '文章数量 (篇)' },
    series: [{
        type: 'bar', name: '文章数量', data: [],
        itemStyle: {
            borderRadius: [8, 8, 0, 0], color: {
                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{ offset: 0, color: '#5470c6' }, { offset: 1, color: '#91cc75' }]
            }
        },
        label: { show: true, position: 'top', formatter: '{c} 篇' }
    }]
});

// 图表配置 - 文章标签分布
const labelChartOption = ref<EChartsOption>({
    tooltip: { trigger: 'item', formatter: '{b}: {c} 篇 ({d}%)' },
    legend: { orient: 'vertical', left: 'left', top: 'center' },
    series: [{
        type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' }, data: []
    }]
});

// 图表配置 - 文章浏览量排行
const viewsChartOption = ref<EChartsOption>({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '18%', right: '8%', bottom: '8%', top: '8%', containLabel: true },
    xAxis: { type: 'value', name: '浏览量 (次)' },
    yAxis: { type: 'category', name: '文章标题', axisLabel: { formatter: (value: string) => value?.length > 12 ? value.slice(0, 12) + '...' : value } },
    series: [{
        type: 'bar', name: '浏览量', data: [],
        itemStyle: { borderRadius: [0, 8, 8, 0], color: '#fac858' },
        label: { show: true, position: 'right', formatter: '{c} 次' }
    }]
});

// 图表配置 - 各分组浏览量统计
const groupViewsChartOption = ref<EChartsOption>({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['总浏览量', '平均浏览量'], bottom: 0 },
    xAxis: { type: 'category', name: '分组名称', axisLabel: { rotate: 30 } },
    yAxis: { type: 'value', name: '浏览量 (次)' },
    series: [
        { type: 'bar', name: '总浏览量', data: [], itemStyle: { borderRadius: [8, 8, 0, 0], color: '#5470c6' }, label: { show: true, position: 'top', formatter: '{c} 次' } },
        { type: 'line', name: '平均浏览量', data: [], smooth: true, lineStyle: { width: 3, color: '#fac858' }, symbol: 'circle', symbolSize: 8, label: { show: true, position: 'top', formatter: '{c} 次' } }
    ]
});

// 图表配置 - 各标签浏览量统计
const labelViewsChartOption = ref<EChartsOption>({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['总浏览量', '平均浏览量'], bottom: 0 },
    xAxis: { type: 'category', name: '标签名称', axisLabel: { rotate: 30 } },
    yAxis: { type: 'value', name: '浏览量 (次)' },
    series: [
        { type: 'bar', name: '总浏览量', data: [], itemStyle: { borderRadius: [8, 8, 0, 0], color: '#91cc75' }, label: { show: true, position: 'top', formatter: '{c} 次' } },
        { type: 'line', name: '平均浏览量', data: [], smooth: true, lineStyle: { width: 3, color: '#ee6666' }, symbol: 'circle', symbolSize: 8, label: { show: true, position: 'top', formatter: '{c} 次' } }
    ]
});

// 图表配置 - 文章发布时间趋势
const timelineOption = ref<EChartsOption>({
    tooltip: { trigger: 'axis' },
    grid: { left: '10%', right: '8%', bottom: '8%', top: '8%' },
    xAxis: { type: 'category', name: '发布时间', data: [] },
    yAxis: { type: 'value', name: '文章数量 (篇)' },
    series: [{
        type: 'line', name: '发布数量', data: [], smooth: true,
        lineStyle: { width: 3, color: '#5470c6' },
        areaStyle: {
            color: {
                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{ offset: 0, color: 'rgba(84, 112, 198, 0.6)' }, { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }]
            }
        },
        symbol: 'circle', symbolSize: 8,
        label: { show: true, position: 'top', formatter: '{c} 篇' }
    }]
});

// 分组数据
const groupData = ref<any[]>([]);
const tagData = ref<any[]>([]);

const filteredGroupData = computed(() => {
    if (!groupSearch.value) return groupData.value;
    const keyword = groupSearch.value.toLowerCase();
    return groupData.value.filter(item =>
        item?.groupName?.toLowerCase().includes(keyword)
    );
});

const filteredTagData = computed(() => {
    if (!tagSearch.value) return tagData.value;
    const keyword = tagSearch.value.toLowerCase();
    return tagData.value.filter(item =>
        item?.tagName?.toLowerCase().includes(keyword)
    );
});

// 数据处理
const processAnalysisData = () => {
    if (!articles.value || articles.value.length === 0) return;

    // 1. 分组统计（文章数量）
    const groupStats = new Map<number, number>();
    articles.value.forEach(article => {
        if (article?.subset_id !== undefined) {
            groupStats.set(article.subset_id, (groupStats.get(article.subset_id) || 0) + 1);
        }
    });
    const groupChartData = Array.from(groupStats.entries())
        .map(([id, count]) => ({ name: getGroupName(id), value: count }))
        .sort((a, b) => b.value - a.value);
    (groupChartOption.value.series as any[])[0].data = groupChartData.map(item => item.value);
    groupChartOption.value.xAxis = { ...groupChartOption.value.xAxis, data: groupChartData.map(item => item.name) };

    // 2. 标签统计（文章数量）
    const labelStats = new Map<string, number>();
    articles.value.forEach(article => {
        if (article?.label) {
            const labelName = getTagName(article.label);
            labelStats.set(labelName, (labelStats.get(labelName) || 0) + 1);
        }
    });
    (labelChartOption.value.series as any[])[0].data = Array.from(labelStats.entries()).map(([name, value]) => ({ name, value }));

    // 3. 浏览量排行 TOP10
    const viewsData = [...articles.value]
        .filter(a => a?.views !== undefined)
        .sort((a, b) => (b?.views || 0) - (a?.views || 0))
        .slice(0, 10)
        .map(article => ({ name: article?.title || '无标题', value: article?.views || 0 }));
    (viewsChartOption.value.series as any[])[0].data = viewsData.map(item => item.value);
    viewsChartOption.value.yAxis = { ...viewsChartOption.value.yAxis, data: viewsData.map(item => item.name) };

    // 4. 分组浏览量统计
    const groupViews = new Map<number, { total: number; count: number }>();
    articles.value.forEach(article => {
        if (article?.subset_id !== undefined) {
            const stats = groupViews.get(article.subset_id) || { total: 0, count: 0 };
            stats.total += article?.views || 0;
            stats.count += 1;
            groupViews.set(article.subset_id, stats);
        }
    });
    const groupNames = Array.from(groupViews.keys()).map(id => getGroupName(id));
    (groupViewsChartOption.value.series as any[])[0].data = Array.from(groupViews.values()).map(v => v.total);
    (groupViewsChartOption.value.series as any[])[1].data = Array.from(groupViews.values()).map(v => Math.round(v.total / v.count));
    groupViewsChartOption.value.xAxis = { ...groupViewsChartOption.value.xAxis, data: groupNames };

    // 5. 标签浏览量统计
    const labelViews = new Map<string, { total: number; count: number; labelId: string }>();
    articles.value.forEach(article => {
        if (article?.label) {
            const stats = labelViews.get(article.label) || { total: 0, count: 0, labelId: article.label };
            stats.total += article?.views || 0;
            stats.count += 1;
            labelViews.set(article.label, stats);
        }
    });
    const labelNames = Array.from(labelViews.keys()).map(id => getTagName(id));
    (labelViewsChartOption.value.series as any[])[0].data = Array.from(labelViews.values()).map(v => v.total);
    (labelViewsChartOption.value.series as any[])[1].data = Array.from(labelViews.values()).map(v => Math.round(v.total / v.count));
    labelViewsChartOption.value.xAxis = { ...labelViewsChartOption.value.xAxis, data: labelNames };

    // 6. 发布时间趋势
    const monthMap = new Map<string, number>();
    articles.value.forEach(article => {
        if (article?.moment) {
            const month = article.moment.split('T')[0].substring(0, 7);
            monthMap.set(month, (monthMap.get(month) || 0) + 1);
        }
    });
    const sortedMonths = Array.from(monthMap.keys()).sort();
    timelineOption.value.xAxis = { ...timelineOption.value.xAxis, data: sortedMonths };
    (timelineOption.value.series as any[])[0].data = sortedMonths.map(month => monthMap.get(month) || 0);

    // 7. 分组详细数据
    const groupDetailMap = new Map<number, { groupId: number; articles: Article[]; labels: Set<string> }>();
    articles.value.forEach(article => {
        if (article?.subset_id !== undefined) {
            if (!groupDetailMap.has(article.subset_id)) {
                groupDetailMap.set(article.subset_id, { groupId: article.subset_id, articles: [], labels: new Set() });
            }
            const group = groupDetailMap.get(article.subset_id)!;
            group.articles.push(article);
            if (article?.label) {
                group.labels.add(article.label);
            }
        }
    });

    groupData.value = Array.from(groupDetailMap.values()).map(group => {
        const total = group.articles.reduce((sum, a) => sum + (a?.views || 0), 0);
        return {
            groupId: group.groupId,
            groupName: getGroupName(group.groupId),
            articleCount: group.articles.length,
            totalViews: total,
            avgViews: group.articles.length > 0 ? total / group.articles.length : 0,
            labels: Array.from(group.labels),
            articles: group.articles
        };
    }).sort((a, b) => b.totalViews - a.totalViews);

    // 8. 标签详细数据
    const tagDetailMap = new Map<string, { tagId: string; articles: Article[]; groups: Set<number> }>();
    articles.value.forEach(article => {
        if (article?.label) {
            if (!tagDetailMap.has(article.label)) {
                tagDetailMap.set(article.label, { tagId: article.label, articles: [], groups: new Set() });
            }
            const tag = tagDetailMap.get(article.label)!;
            tag.articles.push(article);
            if (article?.subset_id !== undefined) {
                tag.groups.add(article.subset_id);
            }
        }
    });

    tagData.value = Array.from(tagDetailMap.values()).map(tag => {
        const total = tag.articles.reduce((sum, a) => sum + (a?.views || 0), 0);
        return {
            tagId: tag.tagId,
            tagName: getTagName(tag.tagId),
            articleCount: tag.articles.length,
            totalViews: total,
            avgViews: tag.articles.length > 0 ? total / tag.articles.length : 0,
            groups: Array.from(tag.groups),
            articles: tag.articles
        };
    }).sort((a, b) => b.totalViews - a.totalViews);
};

// 数据获取
const fetchData = async () => {
    loading.value = true;
    tableLoading.value = true;
    try {
        const [articlesRes, labelsRes, subsetsRes] = await Promise.all([
            getArticlesApi({}),
            getLabelApi(),
            getSubsetApi()
        ]);

        if (articlesRes?.code === 200) {
            articles.value = articlesRes.data?.result || [];
        }
        if (labelsRes?.code === 200) {
            tags.value = labelsRes.data?.result || labelsRes.data || [];
        }
        if (subsetsRes?.code === 200) {
            groups.value = subsetsRes.data?.result || subsetsRes.data || [];
        }

        processAnalysisData();

        // 强制刷新图表组件
        chartKey.value++;

        ElMessage.success(`数据加载成功，共 ${articles.value.length} 篇文章`);
    } catch (error) {
        console.error('获取数据失败:', error);
        ElMessage.error('数据加载失败');
    } finally {
        loading.value = false;
        tableLoading.value = false;
    }
};

const refreshData = () => {
    fetchData();
};

const onChartClick = (params: any) => {
    if (params?.componentType === 'series') {
        console.log('图表点击:', params);
    }
};

// 组件销毁时清理
onUnmounted(() => {
    articles.value = [];
    tags.value = [];
    groups.value = [];
    groupData.value = [];
    tagData.value = [];
});

onMounted(() => {
    fetchData();
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

.chart-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.3s;
}

.chart-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.chart-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #ebeef5;
}

.chart-title {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
}

.chart-subtitle {
    font-size: 12px;
    color: #909399;
    margin-left: 10px;
}

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

.article-popover {
    max-height: 400px;
    overflow: auto;
}

.text-muted {
    color: #909399;
    font-size: 12px;
}
</style>