<template>
    <div class="oper-guide">
        <el-form >
            <el-form-item :label="item.lable" :key="index" v-for="(item,index) in form" >
                <span>{{item.value}}</span>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data(){
        return {
            form: [
                {lable: '乘客下单', value: '乘客发起呼单'},
                {lable: '系统调度', value: '系统对订单进行分发'},
                {lable: '系统调度推送', value: '司机满足派单规则'},
                {lable: '系统调度忽略', value: '司机不满足派单规则'},
                {lable: '司机抢单成功', value: '司机抢单成功'},
                {lable: '司机抢单失败', value: '司机抢单失败'},
                {lable: '司机忽略', value: '系统分发订单给司机，被司机忽略'},
                {lable: '司机取消', value: '系统分发订单给司机，被司机取消'},
                {lable: '乘客取消', value: '乘客取消该订单'},
                {lable: '重复呼单', value: '乘客下单后，系统分单周期结束后未得到司机响应，乘客选择继续呼单'}
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
    .oper-guide{
        .el-form-item{
            width: 50%;
            display: inline-block;
        }
    }
</style>