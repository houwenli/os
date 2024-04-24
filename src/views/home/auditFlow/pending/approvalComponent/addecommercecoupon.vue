<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="160px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />
                <div class="block_item_container">
                    <span class="block_item_title">申请信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="优惠券名称：">{{ nodeForm.couponsName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="补充数量：">{{ nodeForm.addNum }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="App显示名称：">{{ nodeForm.showName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="总数量：">{{ nodeForm.totalNumber }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="优惠券类型：">{{ nodeForm.couponsType | opTypeFilter }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.couponsType==1'>
                            <el-form-item label="满减金额：">{{`满${changeYuan(nodeForm.amountLimitation*1)}减${changeYuan(nodeForm.faceValue*1)}元`}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.couponsType==3'>
                            <el-form-item label="减免金额（元）：">{{ changeYuan(nodeForm.faceValue*1) }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='nodeForm.couponsType==2'>
                            <el-form-item label="优惠金额：">{{ `${changeYuan(nodeForm.faceValue)}折`  }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm.couponsPeriodType==1">
                            <el-form-item label="有效期：">{{ `领券后${nodeForm.validDay}天有效` }}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm.couponsPeriodType==2">
                            <el-form-item label="有效期：">{{ `${nodeForm.effectiveStartTime}至${nodeForm.effectiveEndTime}` }}</el-form-item>
                        </el-col>
                    </el-row>
                       <div class="block_item_container">
                    <span class="block_item_title">适用商品</span>
                <ws-table-el style="margin-top:20px" :data="datalist" ref="tableList" :multi="false" :pagination='false' :filterColumns="false" height="50%" :page-size-list="[20, 30, 50]">
                <template>
                    <ws-table-column-el prop="spuId" label="SPU编号" width="200"></ws-table-column-el>
                    <el-table-column label="SPU图片" width="80">
                        <template slot-scope="scope">
                            <img :src="scope.row.url" width="50" height="50" />
                        </template>
                    </el-table-column>
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
                    <ws-table-column-el prop="firstCateName" label="一级分类"></ws-table-column-el>
                    <ws-table-column-el prop="secondCateName" label="二级分类"></ws-table-column-el>
                    <ws-table-column-el prop="thirdCateName" label="三级分类"></ws-table-column-el>
                    <ws-table-column-el prop="brandName" label="品牌"></ws-table-column-el>
                    <ws-table-column-el prop="stock" label="库存"></ws-table-column-el>
                </template>
            </ws-table-el>    
                     </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
export default {
    //优惠卷配置
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
    data() {
        return {
            availableChannel: {
                0: '不限',
                1: 'APP',
                2: '小程序',
            },
            datalist:[]

        };
    },
    created() {
    },
    mounted() {
        console.log(this.nodeForm,'-xcxc');
        this.getDataList()
            console.log(this.nodeForm.id,'133xxxxxxx');
    },
    methods: {
           //单位转换
        changeYuan(num) {
            let str = (num / 100).toFixed(2) + '';
            let intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',');
            let dot = str.substring(str.length, str.indexOf('.'));
            let ret = intSum + dot;
            return ret;
        },
        getDataList() {
           let data={
            op:'querySpuRelationCoupon',
                data:{
                onlineRetailerCouponIds:[this.nodeForm.onlineRetailerCouponId]
                }
           }
                try {
                this.$axios('/cardcoupon/applyOnlineRetailersCoupon/querySpuRelationCoupon',data).then(res => {
                    //列表
                    if (res.code === 1) {
                       console.log(res);
                       this.datalist=JSON.parse(res.data)
                       this.$refs.tableList.tableData=JSON.parse(res.data)
                       console.log( this.datalist);
                    }
                });
            } catch (error) {
                console.log(error);
            }

        },
        //单位转换
        changeYuan(num) {
            let str = (num / 100).toFixed(2) + '';
            let intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',');
            let dot = str.substring(str.length, str.indexOf('.'));
            let ret = intSum + dot;
            return ret;
        },

    },
};
</script>

<style></style>
