<template>
    <div class="panel">
        <div class="quota-global-formcontent fence-formcontent">
            <div class="base-content">
                <div class="is-flex form-box">
                    <div class="form-label">
                        <span style="color: #f05259">*</span>
                        预约时间:
                    </div>
                    <el-date-picker
                        class="margin-right-10"
                        v-model="dataOptions.date"
                        type="date"
                        :picker-options="pickerOptions"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        @change="dateChange"
                        :clearable="false"
                    ></el-date-picker>
                    <el-time-picker
                        v-model="dataOptions.time"
                        :clearable="false"
                        align="center"
                        format="HH:mm"
                        value-format="HH:mm"
                        :picker-options="{
                            selectableRange: this.selectableRange
                        }"
                        placeholder="选择时间"
                        @change="dateChange"
                    ></el-time-picker>
                </div>
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
                        {{ dataOptions.startAddress ? dataOptions.startAddress : '请选择上车地址' }}
                    </div>
                    <!-- <el-input class="address-input" v-model="dataOptions.startAddress" disabled placeholder="请选择上车地址" @click="getPosition(1)"></el-input> -->
                    <el-button type="primary" @click="getPosition(1)">获取定位</el-button>
                </div>
                <div class="is-flex form-box">
                    <div class="form-label">
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
                        {{ dataOptions.endAddress ? dataOptions.endAddress : '请选择下车地址' }}
                    </div>
                    <!-- <el-input class="address-input" v-model="dataOptions.endAddress" disabled placeholder="请选择下车地址" @click="getPosition(2)"></el-input> -->
                    <el-button type="primary" @click="getPosition(2)">获取定位</el-button>
                </div>
                <div class="is-flex form-box">
                    <div class="form-label">
                        <span style="color: #f05259">*</span>
                        服务车型:
                    </div>
                    <el-select v-model="dataOptions.requestRideType" filterable placeholder="请选择" @change="changeService">
                        <el-option v-for="item in businessTypes" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </div>
                <div class="is-flex form-box">
                    <div class="form-label">
                        <span style="color: #f05259">*</span>
                        预估价:
                    </div>
                    <el-input class="address-input" v-model="dataOptions.price" readonly disabled placeholder="根据上下车点自动计算"></el-input>
                    元
                </div>
                <div class="is-flex form-box">
                    <div class="form-label">
                        <span style="color: #f05259">*</span>
                        乘客手机号:
                    </div>
                    <el-input class="form-input" v-model="dataOptions.passengerPhone" placeholder="请输入乘客手机号" maxlength="11" clearable @input="phoneInput" @change="phoneChange"></el-input>
                    <div v-if="phoneTips" class="form-tips">请输入正确的手机号</div>
                </div>

                <div v-if="showDriver" class="is-flex form-box">
                    <div class="form-label">指派司机:</div>
                    <div :class="{ 'driver-box': true, 'driver-color': driverInfo != null }">
                        <div style="width: 270px" @click="getDriver">{{ driverInfo ? `${driverInfo.name}(${driverInfo.carNum})` : '请选择指派司机，非必填' }}</div>
                        <div v-if="driverInfo" class="driver-close" @click="changeItem">
                            <img src="@/assets/images/colseBtn.png" alt="" />
                        </div>
                    </div>
                    <!-- <el-input class="address-input" v-model="dataOptions.driver" readonly disabled placeholder="请选择指派司机，非必填"></el-input> -->
                    <el-button type="primary" @click="getDriver">获取司机</el-button>
                </div>
                <div v-if="getModulePower('/workbench/placeOrder').addPlaceOrder" class="formcontent-btns">
                    <ws-throttle>
                        <el-button :loading="isLoading" type="primary" @click="submitOrder" :disabled = "btnDisabled">确定下单</el-button>
                    </ws-throttle>
                </div>
                <select-map :show="showMap" :cityCode="onCityCode" :placeholderTxt="placeholderTxt" @select="handleSelectMap"></select-map>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import util from '@/utils/util';
import selectMap from '../../component/selectMap';
export default {
    name: 'placeOrderForm',
    components: {
        selectMap
    },
    data() {
        return {
            moduleName: '/workbench/placeOrder',
            isLoading: false,
            dataOptions: {
                passengerPhone: null,
                date: null,
                time: null,
                startProvinceList: [],
                startAddress: null,
                endProvinceList: [],
                endAddress: null,
                requestRideType: 10,
                driver: null,
                price: null
            },
            phoneTips: false,
            startObj: {},
            endObj: {},
            priceObj: {},
            registerCode: null,
            pickerOptions: {
                disabledDate: this.disabledDate
            },
            op: {
                estimatePrice: 'estimatePrice',
                addPlaceOrder: 'addPlaceOrder',
                getCityCode: 'startCityIsBelongAgencyNumber'
            },
            selectableRange: '00:00:00-23:59:59',
            showMap: false,
            onCityCode: null,
            mapType: 1,
            showDriver: true,
            placeholderTxt: '请输入乘客上车点',
            startProvCity: null,
            endProvCity: null,
            businessTypes: [
                { id: 10, value: '快车' },
                { id: 20, value: '专车 ' },
                { id: 30, value: '豪华车 ' },
                { id: 40, value: '商务车 ' }
            ],
            componentTab: 'subscribe',
            btnDisabled:false
        };
    },
    watch: {
        'dataOptions.date': {
            handler(newValue) {
                if (newValue) {
                    this.initTimeRange(newValue);
                }
            }
        }
    },
    computed: {
        ...mapState(['provinceCityList']),
        ...mapState('order', ['driverInfo'])
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
        ...mapMutations('order', ['setDriverInfo']),
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
        initData() {
            let times = `${util.timestampToTime13(new Date().getTime() + 15 * 60 * 1000)}`.substr(0, 16);
            this.dataOptions.date = times.split(' ')[0];
            this.dataOptions.time = times.split(' ')[1];
            if (this.registerCode) {
                let provinceCode = `${this.registerCode}`.substr(0, 2) + '0000';
                this.dataOptions.startProvinceList = [+provinceCode, this.registerCode];
                this.dataOptions.endProvinceList = [+provinceCode, this.registerCode];
            }
            this.showDriver = true;
            this.setDriverInfo(null);
        },
        initTimeRange(newValue) {
            let nowDate = util.timestampToTime13(new Date().getTime()).split(' ');
            let timesAfter = `${util.timestampToTime13(new Date().getTime() + 15 * 60 * 1000)}`.split(' ');
            if (nowDate[0] == newValue) {
                if (timesAfter[0] == nowDate[0]) {
                    this.selectableRange = `${timesAfter[1]}-23:59:59`;
                    this.dataOptions.time = `${timesAfter[1]}`.substr(0, 5);
                } else {
                    this.selectableRange = `23:59:59-23:59:59`;
                    this.dataOptions.time = nowDate[1].substr(0, 5);
                }
            } else {
                this.selectableRange = `00:00:00-23:59:59`;
                this.dataOptions.time = nowDate[1].substr(0, 5);
            }
        },
        dateChange(e) {
            this.getPrice();
        },
        phoneInput(e) {
            this.phoneTips = false;
            this.dataOptions.passengerPhone = e.replace(/\D+/, '');
        },
        phoneChange(e) {
            if (!/^1[3-9]\d{9}$/.test(e)) {
                this.phoneTips = true;
            }
        },
        disabledDate(time) {
            return time.getTime() < new Date(this.$baseMethod.getBeforeDay(-1, 'yyyy-MM-dd'));
        },
        disabledDatetime(time) {
            return time.getTime() < new Date(this.$baseMethod.getBeforeDay(-1, 'yyyy-MM-dd'));
        },
        datetimeChange(e) {
            if (new Date(e).getTime() < new Date().getTime() + 15 * 60 * 1000) {
                this.$message.error('预约时间需为当前时间15分钟后');
                let times = `${util.timestampToTime13(new Date().getTime() + 15 * 60 * 1000)}`.substr(0, 16);
                this.dataOptions.datetime = times;
                return;
            }
        },
        changeStartCity(e, arr) {
            if (!arr) return;
            this.startProvCity = arr;
            this.dataOptions.startAddress = null;
            this.setDriverInfo(null);
            if (e[1] != this.registerCode) {
                this.showDriver = false;
            } else {
                this.showDriver = true;
            }
        },
        changeEndCity(e, arr) {
            this.endProvCity = arr;
            this.dataOptions.endAddress = null;
        },
        handleSelectMap(e) {
            this.showMap = false;
            if (!e) return;
            if (this.mapType == 1) {
                this.startObj = e;
                this.dataOptions.startAddress = e.address;
            } else {
                this.endObj = e;
                this.dataOptions.endAddress = e.address;
            }
            if (this.dataOptions.startAddress && this.dataOptions.endAddress) {
                this.getPrice();
            }
        },
        getPrice() {
            if (!this.dataOptions.startAddress || !this.dataOptions.endAddress) {
                return;
            }
            if (!this.dataOptions.time || !this.dataOptions.date) {
                this.priceObj = null;
                this.dataOptions.price = null;
                return false;
            }
            if (new Date(`${this.dataOptions.date} ${this.dataOptions.time}:00`).getTime() < new Date().getTime()) {
                this.$message.error('预约时间不能小于当前时间，请重新选择预约时间');
                this.initTimeRange(this.dataOptions.date);
                this.dataOptions.time = null;
                this.priceObj = null;
                this.dataOptions.price = null;
                return;
            }
            let data = {
                data: JSON.stringify({
                    requestRideType: +this.dataOptions.requestRideType,
                    reserveStartTimeStr: `${this.dataOptions.date} ${this.dataOptions.time}:00`,
                    startPoint: {
                        areaCode: +this.startObj.adcode,
                        lat: this.startObj.lat,
                        lon: this.startObj.lon
                    },
                    endPoint: {
                        areaCode: +this.endObj.adcode,
                        lat: this.endObj.lat,
                        lon: this.endObj.lon
                    }
                }),
                op: this.op.estimatePrice
            };
            let URL = this.getModuleUrl(this.op.estimatePrice);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    let data = JSON.parse(res.data);
                    if (data.anwserCode && data.anwserCode.code != 1) {
                        this.$message.error(data.anwserCode.message);
                        this.priceObj = null;
                        this.dataOptions.price = null;
                        return;
                    }
                    this.priceObj = data;
                    this.dataOptions.price = parseFloat(data.concessionarAmount / 100).toFixed(2);
                }
            });
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
        getDriver() {
            if (!this.dataOptions.startAddress) {
                this.$message.error('请先选择乘客上车点');
                return;
            }
            this.setDriverInfo(null);
            let startPoint = [this.startObj.adcode, this.startObj.lat, this.startObj.lon];
            this.$router.refresh({
                name: 'placeOrderDrivers',
                query: { type: 2, startPoint: startPoint.join(','), rideServiceType: this.dataOptions.requestRideType, orderType: 21 }
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
            if (!this.dataOptions.time || !this.dataOptions.date) {
                this.$message.error('补充完整预约时间');
                return false;
            }
            if (new Date(`${this.dataOptions.date} ${this.dataOptions.time}:00`).getTime() < new Date().getTime()) {
                this.$message.error('预约时间不能小于当前时间');
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
            if (!this.dataOptions.price) {
                this.$message.error('预估价不能为空');
                this.getPrice();
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
            let orderData = {
                requestRideType: +this.dataOptions.requestRideType,
                reserveStartTimeStr: `${this.dataOptions.date} ${this.dataOptions.time}:00`,
                startAddress: this.dataOptions.startAddress,
                startPoint: {
                    areaCode: +this.startObj.adcode,
                    lat: this.startObj.lat,
                    lon: this.startObj.lon,
                    fullAddress: this.startObj.fullAddress
                },
                endAddress: this.dataOptions.endAddress,
                endPoint: {
                    areaCode: +this.endObj.adcode,
                    lat: this.endObj.lat,
                    lon: this.endObj.lon,
                    fullAddress: this.endObj.fullAddress
                },
                passengerPhone: this.dataOptions.passengerPhone,
                estimateDistance: this.priceObj.distance,
                estimateTime: this.priceObj.duration,
                estimatePrice: this.priceObj.totalPrice, // 预估价格
                discountMoney: this.priceObj.discountMoney, // 优惠金额
                chargingRuleId: this.priceObj.chargingRuleId, // 计费规则id
                chargingParamId: this.priceObj.chargingParamId, // 计费规则详情id
                estimateDetail: this.priceObj.estimateDetail,
                prePayFlag: false, // 是否预支付
                isPrePay: this.priceObj.isPrePay, // 是否当前节点需要预支付
                prePayPrice: this.priceObj.prePayPrice, // 预付费
                estimateUid: this.priceObj.estimateUid,
                platform: 7,
            };
            if (this.driverInfo) {
                orderData.driverId = this.driverInfo.driverId;
            }
            let URL = this.getModuleUrl(this.op.addPlaceOrder);
            let data = {
                data: JSON.stringify(orderData),
                op: this.op.addPlaceOrder
            };
            this.$axios(URL, data)
                .then(res => {
                    this.isLoading = false;
                    if (res.code == 1) {
                        let data = JSON.parse(res.data);
                        if (data.anwserCode && data.anwserCode.code != 1) {
                            this.$message.error(data.anwserCode.message);
                            return;
                        }
                        this.$message.success('下单成功');
                        this.setDriverInfo(null);
                        this.dataOptions.passengerPhone = null;
                        this.dataOptions.startAddress = null;
                        this.dataOptions.endAddress = null;
                        this.dataOptions.requestRideType = 10;
                        this.dataOptions.price = null;
                        this.initData();
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
        },
        changeItem() {
            this.setDriverInfo(null);
        },
        changeService() {
            this.setDriverInfo(null);
            this.getPrice();
        }
    }
};
</script>

<style lang="scss" scoped>
.is-flex {
    display: flex;
    align-items: center;
    height: 60px;
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
}
.form-input {
    width: 200px;
}
.address-input {
    width: 200px;
    margin-right: 10px;
}
.margin-right-10 {
    margin-right: 10px;
}
.el-input.is-disabled /deep/ .el-input__inner {
    background: #f5f7fa !important;
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
.form-tips {
    position: absolute;
    top: 50px;
    left: 220px;
    color: #f05259;
    font-size: 12px;
}
/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 200px;
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
