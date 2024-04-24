<template>
    <div class="evaluate-info">
        <el-button plain v-if="passengerCommentStatus==0">乘客未评价</el-button>
        <el-button plain v-if="driverCommentStatus==0">车主未评价</el-button>
        <el-button plain v-if="passengerCommentStatus==1" @click="goEvaluate(0)">乘客已评价</el-button>
        <el-button plain v-if="driverCommentStatus==1" @click="goEvaluate(1)">车主已评价</el-button>
        <el-button plain v-if="passengerCommentStatus==2">乘客评价超时</el-button>
        <el-button plain v-if="driverCommentStatus==2">车主评价超时</el-button>
    </div>
</template>
<script>
export default {
    props:['dataList','fromTaxi'],
    data() {
        return {
            passengerCommentStatus: null,
            driverCommentStatus: null,
        }
    },
    watch: {
        dataList: {
            handler(val) {
                this.originData = val;
                this.passengerCommentStatus = this.dataList.passengerCommentStatus;
                this.driverCommentStatus = this.dataList.driverCommentStatus;
            },
            immediate: true
        }
    },
    methods:{
        goEvaluate(type){   //0 乘客   1 司机
            let name = '',
                serialType = 0;
            if(type){
                name = 'evaluatedriver'
            }else{
                name = 'evaluatePassenger'
            }
            let query = {
                serialType:this.fromTaxi? '1': '0',
                orderId: this.$route.query.orderId,
            };
            this.$router.refresh({ name, query});
        }
    }
    
}
</script>