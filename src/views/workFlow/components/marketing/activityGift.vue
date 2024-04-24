<template>
    <div class="data_form">
        <h2 class="flow_title">{{ giftTitle }}</h2>
        <section v-for="(activityPack, index) in formData" :key="index">
            <p v-if="isShow" class="gift_name" :style="{ 'margin-top': index === 0 ? '0px' : '24px' }">{{
            `${activityPack.activityPackName}详情` }}</p>
            <div class="gift_content">
                <el-row v-if="formKeys.length > 0" class="form_line">
                    <el-col v-for="keyItem in formKeys" :key="keyItem.index" :span="12" v-show='(keyItem.nodeHandle && keyItem.nodeHandle(keyItem, activityPack, index).val) ||
                            activityPack[keyItem.key]'>
                        <el-form-item
                            :label="(keyItem.nodeHandle && keyItem.nodeHandle(keyItem, activityPack, index).label) || keyItem.label">
                            <p>{{ (keyItem.nodeHandle && keyItem.nodeHandle(keyItem, activityPack, index).val) ||
                            activityPack[keyItem.key] }}</p>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 奖励 -->
                <div v-if="activityPack.couponsOrRedPackets">
                    <div v-for="item in activityPackType" :key="item.type">
                        <div v-if="item.list.length!=0">
                            <p class="gift_name" style="margin-top: 24px" v-if="item.title">{{item.title}}</p>
                            <giftTable :type="item.type" :tableData="item.list" :tableList="tableList"></giftTable>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import giftTable from './giftTable.vue';

export default {
    components: { giftTable},
    props: {
        formData: {
            type: Array,
            default: () => [],
        },
        formKeys: {
            type: Array,
            default: () => [],
        },
        giftTitle: {
            type: String,
            default: '活动礼包',
        },
        tableList: {
            type: Array,
            default: () => [],
        },
        isShow: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            activityPackType:{
                0:{
                    type:0,
                    title:'',
                    list:[],
                    name:''
                },
                1:{
                    type:1,
                    title:'出行券奖励',
                    list:[],
                    name:'giftTable'
                },
                2:{
                    type:2,
                    title:'红包奖励',
                    list:[],
                    name:'redPackets'
                },
                3:{
                    type:3,
                    title:'电商优惠券',
                    list:[],
                    name:'shopCards'
                },
            }
        }
    },
     watch: {
        'formData':{
            handler(val) {
                if(val.length !=0 && val[0].couponsOrRedPackets){
                    val[0].couponsOrRedPackets.forEach(item => { 
                        if(item.activityPackType){
                            this.activityPackType[item.activityPackType].list.push(item)
                        }else{
                            //兼容非 出行券奖励 红包奖励 电商优惠券
                            this.activityPackType['0'].list.push(item)
                        }
                    });
                }
            },
            immediate: true
        }
    },
    computed: {
        showTips() {
            return function (keyItem, activityPack, index) {
                return { display: index > 0 ? 'none' : 'block', 'margin-bottom': '-24px' }
            }
        }
    },
    mounted(){
    },
    methods:{
    }
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
