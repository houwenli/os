<template>
    <!-- 实时 -->
    <div>
        <div class="is-flex form-box">
            <div class="form-label">
                <span style="color: #f05259">*</span>
                乘客上车点:
            </div>
            <ws-city
                class="margin-right-10"
                @change="changeStartCity"
                :data="provinceCityList"
                ref="ws-city"
                level="2"
                v-model="dataOptions.startProvinceList"
                :defaultProps="{ checkStrictly: false }"
                :clearable="false"
            ></ws-city>
            <div :class="{ 'driver-box': true, 'driver-color': dataOptions.startAddress != null }" @click="getPosition(1)">
                {{ dataOptions.startAddress ? dataOptions.startAddress : '请输入乘客上车点' }}
            </div>
            <el-button type="primary" @click="getPosition(1)">获取定位</el-button>
        </div>

        <div class="is-flex form-box">
            <div class="form-label form-label">
                <span style="color: #f05259">*</span>
                乘客下车点:
            </div>
            <ws-city
                class="margin-right-10"
                @change="changeEndCity"
                :data="provinceCityList"
                ref="ws-city"
                level="2"
                v-model="dataOptions.endProvinceList"
                :defaultProps="{ checkStrictly: false }"
                :clearable="false"
            ></ws-city>
            <div :class="{ 'driver-box': true, 'driver-color': dataOptions.endAddress != null }" @click="getPosition(2)">
                {{ dataOptions.endAddress ? dataOptions.endAddress : '请输入乘客下车点' }}
            </div>
            <el-button type="primary" @click="getPosition(2)">获取定位</el-button>
        </div>
        <div class="is-flextable form-box">
            <div class="form-label">
                <span style="color: #f05259">*</span>
                服务车型:
            </div>
            <template>
                <ws-table-el
                    ref="table"
                    class="tabledata"
                    :data="carTypeList"
                    max-height="300"
                    :topFixedRange="-25"
                    @selection-change="selectionChange"
                    :filterColumns="false"
                    :multi="true"
                    :pagination="false"
                >
                    <ws-table-column-el align="center" prop="requestRideType" label="服务车型" :formatter="carTypeHandle" width="200"></ws-table-column-el>
                    <ws-table-column-el align="center" prop="totalPricefen" label="价格（元）" width="200"></ws-table-column-el>
                </ws-table-el>
            </template>
        </div>
        <div class="is-flex form-box">
            <div class="form-label">
                <span style="color: #f05259">*</span>
                乘客手机号:
            </div>
            <el-input class="form-input" v-model="dataOptions.passengerPhone" placeholder="请输入乘客手机号" maxlength="11" clearable @input="phoneInput" @change="phoneChange"></el-input>
            <div v-if="phoneTips" class="form-tips">请输入正确的手机号</div>
        </div>
        <div v-if="getModulePower('/workbench/placeOrder').placeInstantOrder" class="formcontent-btns">
            <ws-throttle>
                <el-button :loading="isLoading" type="primary" @click="submitOrder" :disabled = "btnDisabled">确定下单</el-button>
            </ws-throttle>
        </div>
        <select-map :show="showMap" :cityCode="onCityCode" :placeholderTxt="placeholderTxt" @select="handleSelectMap"></select-map>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import selectMap from '../../component/selectMap';
import util from '@/utils/sfcUtils';
const CARTYPE = [
    {
        value: 10,
        label: '快车'
    },
    {
        value: 20,
        label: '专车'
    },
    {
        value: 40,
        label: '商务车'
    },
    {
        value: 30,
        label: '豪华车'
    },
    {
        value: 50,
        label: '出租车'
    }
];
const CARTYPELIST = [
    {
        requestRideType: 10,
        totalPricefen: '-'
    },
    {
        requestRideType: 20,
        totalPricefen: '-'
    },
    {
        requestRideType: 50,
        totalPricefen: '-'
    },
    {
        requestRideType: 30,
        totalPricefen: '-'
    },
    {
        requestRideType: 40,
        totalPricefen: '-'
    }
];
export default {
    name: 'realTime',
    data() {
        return {
            moduleName: '/workbench/placeOrder',
            op: {
                instantOrderEstimatePrice: 'instantOrderEstimatePrice',
                placeInstantOrder: 'placeInstantOrder',
                getCityCode: 'startCityIsBelongAgencyNumber'
            },
            carTypeList: CARTYPELIST,
            dataOptions: {
                passengerPhone: null,
                // date: null,
                startProvinceList: [],
                startAddress: null,
                endProvinceList: [],
                endAddress: null,
                requestRideType: []
            },
            startId: '',
            endId: '',
            selectList: [],
            startObj: {},
            endObj: {},
            startProvCity: null,
            endProvCity: null,
            showDriver: true,
            phoneTips: false,
            isLoading: false,
            mapType: 1,
            onCityCode: null,
            aa: '',
            showMap: false,
            placeholderTxt: '请选择乘客上车点',
            orderType: 20, //服务类型:预约;实时;包车;城际专线
            btnDisabled:false
        };
    },
    computed: {
        ...mapState(['provinceCityList'])
    },
    components: {
        selectMap
    },
    created() {
        let { orgType } = this.$baseMethod.getStore('roleOption');
        if (orgType === 0) {
            this.btnDisabled = true;
        }else{
            this.btnDisabled = false
        }
        this.getCityCode();
    },
    activated() {
        let { orgType } = this.$baseMethod.getStore('roleOption');
        if (orgType === 0) {
            this.btnDisabled = true;
        }else{
            this.btnDisabled = false
        }
    },
    methods: {
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        getCityCode() {
            let URL = this.getModuleUrl(this.op.getCityCode);
            this.$axios(URL, {
                data: JSON.stringify({}),
                op: this.op.getCityCode
            }).then(res => {
                if (res.code == 1) {
                    let data = JSON.parse(res.data);
                    this.registerCode = data.submitCityCode;
                    this.initData();
                }
            });
        },
        carTypeHandle(row) {
            return util.searchListVal(CARTYPE, row.requestRideType);
        },
        initData() {
            if (this.registerCode) {
                let provinceCode = `${this.registerCode}`.substr(0, 2) + '0000';
                this.dataOptions.startProvinceList = [+provinceCode, this.registerCode];
                this.dataOptions.endProvinceList = [+provinceCode, this.registerCode];
            }
        },
        goEvaluate(type) {
            this.$router.refresh({
                path: '/evaluate/express',
                query: {
                    orderId: this.$route.query.orderId,
                    type
                }
            });
        },
        selectionChange(e) {
            let list = e.map(element => {
                return element.requestRideType;
            });
            this.selectList = e;
            this.dataOptions.requestRideType = list;
        },
        phoneInput(e) {
            this.phoneTips = false;
            this.dataOptions.passengerPhone = e.replace(/\D+/, '');
        },
        changeStartCity(e, arr) {
            if (!arr) return;
            this.startProvCity = arr;
            this.dataOptions.startAddress = null;
        },
        changeEndCity(e, arr) {
            this.endProvCity = arr;
            this.dataOptions.endAddress = null;
        },
        phoneChange(e) {
            if (!/^1[3-9]\d{9}$/.test(e)) {
                this.phoneTips = true;
            }
        },
        getPosition(type) {
            this.mapType = type;
            if (type == 1 && this.dataOptions.startProvinceList.length == 0) {
                this.$message.error('请先选择乘客上车点城市');
                return;
            }
            if (type == 2 && this.dataOptions.endProvinceList.length == 0) {
                this.$message.error('请先选择乘客下车点城市');
                return;
            }
            if (type == 1) {
                this.onCityCode = this.dataOptions.startProvinceList[1];
                this.placeholderTxt = '请输入乘客上车点';
            } else {
                this.onCityCode = this.dataOptions.endProvinceList[1];
                this.placeholderTxt = '请输入乘客下车点';
            }
            this.showMap = true;
        },
        handleSelectMap(e) {
            this.showMap = false;
            if (!e) return;
            if (this.mapType == 1) {
                this.startObj = e;
                this.dataOptions.startAddress = e.address;
                this.startId = e.id;
            } else {
                this.endObj = e;
                this.dataOptions.endAddress = e.address;
                this.endId = e.id;
            }
            if (this.dataOptions.startAddress && this.dataOptions.endAddress) {
                this.getPrice();
            }
        },
        CurentTime() {
            var now = new Date();
            var year = now.getFullYear(); //年
            var month = now.getMonth() + 1; //月
            var day = now.getDate(); //日
            var hh = now.getHours(); //时
            var mm = now.getMinutes(); //分
            var ss = now.getSeconds(); //秒
            var clock = year + '-';
            if (month < 10) clock += '0';
            clock += month + '-';
            if (day < 10) clock += '0';
            clock += day + ' ';
            if (hh < 10) clock += '0';
            clock += hh + ':';
            if (mm < 10) clock += '0';
            clock += mm + ':';
            if (ss < 10) clock += '0';
            clock += ss;
            return clock;
        },
        getPrice() {
            if (!this.dataOptions.startAddress || !this.dataOptions.endAddress) {
                return;
            }
            let data = {
                data: JSON.stringify({
                    requestRideTypes: [10, 20, 40, 30, 50],
                    startTimeStr: this.CurentTime(),
                    startPoint: {
                        areaCode: +this.startObj.adcode,
                        lat: this.startObj.lat,
                        lon: this.startObj.lon
                    },
                    orderType: this.orderType, //预约21;实时20;包车70;城际专线80
                    endPoint: {
                        areaCode: +this.endObj.adcode,
                        lat: this.endObj.lat,
                        lon: this.endObj.lon
                    },
                    endId: this.endId,
                    startId: this.startId
                }),
                op: this.op.instantOrderEstimatePrice
            };
            this.$axios(this.getModulePower('/workbench/placeOrder').instantOrderEstimatePrice, data).then(res => {
                if (res.code == 1) {
                    let data = JSON.parse(res.data);
                    if (data.anwserCode && data.anwserCode.code != 1) {
                        this.$message.error(data.anwserCode.message);
                        this.priceObj = null;
                        return;
                    }
                    this.carTypeList = data.map(element => {
                        return {
                            ...element,
                            totalPricefen: parseFloat(element.totalPrice / 100).toFixed(2) + `(${element.estimateType == 10 ? '预估价' : element.estimateType == 20 ? '一口价' : ''})`
                        };
                    });
                }
            });
        },
        submitOrder() {
            if (!this.dataOptions.passengerPhone) {
                this.$message.error('请补充完整下单手机号');
                return false;
            }
            if (!/^1[3-9]\d{9}$/.test(this.dataOptions.passengerPhone)) {
                this.$message.error('请输入正确的下单手机号');
                return false;
            }
            if (!this.dataOptions.startAddress) {
                this.$message.error('请选择乘客上车点');
                return false;
            }
            if (!this.dataOptions.endAddress) {
                this.$message.error('请选择乘客下车点');
                return false;
            }
            if (this.dataOptions.requestRideType.length <= 0) {
                this.$message.error('请选择服务车型');
                return false;
            }
            if (this.dataOptions.startProvinceList[1] != this.registerCode) {
                this.$confirm(`确定起点城市是${this.startProvCity.provinceName}${this.startProvCity.cityName}?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                })
                    .then(() => {
                        this.save();
                    })
                    .catch(() => {});
            } else {
                this.save();
            }
        },
        save() {
            this.isLoading = true;
            let estimatePriceAoList = this.selectList.map(item => {
                return {
                    estimateDistance: item.distance, //预估里程
                    estimateTime: item.duration, //预估行驶时间
                    discountMoney: item.discountMoney, //优惠金额
                    chargingRuleId: item.chargingRuleId, //计费规则id
                    chargingParamId: item.chargingParamId, //计费规则详情id
                    estimatePrice: item.totalPrice, // 预估费
                    estimateDetail: item.estimateDetail, //预估详情
                    estimateType: item.estimateType, //预估类型
                    rideType: item.requestRideType //请求运力类型
                };
            });
            let orderData = {
                startAddress: this.dataOptions.startAddress,
                startPoint: {
                    areaCode: +this.startObj.adcode,
                    lat: this.startObj.lat,
                    lon: this.startObj.lon,
                    fullAddress: this.startObj.fullAddress,
                },
                endAddress: this.dataOptions.endAddress,
                estimatePriceAoList: estimatePriceAoList,
                endPoint: {
                    areaCode: +this.endObj.adcode,
                    lat: this.endObj.lat,
                    lon: this.endObj.lon,
                    fullAddress: this.endObj.fullAddress,
                },
                orderType: this.orderType,
                orderChannel: 1,
                platform: 7,
                channel: 1,
                passengerPhone: this.dataOptions.passengerPhone
            };
            let data = {
                data: JSON.stringify(orderData),
                op: this.op.placeInstantOrder
            };
            this.$axios(this.getModulePower('/workbench/placeOrder').placeInstantOrder, data)
                .then(res => {
                    this.isLoading = false;
                    if (res.code == 1) {
                        let data = JSON.parse(res.data);
                        if (data.anwserCode && data.anwserCode.code != 1) {
                            this.$message.error(data.anwserCode.message);
                            return;
                        }
                        this.$message.success('下单成功');
                        this.dataOptions.passengerPhone = null;
                        this.dataOptions.startAddress = null;
                        this.dataOptions.endAddress = null;
                        this.dataOptions.requestRideType = [];
                        this.carTypeList = CARTYPELIST;
                        this.$refs.table.clearSelection();
                        this.initData();
                        // this.$router.refresh({ name: 'realTime',params:{type:1} });
                        // this.$parent.$parent.activeName = 'mixedOrder';
                        !(JSON.stringify(this.getModulePower('/workbench/mixedOrder')) == '{}') && (this.$parent.$parent.activeName = 'mixedOrder');
                        // this.$nextTick(() => {
                        //     this.$parent.$parent.$refs.mixedOrder.searchOptions.orderId = data.orderId;
                        //     this.$parent.$parent.$refs.mixedOrder.search();
                        // });
                    }
                })
                .catch(() => {
                    this.isLoading = false;
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.trip-record {
    margin: 0 15px 15px 0;
}

.is-flex {
    display: flex;
    align-items: center;
    height: 60px;
}
.margin-right-10 {
    margin-right: 10px;
}
.form-input {
    width: 200px;
}
.form-tips {
    position: absolute;
    top: 50px;
    left: 220px;
    color: #f05259;
    font-size: 12px;
}
.form-box {
    flex: 1;
    position: relative;
    margin-bottom: 10px;
}
.form-label {
    width: 200px;
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
    flex-shrink: 0;
}
.form-label1 {
    width: 150px;
}
.is-flextable {
    display: flex;
    align-items: center;
    height: auto;
}

.driver-box {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    width: 320px;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 0 15px;
    margin-right: 10px;
    position: relative;
    .driver-close {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        img {
            display: block;
            width: 10px;
            height: 10px;
        }
    }
}
.driver-color {
    color: #606266;
}
.formcontent-btns {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 20px;
    .el-button {
        width: 160px;
    }
}
</style>
