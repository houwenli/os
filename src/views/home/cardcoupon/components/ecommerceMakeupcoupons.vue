<template>
    <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="couponData" :rules="rules">
        <div class="currency-apply-title">基本信息</div>
        <el-row type="flex" justify="space-between" :gutter="40">
            <el-col :span="12">
                <el-form-item prop="commodityName" label="选择优惠券：">
                    <el-select
                     style="width:20vw"
                        v-model="couponData.commodityName"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请选择优惠券"
                        @change="changeType"
                        value-key="id"
                        :remote-method="getTravelList"
                    >
                        <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="addNum" label="补充数量：">
                    <el-input v-model.trim="couponData.addNum" maxlength="8" placeholder="请输入补充数量"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item prop="showName" :disabled="true" label="APP显示别名：">
                    <el-input v-model.trim="couponData.showName" maxlength="30" :disabled="true" placeholder="请输入APP显示别名"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" :gutter="40">
            <el-col :span="8">
                <el-form-item prop="totalNumber" label="总数量：">
                    <el-input v-model.trim="couponData.totalNumber" maxlength="8" :disabled="true" placeholder="请输入总数量"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="couponsType" label="优惠券类型：">
                    <el-select v-model="couponData.couponsType" :disabled="true" placeholder="请选择优惠券类型" style="width: 100%">
                        <el-option label="立减" value="3"></el-option>
                        <el-option label="折扣" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="faceValue" v-if="couponData.couponsType == 3" label="减免金额：" required>
                    <el-input v-model.trim="couponData.faceValue" maxlength="5" :disabled="true" placeholder="请输入减免金额"></el-input>
                </el-form-item>
                <el-form-item prop="faceValue" v-if="couponData.couponsType == 2" label="折扣金额：" required>
                    <el-input v-model.trim="couponData.faceValue" maxlength="5" :disabled="true" placeholder="请输入折扣0.00-10.00"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" :gutter="40">
            <el-col :span="8">
                <el-form-item prop="couponsPeriodType" label="有效日期：">
                    <el-select @change="handlePeriodType" v-model="couponData.couponsPeriodType" :disabled="true" placeholder="请选择有效日期" style="width: 100%">
                        <el-option label="固定周期有效" value="2"></el-option>
                        <el-option label="领券后周期内有效" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="validDay" :disabled="true" v-if="couponData.couponsPeriodType == 1" label="生效周期：">
                    <el-input v-model.trim="couponData.validDay" maxlength="3" :disabled="true" placeholder="请输入领券后有效周期"></el-input>
                </el-form-item>
                <el-form-item v-else prop="pickerDate" label="有效时间：">
                    <!-- <el-date-picker
                        v-model="couponData.pickerDate"
                        :picker-options="pickerOptions"
                        style="width: 100%"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    ></el-date-picker> -->
                    <ws-date-range :intervalTime="0" :disabled="true" :startTime.sync="couponData.effectiveStartTime" :endTime.sync="couponData.effectiveEndTime"></ws-date-range>
                </el-form-item>
            </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="8">
                <el-form-item label="适用商品：">
                    <el-button @click="addcommodity" :disabled="true" type="danger">添加商品</el-button>
                </el-form-item>
            </el-col>
        </el-row> -->
         <div class="currency-apply-title">适用商品</div>
        <ws-table-el :data="couponData.datalist" :filterColumns="false" :pagination="false" ref="tableList" :page-size-list="[10]">
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
                        {{ regFenToYuan(scope.row.price) }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="discountAfterPrice" label="折后价">
                    <template slot-scope="scope">
                        {{ regFenToYuan(scope.row.discountAfterPrice) }}
                    </template>
                </ws-table-column-el>
                <!-- 此处存疑 -->
                <ws-table-column-el prop="profit" label="预估利润">
                    <template slot-scope="scope">
                        {{ regFenToYuan(scope.row.profit) }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="firstCateName" label="一级分类"></ws-table-column-el>
                <ws-table-column-el prop="secondCateName" label="二级分类"></ws-table-column-el>
                <ws-table-column-el prop="thirdCateName" label="三级分类"></ws-table-column-el>
                <ws-table-column-el prop="brandName" label="品牌"></ws-table-column-el>
                <ws-table-column-el prop="stock" label="库存"></ws-table-column-el>
            </template>
        </ws-table-el>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            couponData: {
                showcommodity: false,
                couponsName: '',
                showName: '',
                totalNumber: '',
                couponsType: '2',
                addNum: 0,
                couponId: '',
                faceValue: '',
                amountLimitation: '',
                couponsPeriodType: '2',
                ecommerceradio: '2',
                validDay: '',
                onlineRetailerCouponId: null,
                pickerDate: [],
                datalist: [],
                idName: null,
                effectiveEndTime: '',
                effectiveStartTime: '',
                type:48
            },
            travelList: [],
            selectList: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                }
            },
            rules: {
                couponsName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
                addNum: [
                    { required: true, message: '请输入补充卡券数量', trigger: 'blur' },
                    {
                        pattern: /^(?!0)(?:[0-9]{1,6}|1000000)$/,
                        message: '请输入1-1000000（100万）',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },

    watch: {
        couponData: {
            handler: function (newVal) {
                this.$emit('changeVal', newVal)
            },
            deep: true
        }
    },

    created() {
        //请求卡券的方法
        // this.getTravelList()
    },

    methods: {
        addcommodity() {
            this.showcommodity = true
        },
        getTravelList(data) {
            this.selectList = []
            this.travelList = []
            const opt = {
                data: { couponsName: data },
                op: 'queryListByName'
            }
            this.$axios('/cardcoupon/applyOnlineRetailersCoupon/queryListByName', opt).then(res => {
                let list = JSON.parse(res.data)
                this.travelList = JSON.parse(res.data)
                // this.selectList=list
                list.forEach((item, index) => {
                    this.selectList.push({ value: item.id, label: item.couponsName+'-'+item.commodityName })
                })
                console.log(list,'---xx2312312');
            })
        },
        getDataList(val) {
            let data = {
                op: 'querySpuRelationCoupon',
                data: {
                    onlineRetailerCouponId: val
                }
            }
            try {
                this.$axios('/cardcoupon/applyOnlineRetailersCoupon/querySpuRelationCoupon', data).then(res => {
                    //列表
                    if (res.code === 1) {
                        this.datalist = JSON.parse(res.data)
                        this.$refs.tableList.tableData = JSON.parse(res.data)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        },
        changeType(val) {
            console.log(val, 'xxx99999')
            if (val) {
                let currentList = this.travelList
                currentList = currentList.filter(item => {
                    return item.id == val
                })[0]
                    this.couponData.showName = currentList.showName,
                    this.couponData.faceValue = this.$baseMethod.regFenToYuan(currentList.faceValue),
                    this.couponData.totalNumber = currentList.totalNumber,
                    this.couponData.validDay = currentList.validDay,
                    this.couponData.effectiveEndTime = currentList.effectiveEndTime,
                    this.couponData.effectiveStartTime = currentList.effectiveStartTime,
                    this.couponData.pickerDate[1]=currentList.effectiveEndTime,
                    this.couponData.pickerDate[0]=currentList.effectiveStartTime,
                    this.couponData.couponsType = currentList.couponsType + '',
                    this.couponData.couponsPeriodType = currentList.couponsPeriodType + '',
                    this.couponData.onlineRetailerCouponId = currentList.id
                    this.couponData.amountLimitation = currentList.amountLimitation,
                     this.couponData.couponsName = currentList.couponsName,
                    this.getDataList(currentList.id)
            } else {
                this.$refs['basicInfo'].resetFields()
                this.money = ''
            }
        },
        regFenToYuan(m) {
            return this.thousandSeparator(this.$baseMethod.regFenToYuan(m))
        },
        // 添加千位符
        thousandSeparator(num) {
            var res = num.toString().replace(/\d+/, function (n) {
                // 先提取整数部分
                return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                    return $1 + ','
                })
            })
            return res
        },
        handlePeriodType(val) {
            console.log(val)
            if (val == 2) {
                this.couponData.pickerDate = [new Date(), new Date()]
                this.couponData.validDay = null
            } else if (val == 1) {
                this.couponData.pickerDate = []
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.currency-apply-title {
    width: 80px;
    height: 28px;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 16px;
    margin-top: 32px;
}
.el-checkbox {
    width: 100px;
}
</style>
