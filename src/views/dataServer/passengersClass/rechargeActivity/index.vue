<template>
  <div>
    <div class="recharge_box">
        <div class="radio_box">
            <el-radio-group v-model="radioQuery" :border="false">
                <el-radio-button label="rechargeCity" v-if="showCity">城市维度</el-radio-button>
                <el-radio-button label="rechargeOrg" v-if="showOrg">机构维度</el-radio-button>
            </el-radio-group>
        </div>
        <component v-if="showCity||showOrg" :is="radioQuery"></component>
    </div>
  </div>
</template>

<script>
import rechargeCity from './components/rechargeCity.vue'
import rechargeOrg from './components/rechargeOrg.vue'
export default {
    components:{rechargeCity,rechargeOrg},
    name:"rechargeActivity",
    moduleName: "/dataServer/rechargeActivity",
    data() {
        return {
            radioQuery:'rechargeCity',
            powerObj:{},
        };
    },
    computed:{
        showCity(){
            let opList = ['queryPassengerRechargeCount','queryPassengerRechargeTrend','selectStatPage','pageStatCount','exportUserRechargeData','select']
            return opList.some(k=>this.powerObj[k])
        },
        showOrg(){
            let opList = ['queryPassengerRechargeCountByOrg','queryPassengerRechargeTrendByOrg','selectStatPageByOrg','pageStatCountByOrg','queryOrgDataTree','exportUserRechargeDataByOrg']
            return opList.some(k=>this.powerObj[k])
        }
    },
    mounted() {
        this.getPermissionList()
        this.radioQuery = this.showCity?'rechargeCity':'rechargeOrg'
    },
    methods: {
        getPermissionList(){
            this.powerObj = this.getModulePower('/dataServer/rechargeActivity')
        },
    }
};
</script>
<style lang="scss" scoped>
.recharge_box{
    border-radius: 8px;
    padding: 20px 40px 24px 40px;
    background: #fff;
    width: 100%;
    .radio_box{
        text-align: center;
        margin-bottom: 20px;
        /deep/.el-radio-button__inner{
            padding: 12px 34px;
            border:none;
            background: #F0F2F5;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #606266;
        }
        /deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner{
            background-color: #F05259;
            border-color:#F05259;
            box-shadow: -1px 0 0 0 #f05259;
            color: #FFFFFF;
        }
    }
}
</style>