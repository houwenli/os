<template>
    <div class="data_form">
        <h2 class="flow_title">{{formList.title}}</h2>
        <section>
            <div class="gift_content">
                <el-row class="form_line">
                    <el-col v-for="item in formList.keys" :key="item.index" :span="12">
                        <el-form-item :label="item.label">
                            <p v-if="formData.length!=0" style="padding-left:10px">
                                {{ (item.nodeHandle && item.nodeHandle(formData[0][item.key])) ||formData[0][item.key]}}
                            </p>
                        </el-form-item>
                    </el-col>
                </el-row>
                <ws-table-el v-bind="tableConfig" :data="formData" :header-cell-style="{ background: '#F5F7FA' }">
                    <template>
                        <ws-table-column-el v-if="show('minNumber' )" :label="'minNumber'|nameFilter(formList.formConfig)">
                             <template slot-scope="scope">
                                   <span>{{scope.row.minNumber}}-{{scope.row.maxNumber}}</span>
                                </template>
                        </ws-table-column-el>
                         <ws-table-column-el v-if="show('promoterRewardAmount' )"  prop="promoterRewardAmount" :label="'promoterRewardAmount' |nameFilter(formList.formConfig)">
                            <template slot-scope="scope">
                                   <span>{{scope.row.promoterRewardAmount}}%</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el v-if="show('orgRewardAmount' )" prop="orgRewardAmount" :label="'orgRewardAmount'|nameFilter(formList.formConfig)">
                            <template slot-scope="scope">
                                   <span>{{scope.row.orgRewardAmount}}%</span>
                            </template>
                        </ws-table-column-el>
                        <ws-table-column-el v-if="show('driverScore' )" prop="driverScore" :label="'driverScore' |nameFilter(formList.formConfig)"></ws-table-column-el>
                        <ws-table-column-el v-if="show('orgScore' )" prop="orgScore" :label="'orgScore' |nameFilter(formList.formConfig)"></ws-table-column-el>
                    </template>
                </ws-table-el>
            </div>
        </section>
    </div>
</template>

<script>
import { Big } from 'big.js';
export default {
    props: {
        formData: {
            type: Array,
            default: () => [],
        },
        formKeys: {
            type: Array,
            default: () => [],
        },
        formList: {
            type: Object,
            default: () => {},
        },
        formGroupObj:{
            type: Object,
            default: () => {
                return {
                    maxNumber:'',
                    minNumber:'',
                    orgRewardAmount:'',
                    promoterRewardAmount:'',
                    rewardLimit:''
                }
            },
        }
    },
    filters:{
        nameFilter(data,formList){
            let name=formList.filter((item)=>{       
                return item.key==data
            })
            return name[0]?.label
        },
    },
    created(){
        this.dataDiv(this.formData)
    },
    data() {
        return {
            tableConfig: {
                data:this.formList,
                filterColumns: false,
                indexColumn: false,
                pagination: false,
            },
            
        };
    },
    methods: {
        show(data){
            return this.formList.formConfig.some((item,index)=>{
                   return item.key==data
            })
        },
        dataDiv(data) {
            let keys=this.formGroupObj
            data.forEach(item => {
                for (const k in item){
                    if(k in keys && item[k] ){
                        let val = new Big(item[k]);
                        item[k]= val.div(100);
                    }
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../comm.scss';

.data_form {
    .form_line {
        margin-bottom: 16px;
    }
    .gift_name {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #303133;
        padding: 0 0 16px 20px;
        position: relative;
    }

    .gift_name::after {
        content: '';
        position: absolute;
        top: 4px;
        left: 0;
        width: 12px;
        height: 12px;
        background: #c0c4cc;
        border-radius: 50%;
    }

    .gift_content {
        width: 100%;
        padding: 16px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
    }

    /deep/ .ws-table-warp {
        padding: 0 !important;
    }
}
</style>
