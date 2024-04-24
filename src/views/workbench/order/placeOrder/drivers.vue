<template>
    <div>
    <div class="drviesList">
        <ws-table-el ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>车主账号：</label>
                    <el-input v-model.trim="searchOptions.phone" placeholder="请输入车主手机号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>车主姓名：</label>
                    <el-input v-model.trim="searchOptions.name" placeholder="请输入车主姓名" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>车主ID：</label>
                    <el-input v-model.trim="searchOptions.driverId" placeholder="请输入车主ID" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>车牌号：</label>
                    <el-input v-model.trim="searchOptions.carNum" placeholder="请输入车牌号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>服务车型：</label>
                    <el-select v-model="searchOptions.rideServiceType" filterable clearable :disabled="rideServiceTypeDis" placeholder="请选择">
                        <el-option v-for="item in businessTypes" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>状态：</label>
                    <el-select v-model="searchOptions.operationStatus" filterable clearable placeholder="请选择">
                        <el-option v-for="item in driverStatus" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
            </template>

            <template #options>
                <el-button-group v-if="getModulePower('/workbench/placeOrder').selectDriverListForPlaceOrder" style="float: right">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                    <!-- <el-button style="margin-left: 20px" @click="back" plain>返回</el-button> -->
                </el-button-group>
            </template>

            <template>
                <ws-table-column-el align="center" prop="driverId" label="车主ID"></ws-table-column-el>
                <ws-table-column-el align="center" prop="phone" label="车主账号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="userName" label="车主姓名">
                    <template slot-scope="scope">
                        {{ scope.row.name || scope.row.userName }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="carNum" label="车牌号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="operationRideServiceType" label="服务车型">
                    <template slot-scope="scope">
                        {{ scope.row.operationRideServiceType | businessTypeFilters }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="remaindSeatNum" label="空余座位数" v-if="$route.query.orderType == 80"></ws-table-column-el>
                <ws-table-column-el align="center" prop="seatNum" label="核载座位数"></ws-table-column-el>
                <ws-table-column-el align="center" label="状态">
                    <template slot-scope="scope">
                        {{ statusfilt(scope.row.operationStatus) }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" label="距离上车点（km）">
                    <template slot-scope="scope">
                        <span v-if="scope.row.distince">{{ scope.row.distince / 1000 }}</span>
                        <span v-else>-</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" min-width="200" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="enterEdit('detail', scope.row)" style="color: #0088ff">确定派单</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <div class="saveButon">
            <el-button class="buttons" @click="back()">返回</el-button>
        </div>
    </div>
    </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
export default {
    name: 'placeOrderDrivers',
    data() {
        return {
            searchOptions: {
                phone: null,
                name: null,
                operationStatus: null,
                driverId: null,
                carNum: null,
                orderId: this.$route.query.orderId,
                rideServiceType: +this.$route.query.rideServiceType,
                agencyNumber: this.$route.query.agencyNumber,
                startPoint: {
                    areaCode: null,
                    lat: null,
                    lon: null
                }
            },
            rideServiceTypeDis: false,
            businessTypes: [],
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/workbench/placeOrder',
                    op: {
                        selectList: 'selectDriverListForPlaceOrder',
                        selectCount: 'selectDriverCountForPlaceOrder'
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: true
                }
            },

            driverStatus: [
                { id: -1, value: '未出车 ' },
                { id: 0, value: '出车(空闲)' },
                { id: 1, value: '出车(服务中)' },
                { id: 2, value: '出车(离线)' }
            ],
            op: {
                selectList: 'selectDriverListForPlaceOrder',
                selectCount: 'selectDriverCountForPlaceOrder',
                changeOrder: 'changeOrder'
            },
            moduleName: '/workbench/placeOrder',
            routerQuery: this.$route.query,
            orderType: null,
            lineObj: {},
            showflag: false
        };
    },
    computed: {
        ...mapGetters('order', ['businessTypeFilters'])
    },
    activated() {
        this.routerQuery = this.$route.query;
        this.searchOptions.phone = null;
        this.searchOptions.name = null;
        this.searchOptions.operationStatus = null;
        this.searchOptions.driverId = null;
        this.searchOptions.carNum = null;
        let businessTypes = [
            { id: 10, value: '快车' },
            { id: 20, value: '专车' },
            { id: 30, value: '豪华车' },
            { id: 40, value: '商务车' }
        ];
        if (this.routerQuery.type == 2) {
            this.rideServiceTypeDis = true;
            this.businessTypes = businessTypes;
        } else {
            this.businessTypes = businessTypes.filter(item => {
                return item.id >= this.$route.query.rideServiceType;
            });
        }
        this.search();
    },
    created() {},
    mounted() {
        this.routerQuery = this.$route.query;
        this.searchOptions.phone = null;
        this.searchOptions.name = null;
        this.searchOptions.operationStatus = null;
        this.searchOptions.driverId = null;
        this.searchOptions.carNum = null;
        let businessTypes = [
            { id: 10, value: '快车' },
            { id: 20, value: '专车' },
            { id: 30, value: '豪华车' },
            { id: 40, value: '商务车' }
        ];
        if (this.routerQuery.type == 2) {
            this.rideServiceTypeDis = true;
            this.businessTypes = businessTypes;
        } else {
            this.businessTypes = businessTypes.filter(item => {
                return item.id >= this.$route.query.rideServiceType;
            });
        }
        this.search();
    },
    methods: {
        ...mapMutations('order', ['setDriverInfo']),
        statusfilt(id) {
            var value = '';
            for (var i = 0; i <= this.driverStatus.length; i++) {
                if (id == this.driverStatus[i].id) {
                    value = this.driverStatus[i].value;
                    return value;
                }
            }
        },
        back() {
            this.$router.go(-1); //返回上一层
        },
        beforeQuery() {
            // OrderType 20 实时，21 预约，70 包车，80城际专线
            if (this.$route.query.orderType == 80) {
                var { seatNum, linePlanDate, lineInfoId, linePlanInfoId } = this.routerQuery.lineObj && JSON.parse(this.routerQuery.lineObj);
            }
            this.searchOptions.orderId = this.$route.query.orderId;
            this.searchOptions.reassignment = this.$route.query.reassignment || null;
            this.searchOptions.agencyNumber = this.$route.query.agencyNumber;
            this.searchOptions.orderType = this.$route.query.orderType || null;
            this.searchOptions.seatNum = seatNum || null;
            this.searchOptions.linePlanDate = linePlanDate || null;
            this.searchOptions.lineInfoId = lineInfoId || null;
            this.searchOptions.linePlanInfoId = linePlanInfoId || null;
            if (this.routerQuery.startPoint) {
                let startPoint = this.routerQuery.startPoint;
                let pontArr = [];
                pontArr = startPoint.split(',');
                this.searchOptions.startPoint.areaCode = pontArr[0];
                this.searchOptions.startPoint.lat = pontArr[1];
                this.searchOptions.startPoint.lon = pontArr[2];
            }
            return {...this.searchOptions, allowSelfOrder: 1 }
        },
        reset() {
            this.$refs.table.reset();
        },
        search() {
            this.$refs.table.search();
        },
        enterEdit(type, row) {
            if (this.routerQuery.bindDriver == row.driverId) {
                this.$message({
                    type: 'info',
                    message: '订单已指派该司机，不能重复指派'
                });
                return;
            }

            let msg = `确定派单给司机：${row.userName}（${row.carNum}）`;
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    if (this.routerQuery.type == 1) {
                        //改派
                        this.updateOrder(row);
                    } else {
                        //派单
                        let data = {
                            driverId: row.driverId,
                            name: row.userName,
                            carNum: row.carNum
                        };
                        this.setDriverInfo(data);
                        this.back();
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        updateOrder(row) {
            let param = {
                data: {
                    orderId: this.routerQuery.orderId,
                    driverId: row.driverId,
                    oldDriverId: this.routerQuery.bindDriver,
                    agencyNumber: this.routerQuery.agencyNumber,
                    orderType: this.$route.query.orderType || null
                },
                op: this.op.changeOrder
            };
            // let URL = this.getModuleUrl(param.op);
            let URL = this.$getModuleUrl(this.routerQuery.moduleName || this.moduleName, param.op)
            this.$axios(URL, param).then(res => {
                let data = JSON.parse(res.data);
                if (data.anwserCode.code == 1) {
                    this.$message({
                        type: 'success',
                        message: '改派订单成功!'
                    });
                    this.$router.go(-1);
                } else {
                    this.$message.error(data.anwserCode.message);
                    return;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.drviesList {
    margin-bottom: 60px;
}
/deep/ .ws-table__wrapper .ws-table__header-wrapper {
    position: static;
}
.ws-table-warp {
    // min-height: calc(100% - 64px);
}
.saveButon {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 64px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .buttons {
        width: 160px;
        height: 36px;
        display: block;
    }
}
</style>
