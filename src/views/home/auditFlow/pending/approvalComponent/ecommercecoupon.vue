<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="160px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />
                <el-collapse v-model="activeNames">
            <el-collapse-item  :title="`配置${index + 1}`"  v-for="(item, index) in nodeForm" :key="index"  :name="index">
                    <div class="block_item_container">
                    <span class="block_item_title">申请信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="优惠券名称：">{{ nodeForm[index].couponsName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="App显示名称：">{{ nodeForm[index].showName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="总数量：">{{ nodeForm[index].totalNumber }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="优惠券类型：">{{ nodeForm[index].couponsType | opTypeFilter }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm[index].couponsType==3'>
                            <el-form-item label="优惠金额（元）：">{{ changeYuan(nodeForm[index].faceValue*1) }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm[index].couponsType==2'>
                            <el-form-item label="优惠金额：">{{ `${changeYuan(nodeForm[index].faceValue*1)}折`  }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm[index].couponsPeriodType==1">
                            <el-form-item label="有效期：">{{ `领券后${nodeForm[index].validDay}天有效` }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm[index].couponsPeriodType==2">
                            <el-form-item label="有效期：">{{ `${nodeForm[index].effectiveStartTime}至${nodeForm[index].effectiveEndTime}` }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">适用商品</span>
                <ws-table-el style="margin-top:20px" :data="datalist" ref="tableList" :multi="false" :pagination='false' :filterColumns="false" height="50%" :page-size-list="[20, 30, 50]">
                <template>
                    <ws-table-column-el prop="spuId" label="SPU编号" width="200"></ws-table-column-el>
                    <ws-table-column-el prop="name" label="SPU标题"></ws-table-column-el>
                    <ws-table-column-el prop="price" label="SPU价格">
                          <template slot-scope="scope">
                            {{changeYuan(scope.row.price)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="discountAfterPrice" label="券后价">
                          <template slot-scope="scope">
                            {{changeYuan(scope.row.discountAfterPrice)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="profit" label="预估利润">
                          <template slot-scope="scope">
                            {{changeYuan(scope.row.profit)}}
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="stock" label="库存"></ws-table-column-el>
                </template>
                </ws-table-el>    
                </div>
               </el-collapse-item>
            </el-collapse>
            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
export default {
    //出行卷配置
    name: 'couponConfigure',
    components: { BaseInfo },
    props: {
        nodeFormJson: {
            type: Object,
            default: () => {},
        },
        dataObject: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            datalist:[],
            activeNames:0,
             availableChannel: {
                0: '不限',
                1: 'APP',
                2: '小程序',
            },

        }
    },
    computed: {
        nodeForm() {
            return JSON.parse(this.dataObject.nodeFormJson);
        },
    },
    filters: {
          opTypeFilter(val) {
            if (val == 1) {
                return '满减';
            } else if (val == 2) {
                return '折扣';
            } else if (val == 3) {
                return '立减';
            }
        },
        DummyFilter(val) {
            if (val == 0) {
                return '否';
            } else if (val == 1) {
                return '是';
            }
        },
        GiftsFilter(val){
            if (val == 0) {
                return '正常商品';
            } else if (val == 1) {
                return '赠品';
            }
        }
    },
    created() {
    },
    mounted() {
        console.log(this.nodeForm);
        this.getData()
        console.log(this.nodeForm.id,'133xxxxxxx');
    },
    methods: {
        getData(){
            this.nodeForm.forEach((element,index) => {
                this.getDataList(index)
            });
        },
        //单位转换
        changeYuan(num) {
            let str = (num / 100).toFixed(2) + '';
            let intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',');
            let dot = str.substring(str.length, str.indexOf('.'));
            let ret = intSum + dot;
            return ret;
        },
             getDataList(index) {
                console.log(this.nodeForm,'this.nodeForm');
           let data={
            op:'querySpuRelationCoupon',
                data:{
                onlineRetailerCouponIds:this.nodeForm[index].ids
                }
           }
                try {
                this.$axios('/cardcoupon/applyOnlineRetailersCoupon/querySpuRelationCoupon',data).then(res => {
                    //列表
                    if (res.code === 1) {
                       console.log(res,'res');
                       this.datalist=JSON.parse(res.data)
                       console.log(this.$refs,'this.$refs');
                       this.$refs.tableList[index].tableData=JSON.parse(res.data)
                       console.log( this.datalist);
                    }
                });
            } catch (error) {
                console.log(error);
            }

        },

    },
};
</script>

<style></style>
