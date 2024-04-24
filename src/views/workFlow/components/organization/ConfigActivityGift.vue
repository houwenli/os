<template>
    <div class="data_form">
        <h2 class="flow_title" v-if="formList.config ? formList.config.title : true">{{formList.title}}</h2>
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
                        <ws-table-column-el v-for="(item,index) in formList.formConfig" :key="index" :label="item.label">
                            <template slot-scope="scope">
                                <template  v-if="item.key=='promoterRewardAmount'||item.key=='orgRewardAmount'">
                                    <!-- isPercent 为 true 不展示 %  -->
                                    <span v-if="item.config&&item.config.isPercent">{{scope.row[item.key]}}</span>
                                    <span v-else>{{scope.row[item.key]}}%</span>
                                </template>
                                <template  v-else-if="item.key=='minNumber'">
                                    <!-- isAlone 为 true 只展示minNumber  -->
                                    <span v-if="item.config&&item.config.isAlone">{{scope.row[item.key]}}</span>
                                    <span v-else>{{scope.row[item.key]}}-{{scope.row['maxNumber']}}</span>
                                </template>
                                <template v-else>{{scope.row[item.key]}}</template>
                            </template>
                        </ws-table-column-el>
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
        },
        activityConfig:{
            type: Object,
            default: () => {
                return {
                    bigDiv:false,//是否需要除100
                }
            },
        },
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
        !this.activityConfig.bigDiv && this.dataDiv(this.formData)
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
        }
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
