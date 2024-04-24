<template>
    <div class="founderReview">
        <div class="reviewBox">
            <div class="rightBox">
                <el-form class="flow_form" :inline="true" label-width="140px" :model="handleData">
                    <dataForm v-for="item in confingList" :key="item.index" :formConfig="item.formConfig" :formData="handleData" :title="item.title"></dataForm>
                </el-form>
                <div class="titleBox">
                    <h2 class="listTitle">补偿奖励配置</h2>
                </div>
                <ws-table-el v-bind="tableConfig" :data="tableData" :header-cell-style="{ background: '#F5F7FA' }">
                    <template>
                        <ws-table-column-el prop="couponsName" label="出行券名称"></ws-table-column-el>
                        <ws-table-column-el prop="showName" label="App显示别名"></ws-table-column-el>
                        <ws-table-column-el prop="couponsType" label="出行券类型">
                            <template slot-scope="scope">
                                <span v-if="scope.row.couponsType">{{ getEnumVal(couponsTypeFilters, scope.row.couponsType, 'value') }}</span>
                                <span v-else>{{'--'}}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el prop="faceValue" label="优惠金额">
                            <template slot-scope="scope">
                                <span>{{ faceValueHandle(scope.row) }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el prop="serviceId" label="适用业务">
                            <template slot-scope="scope">
                                <span v-if="scope.row.ifAllBusiness === 1">不限</span>
                                <span v-else>{{ getEnumVal(fitBusinessFilters, scope.row.serviceId ? scope.row.serviceId.split(',') : '', 'value').toString() }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el prop="sendNum" label="数量"></ws-table-column-el>
                        <ws-table-column-el width="350px" prop="effectiveStartTime" label="有效期">
                            <template slot-scope="scope">
                                <span>{{ timeHandle(scope.row) }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el width="120px" label="可用渠道">
                            <template slot-scope="scope">
                                <div v-if="[undefined, null].includes(scope.row.availableChannel)">{{ '-' }}</div>
                                <div v-else>{{ scope.row.availableChannel | availableChannelFilters }}</div>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el width="120px" label="可用时间段">
                            <template slot-scope="scope">
                                <span>{{ availableHandle(scope.row) }}</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el width="120px" prop="useCity" label="适用城市">
                            <template slot-scope="scope">
                                <span>{{scope.row.useCity===0?'不限城市':'部分城市'}}</span>
                            </template>
                        </ws-table-column-el>
                    </template>
                </ws-table-el>
                <div v-if="!JSON.parse(this.dataObject.nodeFormJson).userFileUrl">
                <div class="titleBox">
                    <h2 class="listTitle">补偿奖励用户</h2>
                </div>
                <ws-table-el v-bind="tableDataConfig" :data="tableUserData" :header-cell-style="{ background: '#F5F7FA' }">
                    <template>
                        <ws-table-column-el prop="passengerPhone" label="用户手机号"></ws-table-column-el>
                        <ws-table-column-el prop="remark" label="备注"></ws-table-column-el>
                    </template>
                </ws-table-el>
            </div>
                <div v-if="JSON.parse(this.dataObject.nodeFormJson).userFileUrl">
                <div class="titleBox">
                    <h2 class="listTitle">补偿奖励用户</h2>
                </div>
                <div class="file_container">
                    <img src="@/assets/index/fileIcon.png" style="margin-right: 10px" />
                    <div class="attachment-item-text">
                    <div>
                    <a :href="JSON.parse(this.dataObject.nodeFormJson).userFileUrl" target="_blank">{{ '用户列表.xlsx' }}</a>
                    <span @click="handleDownLoad">下载</span>
                     </div>
                        </div>
                        </div>
               
            </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import dataForm from '@/views/workFlow/components/dataForm.vue';
export default {
    name: 'driverCoCreatorApplication',
    components: { dataForm },
    props: {
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            tableConfig: {
                filterColumns: false,
                indexColumn: false,
                pagination: false,
            },
            tableDataConfig: {
                filterColumns: false,
                indexColumn: false,
                pagination: false,
                indexColumn:true
            },
            activtyConfig: [
                {
                    title: '审批发起信息',
                    formConfig: [
                        {
                            label: '审批编号',
                            key: 'procdefNo',
                        },
                        {
                            label: '审批类型',
                            key: 'couponCompensation',
                        },
                        {
                            label: '发起时间',
                            key: 'startTime',
                        },
                        {
                            label: '发起人',
                            key: 'startUserName',
                        },
                        {
                            label: '所属部门',
                            key: 'startDeptName',
                        },
                    ],
                },
            ],
        };
    },
    computed: {
      ...mapState({
            // availableChannelFilters: state => state.workFlow.availableChannelFilters,
            useCityFilters: state => state.workFlow.useCityFilters,
            fitBusinessFilters: state => state.workFlow.fitBusinessFilters,
            couponsTypeFilters: state => state.workFlow.couponsTypeFilters,
            availableChannelFilters: state => state.workFlow.availableChannelFilters,
        }),
        handleData() {
            let pageData = JSON.parse(JSON.stringify(this.dataObject));
            let driverName = JSON.parse(pageData.nodeFormJson).name;
            return { ...pageData, driverName ,couponCompensation:'补偿奖励审核'};
        },
        confingList() {
            return this.activtyConfig.filter((p,index)=>{
                return index < 2
            })
        },
        tableData() {
            let data = JSON.parse(this.dataObject.nodeFormJson);
            return data.userTravelCouponList;
        },
        tableUserData(){
          let data = JSON.parse(this.dataObject.nodeFormJson);
            return data.compensationUserAoInfos;
        }
    },
    methods: {
        faceValueHandle(row) {
            let { couponsType, faceValue, amountLimitation } = row;
            let text;
            switch (couponsType) {
                case 1:
                    text = `满${amountLimitation / 100 || '--'}元减${faceValue / 100 || '--'} 元`;
                    break;
                case 2:
                    text = `${faceValue / 100 || '--'} 折/${amountLimitation / 100 || '--'} 元`;
                    break;
                case 3:
                    text = `${faceValue / 100 || '--'} 元`;
                    break;
                default:
                    text = '--';
                    break;
            }
            return text;
        },
        handleDownLoad() {
            let url=JSON.parse(this.dataObject.nodeFormJson).userFileUrl
            if(url){
            this.$baseMethod.exportFileByUrl(url)
        };
        },
        timeHandle(row) {
            let { validDay, effectiveStartTime, effectiveEndTime, couponsPeriodType } = row;
            if (couponsPeriodType === 1) {
                // 红包
                return `领取后${validDay || '--'}天内有效`;
            } else {
                return `${effectiveStartTime || '--'} 至 ${effectiveEndTime || '--'}`;
            }
        },

        availableHandle(row) {
            let { availableStartTime, availableEndTime } = row;
            if (!availableStartTime && !availableEndTime) return '--';
            return `${availableStartTime || '--'}-${availableEndTime || '--'}`;
        },
    },
};
</script>
<style lang="scss" scoped>
.ws-table-warp{
  padding: 0px 32px!important;
}
.data_form {
    margin:  32px 32px 0px 32px;
}
.titleBox {
    padding-top: 32px;
    margin-left: 32px;
}
.listTitle {
    height: 25px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    line-height: 25px;
    margin-bottom: 16px;
    padding-left: 8px;
    position: relative;
}
.file_container {
    margin-left: 32px;
    position: relative;
    display: flex;
    align-items: center;
    height: 80px;

    .attachment-item-text {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: rgba(0, 0, 0, 0.65);
        span{
            cursor: pointer;
            margin-left: 12px;
            color: blue;
    }
    }

    .attachment-item-size {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #c0c4cc;
    }

    &:hover {
      .file_shadow {
        display: block;
      }
    }
}
.listTitle::after {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    width: 4px;
    height: 16px;
    background: #f05259;
    border-radius: 0px 84px 84px 0px;
}
.urlBox{
    margin-left: 32px;
    span{
        color: blue;
    }
}
</style>