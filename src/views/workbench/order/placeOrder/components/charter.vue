<template>
    <!-- 包车 -->
    <div>
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
            ></el-time-picker>
        </div>
        <div class="is-flex form-box">
            <div class="form-label">
                <span style="color: #f05259">*</span>
                服务车型:
            </div>
            <el-select v-model="dataOptions.requestRideType" filterable placeholder="请选择" @change="changeService" style="width: 320px">
                <el-option v-for="item in businessTypes" :key="item.rideType" :label="item.rideName" :value="item.rideType"></el-option>
            </el-select>
        </div>
        <div class="is-flex form-box">
            <div class="form-label flex-shirkitem">
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
            <div :class="{ 'driver-box': true, 'driver-color': dataOptions.startAddress != null }" @click="getPosition">
                {{ dataOptions.startAddress ? dataOptions.startAddress : '请输入乘客上车点' }}
            </div>
            <el-button type="primary" @click="getPosition">获取定位</el-button>
        </div>
        <div class="is-flex form-box">
            <div class="form-label flex-shirkitem">
                <span style="color: #f05259">*</span>
                包车套餐:
            </div>
            <el-select v-model="dataOptions.level" filterable placeholder="请选择" no-data-text="该城市未开通此车型的包车套餐" @change="changePackType" class="flex-shirkitem" style="width: 320px">
                <el-option v-for="item in priceList" :key="item.level" :label="item.name + '(' + $baseMethod.regRiceToKm(item.perKmFee) + '公里' + ')'" :value="item.level"></el-option>
            </el-select>
            <div v-if="fee" class="price-tips">{{ fee }}元起</div>
        </div>
        <div class="is-flex form-box">
            <div class="form-label flex-shirkitem">
                <span style="color: #f05259">*</span>
                乘客手机号:
            </div>
            <el-input
                class="form-input flex-shirkitem"
                v-model="dataOptions.passengerPhone"
                placeholder="请输入乘客手机号"
                maxlength="11"
                clearable
                @input="phoneInput"
                @change="phoneChange"
            ></el-input>
            <div v-if="phoneTips" class="form-tips">请输入正确的手机号</div>
        </div>
        <div class="is-flex form-box" v-if="dataOptions.startProvinceList[1] == this.registerCode">
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
        <div v-if="getModulePower('/workbench/placeOrder').addCharteredBusOrder" class="formcontent-btns">
            <ws-throttle>
                <el-button :loading="isLoading" type="primary" @click="submitOrder" :disabled="btnDisabled">确定下单</el-button>
            </ws-throttle>
        </div>
        <select-map :show="showMap" :cityCode="onCityCode" :placeholderTxt="placeholderTxt" @select="handleSelectMap"></select-map>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import util from '@/utils/util';
import selectMap from '../../component/selectMap';
// import { utils } from 'xlsx';
export default {
    name: 'charter',
    data() {
        return {
            moduleName: '/workbench/placeOrder',
            selectableRange: '00:00:00-23:59:59',
            dataOptions: {
                passengerPhone: null,
                date: null,
                time: null,
                startProvinceList: [],
                startAddress: null,
                // endProvinceList: [],
                // endAddress: null,
                requestRideType: '',
                driver: null,
                price: null,
                level: null
            },
            op: {
                estimatePrice: 'getEstimatePrice',
                getCityCode: 'startCityIsBelongAgencyNumber',
                addCharteredBusOrder: 'addCharteredBusOrder',
                getEntDriver: 'getEntDriver',
                getCityServerDeploy: 'getCityServerDeploy'
            },
            businessTypes: [],
            pickerOptions: {
                disabledDate: this.disabledDate
            },
            phoneTips: false,
            isLoading: false,
            startObj: {},
            startProvCity: null,
            registerCode: null,
            placeholderTxt: '请输入乘客上车点',
            onCityCode: null,
            showMap: false,
            fee: null,
            priceList: [],
            perKmFee: null,
            perMinFee: null,
            areaCode: null,
            btnDisabled:false
        };
    },
    components: {
        selectMap
    },
    computed: {
        ...mapState(['provinceCityList']),
        ...mapState('order', ['driverInfo'])
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
                    this.areaCode = data.areaCode ? data.areaCode : data.submitCityCode;
                    this.getCityServerDeploy();
                    this.initData();
                }
            });
        },
        getCityServerDeploy() {
            let areaCode = this.startObj && this.startObj.adcode ? this.startObj.adcode : this.areaCode;
            this.$axios(this.getModulePower('/workbench/placeOrder').getCityServerDeploy, {
                data: JSON.stringify({ areaCode }),
                op: this.op.getCityServerDeploy
            }).then(res => {
                if (res.code == 1) {
                    this.businessTypes = JSON.parse(res.data);
                    this.dataOptions.requestRideType = this.businessTypes[0].rideType;
                    this.getPrice();
                } else {
                    this.$message.error(res.msg || '程序异常');
                }
            });
        },
        getPosition() {
            if (this.dataOptions.startProvinceList.length == 0) {
                this.$message.error('请先选择乘客上车点城市');
                return;
            }
            this.onCityCode = this.dataOptions.startProvinceList[1];
            this.placeholderTxt = '请输入乘客上车点';
            this.showMap = true;
        },
        handleSelectMap(e) {
            this.showMap = false;
            if (!e) return;
            this.startObj = e;
            this.dataOptions.startAddress = e.address;
            this.getCityServerDeploy();
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
        goEvaluate(type) {
            this.$router.refresh({
                path: '/evaluate/express',
                query: {
                    orderId: this.$route.query.orderId,
                    type
                }
            });
        },
        disabledDate(time) {
            return time.getTime() < new Date(this.$baseMethod.getBeforeDay(-1, 'yyyy-MM-dd'));
        },
        disabledDatetime(time) {
            return time.getTime() < new Date(this.$baseMethod.getBeforeDay(-1, 'yyyy-MM-dd'));
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
        changeService() {
            this.dataOptions.level = null;
            this.fee = null;
            this.setDriverInfo(null);
            this.getPrice();
        },
        getPrice() {
            this.dataOptions.level = null;
            this.fee = null;
            this.priceList = [];
            let areaCode = this.startObj && this.startObj.adcode ? +this.startObj.adcode : +this.areaCode;
            let data = {
                data: JSON.stringify({
                    rideType: +this.dataOptions.requestRideType,
                    areaCode
                }),
                op: this.op.estimatePrice
            };
            this.$axios(this.getModulePower('/workbench/placeOrder').getEstimatePrice, data).then(res => {
                if (res.code == 1) {
                    let data = JSON.parse(res.data);
                    if (!data) {
                        this.priceList = [];
                        this.dataOptions.price = null;
                        return;
                    }
                    this.priceList = data;
                    this.priceList.forEach(element => {
                        element.fee = parseFloat(element.fee / 100).toFixed(2);
                    });
                }
            });
        },
        changePackType(level) {
            let item = this.priceList.find(item => item.level == level);
            this.fee = item.fee;
            this.perKmFee = item.perKmFee;
            this.perMinFee = item.perMinFee;
        },
        phoneInput(e) {
            this.phoneTips = false;
            this.dataOptions.passengerPhone = e.replace(/\D+/, '');
        },
        changeStartCity(e, arr) {
            if (!arr) return;
            this.startProvCity = arr;
            this.startObj = {}; //清除地图信息
            this.dataOptions.startAddress = null;
            this.areaCode = arr.areaCode ? arr.areaCode : arr.cityCode; //重置初始地址
            this.setDriverInfo(null);
            this.getPrice();
            if (e[1] != this.registerCode) {
                this.showDriver = false;
            } else {
                this.showDriver = true;
            }
        },
        phoneChange(e) {
            if (!/^1[3-9]\d{9}$/.test(e)) {
                this.phoneTips = true;
            }
        },
        changeItem() {
            this.setDriverInfo(null);
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
                query: { type: 2, startPoint: startPoint.join(','), rideServiceType: this.dataOptions.requestRideType, orderType: 70 }
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
            if (!this.dataOptions.level) {
                this.$message.error('请先选择包车套餐');
                return false;
            }
            if (new Date(`${this.dataOptions.date} ${this.dataOptions.time}:00`).getTime() - new Date().getTime() < 600000) {
                let newDate = new Date().getTime() + 600000;
                let timesAfter = `${util.timestampToTime13(newDate)}`.split(' ');
                this.dataOptions.date = timesAfter[0];
                this.dataOptions.time = timesAfter[1];
            }
            if (!this.dataOptions.startAddress) {
                this.$message.error('请选择乘客上车点');
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
                    .catch(() => {
                        console.log('error');
                    });
            } else {
                this.save();
            }
        },
        save() {
            this.isLoading = true;
            let RpcEnterpriseHelpOrderConsoleAo = {
                requestRideType: +this.dataOptions.requestRideType,
                startTime: `${this.dataOptions.date} ${this.dataOptions.time}:00`,
                startAddress: this.dataOptions.startAddress,
                startPoint: {
                    areaCode: +this.startObj.adcode,
                    lat: this.startObj.lat,
                    lon: this.startObj.lon,
                    fullAddress: this.startObj.fullAddress,
                },
                areaCode: +this.startObj.adcode,
                perKmFee: this.perKmFee,
                perMinFee: this.perMinFee,
                orderChannel: 1,
                passengerPhone: this.dataOptions.passengerPhone,
                level: this.dataOptions.level,
                chargingParamId: (this.priceList.find(v => v.level == this.dataOptions.level) || {}).chargingParamId
            };
            if (this.driverInfo) {
                RpcEnterpriseHelpOrderConsoleAo.bindDriverId = this.driverInfo.driverId;
            }
            let data = {
                data: JSON.stringify(RpcEnterpriseHelpOrderConsoleAo),
                op: this.op.addCharteredBusOrder
            };
            // this.$axios(this.getModulePower('/workbench/placeOrder').addCharteredBusOrder, data)
            this.$axios(this.getModuleUrl(data.op), data)
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
                        this.dataOptions.requestRideType = 10;
                        this.dataOptions.price = null;
                        this.dataOptions.level = null;
                        this.fee = null;
                        this.initData();
                        // this.$router.refresh({ name: 'charter',params:{type:1} });
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
.flex-shirkitem {
    display: flex;
    flex-shrink: 0;
}
.form-box {
    flex: 1;
    position: relative;
    margin-bottom: 10px;
}
.form-input {
    width: 320px;
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
        z-index: 1000;
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
.form-label {
    width: 200px;
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
}
.price-tips {
    margin-left: 10px;
    color: #f05259;
    font-size: 12px;
    letter-spacing: 4;
}
.form-tips {
    position: absolute;
    top: 60px;
    left: 220px;
    margin-left: 10px;
    color: #f05259;
    font-size: 12px;
}
/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 155px;
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
