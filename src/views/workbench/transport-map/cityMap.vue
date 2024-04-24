<template>
    <div class="ordinary-distribution">
        <div class="map-wrap">
            <div class="map-content" :style="{ height: mapHeight + 'px' }" id="map-content" ref="mapElement"></div>
            <div>
                <el-drawer
                    :modal="false"
                    custom-class="drawerClass"
                    style="position: absolute"
                    size="385"
                    :visible.sync="drawer"
                    :direction="direction"
                    :show-close="false"
                    :before-close="handleClose"
                >
                    <div class="drawerBox">
                        <div class="infoBox">
                            <div class="title">
                                <span>
                                    司机信息
                                    <!-- <span class="detail" v-if="driverDetail" @click="goDriverDetail()">司机详情</span> -->
                                </span>
                                <img class="colseBtn" @click="storeClose" src="@/assets/images/orderMap/icon_off.png" alt="" />
                            </div>
                            <div class="contBox">
                                <div class="label">
                                    <span class="labelTit">司机姓名：</span>
                                    <span>{{ driverInfo.name || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">司机手机号：</span>
                                    <span>{{ driverInfo.phone || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">车牌号：</span>
                                    <span>{{ driverInfo.carNum || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">车主类型：</span>
                                    <span>{{ partnerType[driverInfo.partnerType] || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">服务类型：</span>
                                    <span>{{ serviceType[driverInfo.serviceType] || '快车' }}</span>
                                </div>
                                <div class="label" style="display: flex">
                                    <span class="labelTit">归属机构：</span>
                                    <span style="display: inlinde-block" v-if="driverInfo.companyName">{{ driverInfo.companyName || '' }}</span>
                                </div>
                                <div class="label" style="display: flex" v-if="driverInfo.centerName">
                                    <span class="labelTit" style="visibility: hidden">归属机构：</span>
                                    <span style="display: inlinde-block">{{ driverInfo.centerName || '' }}</span>
                                </div>
                                <div class="label" style="display: flex" v-if="driverInfo.stationName">
                                    <span class="labelTit" style="visibility: hidden">归属机构：</span>
                                    <span style="display: inlinde-block">{{ driverInfo.stationName || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">当前状态：</span>
                                    <span style="color: #00ae87" v-if="operateStatus == 1">服务中</span>
                                    <span style="color: #00ae87" v-else-if="operateStatus == 0">空闲</span>
                                    <span style="color: #00ae87" v-else-if="operateStatus == 2">服务中</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">当前车速：</span>
                                    <span>{{ driverInfo.carSpeed }}km/h</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">今日完成行程订单：</span>
                                    <span>{{ driverInfo.todayFinishOrderCount }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">今日实时单：</span>
                                    <span>{{ driverInfo.todayInstantOrderCount }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">今日扫码单：</span>
                                    <span>{{ driverInfo.todayAppointOrderCount }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">近7日平均在线时长：</span>
                                    <span>{{ driverInfo.onlineTime }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">司机类型：</span>
                                    <span>{{ vip[driverInfo.vip] || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">人证信息：</span>
                                    <span>{{ innerDriverCertState[driverInfo.innerDriverCertState] || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">车证信息：</span>
                                    <span>{{ innerCarCertState[driverInfo.innerCarCertState] || '' }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-if="driverState == 1" class="infoBox" style="margin-top: 20px">
                            <div class="title">
                                <span>
                                    当前订单信息
                                    <span class="detail" @click="goOrderDetail()">综合查询</span>
                                </span>
                            </div>
                            <div class="contBox">
                                <div class="label">
                                    <span class="labelTit">订单号：</span>
                                    <span>{{ orderInfo.orderId || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">下单时间：</span>
                                    <span>{{ orderInfo.createTime || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">订单类型：</span>
                                    <span>{{ orderType[orderInfo.orderType] || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">起点城市：</span>
                                    <span>{{ orderInfo.cityName || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">订单起点：</span>
                                    <span>{{ orderInfo.startAddr || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">订单终点：</span>
                                    <span>{{ orderInfo.endAddr || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">行程状态：</span>
                                    <span>{{ orderStatus[orderInfo.orderStatus] || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">预估时长：</span>
                                    <span>{{ orderInfo.estimateTime | fixTime }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">预估价格：</span>
                                    <span>{{ orderInfo.estimateTotalPrice | price }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">预估里程：</span>
                                    <span>{{ orderInfo.estimateDistance | convertToKm }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">乘客电话：</span>
                                    <span>{{ orderInfo.passengerPhone || '' }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">行驶距离：</span>
                                    <span>{{ orderInfo.currentDistance | convertToKm }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">行驶时间：</span>
                                    <span>{{ orderInfo.currentDuration | fixTime }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">剩余行驶距离：</span>
                                    <span>{{ orderInfo.remainingKON | convertToKm }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">剩余行驶时间：</span>
                                    <span>{{ orderInfo.remainingTime | fixTime }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="infoBox" style="margin-top: 20px">
                            <div class="title">
                                <span>当前状态</span>
                            </div>
                            <div class="contBox">
                                <div class="label">
                                    <span class="labelTit">心跳机制状态：</span>
                                    <span>{{ hertInfo.status }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">心跳机制上传时间：</span>
                                    <span>{{ hertInfo.timestamp }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">经度：</span>
                                    <span>{{ hertInfo.lon }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">纬度：</span>
                                    <span>{{ hertInfo.lat }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">方向角：</span>
                                    <span>{{ hertInfo.angle }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">海拔高度：</span>
                                    <span>{{ hertInfo.elevation }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">速度（km/h）：</span>
                                    <span>{{ hertInfo.speed }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">定位城市：</span>
                                    <span>{{ hertInfo.provinceName }}{{ hertInfo.cityName }}</span>
                                </div>
                                <div class="label">
                                    <span class="labelTit">当前定位：</span>
                                    <span>{{ hertInfo.address || '' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-drawer>
            </div>

            <div class="mapBox">
                <div class="mapMarker">
                    <div class="btnBox">
                        <div class="returnBtn">
                            <ws-throttle>
                                <el-button type="primary" @click="$router.push({ path: moduleName })" class="back">返回</el-button>
                            </ws-throttle>

                            <ws-throttle v-if="powerList.selectDriverPosition">
                                <el-button v-if="flag" type="primary" @click="refresh()" :loading="loading">刷新</el-button>
                                <el-button v-else type="primary" :loading="loading">刷新</el-button>
                            </ws-throttle>
                        </div>
                    </div>
                </div>
                <div class="bacgroundMarker">
                    <div class="btnBox">
                        <div class="mapColor">
                            <div class="labelText">切换背景色：</div>
                            <div
                                class="radio-box"
                                v-for="(item, index) in radioList"
                                :key="index"
                                @click="colorTalChange(item.value)"
                                :style="item.value === colorTal ? 'border: 2px solid #F05259;' : ''"
                            ></div>
                        </div>
                        <div style="margin-left: 16px">
                            <el-button type="primary" @click="isShowDialog = !isShowDialog" style="height: 40px; width: 100px" v-if="!isShowDialog">搜索</el-button>
                            <div v-else style="height: 46px; width: 100px"></div>
                        </div>
                    </div>
                </div>
                <div class="count-box" v-if="isShowDialog">
                    <section>
                        <div class="radioTal-box">
                            <div
                                class="radioTal-contaier"
                                v-for="(item, index) in radioTalList"
                                :key="index"
                                @click="radioTalChange(item.value)"
                                :style="item.value === radioTal ? 'border-bottom: 2px solid #F05259; color: #F05259; font-weight: 600;' : ''"
                            >
                                {{ item.title }}
                            </div>
                            <img src="@/assets/images/orderMap/icon_off.png" alt="" @click="isShowDialog = false" />
                        </div>
                        <div class="search-box" v-if="radioTal == '0'">
                            <div>
                                <span class="label">司机状态：</span>
                                <el-select v-model="searchOptions.operationStatus" placeholder="--请选择--">
                                    <el-option v-for="item in offLineList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </div>

                            <div>
                                <span class="label">运力类型：</span>
                                <el-select v-model="searchOptions.serviceType" placeholder="--请选择--">
                                    <el-option v-for="item in dispatchFilters" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </div>
                            <div class="orgaiza-box">
                                <span class="label">分支机构：</span>
                                <!-- <el-cascader
                                    @visible-change="visibleChange"
                                    placeholder="--请选择--"
                                    v-model="searchOptions.agencyNumberList"
                                    :show-all-levels="false"
                                    :props="agencyProps"
                                    clearable
                                ></el-cascader> -->
                                <OrganizationOptions v-model="searchOptions.agencyNumberList" :moduleName="moduleName" ref="organizationOptions"></OrganizationOptions>
                            </div>
                            <div style="margin-left: 70px; margin-bottom: 19px" v-if="powerList.selectDriverPosition">
                                <el-button-group>
                                    <ws-throttle>
                                        <el-button
                                            style="margin-right: 20px; border-radius: 4px; width: 36px; height: 35px; line-height: 35px; text-align: center; padding: 0; border: none"
                                            @click="reset()"
                                            icon="el-icon-refresh-left"
                                            type="primary"
                                        ></el-button>
                                    </ws-throttle>

                                    <!-- <ws-enter-event :time="3000" :throttle="true"> -->
                                    <ws-throttle>
                                        <el-button type="primary" style="border-radius: 4px; width: 308px; height: 35px; line-height: 35px; padding: 0; border: none" @click="getPoints(true)">
                                            确认
                                        </el-button>
                                    </ws-throttle>
                                    <!-- </ws-enter-event> -->
                                </el-button-group>
                            </div>
                        </div>
                        <div class="search-box" v-else>
                            <div>
                                <span class="label">车主姓名：</span>
                                <el-input placeholder="请输入车主姓名" clearable v-model="searchOptions.driverName"></el-input>
                            </div>
                            <div>
                                <span class="label">车牌号：</span>
                                <el-input placeholder="请输入车牌号" clearable v-model="searchOptions.carNum"></el-input>
                            </div>
                            <div>
                                <span class="label">车主手机：</span>
                                <el-input placeholder="请输入车主手机" clearable v-model="searchOptions.phone"></el-input>
                            </div>
                            <div style="margin-left: 70px; margin-bottom: 19px" v-if="powerList.selectDriverPosition">
                                <el-button-group>
                                    <ws-throttle>
                                        <el-button
                                            style="margin-right: 20px; border-radius: 4px; width: 36px; height: 35px; line-height: 35px; text-align: center; padding: 0; border: none"
                                            @click="reset()"
                                            icon="el-icon-refresh-left"
                                            type="primary"
                                        ></el-button>
                                    </ws-throttle>

                                    <!-- <ws-enter-event :time="3000" :throttle="true"> -->
                                    <ws-throttle>
                                        <el-button type="primary" style="border-radius: 4px; width: 309px; height: 35px; line-height: 35px; padding: 0; border: none" @click="getPoints(true)">
                                            确认
                                        </el-button>
                                    </ws-throttle>
                                    <!-- </ws-enter-event> -->
                                </el-button-group>
                            </div>
                        </div>
                    </section>
                    <section>
                        <!-- <el-table :data="tableData" class="table-data" show-summary v-if="radioTal == '0'"> -->
                        <el-table :data="tableData" class="table-data" v-if="radioTal == '0'">
                            <el-table-column prop="driverStatus" label="运力类型" width="130">
                                <template slot-scope="scope">
                                    <span>{{ driverFilter[scope.row.driverStatus] }}</span>

                                    <img :src="driverImg[scope.row.driverStatus]" v-if="driverImg[scope.row.driverStatus]" />
                                </template>
                            </el-table-column>

                            <el-table-column prop="kc" label="快车" v-if="searchOptions.serviceType === null || searchOptions.serviceType === '10'"></el-table-column>
                            <el-table-column prop="zc" label="专车" v-if="searchOptions.serviceType === null || searchOptions.serviceType === '20'"></el-table-column>
                            <el-table-column prop="hhc" label="豪华车" v-if="searchOptions.serviceType === null || searchOptions.serviceType === '30'"></el-table-column>
                            <el-table-column prop="swc" label="商务车" v-if="searchOptions.serviceType === null || searchOptions.serviceType === '40'"></el-table-column>
                            <el-table-column prop="all" label="合计" v-if="searchOptions.serviceType === null"></el-table-column>
                        </el-table>
                    </section>
                </div>
                <!-- <img @click="setMapCenter" class="setCenter" :style="{top:radioTal==1?450+'px':500+'px'}" src="../../../assets/images/setCenter.png" alt=""> -->
            </div>
        </div>
    </div>
</template>

<script>
// import { delete } from 'vue/types/umd';
// serviceType: 200 快车 ，400 专车 ， 600 拼车
// driverStatus: 1 出车空闲 ，2 出车服务中， 3 出车离线
import { mapActions } from 'vuex';
import OrganizationOptions from '@/components/OrganizationOptions/OrganizationOptions.vue';
export default {
    name: 'userOrdinaryDistribution',
    components: {
        OrganizationOptions,
    },
    data() {
        return {
            loading: false,
            driverFilter: {
                ALL: '合计',
                I_OFF: '服务中离线',
                I_ON: '服务中在线',
                F_OFF: '空闲中离线',
                F_ON: '空闲中在线',
                OUT: '未出车',
            },
            driverImg: {
                ALL: '',
                I_OFF: require('@/assets/images/orderMap/sever_offline.png'),
                I_ON: require('@/assets/images/orderMap/sever_online.png'),
                F_OFF: require('@/assets/images/orderMap/free_offline.png'),
                F_ON: require('@/assets/images/orderMap/free_online.png'),
                OUT: '',
            },
            radioList: [
                {
                    value: true,
                },
                {
                    value: false,
                },
            ],
            radioTalList: [
                {
                    value: 0,
                    title: '筛选查询',
                },
                {
                    value: 1,
                    title: '车主查询',
                },
            ],
            isShowDialog: true,
            queryData: {},
            tableData: [],
            switchValue: false,
            offLineList: [
                {
                    value: 0,
                    label: '全部',
                },
                {
                    value: 1,
                    label: '服务中在线',
                },
                {
                    value: 2,
                    label: '服务中离线',
                },
                {
                    value: 3,
                    label: '空闲中在线',
                },
                {
                    value: 4,
                    label: '空闲中离线',
                },

                // {
                //     value: 5,
                //     label: '未出车',
                // },
            ],
            timePremium: '30',
            dispatchFilters: [
                { value: null, label: '全部' },
                { value: '10', label: '快车' },
                { value: '20', label: '专车' },
                { value: '30', label: '豪华车' },
                { value: '40', label: '商务车' },
            ], //业务类型

            driverDetail: '',
            orderDetail: '',
            searchOptions: {
                carNum: null,
                phone: null,
                driverName: null,
                agencyNumberList: null,
                serviceType: null,
                operationStatus: 0,
            },

            // op: {
            //     selectDriver: 'selectDriver',
            //     selectOrg: 'selectOrg',
            //     selectCount: 'selectExpDriverCount',
            //     selectInfo: 'selectExpInfo',
            //     selectDriverOrder: 'selectDriverOrder',
            // },
            op: {
                selectDriverPosition: 'selectDriverPosition',
                // selectDisDriverSummarizing: 'selectDisDriverSummarizing',
                selectDistibutionDriverInfo: 'selectDistibutionDriverInfo',
                selectOrderInfo: 'selectOrderInfo',
            },
            moduleName: '/workbench/transportMap',
            // map: null,
            // 当前查询参数
            nowFilterParam: {},
            markerList: [],
            statisticsData: {},
            interval: null,
            radioValue: [],

            radioTal: 0,

            collapseTop: 19,
            dateTime: null,
            isBatch: true,
            defaultCenter: null,
            driverCenter: null,
            lastUpdateTime: null,
            refreshInterval: null,
            flag: true,
            second: 15,
            mapHeight: 880,
            direction: 'rtl',
            driverInfo: {},
            orderInfo: {},
            hertInfo: {},
            detailData: {},
            driverPhone: '',
            currentOrderId: '',
            mapStyle: true,
            colorTal: true,
            drawer: false,
            operateStatus: '',
            driverState: 0,
            centerData: [],

            massMarksStyle: [
                this.createIcon('server_online_kuai'),
                 // 服务中在线快车
                this.createIcon('server_online_zhuan'),
                 // 服务中在线专车
                this.createIcon('server_online_hao'),
                // 服务中在线豪华车
                this.createIcon('server_online_shang'),
                // 服务中在线商务车
                this.createIcon('server_outline_kuai'),
                // 服务中离线快车
                this.createIcon('server_outline_zhuan'),
                 // 服务中离线专车
                this.createIcon('server_outline_hao'),
                 // 服务中离线豪华车
                this.createIcon('server_outline_shang'),
                 // 服务中离线商务车
                this.createIcon('free_online_kuai'),
                 // 空闲中在线快车
                this.createIcon('free_online_zhuan'),
                // 空闲中在线专车
                this.createIcon('free_online_hao'),
                // 空闲中在线豪华车
                this.createIcon('free_online_shang'),
                 // 空闲中在线商务车
                this.createIcon('free_outline_kuai'),
                // 空闲中离线快车
                this.createIcon('free_outline_zhuan'),
                // 空闲中离线专车
                this.createIcon('free_outline_hao'),
                // 空闲中离线豪华车
                this.createIcon('free_outline_shang'),
                // 空闲中离线商务车
            ],
            operate: {
                '-1': '下班',
                0: '空闲',
                1: '服务中',
                2: '忙碌',
            },
            serviceType: {
                10: '快车',
                20: '专车',
                30: '豪华车',
                40: '商务车',
            },
            partnerType: {
                1: '普通车主',
                2: '共享合伙人',
                3: '高级合伙人',
            },
            orderType: {
                20: '实时',
                21: '预约',
                22: '扫码',
                40: '拼车',
                70: '包车',
            },
            orderStatus: {
                0: '等待应答',
                10: '等待接驾',
                11: '等待接驾',
                20: '待出发',
                30: '行程中',
                40: '行程结束',
                50: '待付款',
                60: '已完成',
            },
            innerDriverCertState: {
                '-1': '无',
                0: '待校验',
                1: '有',
                2: '过期',
                3: '有证（部级不可查）',
            },
            innerCarCertState: {
                '-1': '无',
                0: '待校验',
                1: '有',
                2: '过期',
                3: '有证（部级不可查）',
            },
            vip: {
                0: '非包干司机',
                1: '有效包干司机',
                2: '无效包干司机',
            },
            agencyProps: {
                expandTrigger: 'click',
                value: 'agencyNumber',
                label: 'orgName',
                lazy: true,
                checkStrictly: true,
                lazyLoad: this.lazyLoad,
            },
        };
    },
    filters: {
        convertToKm: distance => {
            if (distance === 0) {
                return 0 + 'km';
            }
            if (distance === '' || distance == null) {
                return '';
            }
            distance = distance / 1000;
            return distance.toFixed(2) + 'km';
        },
        fixTime: time => {
            if (time === 0) {
                return 0 + '分';
            }
            if (time === '' || time == null) {
                return '';
            }
            time = time / 60;
            if (time >= 60) {
                const m = time % 60;
                return parseInt(time / 60) + '时' + (m == 0 ? '' : m.toFixed(0) + '分');
            } else {
                return time.toFixed(0) + '分';
            }
        },
        price: price => {
            if (price === 0) {
                return 0 + '元';
            }
            if (price === '' || price == null) {
                return '';
            }
            return price ? (price / 100).toFixed(2) + '元' : 0 + '元';
        },
        thousandSeparator: function (num) {
            var num = (num || 0).toString(),
                re = /\d{3}$/,
                result = '';
            while (re.test(num)) {
                result = RegExp.lastMatch + result;
                if (num !== RegExp.lastMatch) {
                    result = ',' + result;
                    num = RegExp.leftContext;
                } else {
                    num = '';
                    break;
                }
            }
            if (num) {
                result = num + result;
            }
            return result;
        },
    },
    computed: {
        userInfo() {
            const info = window.sessionStorage.getItem('_ccmUser');
            return JSON.parse(info);
        },
    },
    watch: {
        drawer: function (val, oldVal) {
            if (val == true) {
                this.clearTime();
            }
        },
    },
    methods: {
        createIcon(iconName,{x=59,y=68,width=32.2,height=36.4}={}){
            // 原始宽高width=46,height=52过大，缩放70%
            return {
                url: require(`../../../assets/images/orderMap/${iconName}.png`),
                anchor: new AMap.Pixel(x, y),
                size: new AMap.Size(width, height),
            }
        },
        searchTable(agencyNumber = null) {
            let data = {
                // data: { type: this.$route.query.type, code: this.$route.query.areaCode },
                data: { type: 'X', code: this.$route.query.areaCode, agencyNumber },
                op: 'areaQuery',
            };
            this.$axios(this.getModuleUrl(data.op), data).then(res => {
                let result = JSON.parse(res.data) || [];
                let tableData = [];
                tableData = result.transportDetail || [];
                switch (this.searchOptions.operationStatus) {
                    case 0:
                        this.tableData = tableData;
                        break;
                    case 1:
                        this.tableData = tableData.filter(item => {
                            return item.driverStatus === 'I_ON';
                        });
                        break;
                    case 2:
                        this.tableData = tableData.filter(item => {
                            return item.driverStatus === 'I_OFF';
                        });
                        break;
                    case 4:
                        this.tableData = tableData.filter(item => {
                            return item.driverStatus === 'F_OFF';
                        });
                        break;
                    case 3:
                        this.tableData = tableData.filter(item => {
                            return item.driverStatus === 'F_ON';
                        });
                        break;
                    case 5:
                        this.tableData = tableData.filter(item => {
                            return item.driverStatus === 'OUT';
                        });
                        break;
                    default:
                        this.tableData = tableData;
                }
            });
        },

        back() {
            this.$router.go(-1);
        },
        visibleChange() {
            // document.querySelectorAll('.el-cascader-menu:first-child .el-cascader-node__postfix').forEach((item, index) => {
            //     if (index == 0) {
            //         item.style.visibility = 'hidden';
            //     }
            // });
        },
        storeClose() {
            this.drawer = false;
            this.autoRefresh(this.timePremium);
        },
        handleClose(done) {
            done();
            this.autoRefresh(this.timePremium);
        },
        refresh() {
            let that = this;
            if (that.flag) {
                that.flag = false;
                this.refreshInterval = window.setInterval(function () {
                    if (that.second-- <= 0) {
                        that.second = 15;
                        that.flag = true;
                        window.clearInterval(this.refreshInterval);
                    }
                }, 1000);
                this.getPoints(true, true);
            }
        },
        reset() {
            (this.searchOptions.carNum = ''), (this.searchOptions.phone = ''), (this.searchOptions.driverName = '');
            (this.searchOptions.agencyNumberList = ''), (this.searchOptions.serviceType = null), (this.searchOptions.operationStatus = 0);
            this.$refs.organizationOptions.orgValue = '20';
            this.$refs.organizationOptions.value = '';
        },

        setMapCenter() {
            let { lng, lat } = this.queryData;
            if (lng && lat) {
                let mapCenter = new AMap.LngLat(lng, lat);
                this.map.setCenter(mapCenter);
                this.map.setZoom('12');
            }
            // if (this.userInfo.registerPoint && this.userInfo.registerPoint.lon && this.userInfo.registerPoint.lat) {
            //     let mapCenter = this.isBatch ? this.defaultCenter : this.driverCenter;
            //     this.map.setCenter(mapCenter);
            //     this.map.setZoom('12');
            // }
        },
        colorTalChange(e) {
            this.colorTal = e;
            this.map.setMapStyle(this.colorTal ? 'amap://styles/998f25903ebf671b4f4ea6c5645a5791' : 'amap://styles/b265c2b3c5dc85d44e1fcedeac037ead');
        },
        radioTalChange(e) {
            this.radioTal = e;
            if (e == 0) {
                this.searchOptions.carNum = null;
                this.searchOptions.phone = null;
                this.searchOptions.driverName = null;
                this.isBatch = true;
                this.getPoints();
            } else {
                this.searchOptions.agencyNumberList = '';
                this.searchOptions.serviceType = null;
                this.searchOptions.operationStatus = 0;
                this.isBatch = false;
            }
        },

        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        addFirst(arr, item) {
            return [item].concat(arr);
        },

        getPartnerInfo(param) {
            let data = {
                data: param,
                op: 'getOrgInfo',
            };
            return new Promise((resolve, reject) => {
                this.$axios(this.getModuleUrl(data.op), data).then(
                    response => {
                        let dataList = JSON.parse(response.data);
                        // commit(types.SELECT_SERVICE_PARTNER, dataList);
                        resolve(dataList);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },
        lazyLoad(node, resolve) {
            let item = node.data;

            this.getPartnerInfo(item || {})
                .then(item => {
                    if (item && item.length) {
                        let targetData = item.filter(temp => temp.orgType < 50);
                        resolve(targetData);
                    } else {
                        resolve(null);
                    }
                })
                .catch(err => {
                    console.log('错误', err);
                });
        },
        deepClone(obj) {
            var type = Object.prototype.toString.call(obj); //通过原型对象获取对象类型
            var newObj;
            if (type === '[object Array]') {
                //数组
                newObj = [];
                if (obj.length > 0) {
                    for (var x = 0; x < obj.length; x++) {
                        newObj.push(this.deepClone(obj[x]));
                    }
                }
            } else if (type === '[object Object]') {
                //对象
                newObj = {};
                for (var x in obj) {
                    newObj[x] = this.deepClone(obj[x]);
                }
            } else {
                //基本类型和方法可以直接赋值
                newObj = obj;
            }
            return newObj;
        },
        getPoints(isOne, isRefresh = false) {
            if (isRefresh) {
                this.loading = true;
            }
            this.clearTime();
            this.massMarks && this.massMarks.clear();
            let searchOptions = this.deepClone(this.searchOptions);
            searchOptions.agencyNumberList = searchOptions.agencyNumberList ? [searchOptions.agencyNumberList] : null;
            // if (this.searchOptions.agencyNumberList) {
            //     let agList = searchOptions.agencyNumberList[searchOptions.agencyNumberList.length - 1],
            //         agNum,
            //         orgList = [];
            //     if (agList && agList == 'quan10') {
            //         searchOptions.agencyNumberList = orgList.length ? orgList : null;
            //     } else {
            //         agNum = agList && [agList];
            //         searchOptions.agencyNumberList = this.searchOptions.agencyNumberList ? agNum : null;
            //     }
            // }
            if (!searchOptions.agencyNumberList) {
                searchOptions.cityCode = this.$route.query.areaCode;
            }

            searchOptions.lastUpdateTime = this.lastUpdateTime;
            searchOptions.operationStatus = this.searchOptions.operationStatus;

            searchOptions.requestType = isOne ? 2 : 1;
            let reqData = {
                data: searchOptions,
                op: this.op.selectDriverPosition,
            };
            if (this.radioTal == 0) {
                delete reqData.data.phone;
                delete reqData.data.carNum;
                delete reqData.data.driverName;
                if (this.$route.query.areaCode) {
                    if (reqData.data.agencyNumberList && reqData.data.agencyNumberList.length) {
                        this.searchTable(reqData.data.agencyNumberList[0]);
                    } else {
                        this.searchTable();
                    }
                }
            } else {
                if (!reqData.data.phone && !reqData.data.carNum && !reqData.data.driverName) {
                    if (isOne) {
                        this.loading = false;
                        this.$message.error('请输入司机信息');
                        return false;
                    } else {
                        delete reqData.data.phone;
                        delete reqData.data.carNum;
                        delete reqData.data.driverName;
                    }
                } else {
                    reqData.op = this.op.selectDriverPosition;
                    delete reqData.data.operationStatus;
                    delete reqData.data.serviceType;
                    delete reqData.data.agencyNumberList;
                }
            }
            this.getDisMap(reqData, isOne);
            // this.getStatistics(searchOptions.agencyNumberList);
        },
        // 地图开始拖拽
        showInfoDragstart(e) {
            this.clearTime();
        },
        // 地图结束拖拽
        showInfoDragend(e) {
            this.getPoints();
        },
        getDisMap(reqData, isOne) {
            const url = this.getModuleUrl(reqData.op);
            if (this.$route.query.areaCode) {
                this.$axios(url, reqData).then(res => {
                    let resData = JSON.parse(res.data);
                    let result = resData.postionList,
                        noWorkList = [];

                    if (result && result.length) {
                        result = result.filter((item, index) => {
                            item.lnglat = [item.gbPoint.lon, item.gbPoint.lat];
                            if (item.operationStatus == '-1') {
                                noWorkList.push(item);
                            }
                            // netStatus    司机网络状态 0 在线 1离线
                            // operationStatus   1和2 服务中   0 是空闲
                            // rideServiceType 10-快车 20-专车 30-豪华车 40-商务车
                            if ([1, 2].includes(item.operationStatus)) {
                                if (item.netStatus === 0) {
                                    // 服务中在线
                                    switch (item.rideServiceType) {
                                        case 10:
                                            item.style = 0;
                                            break;
                                        case 20:
                                            item.style = 1;
                                            break;
                                        case 30:
                                            item.style = 2;
                                            break;
                                        case 40:
                                            item.style = 3;
                                            break;
                                    }
                                } else if (item.netStatus === 1) {
                                    // 服务中离线
                                    switch (item.rideServiceType) {
                                        case 10:
                                            item.style = 4;
                                            break;
                                        case 20:
                                            item.style = 5;
                                            break;
                                        case 30:
                                            item.style = 6;
                                            break;
                                        case 40:
                                            item.style = 7;
                                            break;
                                    }
                                }
                            } else if ([0].includes(item.operationStatus)) {
                                if (item.netStatus === 0) {
                                    // 空闲中在线
                                    switch (item.rideServiceType) {
                                        case 10:
                                            item.style = 8;
                                            break;
                                        case 20:
                                            item.style = 9;
                                            break;
                                        case 30:
                                            item.style = 10;
                                            break;
                                        case 40:
                                            item.style = 11;
                                            break;
                                    }
                                } else if (item.netStatus === 1) {
                                    // 空闲中离线
                                    switch (item.rideServiceType) {
                                        case 10:
                                            item.style = 12;
                                            break;
                                        case 20:
                                            item.style = 13;
                                            break;
                                        case 30:
                                            item.style = 14;
                                            break;
                                        case 40:
                                            item.style = 15;
                                            break;
                                    }
                                }
                            }
                            return item.operationStatus != '-1';
                        });

                        if (result && result.length) {
                            if (isOne) {
                                if (!this.isBatch) {
                                    this.driverCenter = new AMap.LngLat(result[0].gbPoint.lon, result[0].gbPoint.lat);
                                    this.map.setCenter(this.driverCenter);
                                    this.map.setZoom('12');
                                }
                                if (this.searchOptions.agencyNumberList) {
                                    const sw = this.getSW(result);
                                    const ne = this.getNE(result);
                                    let mybounds = new AMap.Bounds(sw, ne);
                                    this.map.setBounds(mybounds);
                                    // this.map.setZoom('12')
                                }
                            }
                        } else {
                            if (isOne && noWorkList.length && !this.isBatch) {
                                this.$message.error('司机未出车');
                            }
                        }
                        this.loading = false;
                        this.massMarks.setData(result);
                    } else {
                        this.loading = false;
                        this.massMarks && this.massMarks.clear();
                        if (isOne) {
                            this.$message.error('查无数据');
                        }
                    }
                    // this.searchTable();
                    if (!this.interval) {
                        this.autoRefresh(this.timePremium);
                    }
                });
            }
        },
        getSW(list) {
            let south = null;
            let west = null;
            for (let item of list) {
                if ((west && item.gbPoint.lon < west) || !west) {
                    west = item.gbPoint.lon - 0.7;
                }
                if ((south && item.gbPoint.lat < south) || !south) {
                    south = item.gbPoint.lat - 0.7;
                }
            }
            return [west, south];
        },
        getNE(list) {
            let north = null;
            let east = null;
            for (let item of list) {
                if ((east && item.gbPoint.lon > east) || !east) {
                    east = item.gbPoint.lon + 0.7;
                }
                if ((north && item.gbPoint.lat > north) || !north) {
                    north = item.gbPoint.lat + 0.7;
                }
            }

            return [east, north];
        },
        getDriverInfo(data) {
            this.clearTime();
            this.drawer = true;
            this.getDriverData(data);
            this.detailData = data;
        },
        getDriverData(inData) {
            let gbPoint = inData.gbPoint || {};
            this.hertInfo = {
                status: inData.netStatus === 1 ? '异常(车辆离线)' : '正常(车辆在线)',
                timestamp: this.$baseMethod.formatData(inData.timestamp),
                lon: gbPoint.lon,
                lat: gbPoint.lat,
                angle: gbPoint.angle,
                elevation: gbPoint.elevation,
                speed: gbPoint.speed,
                address: gbPoint.address,
                provinceName: inData.provinceName,
                cityName: inData.cityName,
            };

            this.driverInfo = {};
            this.operateStatus = inData.operationStatus;
            let reqData = {
                data: { driverId: inData.driverId },
                op: this.op.selectDistibutionDriverInfo,
            };
            const url = this.getModuleUrl(this.op.selectDistibutionDriverInfo);
            this.$axios(url, reqData).then(res => {
                let resData = JSON.parse(res.data);
                this.driverInfo = resData;
                this.driverInfo.onlineTime = resData.onlineTime == null ? '' : resData.onlineTime + '小时';
                let speed = inData.gbPoint.speed;
                this.driverInfo.carSpeed = speed.toFixed(2);
                this.driverPhone = resData.phone;
                this.getOrderData(inData, resData.currentOrderId);
            });
        },
        getOrderData(inData, currentOrderId) {
            this.orderInfo = {};
            this.driverState = 0;
            if (!currentOrderId) return false;
            this.currentOrderId = currentOrderId;
            if (inData.operationStatus == 1) {
                this.driverState = 1;
                let reqData = {
                    data: {
                        lon: inData.gbPoint.lon,
                        lat: inData.gbPoint.lat,
                        orderId: currentOrderId,
                    },
                    op: this.op.selectOrderInfo,
                };
                const url = this.getModuleUrl(this.op.selectOrderInfo);
                this.$axios(url, reqData).then(res => {
                    let resData = JSON.parse(res.data);
                    this.orderInfo = resData;
                });
            } else {
                this.driverState = 0;
            }
        },
        getStatistics(agNum) {
            let reqData = {
                data: {
                    agencyNumber: agNum,
                },
                op: this.op.selectCount,
            };
            const url = this.getModuleUrl(this.op.selectCount);
            this.$axios(url, reqData).then(res => {
                const result = JSON.parse(res.data);
                this.statisticsData = result;
            });
        },

        goDriverDetail() {
            let { driverId } = this.detailData;
            this.driverInfo.driverId = driverId;
            const grams = JSON.stringify(this.driverInfo);
            localStorage.setItem('grams', grams);
            this.$router.refresh({ name: 'userOrdinaryCarForm' });
        },

        goOrderDetail() {
            let path = `/orderManage/order/ordinary/realTime/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`;
            if(this.orderInfo.orderType == 40){
                // 拼车订单跳转
                if(this.currentOrderId.substring(7,9) == '20'){
                    // 司机拼车订单
                    path = `/orderManage/order/ordinary/driverOrder/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`
                } else {
                     // 乘客拼车订单
                    path = `/orderManage/order/ordinary/passengerOrder/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`
                }
            } else if(this.orderInfo.orderType == 70){
                // 包车订单跳转
                path = `/orderManage/order/ordinary/charter/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`
            }  else if(this.orderInfo.orderType == 21){
                // 预约订单跳转
                path = `/orderManage/order/ordinary/subscribe/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`
            } else if(this.orderInfo.orderType == 22){
                // 扫码订单跳转
                path = `/orderManage/order/ordinary/scanCode/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`
            }   
            
            let cur = this.$router.options.routes.find(item => item.path.startsWith('/orderManage'));
            cur.meta.moduleName = '订单系统';
            cur.meta.systemCode = 'ORDERMANAGE';
            this.$router.push({
                path              
            });
        },

        autoRefresh(time) {
            this.clearTime();
            if (this.powerList.selectDriverPosition) {
                if (!this.interval) {
                    this.interval = window.setInterval(() => {
                        this.getPoints(false);
                    }, time * 1000);
                }
            }
        },
        clearTime() {
            window.clearInterval(this.interval);
            this.interval = null;
        },
        // 获取综合查询权限
        // getOrderModule() {
        //     let op = 'selectAndPage';
        //     this.orderDetail = this.$getModuleUrl('/order/mixedOrder', op) || '';
        // },
        // // 获取司机详情权限
        // getDriverModule() {
        //     let op = 'detail';
        //     this.driverDetail = this.$getModuleUrl('/user/ordinary-car', op) || '';
        // },
    },
    mounted() {
        // this['personalCenter/getPartnerInfo']()
        //     .then()
        //     .catch(err => {
        //         console.log('mounted', err);
        //     });
        let that = this;

        that.queryData = that.$route.query;
        let clientH = `${document.documentElement.clientHeight}`;
        if (clientH) {
            this.mapHeight = parseInt(clientH) - 88;
        }
        window.onresize = () => {
            return (() => {
                that.mapHeight = parseInt(`${document.documentElement.clientHeight}`) - 88;
            })();
        };
        this.map = new AMap.Map('map-content', {
            zoom: 12,
            animateEnable: false,
            mapStyle: this.colorTal ? 'amap://styles/998f25903ebf671b4f4ea6c5645a5791' : 'amap://styles/b265c2b3c5dc85d44e1fcedeac037ead',
        });
        // if (this.userInfo.registerPoint && this.userInfo.registerPoint.lon && this.userInfo.registerPoint.lat) {
        //     this.defaultCenter = new AMap.LngLat(this.userInfo.registerPoint.lon, this.userInfo.registerPoint.lat);
        //     this.map.setCenter(this.defaultCenter);
        // }
        this.searchTable();
        this.massMarks = new AMap.MassMarks([], {
            zIndex: 100,
            style: this.massMarksStyle,
        });
        this.massMarks.on('click', ({ data }) => {
            this.getDriverInfo(data);
        });
        this.map.on('dragstart', this.showInfoDragstart);
        this.map.on('dragend', this.showInfoDragend);
        this.clearTime();
        // this.getOrderModule();
        // this.getDriverModule();
        this.massMarks.setMap(this.map);
        this.setMapCenter();
        this.getPoints(true);
    },
    activated() {},
    deactivated() {},
    destroyed() {
        this.clearTime();
    },
};
</script>

<style scoped lang="scss">
.ordinary-distribution {
    height: 100%;
    padding: 0 !important;
    .amap-scale-text {
        color: #fff !important;
    }
    .amap-logo {
        display: none !important;
    }
    // .el-drawer__wrapper {
    //     background: rgba(255, 255, 255, 0.15) !important;
    // }

    /deep/.drawerClass {
        height: calc(100% - 30px);
        top: 20px;
        border-radius: 4px;
        background: rgba(32, 47, 82, 0.8);
        width: 370px;

        overflow-y: auto;
        .el-drawer__header {
            padding: 0;
            margin-bottom: 12px;
        }
    }
    /deep/.el-drawer__body::-webkit-scrollbar-corner,
    /deep/.el-drawer__body::-webkit-scrollbar-track {
        /* 滚动条轨道 */
        background-color: rgba(32, 47, 82, 0.8);
        box-shadow: none;
    }
    /deep/.el-drawer__body::-webkit-scrollbar {
        width: 8px;
        background-color: rgba(32, 47, 82, 0.8);
    }
    /deep/.el-drawer__body::-webkit-scrollbar-thumb {
        /* 滚动条手柄 */
        background-color: #316cc6;
    }
    .drawerBox {
        .infoBox {
            padding: 0 16px 0 20px;
            color: #fff;
            .contBox {
                margin-top: 13px;
            }
            .title {
                font-size: 20px;
                font-weight: 500;
                border-bottom: 1px solid #4b8df3;
                padding-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .detail {
                    font-size: 14px;
                    color: #0091ff;
                    cursor: pointer;
                    margin-left: 17px;
                }
                .colseBtn {
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                }
            }
            .label {
                font-size: 14px;
                line-height: 26px;
                display: flex;
                .labelTit {
                    width: 140px;
                    font-size: 14px;
                    display: inline-block;
                    text-align: left;
                }
                > span:last-child {
                    flex: 1;
                }
            }
        }
    }
    #map-content {
        width: 100%;
        height: 100%;
    }
    .map-wrap {
        position: relative;
        height: 100%;
        border-radius: 8px;
    }
    .mapBox {
        .mapMarker {
            position: absolute;
            left: 23px;
            top: 23px;
            .btnBox {
                display: flex;
            }

            .returnBtn {
                // width: 100px;
                border-radius: 4px;
                margin-right: 16px;
                .el-button {
                    width: 100px;
                    font-size: 14px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                    border: none;
                    border-radius: 4px;
                }
                button.back {
                    background: rgba(32, 47, 82, 0.8);
                }
                button.back:hover {
                    background: rgba(32, 47, 82, 0.8) !important;
                    border: none;
                }
            }
        }
        .bacgroundMarker {
            position: absolute;
            left: 23px;
            top: 72px;
            .btnBox {
                display: flex;
                .mapColor {
                    display: flex;
                    align-items: center;
                    padding-left: 24px;
                    width: 459px;
                    height: 40px;
                    background: #252931;
                    background: rgba(32, 47, 82, 0.8);
                    border-radius: 4px;

                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #fff;
                    .radio-box {
                        background: #000;
                        width: 100px;
                        height: 20px;
                        margin-left: 20px;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .radio-box:nth-of-type(3) {
                        background: #fff;
                    }
                    .labelText {
                        line-height: 16px;
                        width: 100px;
                    }
                    /deep/.el-radio {
                        color: #fff;
                    }
                }
            }
        }
        .count-box {
            position: absolute;
            left: 20px;
            top: 120px;
            z-index: 0;
            width: 574px;
            section {
                border-radius: 4px;
                background: rgba(32, 47, 82, 0.8);
                .search-box {
                    width: 100%;
                    padding: 24px;
                    /deep/.el-input {
                        width: 364px;
                        margin-bottom: 16px;
                    }
                    .label {
                        width: 70px;
                        display: inline-block;
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: rgba(255, 255, 255, 0.85);
                        text-align: right;
                    }
                    /deep/.el-select__tags {
                        top: 35%;
                    }
                    /deep/ .el-button--medium {
                        min-width: inherit;
                    }
                    .orgaiza-box {
                        display: flex;
                        align-items: center;
                        margin-bottom: 16px;
                        /deep/.el-input {
                            width: 100%;
                            margin-bottom: 0;
                        }
                        .ws-organization-options {
                            width: 364px !important;
                        }
                    }
                }

                .radioTal-box {
                    z-index: 1;
                    width: 572px;
                    height: 40px;
                    line-height: 40px;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    // border-bottom: 2px solid #4b8df3;
                    position: relative;
                    background: rgba(37, 55, 99, 0.8);
                    > div {
                        display: inline-block;
                        height: 40px;
                        margin-left: 29px;
                        color: #fff;
                        cursor: pointer;
                        font-size: 14px;
                        font-family: PingFangSC-Medium, PingFang SC;
                    }
                    > div:last-child {
                        margin-left: 66px;
                    }
                    img {
                        position: absolute;
                        right: 10px;
                        width: 24px;
                        top: 8px;
                        cursor: pointer;
                    }
                }
            }
            section:last-child {
                // border: 1px solid #40568b;
                margin-top: 4px;
                .table-data {
                    background: rgba(32, 47, 82, 0.8);
                    border-radius: 4px;
                    border-right: 1px solid #40568b !important;
                    /deep/th {
                        background: rgba(32, 47, 82, 0.8);
                        color: #fff;
                        font-weight: 500;
                        border: 1px solid #40568b !important;
                        border-right: none !important;
                        border-bottom: 1px solid #40568b !important;
                    }
                    /deep/tr {
                        background-color: rgba(32, 47, 82, 0.8) !important;
                        td {
                            background: rgba(32, 47, 82, 0.8) !important;
                            border: 1px solid #40568b;
                            border-right: none !important;
                            color: #fff;
                        }
                    }
                    /deep/.cell {
                        display: flex;
                        align-items: center;
                    }
                    img {
                        width: 17px;
                        height: 20px;
                        margin-left: 7px;
                    }
                    /deep/ .el-table__empty-block {
                        border: 1px solid #40568b;
                        border-right: none;
                        border-top: none;
                    }
                }
                /deep/.el-table::before {
                    height: 0 !important;
                }
            }
        }

        .setCenter {
            position: absolute;
            left: 23px;
            top: 500px;
            width: 46px;
            height: 46px;
            cursor: pointer;
        }
    }
}
</style>
