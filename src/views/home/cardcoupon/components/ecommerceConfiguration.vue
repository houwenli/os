<template>
    <div>
        <el-button class="add-card-button" @click="addcard" type="danger">添加优惠券配置</el-button>
        <el-collapse v-model="activeNames">
            <el-collapse-item :title="`配置${index + 1}`" v-for="(item, index) in cardList" :key="index" :name="index">
                <addCommodity ref="addCommodityList" @selectList="selectList" :couponRelationSpuList="cardList[index].searchList" :inListData="inListData" />
                <uploadCoupon class="uploadList" ref="uploadCommodityList" @selectList="selectList" @uploadList="uploadList" />
                <template slot="title">
                    <div class="ad-config-template">
                        <span class="ad-config-title">配置-{{ index + 1 }}</span>
                        <span class="ad-config-copy" @click="copyCardList(index)">复制新建</span>
                        <!-- <span v-if='cardList.length>1' class="ad-config-delete" @click="deleteCardList(index)">删除</span> -->
                        <span v-if="cardList.length > 1" class="ad-config-delete" @click="opendel(index)">删除</span>
                    </div>
                </template>
                <el-form ref="basicInfo" label-position="right" label-width="8rem" :model="cardList[index]" :rules="rules">
                    <div class="currency-apply-title">基本信息</div>
                    <el-row type="flex" justify="space-between" :gutter="40">
                        <el-col :span="12">
                            <el-form-item prop="couponsName" label="优惠券名称：">
                                <el-input v-model.trim="cardList[index].couponsName" maxlength="30" placeholder="请输入优惠券名称"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item prop="showName" label="APP显示别名：">
                                <el-input v-model.trim="cardList[index].showName" maxlength="30" placeholder="请输入APP显示别名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="totalNumber" label="总数量：">
                                <el-input v-model.trim="cardList[index].totalNumber" maxlength="8" placeholder="请输入总数量"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" :gutter="40">
                        <el-col :span="12">
                            <el-form-item prop="couponsType" label="优惠券类型：">
                                <el-select
                                    :disabled="cardList[index].couponRelationSpuList.length > 0"
                                    @change="couponsTypeChange(cardList[index].couponsType, index)"
                                    v-model="cardList[index].couponsType"
                                    placeholder="请选择优惠券类型"
                                    style="width: 100%"
                                >
                                    <el-option label="折扣" value="2"></el-option>
                                    <el-option label="立减" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="faceValue" :label="cardList[index].couponsType == 2 ? '折扣金额：' : '减免金额：'">
                                <el-input
                                    v-model.trim="cardList[index].faceValue"
                                    @change="changeprice(index)"
                                    :maxlength="cardList[index].couponsType == 2 ? 5 : ''"
                                    :placeholder="cardList[index].couponsType == 2 ? '请输入折扣0.00-10.00' : '请输入优惠金额'"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="couponsPeriodType" label="有效日期：">
                                <el-select @change="handlePeriodType" v-model="cardList[index].couponsPeriodType" placeholder="请选择有效日期" style="width: 100%">
                                    <el-option label="固定周期有效" value="2"></el-option>
                                    <el-option label="领券后周期内有效" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" :gutter="40">
                        <el-col :span="8">
                            <el-form-item prop="validDay" v-if="cardList[index].couponsPeriodType == 1" label="生效周期：">
                                <el-input v-model.trim="cardList[index].validDay" maxlength="3" placeholder="请输入领券后有效周期"></el-input>
                            </el-form-item>
                            <el-form-item v-else prop="pickerDate" label="有效时间：">
                                <el-date-picker
                                    v-model="cardList[index].pickerDate"
                                    :picker-options="pickerOptions"
                                    style="width: 100%"
                                    type="datetimerange"
                                    range-separator="至"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item required label="适用商品：">
                                    <el-button style="margin-left: 20px" @click="addcommoditybtn(index)" type="danger">添加商品</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-button style="margin-left: 10px" @click="uploadCommodity(index)" type="danger">批量上传</el-button>
                    </el-row>
                    <!-- 后续更替 -->
                    <!-- <ws-table-el  v-bind="tableConfig" ref="table" :page-size-list="[20, 30, 50]"> -->
                    <div class="currency-apply-title">适用商品设置</div>
                    <div class="tableBox">
                        <ws-table-el
                            class="commodtyListStyle"
                            :data="cardList[index].tableList"
                            :filterColumns="false"
                            :pagination="true"
                            :autoHeight='false'
                            ref="table"
                            height="400"
                            :total="cardList[index].total"
                            :currentPage="cardList[index].currentPage"
                            @currentChange="val => handleCurrentChange(val, index)"
                        >
                            <template #search>
                                <search-group>
                                    <label for>SPU编号:</label>
                                    <el-input v-model.trim="cardList[index].searchOptions.spuId" placeholder="请输入"></el-input>
                                </search-group>
                                <search-group>
                                    <label for>SPU标题:</label>
                                    <el-input v-model.trim="cardList[index].searchOptions.name" placeholder="请输入"></el-input>
                                </search-group>
                            </template>
                            <template #searchBtns>
                                <el-button-group class="commodtyListBtnStyle">
                                    <ws-enter-event>
                                        <el-button type="primary" icon="el-icon-search" @click="search(index)">查询</el-button>
                                    </ws-enter-event>
                                    <ws-throttle>
                                        <el-button type="primary" class="table-column-header-button" icon="el-icon-refresh-left" @click="reset(index)"></el-button>
                                    </ws-throttle>
                                </el-button-group>
                            </template>
                            <template>
                                <ws-table-column-el prop="spuId" label="SPU编号" width="200"></ws-table-column-el>
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
                                <ws-table-column-el prop="stock" label="库存"></ws-table-column-el>
                                <ws-table-column-el label="操作" fixed="right" min-width="50px">
                                    <template slot-scope="scope">
                                        <!-- <el-button  @click="enterForm('delete', scope.row.id)" type="text">移除</el-button> -->
                                        <el-button @click="deletecommodity(scope, index)" type="text">移除</el-button>
                                    </template>
                                </ws-table-column-el>
                            </template>
                        </ws-table-el>
                    </div>
                </el-form>
            </el-collapse-item>
            <!-- </ws-descriptions> -->
        </el-collapse>
    </div>
</template>

<script>
import addCommodity from './addCommodity.vue'
import uploadCoupon from './uploadCoupon.vue'
export default {
    components: { addCommodity, uploadCoupon },
    data() {
        return {
            cardList: [
                {
                    couponsName: '',
                    showName: '',
                    totalNumber: '',
                    couponsType: '2',
                    faceValue: '',
                    amountLimitation: '',
                    couponsPeriodType: '2',
                    ecommerceradio: '2',
                    validDay: '',
                    pickerDate: [new Date(), new Date()],
                    effectiveStartTime: '',
                    effectiveEndTime: '',
                    couponRelationSpuList: [],
                    type: 47,
                    searchOptions: {
                        spuId: '',
                        name: ''
                    },
                    searchList: [],
                    tableList: [],
                    pageSize: 20,
                    currentPage: 1,
                    total: 0,
                    spuId: '',
                    name: ''
                }
            ],
            inListData: {
                couponsType: '',
                faceValue: '',
                amountLimitation: ''
            },
            selectTarget: null,
            activeNames: 0,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                }
            },
            currentList: [],
            rules: {
                couponsName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
                showName: [{ required: true, message: '请输入APP显示别名', trigger: 'blur' }],
                totalNumber: [
                    { required: true, message: '请输入总数量', trigger: 'blur' },
                    {
                        pattern: /^(?!0)(?:[0-9]{1,6}|1000000)$/,
                        message: '请输入1-1000000（1000万）',
                        trigger: 'blur'
                    }
                ],
                validDay: [
                    { required: true, message: '请输入领券后有效周期', trigger: 'blur' },
                    {
                        pattern: /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-5][0-9]|(360|361|363|362|364|365))$/,
                        message: '请输1-365整数',
                        trigger: 'blur'
                    }
                ],
                couponsType: [{ required: true, message: '请选择优惠券类型', trigger: 'blur' }],
                couponsPeriodType: [{ required: true, message: '请选择有效日期', trigger: 'blur' }],
                pickerDate: [{ required: true, message: '请选择有效时间', trigger: 'blur' }],
                faceValue: [{ required: true, message: '请输入折扣金额', trigger: 'blur' }]
            },
            tableList: []
        }
    },

    watch: {
        cardList: {
            handler: function (newVal) {
                console.log(newVal, 'newval')
                this.$emit('changeVal', newVal)
            },
            deep: true
        }
    },

    created() {
        // this.couponsTypeChange(this.cardList[index].couponsType)
    },
    methods: {
        opendel(index) {
            this.$confirm('点击删除后不可恢复，确认删除么', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.deleteCardList(index)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
                .catch(() => {
                    this.$message({
                        type: 'success',
                        message: '已取消删除'
                    })
                })
        },
        search(index, refresh = true) {
            let arr = []
            let list = this.cardList[index].tableList
            if (list && list.length > 0 && list.length < 2) this.cardList[index].currentPage -= 1
            let { name, spuId } = this.cardList[index].searchOptions
            let { currentPage, pageSize } = this.cardList[index]
            if (refresh) {
                this.$refs.table[index].refresh()
                currentPage = 1
                this.cardList[index].spuId = spuId
                this.cardList[index].name = name
            }
            let searchName = this.cardList[index].name
            let searchSpuId = this.cardList[index].spuId
            arr = this.cardList[index].searchList.filter(item => {
                return item.spuId == (searchSpuId ? searchSpuId : item.spuId) && item.name == (searchName ? searchName : item.name)
            })
            this.cardList[index].tableList = arr.slice(pageSize * (currentPage - 1), pageSize * currentPage)
            this.cardList[index].total = arr.length
            // this.cardList[index].searchList=this.cardList[index].couponRelationSpuList
        },
        handleCurrentChange(val, index) {
            this.cardList[index].pageSize = val.pageSize
            this.cardList[index].currentPage = val.currentPage
            // this.cardList[this.selectTarget].tableList = searchList.slice(pageSize * (currentPage-1), pageSize *  currentPage)
            this.search(index, false)
        },
        reset(index) {
            this.$refs.table[index].refresh()
            this.cardList[index].searchOptions.spuId = ''
            this.cardList[index].searchOptions.name = ''
            this.search(index)
            // this.search(index)
        },
        copyCardList(val) {
            if(this.cardList && this.cardList.length > 9) {
                this.$message.error('最多添加10个卡券配置')
                return
            }
            let currentinfoList = {}
            currentinfoList = Object.assign(currentinfoList, this.cardList[val])
            this.cardList.push(currentinfoList)
        },
        deleteCardList(val) {
            console.log(val)
            this.cardList.splice(val, 1)
        },
        uploadCommodity(index) {
            this.$refs.basicInfo[index].validate(val => {
                if (val) {
                    this.selectTarget = index
                    console.log(this.$refs.uploadCommodityList)
                    this.$refs.uploadCommodityList[index].uploadcommoditybtn()
                }
            })
        },
        addcard() {
            if (this.cardList.length > 9) {
                return this.$message.error('最多添加10个卡券配置!')
            }
            this.cardList.push({
                couponsName: '',
                showName: '',
                totalNumber: '',
                couponsType: '2',
                faceValue: '',
                amountLimitation: '',
                couponsPeriodType: '2',
                ecommerceradio: '2',
                validDay: '',
                pickerDate: [new Date(), new Date()],
                effectiveStartTime: '',
                effectiveEndTime: '',
                couponRelationSpuList: [],
                searchOptions: {
                    spuId: '',
                    name: ''
                },
                searchList: [],
                tableList: [],
                pageSize: 20,
                currentPage: 1,
                total: 0,
                spuId: '',
                name: '',
                type: 47
            })
            console.log(this.cardList, '添加后的数组')
        },
        changeprice(index) {
            let faceValue = []
            let checkAge = (rule, value, callback) => {
                if (value == 0.0 || !/^(?:(?!0\d)\d{1,5}(?:\.\d{1,2})?|100000(?:\.0{1,2})?)$/.test(value)) {
                    return callback(new Error('请输入0.01-100000.00（10万）'))
                } else {
                    return callback()
                }
            }
            switch (this.cardList[index].couponsType) {
                case '2': // 折扣
                    faceValue = [
                        { required: true, message: '请输入折扣0.00-10.00', trigger: ['blur', 'change'] },
                        {
                            pattern: /^(?:(?!0\d)\d{1}(?:\.\d{1,2})?|10(?:\.0{1,2})?)$/,
                            message: '请输入0.00-10.00',
                            trigger: 'blur'
                        }
                    ]
                    break
                case '3': // 立减
                    faceValue = [
                        { required: true, message: '请输入优惠金额', trigger: ['blur', 'change'] },
                        {
                            pattern: /(^[1-9]\d{0,4}(\.[0-9]{1,2})?$)|(^[0](\.[1-9]{1}[0-9]?)$)|(^[0](\.[0]{1}[1-9]{1})$)|(^[1][0]{5}(\.[0]{1,2})?$)/,
                            message: '请输入0.01-100000.00',
                            trigger: 'blur'
                        }
                    ]
                    break
            }
            this.rules.faceValue = faceValue
            this.$refs.basicInfo[index].validate(val => {
                if (val) {
                    let data = {
                        op: 'calculatePrice', //卡券/红包列表
                        data: {
                            couponsType: this.cardList[index].couponsType,
                            // faceValue: this.cardList[index].faceValue * 100,
                            faceValue: this.$baseMethod.regYuanToFen(this.cardList[index].faceValue),
                            amountLimitation: 0,
                            couponRelationSpuList: this.cardList[index].couponRelationSpuList
                        }
                    }
                    try {
                        this.$axios('/cardcoupon/applyOnlineRetailersCoupon/calculatePrice', data).then(res => {
                            //列表
                            if (res.code === 1) {
                                this.cardList[index].couponRelationSpuList = JSON.parse(res.data)
                                this.cardList[index].searchList = JSON.parse(res.data)
                                this.search(index, false)
                            }
                        })
                    } catch (error) {
                        console.log(error)
                    }
                }
            })
        },

        addcommoditybtn(index) {
            //需要所有条件填写完才能点击添加商品
            console.log(index, '===传进来的索引')
            this.selectTarget = index
            console.log(this.$refs.basicInfo[index], '----------------------------')
            this.$refs.basicInfo[index].validate(val => {
                if (val) {
                    this.inListData.couponsType = this.cardList[index].couponsType
                    this.inListData.faceValue = this.cardList[index].faceValue
                    this.inListData.amountLimitation = 0
                    console.log(this.$refs, '============ref=======')
                    this.$refs.addCommodityList[index].addcommoditybtn()
                }
            })
        },
        selectList(data, tag) {
            if (tag) {
                data = this.removeRepeat(this.cardList[this.selectTarget].couponRelationSpuList.concat(data), 'spuId')
            }
            // let commodtyListLength=data.length+this.cardList[this.selectTarget].couponRelationSpuList.length
            if (data.length > 100) {
                // commodtyListLength=0
                return this.$message.error('单张卡券最多添加100件适用商品!')
            }
            this.cardList[this.selectTarget].couponRelationSpuList = data
            this.cardList[this.selectTarget].searchList = data
            this.reset(this.selectTarget)
            // this.search(this.selectTarget)
        },
        removeRepeat(arr, uniId) {
            const res = new Map()
            return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1))
        },
        uploadList(data) {
            console.log(data, '主列表获取的data')
            console.log(this.cardList)
            if (this.cardList[this.selectTarget].couponRelationSpuList.length > 0 && this.cardList[this.selectTarget].searchList.length > 0) {
                this.cardList[this.selectTarget].couponRelationSpuList = this.cardList[this.selectTarget].couponRelationSpuList.concat(data)
                console.log(this.cardList[this.selectTarget].couponRelationSpuList.length, 'this.cardList[this.selectTarget].couponRelationSpuList.length')
                this.cardList[this.selectTarget].couponRelationSpuList = this.unique(this.cardList[this.selectTarget].couponRelationSpuList)
                this.cardList[this.selectTarget].searchList = this.cardList[this.selectTarget].searchList.concat(data)
                this.cardList[this.selectTarget].searchList = this.unique(this.cardList[this.selectTarget].searchList)
            } else {
                this.cardList[this.selectTarget].couponRelationSpuList = data
                this.cardList[this.selectTarget].searchList = data
            }
            this.changeprice(this.selectTarget)
        },
        unique(arr) {
            return Array.from(new Set(arr))
        },
        deletecommodity(val, index) {
            console.log(val)
            console.log(index, 'index')
            let numindex = this.cardList[index].couponRelationSpuList.findIndex(item => item.spuId == val.row.spuId)
            // let searchnumindex = this.cardList[index].searchList.findIndex(item => item.spuId == val.row.spuId)
            this.cardList[index].couponRelationSpuList.splice(numindex, 1)
            // this.cardList[index].searchList.splice(searchnumindex, 1)
            this.cardList[index].searchList = this.cardList[index].couponRelationSpuList
            console.log(this.cardList[index].searchList, ' this.cardList[index].searchList=======')
            this.search(index, false)
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
        couponsTypeChange(val, index) {
            console.log(this.$refs['basicInfo'][index], '$refs$refs$refs$refs')
            // this.$refs['basicInfo'][index] && this.$refs['basicInfo'][index].clearValidate(['faceValue', 'amountLimitation'])
            this.$refs.basicInfo[index] && this.$refs.basicInfo[index].clearValidate(['faceValue', 'amountLimitation'])
            if (this.cardList[index].couponsType !== '') {
                this.cardList[index].faceValue = ''
                this.cardList[index].amountLimitation = ''
            }
            // let faceValue = []
            let amountLimitation = []
            this.rules.amountLimitation = amountLimitation
        },
        handlePeriodType(val) {
            console.log(val)
            if (val == 2) {
                this.cardList[index].pickerDate = [new Date(), new Date()]
                this.cardList[index].validDay = null
            } else if (val == 1) {
                this.cardList[index].pickerDate = []
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.tableBox {
    border: 1px solid #DCDFE6;
    border-radius: 4px;
}
.commodtyListStyle {
    position: relative;
}
.commodtyListBtnStyle {
    position: absolute;
    top:50px;
    right: 2%;
}
/deep/ .ws-table-warp .search-wrap {
    border: none;
    background: none;
}
/deep/ .el-collapse {
    border-top: none;
    border-bottom: none;
}
/deep/ .el-collapse-item__header {
    background-color: #f5f7fa;
    border-radius: 5px;
}
.currency-apply-title {
    width: 100px;
    height: 28px;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-top: 32px;
    margin-bottom: 16px;
}
.el-checkbox {
    width: 100px;
}
.add-card-button {
    margin-bottom: 20px;
    position: relative;
    left: 91%;
}
.ad-config-template {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    .icon {
        display: inline-block;
        width: 20px;
        height: 20px;
    }
    .ad-config-title {
        padding: 0 4px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #303133;
        line-height: 16px;
    }
    .ad-config-delete {
        position: absolute;
        right: 30px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #f05259;
    }
    .ad-config-copy {
        position: absolute;
        right: 70px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0088ff;
    }
}
</style>
