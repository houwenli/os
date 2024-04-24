<template>
  <div class="content-wrap">
    <ws-table-el ref="table" v-bind="tableConfig" v-if="tableColumns.length" @sort-change="sortChange">
      <template #search>
        <search-group>
          <label for>机构名称：</label>
          <organization-all v-model="searchOptions.agencyNumber" :showSelect="false" orgType="30" ref="org" placeholder="请输入机构名称搜索" valueKey="agencyNumber">
          </organization-all>
        </search-group>
        <search-group>
          <label for> <span style="color:rgb(240, 82, 89);margin-right:3px;">*</span>时间：</label>
          <el-date-picker v-model="searchOptions.statisticsDate" value-format="yyyy-MM" :picker-options="pickerOptions" type="month" placeholder="选择月份">
          </el-date-picker>
        </search-group>
      </template>
      <template slot="searchBtns">
        <el-button-group v-if="powerList.selectPage">
          <ws-enter-event>
            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
          </ws-enter-event>
          <ws-throttle>
            <el-button type="primary" class="table-column-header-button" @click="reset" icon="el-icon-refresh-left"></el-button>
          </ws-throttle>
        </el-button-group>
        <el-button style="margin-left: 20px;" v-if="powerList.export" @click="exportData" plain>导出</el-button>
      </template>
      <template>
        <ws-table-column-el :width="(titleObj.tip||titleObj.sortable)?'215':''" v-for="(titleObj,index) in tableColumns" :label="titleObj.title" :key="index" :prop="titleObj.key"
          :sortable="titleObj.sortable">
          <template slot="header" slot-scope="scope" v-if="titleObj.tip||titleObj.ext">
            <span>{{titleObj.title}}</span><span v-if="titleObj.ext">{{`(${titleObj.ext})`}}</span>
            <el-tooltip :content="tipContentFilter[titleObj.key]" placement="top" v-if="titleObj.tip">
              <span class="el-icon-info" style="margin-left:10px;"></span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="titleObj.add">{{`${scope.row[titleObj.key]}${titleObj.add}`}}</span>
            <span v-else-if="titleObj.key==='vipAmount'">{{$baseMethod.regFenToYuan(scope.row[titleObj.key])}}</span>
            <span v-else>{{scope.row[titleObj.key]}}</span>
          </template>
        </ws-table-column-el>
      </template>
    </ws-table-el>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import organizationAll from '@/components/Organization/organization-all';
const getEndMonth = () => {
    const today = new Date().getDate();
    const endYear = new Date().getFullYear();
    let endMonth = new Date().getMonth() + 1;
    if (today === 1) {
        endMonth = new Date().getMonth();
    }
    return endMonth < 10 ? `${endYear}-0${endMonth}` : `${endYear}-${endMonth}`; // 例：'2022-05'
};
export default {
    components: {
        organizationAll,
    },
    data() {
        return {
            dateBackup: '',
            defaultColumns: [
                { title: '机构编码', key: 'agencyNumber' },
                { title: '机构名称', key: 'agencyName' },
                { title: '综合分数', key: 'totalScore' },
                { title: '综合排名名次', key: 'totalScoreRanking', sortable: true },
            ],
            tableColumns: [],
            searchOptions: {
                agencyNumber: '',
                statisticsDate: '',
                agencyType: 1,
                totalScoreRankingSort: 0,
            },
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/workbench/OMfirstOrgManage',
                    op: {
                        selectList: 'selectPage',
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
            moduleName: '/workbench/OMfirstOrgManage',
            pickerOptions: {
                disabledDate(dateVal) {
                    // 1、默认最早可查询月份为2022年2月份，
                    // 2、当前时间为月初1号，月份筛选器只能选到上月，只有当前时间为月初2号，月份筛选器才能筛选本月。

                    const currentTime = dateVal.getTime();
                    const dataStartTime = new Date('2022-02').getTime();
                    const endMonth = getEndMonth();
                    const dataEndTime = new Date(endMonth).getTime();
                    return currentTime < dataStartTime || currentTime > dataEndTime;
                },
            },
        };
    },
    computed: {
        ...mapState('workbench', ['levelListFilters', 'tableColumnsTitleFilters', 'propKeyFilters', 'tipContentFilter', 'propNameFilters']),
    },
    created() {
        this.searchOptions.statisticsDate = getEndMonth();
        this.dateBackup = this.searchOptions.statisticsDate;
        this.getTableColumns();
    },
    methods: {
        beforeQuery() {
            if (!this.searchOptions.statisticsDate) {
                this.$message.error('请选择时间');
                return false;
            } else {
                return this.searchOptions;
            }
        },
        sortChange(orderInfo) {
            // 先去掉原有的排序
            const searchKeys = Object.keys(this.searchOptions);
            searchKeys.forEach(key => {
                if (key.endsWith('Sort')) {
                    delete this.searchOptions[key];
                }
            });
            // 再加上新的排序条件
            this.searchOptions[orderInfo.prop + 'Sort'] = orderInfo.order === 'descending' ? 1 : 0;
            this.search();
        },
        getTableColumns() {
            this.searchOptions.agencyNumber = '';
            this.tableColumns = []; // 需要清空列头才能让表格重载，表格重载自动触发表格数据搜索
            let params = {
                data: { statisticsDate: this.searchOptions.statisticsDate },
                op: 'selectHead',
            };
            const URL = this.getModuleUrl(params.op);
            try {
                this.$axios(URL, params).then(res => {
                    // 对表头进行组装
                    let resData = JSON.parse(res.data);
                    let keys = Object.keys(resData);
                    let extraColumns = [];
                    keys.forEach(key => {
                        if (resData[key] === 1) {
                            extraColumns.push({
                                title: this.tableColumnsTitleFilters[key],
                                key: this.propKeyFilters[key],
                                tip: true,
                                add: key === 'isAppropriateOrder' ? '%' : '',
                            });
                            extraColumns.push({
                                title: this.tableColumnsTitleFilters[key + 'Ranking'],
                                key: this.propKeyFilters[key] + 'Ranking',
                                ext: resData[this.propNameFilters[key]],
                                add: '',
                                sortable: 'custom',
                            });
                        }
                    });
                    this.tableColumns = this.defaultColumns.concat(extraColumns);
                });
            } catch (error) {
                this.$message.error(error);
            }
        },
        search() {
            if (!this.searchOptions.statisticsDate) {
                return this.$message.error('请选择时间');
            }
            if (this.searchOptions.statisticsDate !== this.dateBackup) {
                this.dateBackup = this.searchOptions.statisticsDate;
                this.getTableColumns();
            } else {
                this.$refs.table.search();
            }
        },
        reset() {
            this.searchOptions = {
                agencyNumber: '',
                statisticsDate: getEndMonth(),
                agencyType: 1,
                totalScoreRankingSort: 0,
            };
            this.search();
        },
        exportData() {
            let params = {
                data: this.searchOptions,
                op: 'export',
            };
            const URL = this.getModuleUrl(params.op);
            try {
                this.$axios(URL, params).then(res => {
                    this.$message.success('导出成功，请到文件下载中查看！');
                });
            } catch (error) {
                this.$message.error(error);
            }
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>
<style lang="scss" scoped>
.content-wrap {
    /deep/.ws-table-warp {
        padding: 0px !important;
    }
}
</style>
