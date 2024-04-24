<template>
    <div>
        <!-- 列表 -->
        <ws-table-el ref="table" v-bind="tableConfig">
            <template #search>
                <search-group>
                    <label for>选择时间：</label>
                    <div class="date-wrap">
                        <el-select style="width:21%;margin-right: -4px" v-model="searchOptions.dateType" @change="changeTime(searchOptions.dateType)"
                                   placeholder="请选择">
                            <el-option v-for="item in [{label:'按年',value: 'year'},{label:'按月',value: 'month',}]"
                                       :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                        <el-date-picker style="width:80%;" v-model="searchOptions[searchOptions.dateType]"
                                        :type="searchOptions.dateType"
                                        :picker-options="{
                                            disabledDate: time =>{
                                                return searchOptions.dateType == 'year' ? (time.getTime() < new Date('2021-12-31').getTime()) || (time.getTime() > Date.now()) : (time.getTime() < new Date('2022-12-31').getTime()) || ((time.getTime() + 2626560000) > Date.now());
                                            }
                                        }"
                                        :value-format="searchOptions.dateType =='year' ? 'yyyy' : 'yyyy-MM'"
                                        :placeholder="searchOptions.dateType =='year' ? '请选择年份' : '请选择月份'"></el-date-picker>
                    </div>
                </search-group>
                <search-group>
                    <label for>姓名：</label>
                    <el-input v-model.trim="searchOptions.driverName" placeholder="请输入司机姓名" :maxlength="30"
                              clearable></el-input>
                </search-group>
                <search-group>
                    <label for>手机号：</label>
                    <el-input v-model.trim="searchOptions.phoneNum" placeholder="请输入手机号" :maxlength="11"
                              clearable></el-input>
                </search-group>
                <search-group>
                    <label for>司机ID：</label>
                    <el-input v-model.trim="searchOptions.driverId" type="number" placeholder="请输入司机ID" :maxlength="30"
                              clearable></el-input>
                </search-group>
                <search-group v-if="orgType !== 40">
                    <label for>所属机构：</label>
                    <organization v-model="searchOptions[{'10':'regionNumber','20':'companyNumber','30':'centerNumber','40':'stationNumber'}[searchOptions.orgType]]"
                        :showSelect="true" :selectOptions="orgOptions"
                        :orgType="searchOptions.orgType"
                        placeholder="选择机构"
                        valueKey="agencyNumber"
                        :reqData="{data: {isStopOperation: true},op: 'selectOrgByOrgType', moduleName: '/dataServer/annualData'}"
                        @orgTypeChange="(val) => (searchOptions.orgType = val)"
                    ></organization>
                </search-group>
                <search-group>
                    <label for>本地生活包干类型：</label>
                    <el-select v-model='searchOptions.localType'>
                        <el-option v-for="item in localTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>认证包干类型 ：</label>
                    <el-select v-model='searchOptions.vipType'>
                        <el-option v-for="item in vipTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>合伙人类型 ：</label>
                    <el-select v-model='searchOptions.partnerType'>
                        <el-option v-for="item in partnerTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group>
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="table-column-header-button" @click="reset"
                                   icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
            </template>
            <!-- 表格 -->
            <template>
                <ws-table-column-el prop="driverName" label="司机姓名"></ws-table-column-el>
                <ws-table-column-el prop="phoneNum" label="手机号"></ws-table-column-el>
                <ws-table-column-el prop="driverId" label="司机ID"></ws-table-column-el>
                <ws-table-column-el prop="orgName" label="所属机构"></ws-table-column-el>
                <ws-table-column-el label="合伙人类型">
                    <template slot-scope="scope">
                        {{ scope.row.partnerType }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="认证包干类型">
                    <template slot-scope="scope">
                        {{ scope.row.vipType }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="本地生活包干类型">
                    <template slot-scope="scope">
                        {{ scope.row.localType }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="complianceType" label="系统合规类型">
                    <template slot-scope="scope">
                        {{ scope.row.complianceType }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="firstAuditPassTime" label="入网时间">
                    <template slot-scope="scope">
                        {{ scope.row.firstAuditPassTime || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="passingTime" label="入网时长（天）">
                    <template slot-scope="scope">
                        {{ scope.row.passingTime || 0 }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="paymoneyTotal" label="总收入（元）">
                    <template slot-scope="scope">
                        {{ scope.row.paymoneyTotal || '0.00' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="paymoneyOrder" label="订单收入（元）">
                    <template slot-scope="scope">
                        {{ scope.row.paymoneyOrder || '0.00' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="paymoneyActivity" label="活动收入（元）">
                    <template slot-scope="scope">
                        {{ scope.row.paymoneyActivity || '0.00' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="scoreTotal" label="累计获得绩效分（分）">
                    <template slot-scope="scope">
                        {{ scope.row.scoreTotal || 0 }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="currentSocre" label="当前绩效分（分）">
                    <template slot-scope="scope">
                        {{ scope.row.currentSocre || 0 }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="rank" label="当前绩效分排名" fixed="right">
                    <template slot-scope="scope">
                        {{ scope.row.rank || '-' }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="rank" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" style="color: #0088ff" @click="$router.push({path: 'annualData/form', query:{dateType: searchOptions.dateType,...scope.row}})">详情</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>

import {mapState} from "vuex";
import organization from '@/components/orgSelect/organization-options.vue';

export default {
    name: 'annualData',
    components: {
        organization
    },
    data () {
        return {
            moduleName: '/dataServer/annualData',
            orgType: 0,
            searchOptions: {
                orgType: '',
                dateType: 'year',
                year: (new Date().getFullYear() - 1) + '',
                month: new Date().getFullYear() + '-' + (new Date().getMonth() < 10 ? ('0'+new Date().getMonth()) : new Date().getMonth()),
                driverName: '',
                phoneNum: '',
                driverId: '',
                regionNumber: '',
                companyNumber: '',
                centerNumber: '',
                stationNumber: '',
                vipType: '',
                localType: '',
                partnerType: '',
                complianceType: '',
            },
            tableConfig: {
                lazyQuery: {
                    moduleName: '/dataServer/annualData',
                    op: {
                        selectList: 'list',
                    },
                },
            },

        };
    },
    computed:{
        ...mapState('workbench', ['localTypeFilters','vipTypeFilters','partnerTypeFilters', 'complianceTypeFilters']),
        orgOptions() {
           return [
                {
                    value: '10',
                    label: '大区',
                },
                {
                    value: '20',
                    label: '城市分公司',
                },
                {
                    value: '30',
                    label: '区县分公司',
                },
                {
                    value: '40',
                    label: '实体店',
                },
            ].splice({'5':1,'10':1,'20':2,'30':3}[this.orgType] || 0)
        }
    },
    created () {
        this.orgType = this.$baseMethod.getStore('roleOption').orgType;
    },
    watch:{
        'searchOptions.orgType'(val){
            let keys = {10:'regionNumber',20:'companyNumber',30:'centerNumber',40:'stationNumber'}
            for (const key in keys) {
                if(key !== val){
                    this.searchOptions[keys[key]] = ''
                }
            }
        }
    },
    methods: {
        changeTime(type){
            type === 'month' ? this.searchOptions.year = '' : this.searchOptions.month =''
        },
        search () {
            this.$refs.table.search();
        },
        // 重置
        reset () {
            this.searchOptions = this.$options.data().searchOptions
            this.search();
        },
        // 导出
        // async exportExcel () {
        //     const reqData = {
        //         data: {...this.searchOptions},
        //         op: 'export',
        //     };
        //
        //     try {
        //         await this.$axios(this.getModuleUrl('export'), reqData)
        //         this.$message.success('文件正在导出，请到文件下载界面进行下载');
        //     } catch (error) {
        //     }
        // },
        getModuleUrl (op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
.date-wrap {
    width: 100%;
    display: flex;

    /deep/ .ws-daterange .el-input {
        width: 100% !important;
    }
}

</style>
