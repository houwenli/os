<template>
    <div class="ordinary-distribution">
        <div class="map-wrap">
            <div class="map-content" :style="{ height: mapHeight + 'px' }" id="map-content" ref="mapElement"></div>

            <el-drawer :modal="false" custom-class="drawerClass" style="position: absolute" size="385" :visible.sync="drawer" :direction="direction" :show-close="false" :before-close="handleClose">
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
                                <span style="color: #00ae87" v-else-if="operateStatus == -1">未出车</span>
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

            <div class="mapBox">
                <div class="mapMarker">
                    <div class="btnBox">
                        <div style="margin-left: 16px">
                            <el-button type="primary" @click="isShowDialog = !isShowDialog" style="height: 40px; width: 100px" v-if="!isShowDialog">搜索</el-button>
                            <div v-else style="height: 40px; width: 100px"></div>
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
                                <!-- <span class="label">分支机构：</span>
                                <el-cascader placeholder="--请选择--" v-model="searchOptions.agencyNumberList" :show-all-levels="false" :props="agencyProps" clearable></el-cascader> -->

                                <span class="label">分支机构：</span>
                                <organizationOptions v-model="searchOptions.agencyNumberList" :moduleName="moduleName" ref="organizationOptions"></organizationOptions>
                            </div>
                            <div style="margin-left: 70px; margin-bottom: 19px" v-if="powerList.selectLocationDistribution">
                                <el-button-group>
                                    <ws-throttle>
                                        <el-button
                                            style="margin-right: 20px; border-radius: 4px; width: 36px; height: 35px; line-height: 35px; text-align: center; padding: 0; border: none"
                                            @click="reset()"
                                            icon="el-icon-refresh-left"
                                            type="primary"
                                            :disabled="loading"
                                        ></el-button>
                                    </ws-throttle>

                                    <ws-throttle>
                                        <el-button
                                            type="primary"
                                            style="border-radius: 4px; width: 308px; height: 35px; line-height: 35px; padding: 0; border: none"
                                            @click="getPoints(true)"
                                            :loading="loading"
                                        >
                                            确认
                                        </el-button>
                                    </ws-throttle>
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
                            <div style="margin-left: 70px; margin-bottom: 19px" v-if="powerList.selectLocationDistribution">
                                <el-button-group>
                                    <ws-throttle>
                                        <el-button
                                            style="margin-right: 20px; border-radius: 4px; width: 36px; height: 35px; line-height: 35px; text-align: center; padding: 0; border: none"
                                            @click="reset()"
                                            icon="el-icon-refresh-left"
                                            type="primary"
                                        ></el-button>
                                    </ws-throttle>

                                    <ws-throttle>
                                        <el-button type="primary" style="border-radius: 4px; width: 309px; height: 35px; line-height: 35px; padding: 0; border: none" @click="getPoints(true)">
                                            确认
                                        </el-button>
                                    </ws-throttle>
                                </el-button-group>
                            </div>
                        </div>
                    </section>
                    <section>
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
            </div>

            <div class="update-box">最后更新时间：{{ updateTime }}</div>
        </div>
    </div>
</template>

<script>
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
                OUT: require('@/assets/images/orderMap/out.png'),
            },

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
            offLineList: [
                {
                    value: null,
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
                {
                    value: 0,
                    label: '未出车',
                },
            ],
            timePremium: '30', // 隔多久查询一次
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
                operationStatus: 3,
            },

            op: {
                selectLocationDistribution: 'selectLocationDistribution', // 查询地图点信息
                selectDistibutionDriverInfo: 'selectDistibutionDriverInfo',
                selectOrderInfo: 'selectOrderInfo',
            },
            moduleName: '/workbench/transportMap',
            // map: null,
            // 当前查询参数
            interval: null,
            radioTal: 0,
            isBatch: true,
            lastUpdateTime: null,
            mapHeight: 880,
            direction: 'rtl',
            driverInfo: {},
            orderInfo: {},
            hertInfo: {},
            detailData: {},
            driverPhone: '',
            currentOrderId: '',

            drawer: false,
            operateStatus: '',
            driverState: 0,

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
            groupImg: {
                0: require('@/assets/images/orderMap/server_online_kuai.png'),
                1: require('@/assets/images/orderMap/server_online_zhuan.png'),
                2: require('@/assets/images/orderMap/server_online_hao.png'),
                3: require('@/assets/images/orderMap/server_online_shang.png'),
                4: require('@/assets/images/orderMap/server_outline_kuai.png'),
                5: require('@/assets/images/orderMap/server_outline_zhuan.png'),
                6: require('@/assets/images/orderMap/server_outline_hao.png'),
                7: require('@/assets/images/orderMap/server_outline_shang.png'),
                8: require('@/assets/images/orderMap/free_online_kuai.png'),
                9: require('@/assets/images/orderMap/free_online_zhuan.png'),
                10: require('@/assets/images/orderMap/free_online_hao.png'),
                11: require('@/assets/images/orderMap/free_online_shang.png'),
                12: require('@/assets/images/orderMap/free_outline_kuai.png'),
                13: require('@/assets/images/orderMap/free_outline_zhuan.png'),
                14: require('@/assets/images/orderMap/free_outline_hao.png'),
                15: require('@/assets/images/orderMap/free_outline_shang.png'),
                16: require('@/assets/images/orderMap/out_kuai.png'),
                17: require('@/assets/images/orderMap/out_zhuan.png'),
                18: require('@/assets/images/orderMap/out_hao.png'),
                19: require('@/assets/images/orderMap/out_shang.png'),
            }, // 地图显示的16种图片
            pointSimplifierIns: null,
            timer: null,
            updateTime: new Date(), // 获取当前时间
            // currentPage: 1,
            // saveList: [], // 存储每次查询出来的数据
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
    watch: {
        drawer: function (val, oldVal) {
            if (val == true) {
                this.clearTime();
            }
        },
    },
    mounted() {
        let that = this;

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
            zoom: 4,
            animateEnable: false,
            mapStyle: 'amap://styles/998f25903ebf671b4f4ea6c5645a5791',
        });
        this.showUpdateTime();
        // 初始化地图
        this.getPoints(true);

        this.map.on('dragstart', this.showInfoDragstart);
        this.map.on('dragend', this.showInfoDragend);
        this.clearTime();
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
        }
    },
    methods: {
        // handleSperaChange(e) {
        //     this.currentPage = 1;
        //     this.saveList = [];
        // },
        showUpdateTime() {
            var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
            _this.timer = setInterval(function () {
                let date = new Date(new Date().getTime() - 32000);
                _this.updateTime = _this.$baseMethod.formatData(date, 'yyyy-MM-dd hh:mm:ss');
            }, 1000);
        },
        //过滤加0
        appendZero(obj) {
            if (obj < 10) {
                return '0' + obj;
            } else {
                return obj;
            }
        },
        initMap(reqData, isOne) {
            let that = this;
            AMapUI.load(['ui/misc/PointSimplifier', 'lib/$'], function (PointSimplifier, $) {
                if (!PointSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！');
                    return;
                }
                that.initPage(PointSimplifier, $, reqData, isOne);
            });
        },

        initPage(PointSimplifier, $, reqData, isOne) {
            let that = this;
            var groupStyleMap = {};
            for (var key in this.groupImg) {
                groupStyleMap[key] = {
                    pointStyle: {
                        //绘制点占据的矩形区域
                        content: PointSimplifier.Render.Canvas.getImageContent(
                            this.groupImg[key],
                            function onload() {
                                //图片加载成功，重新绘制一次
                                that.pointSimplifierIns.renderLater();
                            },

                            function onerror(e) {
                                console.error('图片加载失败！');
                            }
                        ),
                        //宽度
                        width: 46,
                        //高度
                        height: 52,
                        //定位点为中心
                        offset: ['-50%', '-50%'],
                        fillStyle: null,
                        //strokeStyle: null
                    },
                };
            }

            that.pointSimplifierIns = new PointSimplifier({
                zIndex: 115,
                autoSetFitView: false,
                map: this.map, //所属的地图实例

                getPosition: function (item) {
                    var lngLatLine = item.lnglat;

                    if (!lngLatLine) {
                        return null;
                    }

                    var parts = lngLatLine.split(',');

                    return [parseFloat(parts[0]), parseFloat(parts[1])];
                },
                getHoverTitle: function (dataItem, idx) {
                    // return '序号: ' + idx;
                    return;
                },
                //使用GroupStyleRender
                renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
                renderOptions: {
                    //点的样式
                    pointStyle: {
                        width: 5,
                        height: 5,
                        // fillStyle: '#A2D0FA',
                    },
                    getGroupId: function (item, idx) {
                        return item.style;
                    },
                    groupStyleOptions: function (gid) {
                        return groupStyleMap[gid];
                    },
                    pointHoverStyle: {
                        content: 'none', // 鼠标经过样式
                    },
                    //TopN区域
                    // topNAreaStyle: {
                    //     autoGlobalAlphaAlpha: true,
                    //     content: 'rect',
                    //     fillStyle: '#e25c5d',
                    //     lineWidth: 1,
                    //     strokeStyle: 'rgba(0,0,0,0)',
                    // },
                },
            });
            this.getData(reqData);

            // that.pointSimplifierIns.renderEngine.setOptions({
            //     getAreaSizeForTopSelect: function (zoom, pointSize) {
            //         return 80 * 80;
            //     },
            //     //topN选取的数量
            //     getNumForTopSelect: function (zoom, bounds, descendantsNum, pointSize) {
            //         return 1;
            //     },
            // });
            //监听点击事件
            that.pointSimplifierIns.on('pointClick', function (e, record) {
                that.getDriverInfo(record.data);
            });
        },
        getData(reqData) {
            const url = this.getModuleUrl(reqData.op);
            this.$axios(url, reqData)
                .then(res => {
                    let resData = JSON.parse(res.data);
                    let result = resData.vehicleLocationPos || [],
                        noWorkList = [];

                    if (result && result.length) {
                        result = result.filter((item, index) => {
                            item.lnglat = [item.l.o, item.l.a].join(',');

                            // n    司机网络状态 0 在线 1离线
                            // o   1和2 服务中   0 是空闲
                            // r 10-快车 20-专车 30-豪华车 40-商务车
                            if ([1, 2].includes(item.o)) {
                                if (item.n === 0) {
                                    // 服务中在线
                                    switch (item.r) {
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
                                } else if (item.n === 1) {
                                    // 服务中离线
                                    switch (item.r) {
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
                            } else if ([0].includes(item.o)) {
                                if (item.n === 0) {
                                    // 空闲中在线
                                    switch (item.r) {
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
                                } else if (item.n === 1) {
                                    // 空闲中离线
                                    switch (item.r) {
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
                            } else if ([-1].includes(item.o)) {
                                // 未出车
                                switch (item.r) {
                                    case 10:
                                        item.style = 16;
                                        break;
                                    case 20:
                                        item.style = 17;
                                        break;
                                    case 30:
                                        item.style = 18;
                                        break;
                                    case 40:
                                        item.style = 19;
                                        break;
                                }
                                noWorkList.push(item);
                            }
                            return [1, 2, 0, -1].includes(item.o);
                        });

                        if (result && result.length) {
                        } else {
                            // if (isOne && noWorkList.length && !this.isBatch) {
                            //     this.$message.error('司机未出车');
                            // }
                        }
                        // 如果是筛选查询
                        // if (this.radioTal == 0) {
                        //     this.saveList.push(result);
                        //     this.currentPage++;
                        //     if (resData.vehicleLocationPos.length >= 10000) {
                        //         this.getPoints(true);
                        //     } else {
                        //         this.currentPage = 1;
                        //         this.loading = false;
                        //         this.pointSimplifierIns.setData(result);
                        //     }
                        // } else {
                        //     this.currentPage = null;
                        //     this.saveList = [];
                        //     this.loading = false;
                        //     this.pointSimplifierIns.setData(result);
                        // }
                        this.loading = false;
                        this.pointSimplifierIns.setData(result);
                        this.map.setZoom('4');
                    } else {
                        this.loading = false;

                        // if (isOne) {
                        //     this.$message.error('查无数据');
                        // }
                    }

                    if (!this.interval) {
                        this.autoRefresh(this.timePremium);
                    }
                })
                .catch(error => {
                    // if (this.radioTal == 0) {
                    //     this.currentPage = 1;
                    // } else {
                    //     this.currentPage = null;
                    // }
                    // this.saveList = [];
                    this.loading = false;
                    if (!this.interval) {
                        this.autoRefresh(this.timePremium);
                    }
                });
        },
        searchTable(reqData) {
            const url = this.getModuleUrl('selectOwnerPositioningStatistics');
            let data = this.deepClone(reqData);
            data.op = 'selectOwnerPositioningStatistics';
            this.$axios(url, data)
                .then(res => {
                    let resData = JSON.parse(res.data) || [];
                    let tableData = resData.jsonRootBean ? resData.jsonRootBean.transportDetail : [];

                    switch (this.searchOptions.operationStatus) {
                        case null:
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
                        case 0:
                            this.tableData = tableData.filter(item => {
                                return item.driverStatus === 'OUT';
                            });
                            break;
                        default:
                            this.tableData = tableData;
                    }
                })
                .catch(() => {
                    this.tableData = [];
                });
        },
        storeClose() {
            this.drawer = false;
            this.autoRefresh(this.timePremium);
        },
        handleClose(done) {
            done();
            this.autoRefresh(this.timePremium);
        },

        reset() {
            (this.searchOptions.carNum = ''), (this.searchOptions.phone = ''), (this.searchOptions.driverName = '');
            (this.searchOptions.agencyNumberList = null), (this.searchOptions.serviceType = null), (this.searchOptions.operationStatus = 3);

            this.$refs.organizationOptions.orgValue = '20';
            this.$refs.organizationOptions.value = '';
            // this.currentPage = null;
            // this.saveList = [];
        },

        radioTalChange(e) {
            this.radioTal = e;
            if (e == 0) {
                this.searchOptions.carNum = null;
                this.searchOptions.phone = null;
                this.searchOptions.driverName = null;
                this.isBatch = true;
                if (this.pointSimplifierIns) {
                    this.map.clearMap();
                    this.pointSimplifierIns.setData();
                }
                this.getPoints();
            } else {
                this.searchOptions.agencyNumberList = '';
                this.searchOptions.serviceType = null;
                this.searchOptions.operationStatus = 3;
                this.isBatch = false;
            }
        },

        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        // 获取机构数据
        getPartnerInfo(param) {
            let data = {
                data: param,
                op: 'getOrgInfo',
            };
            return new Promise((resolve, reject) => {
                this.$axios(this.getModuleUrl(data.op), data).then(
                    response => {
                        let dataList = JSON.parse(response.data);
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
            // if (isOne) {
            //     this.saveList = [];
            // }
            this.loading = true;
            this.clearTime();
            let that = this;
            if (that.pointSimplifierIns) {
                that.map.clearMap();
                that.pointSimplifierIns.setData();
            }

            let searchOptions = this.deepClone(this.searchOptions);
            searchOptions.agencyNumberList = searchOptions.agencyNumberList ? [searchOptions.agencyNumberList] : null;
            searchOptions.lastUpdateTime = this.lastUpdateTime;
            searchOptions.operationStatus = this.deepClone(this.searchOptions.operationStatus);

            searchOptions.requestType = isOne ? 2 : 1;
            let reqData = {
                data: searchOptions,
                op: this.op.selectLocationDistribution,
            };
            if (this.radioTal == 0) {
                delete reqData.data.phone;
                delete reqData.data.carNum;
                delete reqData.data.driverName;
                this.searchTable(reqData);
                // searchOptions.currentPage = this.currentPage;
                // searchOptions.pageSize = 10000;
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
                    reqData.op = this.op.selectLocationDistribution;
                    delete reqData.data.operationStatus;
                    delete reqData.data.serviceType;
                    delete reqData.data.agencyNumberList;
                }
            }

            this.initMap(reqData, isOne);
        },
        // 地图开始拖拽
        showInfoDragstart(e) {
            this.clearTime();
        },
        // 地图结束拖拽
        showInfoDragend(e) {
            // this.getPoints();
        },

        getDriverInfo(data) {
            this.clearTime();
            this.drawer = true;
            this.getDriverData(data);
            this.detailData = data;
        },
        getDriverData(inData) {
            this.driverInfo = {};
            this.operateStatus = inData.o;
            let reqData = {
                data: { driverId: inData.i },
                op: this.op.selectDistibutionDriverInfo,
            };
            const url = this.getModuleUrl(this.op.selectDistibutionDriverInfo);
            this.$axios(url, reqData).then(res => {
                let resData = JSON.parse(res.data);
                let gbPoint = resData.gbPoint || {};

                this.driverInfo = resData;
                this.driverInfo.onlineTime = resData.onlineTime == null ? '' : resData.onlineTime + '小时';
                let speed = gbPoint.speed;
                this.driverInfo.carSpeed = speed.toFixed(2);
                this.driverPhone = resData.phone;

                this.hertInfo = {
                    status: inData.n === 1 ? '异常(车辆离线)' : '正常(车辆在线)',
                    timestamp: this.$baseMethod.formatData(resData.timestamp),
                    lon: gbPoint.lon,
                    lat: gbPoint.lat,
                    angle: gbPoint.angle,
                    elevation: gbPoint.elevation,
                    speed: gbPoint.speed,
                    address: gbPoint.address,
                    provinceName: resData.provinceName,
                    cityName: resData.cityName,
                };

                this.getOrderData(inData, resData.currentOrderId);
            });
        },
        getOrderData(inData, currentOrderId) {
            this.orderInfo = {};
            this.driverState = 0;
            if (!currentOrderId) return false;
            this.currentOrderId = currentOrderId;
            if (inData.o == 1) {
                this.driverState = 1;
                let reqData = {
                    data: {
                        lon: inData.l.o,
                        lat: inData.l.a,
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

        goDriverDetail() {
            let { i } = this.detailData;

            this.driverInfo.driverId = i;

            this.$router.refresh({ name: 'userOrdinaryCarForm' });
        },

        goOrderDetail() {
            let path = `/orderManage/order/ordinary/realTime/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`;
            if (this.orderInfo.orderType == 40) {
                // 拼车订单跳转
                if (this.currentOrderId.substring(7, 9) == '20') {
                    // 司机拼车订单
                    path = `/orderManage/order/ordinary/driverOrder/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`;
                } else {
                    // 乘客拼车订单
                    path = `/orderManage/order/ordinary/passengerOrder/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`;
                }
            } else if (this.orderInfo.orderType == 70) {
                // 包车订单跳转
                path = `/orderManage/order/ordinary/charter/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`;
            } else if (this.orderInfo.orderType == 21) {
                // 预约订单跳转
                path = `/orderManage/order/ordinary/subscribe/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`;
            } else if (this.orderInfo.orderType == 22) {
                // 扫码订单跳转
                path = `/orderManage/order/ordinary/scanCode/list/detail?orderId=${this.currentOrderId}&isEncrypt=true`;
            }

            let cur = this.$router.options.routes.find(item => item.path.startsWith('/orderManage'));
            cur.meta.moduleName = '订单系统';
            cur.meta.systemCode = 'ORDERMANAGE';
            this.$router.push({
                path,
            });
        },

        autoRefresh(time) {
            this.clearTime();
            if (this.powerList.selectLocationDistribution) {
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
    },

    destroyed() {
        this.clearTime();
    },
};
</script>

<style scoped lang="scss">
.ordinary-distribution {
    height: 100%;
    padding: 0 !important;

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
    .update-box {
        position: absolute;
        bottom: 20px;
        right: 40px;
        color: #fff;
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
            .btnBox {
                // display: flex;
                position: absolute;
                top: 59px;
                left: 412px;
                .el-button {
                    color: #fff;
                }
            }
        }
        .count-box {
            position: absolute;
            left: 20px;
            top: 110px;

            z-index: 0;
            width: 574px;
            section {
                // border: 2px solid #4b8df3;
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
                    // border-bottom: 2px solid #4b8df3;
                    position: relative;
                    background: rgba(37, 55, 99, 0.8);
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;

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
    }
}
</style>
