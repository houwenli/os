<template>
    <div>
        <!-- 投诉列表 -->
        <ws-table-el :col="8" ref="table" v-bind="tableConfig">
            <template #search>
                <search-group>
                    <label for>投诉标题：</label>
                    <el-input v-model.trim="searchOptions.title" placeholder="请输入投诉标题" :maxlength="40" clearable></el-input>
                </search-group>
            </template>
            <template #options>
                <el-button-group style="float: right">
                    <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                    <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                </el-button-group>
            </template>
            <template>
                <ws-table-column-el label="投诉标题">
                    <template slot-scope="scope">
                        <span>{{ scope.row.title | filtrateTitle }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="投诉内容">
                    <template slot-scope="scope">
                        <span>{{ scope.row.content | filtrateContent }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="createTime" label="投诉时间"></ws-table-column-el>
                <ws-table-column-el label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" @click="details(scope.row.id)" class="c0088ff">查看详情</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询
            searchOptions: {
                title: ''
            },
            // 列表
            tableConfig: {
                filterColumns: false,
                labelWidth: '80px',
                lazyQuery: {
                    url: '/message/feedback/select',
                    op: {
                        selectList: 'feedbackListPublic',
                        selectCount: 'feedbackListPublicCount'
                    }
                }
            },
            moduleName:'/personalComplaint/myComplaint'
        };
    },
    filters: {
        filtrateTitle(value) {
            if (!value) return '';
            if (value.length > 20) {
                return value.slice(0, 20) + '...';
            }
            return value;
        },
        filtrateContent(value) {
            if (!value) return '';
            if (value.length > 60) {
                return value.slice(0, 60) + '...';
            }
            return value;
        }
    },
    methods: {
        // 搜索
        search() {
            this.$refs.table.search();
        },
        //重置
        reset() {
            this.$refs.table.reset();
        },
        // 详情
        details(id) {
            this.$emit('details', id);
        }
    }
};
</script>

<style lang="scss" scoped>
.c0088ff {
    color: #0088ff;
}
</style>
