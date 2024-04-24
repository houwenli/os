<template>
    <!-- 城际专线 -->
    <div>
        <div class="is-flex form-box">
            <div class="form-label">
                <span style="color: #f05259">*</span>
                出发城市:
            </div>
            <ws-city
                class="margin-right-10 form-input"
                @change="changeEndCity"
                :data="provinceCityList"
                ref="ws-city"
                level="2"
                v-model="dataOptions.endProvinceList"
                :defaultProps="{ checkStrictly: false }"
                :clearable="false"
            ></ws-city>
            <div class="form-label" style="width: 200px">
                <span style="color: #f05259">*</span>
                出发日期:
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
        </div>

        <div class="is-flex form-box is-flextable">
            <div class="form-label">
                <span style="color: #f05259">*</span>
                出发线路:
            </div>
            <el-table
                ref="multipleTable"
                class="tabledata"
                :data="tabledata"
                max-height="290"
                :topFixedRange="-25"
                @selection-change="selectionChange"
                :filterColumns="false"
                :indexColumn="false"
                :pagination="false"
                @select="singleSelect"
                @row-click="rowClick"
                empty-text="暂无班次"
                stripe
                border
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column width="55" align="center" label="序号">
                    <template slot-scope="scope">
                        {{ scope.row.index }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="planTimeStr" label="班次时间" width="120"></el-table-column>
                <el-table-column align="center" label="里程往返" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.planType == 1 ? '往程' : scope.row.planType == 2 ? '返程' : '-' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="线路名称" width="220">
                    <template slot-scope="scope">
                        {{ scope.row.LineName }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="起点围栏" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.startFenceName }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="终点围栏" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.endFenceName }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="is-flex form-box">
            <div class="form-label">
                <span style="color: #f05259">*</span>
                乘客上车点:
            </div>
            <div :class="{ 'driver-box': true, 'driver-color': dataOptions.startAddress != null }" @click="getPosition(1)">
                {{ dataOptions.startAddress ? dataOptions.startAddress : '请选择上车地址' }}
            </div>
            <el-button type="primary" @click="getPosition(1)">获取定位</el-button>
            <div class="form-label" style="width: 92px">
                <span style="color: #f05259">*</span>
                乘客下车点:
            </div>
            <div :class="{ 'driver-box': true, 'driver-color': dataOptions.endAddress != null }" @click="getPosition(2)">
                {{ dataOptions.endAddress ? dataOptions.endAddress : '请选择上车地址' }}
            </div>
            <el-button type="primary" @click="getPosition(2)">获取定位</el-button>
        </div>
        <div class="is-flex form-box">
            <div class="form-label">
                <span style="color: #f05259">*</span>
                服务车型:
            </div>
            <el-select v-model="dataOptions.requestRideType" filterable placeholder="请选择" @change="changeService">
                <el-option v-for="item in businessTypes" :key="item.rideType" :label="item.rideName" :value="item.rideType"></el-option>
            </el-select>
            <div class="form-label">指派司机:</div>
            <div :class="{ 'driver-box': true, 'driver-color': driverInfo != null }">
                <div style="width: 470px" @click="getDriver">{{ driverInfo ? `${driverInfo.name}(${driverInfo.carNum})` : '请选择指派司机，非必填' }}</div>
                <div v-if="driverInfo" class="driver-close" @click="changeItem">
                    <img src="@/assets/images/colseBtn.png" alt="" />
                </div>
            </div>
            <el-button type="primary" @click="getDriver">获取司机</el-button>
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
            <div class="form-label flex-shirkitem">
                <span style="color: #f05259">*</span>
                乘车人数:
            </div>
            <el-select v-model="dataOptions.purchaseSeatNum" filterable placeholder="请选择" @change="changePassengers">
                <el-option v-for="item in passengersList" :key="item" :label="item + '人'" :value="item"></el-option>
            </el-select>
        </div>
        <div class="is-flex form-box" v-if="showDriver">
            <div class="form-label flex-shirkitem">预估价:</div>
            <el-input class="form-input flex-shirkitem" v-model="dataOptions.price" placeholder="根据乘车线路自动计算" maxlength="11" disabled clearable></el-input>
        </div>
        <div v-if="getModulePower('/workbench/placeOrder').addOrder" class="formcontent-btns">
            <ws-throttle>
                <el-button :loading="isLoading" type="primary" @click="submitOrder" :disabled='btnDisabled'>确定下单</el-button>
            </ws-throttle>
        </div>
        <select-map :show="showMap" :cityCode="onCityCode" :fenceData="fenceData" :placeholderTxt="placeholderTxt" @select="handleSelectMap"></select-map>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import util from '@/utils/util';
import selectMap from '../../component/selectMap';

export default {
    name: 'cityCar',
    data() {
        return {
            moduleName: '/workbench/placeOrder',
            tabledata: [],
            dataOptions: {
                passengerPhone: null,
                date: null,
                startProvinceList: [],
                startAddress: null,
                endProvinceList: [],
                endAddress: null,
                requestRideType: null,
                purchaseSeatNum: 1
            },
            endProvCity: null,
            pickerOptions: {
                disabledDate: this.disabledDate
            },
            passengersList: [1, 2, 3, 4, 5, 6],
            businessTypes: [],
            startObj: {},
            phoneTips: false,
            isLoading: false,
            op: {
                estimatePrice: 'estimatePrice',
                addOrder: 'addOrder',
                getCityCode: 'startCityIsBelongAgencyNumber',
                getStartlineplanList: 'getStartlineplanList',
                getLineDetailByLineId: 'getLineDetailByLineId',
                getPassengerOnePriceList: 'getPassengerOnePriceList'
            },
            mapType: 1,
            onCityCode: null,
            showMap: false,
            placeholderTxt: '请选择乘客上车点',
            selectData: [],
            endFence: {}, //终点围栏信息
            startFence: {}, //起点围栏信息
            fenceData: {},
            priceInfo: {},
            showDriver: true,
            isStatus: null,
            btnDisabled:false
        };
    },
    computed: {
        ...mapState(['driverInfo', 'provinceCityList']),
        ...mapState('order', ['driverInfo'])
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
        ...mapMutations('order', ['setDriverInfo']),
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        disabledDate(time) {
            return time.getTime() < new Date(this.$baseMethod.getBeforeDay(-1, 'yyyy-MM-dd'));
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
            let times = `${util.timestampToTime13(new Date().getTime())}`.substr(0, 16);
            this.dataOptions.date = times.split(' ')[0];
            if (this.registerCode) {
                let provinceCode = `${this.registerCode}`.substr(0, 2) + '0000';
                this.dataOptions.startProvinceList = [+provinceCode, this.registerCode];
                this.dataOptions.endProvinceList = [+provinceCode, this.registerCode];
            }
            this.showDriver = true;
            this.getLine();
            this.setDriverInfo(null);
        },
        changeItem() {
            this.setDriverInfo(null);
        },
        changeEndCity(e, arr) {
            if (!arr) return;
            this.endProvCity = arr;
            this.getLine();
            this.restData();
            if (e[1] != this.registerCode) {
                this.showDriver = false;
            } else {
                this.showDriver = true;
            }
        },
        dateChange() {
            this.$refs.multipleTable.clearSelection();
            this.restData();
            this.getLine();
        },
        getDriver() {
            if (!this.dataOptions.startAddress) {
                this.$message.error('请先选择乘客上车点');
                return;
            }
            if (!this.dataOptions.requestRideType) {
                this.$message.error('请先选择服务车型');
                return;
            }
            if (this.selectData.length == 0) {
                this.$message.error('请先选择出发线路');
                return;
            }
            this.setDriverInfo(null);
            let startPoint = [this.startObj.adcode, this.startObj.lat, this.startObj.lon];
            let lineObj = {
                lineInfoId: this.selectData[0].id,
                linePlanInfoId: this.selectData[0].planId, //路线信息
                seatNum: this.dataOptions.purchaseSeatNum,
                linePlanDate: this.dataOptions.date,
                orderRideServiceType: this.dataOptions.requestRideType
            };
            this.$router.refresh({
                name: 'placeOrderDrivers',
                query: { type: 2, startPoint: startPoint.join(','), rideServiceType: this.dataOptions.requestRideType, orderType: 80, lineObj: JSON.stringify(lineObj) }
            });
        },
        async singleSelect(selection, row) {
            await this.$refs.multipleTable.clearSelection(); // 执行完清空操作在进行下面的勾选
            if (selection.length === 0) return;
            this.$refs.multipleTable.toggleRowSelection(row, true);
        },
        // 表格的选中 可以获得当前选中的数据
        selectionChange(val) {
            // 将选中的数据存储起来
            this.selectData = val;
            if (this.selectData.length == 0) {
                this.restData();
            }
            if (this.selectData.length == 1) {
                this.isStatus = this.selectData[0].planType;
                this.getRpcFenceVo();
                this.getPrice();
                this.restData();
            } else {
                this.businessTypes = [];
            }
        },
        // 表格某一行的单击事件
        rowClick(row, column) {
            const selectData = this.selectData;
            this.$refs.multipleTable.clearSelection();
            if (selectData.length == 1) {
                selectData.forEach(item => {
                    // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
                    if (item == row) {
                        this.$refs.multipleTable.toggleRowSelection(row, false);
                    }
                    // 不然就让当前的一行勾选
                    else {
                        this.$refs.multipleTable.toggleRowSelection(row, true);
                    }
                });
            } else {
                this.$refs.multipleTable.toggleRowSelection(row, true);
            }
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
        getPosition(type) {
            if (this.selectData.length == 0) {
                this.$message.error('请先选择出发线路');
                return;
            }
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
                this.checkLineStatus(1);
                this.placeholderTxt = '请输入乘客上车点';
            } else {
                this.onCityCode = this.dataOptions.endProvinceList[1];
                this.checkLineStatus(2);
                this.placeholderTxt = '请输入乘客下车点';
            }
            this.showMap = true;
        },
        // 判断往还是反程
        checkLineStatus(status) {
            if (this.isStatus == 1) {
                this.fenceData = status == 1 ? this.startFence : this.endFence;
            } else {
                this.fenceData = status == 1 ? this.endFence : this.startFence;
            }
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
        },
        changeService(e) {
            this.setDriverInfo(null);
            // 根据改变的服务车型找到对应预估价
            this.priceInfo = this.businessTypes.filter(item => {
                return item.rideType == e;
            })[0];
            this.dataOptions.price = this.priceInfo.concessionarAmount;
        },
        changePassengers(e) {
            this.businessTypes = [];
            this.dataOptions.price = null;
            this.dataOptions.requestRideType = null;
            this.getPrice();
        },
        // 获取线路
        getLine() {
            let data = {
                startTime: `${this.dataOptions.date} 00:00:00`,
                areaCode: this.dataOptions.endProvinceList[this.dataOptions.endProvinceList.length-1] || this.registerCode
            };
            this.tabledata = [];
            this.$axios(this.getModulePower('/workbench/placeOrder').getStartlineplanList, {
                data: JSON.stringify(data),
                op: this.op.getStartlineplanList
            })
                .then(res => {
                    if (res.code == 1) {
                        let data = JSON.parse(res.data);
                        if (data.length > 0) {
                            this.tabledata = data.map((item, index) => {
                                return {
                                    ...item,
                                    index: index + 1
                                };
                            });
                        } else {
                            this.$message({
                                message: '当日无可选择班次',
                                type: 'error',
                                duration: 1000
                            });
                        }
                    }
                })
                .catch(err => {
                    // this.tabledata = arr
                });
        },
        // 获取围栏信息
        getRpcFenceVo() {
            this.$axios(this.getModulePower('/workbench/placeOrder').getLineDetailByLineId, {
                data: JSON.stringify({ lineId: this.selectData[0].id }),
                op: this.op.getLineDetailByLineId
            }).then(res => {
                if (res.code == 1) {
                    let data = JSON.parse(res.data);
                    this.endFence = data.endFence;
                    this.startFence = data.startFence;
                }
            });
        },
        // 获取预估价和车型
        getPrice() {
            let data = {
                passengerCount: this.dataOptions.purchaseSeatNum,
                lineId: this.selectData[0].id,
                linePlanId: this.selectData[0].planId
            };
            this.$axios(this.getModulePower('/workbench/placeOrder').getPassengerOnePriceList, {
                data: JSON.stringify(data),
                op: this.op.getPassengerOnePriceList
            }).then(res => {
                if (res.code == 1) {
                    let data = JSON.parse(res.data);
                    this.businessTypes = data.map(item => {
                        return {
                            ...item,
                            concessionarAmountfen: item.concessionarAmount,
                            concessionarAmount: parseFloat(item.concessionarAmount / 100).toFixed(2)
                        };
                    });
                }
            });
        },
        submitOrder() {
            if (this.selectData.length == 0) {
                this.$message.error('请选择出发线路');
                return false;
            }
            if (!this.dataOptions.requestRideType) {
                this.$message.error('请选择服务车型');
                return false;
            }
            if (!this.dataOptions.passengerPhone) {
                this.$message.error('请补充完整下单手机号');
                return false;
            }
            if (!/^1[3-9]\d{9}$/.test(this.dataOptions.passengerPhone)) {
                this.$message.error('请输入正确的下单手机号');
                return false;
            }
            if (!this.dataOptions.date) {
                this.$message.error('请选择出发日期');
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
                return false;
            }
            if (this.dataOptions.startProvinceList[1] != this.registerCode) {
                this.$confirm(`确定起点城市是${this.endProvCity.provinceName}${this.endProvCity.cityName}?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                })
                    .then(() => {
                        this.addOrder();
                    })
                    .catch(() => {});
            } else {
                this.addOrder();
            }
        },
        restData(isClear) {
            this.dataOptions.startAddress = null;
            this.dataOptions.endAddress = null;
            this.dataOptions.requestRideType = null;
            this.dataOptions.price = null;
            this.setDriverInfo(null);
            if (isClear) {
                this.dataOptions.purchaseSeatNum = 1;
                this.dataOptions.passengerPhone = null;
            }
        },
        addOrder() {
            let time = `${this.dataOptions.date} 00:00:00`;
            this.isLoading = true;
            this.startObj.areaCode = this.startObj.adcode;
            this.endObj.areaCode = this.endObj.adcode;
            let options = {
                startAddress: this.dataOptions.startAddress,
                startPoint: this.startObj,
                endAddress: this.dataOptions.endAddress,
                endPoint: this.endObj,
                cityCode: this.endProvCity ? this.endProvCity.cityCode : this.registerCode,
                etdStartDate: time,
                passengerPhone: this.dataOptions.passengerPhone,
                lineValuationInfoId: [this.priceInfo.lineValuationInfoId], //线路计价信息
                purchaseSeatNum: this.dataOptions.purchaseSeatNum,
                areaCode: this.startFence.areaCode, //取围栏中心点区域code
                linePlanInfoId: this.selectData[0].planId, //路线信息
                channel: 1,
                requestRideType: [this.dataOptions.requestRideType],
                orderMoney: this.priceInfo.concessionarAmountfen
            };
            if (this.driverInfo) {
                options.driverId = this.driverInfo.driverId;
            }
            let data = {
                data: JSON.stringify(options),
                op: this.op.addOrder
            };
            this.$axios(this.getModulePower('/workbench/placeOrder').addOrder, data)
                .then(res => {
                    this.isLoading = false;
                    if (res.code == 1) {
                        let data = JSON.parse(res.data);
                        if (data.anwserCode && data.anwserCode.code != 1) {
                            this.$message.error(data.anwserCode.message);
                            return;
                        }
                        this.$refs.multipleTable.clearSelection();
                        this.$message.success('下单成功');
                        this.restData(1);
                        // this.$router.refresh({ name: 'intercityLinePassengerOrders',query:{type:1}});
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
.form-tips {
    position: absolute;
    top: 58px;
    left: 220px;
    color: #f05259;
    font-size: 12px;
}
.form-input {
    width: 280px;
}
.el-select {
    width: 280px;
}
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
.is-flextable {
    height: auto;
    margin-bottom: 30px;
}
.driver-box {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    width: 280px;
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
/*隐藏表头复选框*/
/deep/ .el-table__header .el-table-column--selection .cell .el-checkbox {
    display: none;
}
/deep/ .el-table__header .is-leaf {
    background: #f0f2f5;
    color: #333;
}
/deep/ .el-table::before {
    height: 0;
}
/deep/ .el-table--border,
.el-table--group {
    border: none;
    border-left: 1px solid #ebeef5;
}
/deep/ .el-table-column--selection .cell {
    padding-left: 20px !important;
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
