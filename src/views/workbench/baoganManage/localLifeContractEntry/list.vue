<template>
<!-- 本地生活包干录入列表 -->
    <div class="bg-page" :class="isFolder?'addWidth':''">
        <div class="sidebar"> 
            <tabs @changeWidth="changeWidth"></tabs>
        </div>
        <!-- 本地生活包干录入 -->
        <ws-table-el align="left" ref="table" v-bind="tableConfig" :col="8" :header-cell-style="{ background: '#F5F7FA' }">
            <template #search>
                <search-group>
                    <label for>订单号：</label>
                    <el-input v-model.trim="searchOptions.orderCode" placeholder="请输入订单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>姓名：</label>
                    <el-input v-model.trim="searchOptions.name" placeholder="请输入姓名" clearable maxlength="11"></el-input>
                </search-group>
                <search-group>
                    <label for>手机号码：</label>
                    <el-input v-model.trim="searchOptions.phone" placeholder="请输入手机号码" clearable maxlength="11"></el-input>
                </search-group>
                <search-group>
                    <label for>机构名称：</label>
                    <organization
                        v-model="searchOptions.idNumber"
                        :showSelect="true"
                        :selectOptions="selectOptions"
                        ref="orgSelect"
                        placeholder="请选择"
                        valueKey="idNumber"
                        :orgType="searchOptions.orgType"
                        :reqData="{}"
                        @orgTypeChange="changeOrgType"
                        @organizationChange="organizationChange">
                    </organization>
                </search-group>
                <search-group>
                    <label for>推荐类型：</label>
                    <el-select v-model="searchOptions.recommendType" placeholder="请选择推荐类型" clearable>
                        <el-option v-for="item in recommendedTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>推荐人手机号：</label>
                    <el-input v-model.trim="searchOptions.recommendPhone" placeholder="请输入推荐人手机号" clearable maxlength="11"></el-input>
                </search-group>
                <search-group>
                    <label for>状态：</label>
                    <el-select v-model="searchOptions.orderType" placeholder="请选择状态" clearable>
                        <el-option v-for="item in stateFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>打款时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.drawingTimeStart"
                        :endTime.sync="searchOptions.drawingTimeEnd"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        style="width: 100%"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>创建时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.createTimeStart"
                        :endTime.sync="searchOptions.createTimeEnd"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        style="width: 100%"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>退款时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.refundTimeStart"
                        :endTime.sync="searchOptions.refundTimeEnd"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        style="width: 100%"
                    ></ws-date-range>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList.pageList || powerList.count">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button style="margin-left:20px" @click="derive" v-if="powerList.exportLocalLivingContract" plain>导出</el-button>
                <el-button plain @click="enterAdd('add')" v-if="powerList.save" style="margin-left: 20px">
                    <i class="el-icon-circle-plus" style="margin-right: 4px"></i>
                    新增
                </el-button>
            </template>
            <template>
                <ws-table-column-el align="center" prop="orderCode" label="订单号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="name" label="姓名"></ws-table-column-el>
                <ws-table-column-el align="center" prop="phone" label="手机号码"></ws-table-column-el>
                <ws-table-column-el align="center" prop="amount" label="金额（元）">
                  <template slot-scope="scope">{{ scope.row.amount?scope.row.amount.toFixed(2):'-' }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="drawingTime" label="打款时间">
                  <template slot-scope="scope">{{ scope.row.drawingTime?scope.row.drawingTime:'-' }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="recommendType" label="推荐类型">
                    <template slot-scope="scope">{{ scope.row.recommendType | recommendedTypeFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="recommendName" label="推荐人">
                    <template slot-scope="scope">{{ scope.row.recommendType == 1 ? scope.row.recommendName:'-' }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="recommendPhone" label="推荐人手机号码">
                    <template slot-scope="scope">{{ scope.row.recommendType == 1 ? scope.row.recommendPhone:'-' }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="deptFullName" label="机构名称"></ws-table-column-el>
                <ws-table-column-el align="center" prop="orderType" label="状态">
                  <template slot-scope="scope">{{ scope.row.orderType | stateFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="refundAmount" label="退款金额">
                  <template slot-scope="scope">{{ scope.row.refundAmount&&scope.row.refundAmount.toFixed(2) || '-' }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="refundTime" label="退款时间">
                  <template slot-scope="scope">{{ scope.row.refundTime&&scope.row.refundTime || '-' }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" label="操作" fixed="right" width="140px">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            v-if="powerList.detail"
                            style="color:#0088ff;"
                            @click="enterForm(scope.row.id,scope.row.orderCode,'detail')"
                        >详情</el-button>
                        <el-button
                            type="text"
                            v-if="powerList.update&&scope.row.orderType==1"
                            style="color:#0088ff;"
                            @click="enterAdd('edit',scope.row.id)"
                        >修改</el-button>
                        <el-button
                            type="text"
                            v-if="powerList.refund&&scope.row.orderType==1"
                            style="color:#F56C6C;"
                            @click="enterForm(scope.row.id,scope.row.orderCode,'refund')"
                        >退款</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import tabs from '../components/tabs.vue';
import organization from './components/organization-options.vue'
export default {
    components: { tabs, organization },
    name: 'localLifeContractEntry',
    data() {
        return {
            moduleName: '/workbench/baoganManage/localLifeContractEntry',
            tableConfig: {
                filterColumns: false,
                emptyModel: true,
                indexColumn: true,
                layout: 'flow',
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/localLifeContractEntry',
                    // url: '/localLivingContract/select',
                    op: {
                        selectList: 'pageList',
                        selectCount: 'count',
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
            isFolder:false,
            searchOptions: {
                orderCode: '', //订单号
                name: '', //姓名
                phone: '', //手机号码
                idNumber: '', //机构编码
                orgType: '', //机构类型
                recommendType: '', //推荐类型
                recommendPhone: '', //推荐人手机号
                orderType: '', //状态
                drawingTimeStart: '', //打款开始时间
                drawingTimeEnd: '', //打款结束时间
                createTimeStart: this.$baseMethod.getBeforeDay(-7, 'yyyy-MM-dd hh:mm:ss'), //创建开始时间
                createTimeEnd: this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd 23:59:59'), //创建结束时间
                refundTimeStart: '', //退款开始时间
                refundTimeEnd: '', //退款开始时间
            },
            selectOptions: [
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
              }
            ]
        };
    },
    computed: {
        ...mapState({
            recommendedTypeFilters: state => state.baogan.recommendedTypeFilters,
            stateFilters: state => state.baogan.stateFilters
        })
    },
    activated() {
      this.search()
    },
    methods: {
        beforeQuery() {
            return this.searchOptions;
        },
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.$refs.table.reset();
        },
        changeOrgType(val) {
            this.searchOptions.orgType = val;
        },
        organizationChange(value, orgName, agencyNumber) {
            this.searchOptions.idNumber = value;
        },
        enterAdd(type,id) {
            this.$router.push({ name: 'localLifeContractEntryAdd', query: {type,id} });
        },
        enterForm(id,orderCode,type) {
            this.$router.push({ name: 'localLifeContractEntryForm', query: {id,orderCode,type} });
        },
        derive() {
            // 导出
            let param = {
                data: this.searchOptions,
                op: 'exportLocalLivingContract'
            };
            let URL = this.powerList.exportLocalLivingContract;
            this.$axios(URL, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
            });
        },
        changeWidth(isFolder){
            this.isFolder = isFolder
        }
    }
};
</script>

<style lang="scss" scoped>
.bg-page{
    display:flex;
    transition: 0.5s;
    .sidebar{
        flex:1;
        margin-right:14px;
    }
}
.bg-page /deep/ .ws-table-warp {
    border-radius: 0 0 8px 8px;
    padding: 24px !important;
    width:89%;
}
.addWidth /deep/ .ws-table-warp {
    width:92%;
}
.ws-organization-options {
  /deep/.options-wrap {
      width: 116px !important;
      flex: 0 0 116px;
      border-right: 1px solid #dcdfe6;
  }
}
/deep/ .table-column-header-button {
    padding: 10px 12px;
}
/deep/ .ws-table-warp .searchBtns {
    margin-right: 0px;
}
</style>
