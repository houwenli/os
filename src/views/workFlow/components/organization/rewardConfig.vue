<template>
    <div>
        <div v-for="(item,index) in configData" :key="index" class="data_form">
            <h2 class="flow_title">{{item.title}}</h2>
            <div :class="[isHeader ? 'gift_content' : '']">
                <el-row class="form_line" v-if="configForm === 'recommendRechargeOrg'">
                    <el-col :span="12">
                        <el-form-item label="推荐奖励上限：">
                            <p>{{ formData[item.tableName][0]['limitType'] |changelimitType}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="formData[item.tableName][0]['limitType']">
                        <el-form-item label="奖励上限（元）：">
                            <p>{{ formData[item.tableName][0]['rewardLimit'] }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="推荐奖励配置：">
                            <p>{{ formData[item.tableName][0]['rewardType'] | changerewardType}}</p>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="form_line" v-else-if="configForm === 'recommendRecharge'">
                    <el-col :span="12">
                        <el-form-item label="推荐奖励上限：">
                            <p>{{ formData['limitType'] |changelimitType}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="formData['limitType']">
                        <el-form-item label="奖励上限（元）：">
                            <p>{{ (formData['rewardLimit']/100).toFixed(0)}}</p>
                        </el-form-item>
                    </el-col>
                </el-row>
                <ws-table-el v-bind="tableConfig" :data="formData[item.tableName]" :header-cell-style="{ background: '#F5F7FA' }" ref="table">
                    <template>
                        <ws-table-column-el v-for="(sitem,sindex) in item.tableCloumn" :key="sindex" :label="sitem.label">
                            <template slot-scope="scope">
                                <span v-if="sitem.type === 'a'">{{scope.row[sitem.prop.split('-')[0]] |fixedMoney(sindex,configForm)}} - {{scope.row[sitem.prop.split('-')[1]] | fixedMoney(sindex,configForm)}}</span>
                                <span v-else-if="sitem.type === 'p'">{{scope.row[sitem.prop]|fixedMoney(sindex,configForm) }}%</span>
                                <span v-else>{{scope.row[sitem.prop] | fixedMoney(sindex,configForm)}}</span>
                            </template>
                        </ws-table-column-el>
                    </template>
                </ws-table-el>
            </div>
        </div>
    </div>
</template>

<script>
import { PURCHASE_LIMIT } from '@/utils/enum';
import Big from 'big.js';
export default {
    name:'rewardConfig',
    props: {
        formData: {
            type: Object,
            default: () => {},
        },
        isHeader: {
            type: Boolean,
            default: false
        },
        listName:{
            type: String,
            default: () => {
                return 'activityRules'
            },
        },
        configData:{
            type: Array,
            default: () => [],
        },
        configForm:{
            type: String,
            default:''
        }
    },
    data() {
        return {
            PURCHASE_LIMIT,
            countDown: {
                1: '开启',
                2: '关闭',
            },
            tableConfig: {
                filterColumns: false,
                pagination: false,
            },
        };
    },
    filters:{
        changelimitType(val) {
            let str = ["不限","每日奖励上限","活动周期内获得奖励上限"]
            return str[val]
        },
        changerewardType(val) {
            let str = ["","固定金额奖励","比例金额奖励"]
            return str[val]
        },
        fixedMoney(val,index,type) {
            let str = val
            
            if(index < 2 && type === 'rechargeSend' || index < 2 && type === 'recommendRecharge') {
                return Big(val).div(100) 
            } else {
                return str
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../comm.scss';

.gift_content {
    padding: 16px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
}

.form_line {
    margin-bottom: 16px;
}
</style>
