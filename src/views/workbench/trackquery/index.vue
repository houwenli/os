<template>
    <div class="car-trajectory">
        <el-drawer :modal="false" custom-class="drawerClass" style="position: absolute" size="385" :visible.sync="dialogDrawer" direction="rtl" :show-close="false" :before-close="storeClose">
            <div class="drawerBox">
                <div class="infoBox" v-if="searchOptions.orderId">
                    <div class="title">
                        <span>当前订单信息</span>
                        <img class="colseBtn" @click="storeClose" src="@/assets/images/orderMap/icon_off.png" alt="" />
                    </div>
                    <div class="contBox">
                        <div class="label">
                            <span class="labelTit">订单号：</span>
                            <span>{{ orderMapPointInfoVo.orderId || '' }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">下单时间：</span>
                            <span>{{ orderMapPointInfoVo.receivedOrderTime || '' }}</span>
                        </div>

                        <div class="label">
                            <span class="labelTit">订单类型：</span>
                            <span>{{ orderTypeFilter[orderMapPointInfoVo.orderType] || '' }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">起点城市：</span>
                            <span>{{ orderMapPointInfoVo.cityName || '' }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">订单起点：</span>
                            <span>{{ orderMapPointInfoVo.startAddr || '' }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">订单终点：</span>
                            <span>{{ orderMapPointInfoVo.endAddr || '' }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">行程状态：</span>
                            <span>{{ orderFilter[orderMapPointInfoVo.orderStatus] || '' }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">预估时长：</span>
                            <span>{{ orderMapPointInfoVo.estimateTime || 0 }}分钟</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">预估价格：</span>
                            <span>{{ orderMapPointInfoVo.estimatePrice || 0 }}元</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">预估里程：</span>
                            <span>{{ orderMapPointInfoVo.estimateDistance || 0 }}公里</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">已行驶时长：</span>
                            <span>{{ orderMapPointInfoVo.elapsedTime || 0 }}分钟</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">已行驶里程：</span>
                            <span>{{ orderMapPointInfoVo.travlledDistance || 0 }}公里</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">剩余行驶里程：</span>
                            <span>{{ orderMapPointInfoVo.remainingMileage || 0 }}公里</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">剩余行驶时间：</span>
                            <span>{{ orderMapPointInfoVo.remainingTime || 0 }}分钟</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">乘客电话：</span>
                            <span>{{ orderMapPointInfoVo.passengerPhone || '' }}</span>
                        </div>
                    </div>
                </div>

                <div class="infoBox">
                    <div class="title">
                        <span>当前状态</span>
                        <img class="colseBtn" @click="storeClose" src="@/assets/images/orderMap/icon_off.png" alt="" v-if="!searchOptions.orderId" />
                    </div>
                    <div class="contBox">
                        <div class="label">
                            <span class="labelTit">心跳机制状态：</span>
                            <span>{{ stateFilter[heartInfo.state] || '' }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">心跳机制上传时间：</span>
                            <span>{{ heartInfo.createTime || '暂无' }}</span>
                        </div>

                        <div class="label">
                            <span class="labelTit">经度：</span>
                            <span>{{ heartInfo.lon }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">纬度：</span>
                            <span>{{ heartInfo.lat }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">方向角：</span>
                            <span>{{ heartInfo.angle }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">海拔高度：</span>
                            <span>{{ heartInfo.elevation }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">速度（km/h）：</span>
                            <span>{{ heartInfo.speed }}</span>
                        </div>
                        <div class="label">
                            <span class="labelTit">当前定位：</span>
                            <span>{{ heartInfo.address }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>

        <div class="map-wrap">
            <div class="map-content" :style="{ height: mapHeight + 'px' }" id="map-content" ref="mapElement"></div>
            <div class="count-box" :style="{ height: mapHeight + 'px', 'overflow-y': 'auto' }">
                <div :style="{ 'border-radius': borderRadius }" id="routes-container">
                    <div style="text-align: center; width: 100%">
                        <el-button-group>
                            <el-button @click="startAnimation" :disabled="!lineArr.length || navgStatus === 'moving'" :class="navgStatus === 'moving' ? '' : 'diabled-class'">开始巡航</el-button>
                            <el-button
                                @click="pauseAnimation"
                                :disabled="!lineArr.length || navgStatus === 'pause' || navgStatus === 'stop'"
                                :class="navgStatus === 'pause' || navgStatus === 'stop' ? '' : 'diabled-class'"
                            >
                                暂停
                            </el-button>
                            <el-button
                                @click="resumeAnimation"
                                :disabled="!lineArr.length || navgStatus === 'moving' || navgStatus === 'stop'"
                                :class="navgStatus === 'moving' || navgStatus === 'stop' ? '' : 'diabled-class'"
                            >
                                继续巡航
                            </el-button>
                        </el-button-group>
                    </div>
                </div>
                <el-collapse class="collapseMap" @change="collapseChange" v-model="activeName" accordion>
                    <el-collapse-item :disabled="false" title="轨迹设置及查询" name="1">
                        <div class="search-box">
                            <div>
                                <span class="label">订单号：</span>
                                <el-input placeholder="请输入订单号" clearable v-model="searchOptions.orderId" maxlength="21" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                            </div>
                            <div>
                                <span class="label">手机号码：</span>
                                <el-input clearable placeholder="请输入车主手机号" v-model="searchOptions.phone" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                            </div>
                            <div>
                                <span class="label">车主ID：</span>
                                <el-input clearable placeholder="请输入车主ID" v-model="searchOptions.driverId" maxlength="13" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                            </div>
                            <div>
                                <span class="label">定位时间：</span>
                                <el-date-picker
                                    v-model="dateTime"
                                    type="datetimerange"
                                    align="right"
                                    range-separator="~"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 280px; background: #fff"
                                    :picker-options="pickerOptions"
                                    :default-time="['00:00:00', '23:59:59']"
                                >
                                    >
                                </el-date-picker>
                            </div>
                            <div style="text-align: right; margin: 18px 14px 0 0">
                                <el-button-group>
                                    <ws-throttle>
                                        <div
                                            @click="showSetBtn = !showSetBtn"
                                            v-if="oaPowerList.select"
                                            style="border-radius: 4px; width: 35px; height: 35px; text-align: center; padding: 0; position: absolute; left: 80px; cursor: pointer"
                                        >
                                            <img
                                                :src="showSetBtn ? require('@/assets/images/orderMap/expand_arrow.png') : require('@/assets/images/orderMap/collapse_arrow.png')"
                                                style="width: 24px; height: 24px; margin-top: 4px"
                                            />
                                        </div>
                                    </ws-throttle>
                                    <ws-throttle>
                                        <div
                                            v-if="oaPowerList.select"
                                            style="border-radius: 4px; width: 35px; height: 35px; text-align: center; padding: 0; position: absolute; left: 136px; cursor: pointer; background: #f05259"
                                            @click="reset"
                                        >
                                            <img :src="require('@/assets/images/orderMap/icon_reset.png')" alt="" style="width: 24px; height: 24px; margin-top: 4px" />
                                        </div>
                                    </ws-throttle>
                                    <ws-enter-event>
                                        <el-button v-if="oaPowerList.select" type="primary" style="border-radius: 4px; width: 164px; height: 35px; text-align: center; padding: 0" @click="getPoints()">
                                            确认
                                        </el-button>
                                    </ws-enter-event>
                                </el-button-group>
                            </div>
                        </div>
                    </el-collapse-item>
                    <div v-if="showSetBtn" class="set_box">
                        <el-checkbox v-model="checked" @change="handleAllChange">全选/反选</el-checkbox>
                        <el-checkbox-group v-model="checkedColumnList" @change="handleCheckedChange" style="margin-top: 14px">
                            <div
                                class="popover-headers"
                                v-for="(item, index) in columnList"
                                :key="index"
                                style="background: #0e1b37; border-radius: 4px; margin-bottom: 8px; padding: 16px 16px 4px 16px"
                            >
                                <div v-for="(ele, index2) in item" :key="index2" style="width: 50%; display: inline-block; margin-bottom: 12px">
                                    <el-checkbox :label="ele" :key="index2">
                                        {{ ele }}
                                    </el-checkbox>
                                </div>
                            </div>
                        </el-checkbox-group>
                    </div>
                </el-collapse>
            </div>
        </div>
    </div>
</template>

<script>
let pathNavigs = [];
export default {
    name: 'userCarTrajectory',
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    // return time.getTime() >= Date.now();

                    return time.getTime() > new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
                },
            },
            showSetBtn: true, // 是否显示设置按钮
            checked: false,
            orderTypeFilter: {
                20: '实时',
                21: '预约',
                22: '实时',
                10: '巡游出租车',
                11: '巡游出租车',
                12: '收款码',
                31: '预约',
                30: '实时',
                40: '村村通拼车',
                70: '包车',
                80: '城际专线',
                90: '空驶单',
            },
            orderFilter: {
                0: '等待应答',
                5: '未应答取消',
                10: '等待接驾/司机接单',
                14: '乘客取消',
                18: '司机取',
                20: '到达预约地点',
                30: '开始计费',
                40: '结束计费/到达目的地',
                50: '未付款/司机发起付款',
                60: '已支付',
            },
            stateFilter: {
                0: '异常(车辆离线)',
                1: '正常(车辆在线)',
                NA: '暂无',
            },
            navgStatus: 'stop', // stop pause -开始巡航 moving-暂停 pause-继续巡航
            // checkedColumnList: ['出车', '收车', '订单起点', '订单终点', '服务中离线点', '服务中在线点', '空闲中离线点', '空闲中在线点', '开始计费点', '结束计费点'], //选中显示表格列
            checkedColumnList: ['订单起点', '订单终点', '空闲中离线点', '开始计费点', '结束计费点'], //选中显示表格列
            columnList: ['出车', '收车', '订单起点', '订单终点', '服务中离线点', '服务中在线点', '空闲中离线点', '空闲中在线点', '开始计费点', '结束计费点'],
            orderMapPointInfoVo: {}, // 订单详情
            heartInfo: {}, // 心跳详情
            dialogDrawer: false,
            searchOptions: {
                driverId: '',
                startTime: '',
                endTime: '',
                phone: '',
                orderId: '',
            },
            dateTime: [],
            moduleName: '/workbench/BRtrackQuery',
            // map: null,
            lineArr: [],
            marker: null,
            op: {
                selectExpDriverDisStatics: 'selectExpDriverDisStatics',
                selectCount: 'selectExpDriverDisStaticsCount',
                selectInfo: 'selectExpInfo',
            },
            radioValue: 0,
            speedCount: 1,
            colors: [],
            pathSimplifierIns: null,
            navigBtnsConf: [],
            speedRangeInput: null,
            speedTxt: null,
            activeName: '1',
            infoWindow: null,
            borderRadius: '4px',
            border: 'none',
            mapHeight: 880,
            btnDisabled: false,
            markerObj: {
                oneMarker: null,
                siteNameMarker: null,
                siteMarker: null,
            },
            dataPostion: [],
            polylineMarker: null,
            carSpeed: 1000,
            defaultCenter: null,
            offLineDataPostion: [],
            trailPointInfoVos: [], // 整个路径
            lastPoint: [], // 终点轨迹
        };
    },
    destroyed() {
        document.querySelector('#ws-watermark-background').style.display = 'block';
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
    },
    mounted() {
        AMap.plugin(['AMap.Driving', 'AMap.Scale', 'AMap.ToolBar', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MouseTool'], () => {
            this.initMap();
            this.columnList = this.spArr(this.columnList, 4);
        });
    },
    computed: {
        userInfo() {
            const info = window.sessionStorage.getItem('_ccmUser');
            return JSON.parse(info);
        },
    },
    watch: {
        dateTime: {
            handler: function (newData, oldData) {
                if (!newData) {
                    this.searchOptions.startTime = '';
                    this.searchOptions.endTime = '';
                    this.dateTime = [];
                }
            },
            immediate: true, //在初始化实例时，会触发 handler调用
            deep: true, //当容器内部的元素发生更改时，会出发handler ，比如 list中第一个元素的name更改成 王二，会触发 handler调用
        },
    },
    methods: {
        spArr(arr, num) {
            //arr是你要分割的数组，num是以几个为一组
            let newArr = []; //首先创建一个新的空数组。用来存放分割好的数组
            for (let i = 0; i < arr.length; ) {
                //注意：这里与for循环不太一样的是，没有i++
                newArr.push(arr.slice(i, (i += num)));
            }
            return newArr;
        },
        initMap() {
            // let { orgType } = this.$baseMethod.getStore('roleOption');
            // if (orgType === 0) {
            //     this.btnDisabled = true;
            // } else {
            //     this.btnDisabled = false;
            // }
            let that = this;
            let clientH = `${document.documentElement.clientHeight}`;
            if (clientH) {
                this.mapHeight = parseInt(clientH) - 56;
            }
            window.onresize = () => {
                return (() => {
                    that.mapHeight = parseInt(`${document.documentElement.clientHeight}`) - 56;
                })();
            };
            this.map = new AMap.Map('map-content', {
                resizeEnable: true,
                zoom: 10,
                showIndoorMap: false,
                mapStyle: 'amap://styles/998f25903ebf671b4f4ea6c5645a5791',
                animateEnable: false,
            });
            if (this.userInfo.registerPoint && this.userInfo.registerPoint.lon && this.userInfo.registerPoint.lat) {
                // let defaultCenter = new AMap.LngLat(this.userInfo.registerPoint.lon, this.userInfo.registerPoint.lat);
                let defaultCenter = new AMap.LngLat(116.478935, 39.997761);
                this.map.setCenter(defaultCenter);
            }
            this.infoWindow = new AMap.InfoWindow();

            this.initButton();
            this.map.setFitView();

            this.$refs.mapElement.addEventListener('click', event => {
                if (this.infoWindow) this.infoWindow.close();
                if (event.target.className == 'togoDriver') {
                    this.goDriverDetail(event.target.id);
                }
                if (event.target.className == 'togoOrder') {
                    this.goOrderDetail(event.target.id, event.target.dataset);
                }
            });
            document.querySelector('#ws-watermark-background').style.display = 'none';
        },
        // 初始化按钮
        initButton() {
            let that = this;
            AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {
                if (!PathSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！');
                    return;
                }
                let arr = [];
                arr.push({ name: '', path: [] });
                that.initRoutesContainer(arr);
            });
        },
        // 暂停巡航
        pauseAnimation() {
            this.navgStatus = 'pause';
            this.polylineMarker.pauseMove();
        },
        // 继续巡航
        resumeAnimation() {
            this.navgStatus = 'moving';
            this.polylineMarker.resumeMove();
        },
        // 开始巡航
        startAnimation() {
            let that = this;
            that.navgStatus = 'moving';
            // 巡航的线路的样式
            let passedPolyline = new AMap.Polyline({
                map: this.map,
                strokeColor: '#29FF76',
                strokeWeight: 8, //线宽
                zIndex: 10,
            });
            // lastPoint- 终点经纬度，需要在外面处理数据，否则可能拿不到
            that.polylineMarker.on('moving', function (e) {
                let elng = e.passedPath[e.passedPath.length - 1].lng; // 巡航的经度是否到达最后一个点
                let elat = e.passedPath[e.passedPath.length - 1].lat; // 巡航的纬度是否到达最后一个点
                // 判断巡航的点是都到达终点，到达终点让按钮复原
                if (elng == that.lastPoint[0] && elat == that.lastPoint[1]) {
                    that.navgStatus = 'stop';
                }
                passedPolyline.setPath(e.passedPath);
            });
            // 设置巡航路线和速度，取全段路线
            that.polylineMarker.moveAlong(that.trailPointInfoVos, that.carSpeed);
        },
        setPolle(lineArr, defaultCenter, offLineDataPostion) {
            // 这里是画线路，整段线路，多段
            for (let i = lineArr.length - 1; i >= 0; i--) {
                let lineList = [];
                lineArr[i].forEach(item => {
                    lineList.push([item.lon, item.lat]);
                });
                let polyline1 = new AMap.Polyline({
                    map: this.map,
                    path: lineList, // 轨迹的坐标数组
                    strokeColor: '#7C9AFF',
                    strokeWeight: 8, //线宽
                    zIndex: 1,
                    borderWidth: 0,
                    bubble: true,
                    lineJoin: 'round',
                    lineCap: 'round',
                });
                this.map.add(polyline1);
            }
            // 这里是画离线的线路，多段
            offLineDataPostion.forEach(ele => {
                let offlineArr = [];
                ele.forEach(item => {
                    offlineArr.push([item.lon, item.lat]);
                });
                // 绘制离线
                let polyline2 = new AMap.Polyline({
                    map: this.map,
                    path: offlineArr, // 轨迹的坐标数组
                    strokeColor: '#ccc',
                    strokeWeight: 8, //线宽
                    zIndex: 2,
                    borderWidth: 0,
                    bubble: true,
                    strokeStyle: 'dashed',
                });
                this.map.add(polyline2);
            });

            // 这里是画小车的图标
            let imgUrl = require('../../../assets/images/orderMap/car.png');
            this.polylineMarker = new AMap.Marker({
                map: this.map,
                position: defaultCenter,
                offset: new AMap.Pixel(-85.5, -85.5),
                icon: new AMap.Icon({
                    size: new AMap.Size(171, 171),
                    image: imgUrl,
                    imageSize: new AMap.Size(171, 171),
                }),
                angle: -90,
                autoRotation: true,
                lineJoin: 'round',
                lineCap: 'round',
                bubble: true,
            });
            this.map.add(this.polylineMarker);
        },
        handleAllChange(e) {
            this.checkedColumnList = e ? this.columnList.flat(Infinity) : [];
            this.navgStatus = 'stop';
            // this.map.clearMap();
            // if (this.dataPostion.length) {
            //     this.createCircleMarker(this.dataPostion);
            //     this.setPolle(this.lineArr, this.defaultCenter, this.offLineDataPostion);
            // }
            this.getPoints();
        },
        handleCheckedChange(e) {
            // 筛选栏，这里是清楚地图重画，也可以选择让地图的点，气泡，图标消失的api-hide来做，但处理会复杂很多
            this.checkedColumnList = e;
            this.checked = this.checkedColumnList.length === this.columnList.flat(Infinity).length;
            this.navgStatus = 'stop';
            // this.map.clearMap();

            // if (this.dataPostion.length) {
            //     this.createCircleMarker(this.dataPostion);
            //     this.setPolle(this.lineArr, this.defaultCenter, this.offLineDataPostion);
            // }
            this.getPoints();
        },
        openDraw(item) {
            // 点击气泡显示浮窗数据
            this.orderMapPointInfoVo = item.orderMapPointInfoVo || {};
            // 判断这方向角，海拔，速度是否为null,undefined,空且不为0，则显示暂无，否则显示速度
            item.angle = this.isShowNA(item.angle);
            item.elevation = this.isShowNA(item.elevation);
            item.speed = this.isShowNA(item.speed);
            this.heartInfo = item || {};
            if (item.type === 2 || item.type === 3) {
                item.state = 'NA';
            }
            this.dialogDrawer = true;
        },
        storeClose() {
            this.dialogDrawer = false;
        },
        isShowNA(item) {
            if (!item && item != 0) {
                item = '暂无';
            }
            return item;
        },
        reset() {
            (this.searchOptions.driverId = ''),
                (this.searchOptions.startTime = ''),
                (this.searchOptions.endTime = ''),
                (this.searchOptions.phone = ''),
                (this.searchOptions.orderId = ''),
                (this.dateTime = []);
            this.dataPostion = [];
            this.lineArr = [];
            // this.getPoints();
            this.map.clearMap();
            this.navgStatus = 'stop';
            this.checked = false;
            this.lineArr = [];
            this.checkedColumnList = ['订单起点', '订单终点', '空闲中离线点', '开始计费点', '结束计费点'];
        },
        collapseChange(e) {
            this.activeName = e;
            if (this.activeName) {
                this.border = 'none';
                this.borderRadius = '4px';
            } else {
                this.border = '1px solid #979797 !important';
                this.borderRadius = '4px 4px 4px 4px';
                this.showSetBtn = false;
            }
        },
        getPoints() {
            let that = this,
                range = 2 * 24 * 3600 * 1000;
            that.map.clearMap();
            that.navgStatus = 'stop';
            this.lineArr = [];
            if (that.marker) {
                that.map.remove(that.marker);
            }

            if (that.markerObj.oneMarker) {
                that.map.remove(that.markerObj.oneMarker);
            }
            if (that.markerObj.siteNameMarker) {
                that.map.remove(that.markerObj.siteNameMarker);
            }
            if (that.markerObj.siteMarker) {
                that.map.remove(that.markerObj.siteMarker);
            }
            // if (window.pathSimplifierIns) {
            //     let arr = [];
            //     arr.push({ data: '', path: this.lineArr });
            //     // 清空makert
            //     that.createCircleMarker([]);
            //     that.pathSimplifierIns.setData(arr);
            //     that.initRoutesContainer(arr);
            // }
            if (!that.searchOptions.orderId) {
                if (that.searchOptions.phone && !that.dateTime.length) {
                    this.$message.error('请输入查询时间');
                    return false;
                }
                if (that.searchOptions.driverId && !that.dateTime.length) {
                    this.$message.error('请输入查询时间');
                    return false;
                }
                if (that.dateTime && that.dateTime.length) {
                    that.searchOptions.startTime = that.dateTime[0];
                    that.searchOptions.endTime = that.dateTime[1];
                    if (new Date(that.searchOptions.endTime).getTime() - new Date(that.searchOptions.startTime).getTime() > range) {
                        this.$message.error('最大可选择48小时范围');
                        return false;
                    }
                }
            }
            if (that.dateTime.length && !that.searchOptions.orderId) {
                if (!that.searchOptions.driverId && !that.searchOptions.phone) {
                    this.$message.error('请选择手机号码或车主ID');
                    return false;
                }
            }
            let reqData = {
                data: that.searchOptions,
                op: 'select',
            };

            const url = that.getModuleUrl('select');
            that.$axios(url, reqData).then(
                res => {
                    let resData = JSON.parse(res.data),
                        dataPostion = [];
                    if (!resData) {
                        return this.$message.error('查无数据');
                    }
                    // 整个路径
                    let trailPointInfoVos = resData.trailPointInfoVos || [];
                    this.trailPointInfoVos = trailPointInfoVos.map(item => {
                        return [item.lon, item.lat];
                    });
                    // 终点
                    this.lastPoint = this.trailPointInfoVos[this.trailPointInfoVos.length - 1];
                    //在线轨迹多段
                    let result = resData.TrailPointInfoVoList;
                    //打点点位信息
                    let resultPoint = resData.mapPointInfoVo;
                    // 离线点
                    let offLineTrailPointInfoVos = resData.offLineTrailPointInfoVos;

                    if (result && result.length) {
                        let defaultCenter = new AMap.LngLat(result[0][0].lon, result[0][0].lat);
                        that.map.setCenter(defaultCenter);
                        that.defaultCenter = defaultCenter;

                        let imgUrl = that.searchOptions.orderId ? require('../../../assets/images/orderMap/orderflag.png') : require('../../../assets/images/orderMap/timeflag.png');
                        // 订单起点，时间起点旗帜
                        that.marker = new AMap.Marker({
                            map: that.map,
                            position: defaultCenter,
                            icon: new AMap.Icon({
                                size: new AMap.Size(24, 24),
                                image: imgUrl,
                                imageSize: new AMap.Size(24, 24),
                            }),
                            offset: new AMap.Pixel(-3, -20),
                        });

                        that.lineArr = result;
                        if (resultPoint && resultPoint.length) {
                            resultPoint.forEach(item => {
                                dataPostion.push(item);
                            });
                        }

                        this.dataPostion = dataPostion;
                        that.offLineDataPostion = offLineTrailPointInfoVos;
                        // 画线路
                        that.setPolle(that.lineArr, defaultCenter, that.offLineDataPostion);
                        // 画气泡，圆点 图标
                        that.createCircleMarker(dataPostion);
                        this.map.setFitView();
                    } else {
                        this.$message.error('查无数据');
                    }
                },
                error => {
                    let arr = [];
                    arr.push({ name: '', path: this.lineArr });
                    that.createCircleMarker([]);
                }
            );
        },
        createCircleMarker(dataPostion) {
            let iconUrls = {
                2: require('../../../assets/images/orderMap/start.png'),
                3: require('../../../assets/images/orderMap/stop.png'),
            };
            let siteName = {
                0: '出车',
                1: '收车',
                2: '订单起点',
                3: '订单终点',
                4: '服务中离线点',
                5: '服务中在线点',
                6: '空闲中离线点',
                7: '空闲中在线点',
                8: '开始计费点',
                9: '结束计费点',
            };
            // 处理设置按钮
            let checkObj = {};
            let keyLisy = [];
            for (var key in siteName) {
                if (this.checkedColumnList.includes(siteName[key])) {
                    keyLisy.push(+key);
                    checkObj[key] = siteName[key];
                }
            }

            if (dataPostion.length) {
                dataPostion.forEach((item, index) => {
                    if (item.type || item.type === 0) {
                        if (keyLisy.includes(item.type)) {
                            // 打点图标
                            if (iconUrls[item.type]) {
                                this.markerObj.oneMarker = new AMap.Marker({
                                    map: this.map,
                                    icon: new AMap.Icon({
                                        size: new AMap.Size(30, 36),
                                        image: iconUrls[item.type],
                                        imageSize: new AMap.Size(30, 36),
                                    }),

                                    position: new AMap.LngLat(item.lon, item.lat),
                                    offset: new AMap.Pixel(-14, -46),
                                    autoRotation: true,
                                    zIndex: 100,
                                });
                                this.markerObj.oneMarker.setMap(this.map);
                            }
                            // 打点上方气泡
                            this.markerObj.siteNameMarker = new AMap.Marker({
                                map: this.map,
                                content: `<div style="width:150px;color: #fff; padding: 4px 16px; height: 28px; background: #516695; border: 1px solid #94A7D1;
                         border-radius: 18px; display: flex;align-items: center;justify-content: center;position:relative" >
                        <div> ${checkObj[item.type]}</div>
                        <div class="el-icon-arrow-right" style="margin-left:10px;color:#fff"></div>
                        <div class="arrow-border"></div>
                    </div>`,
                                position: new AMap.LngLat(item.lon, item.lat),
                                offset: iconUrls[item.type] ? new AMap.Pixel(-74, -83) : new AMap.Pixel(-75, -45),
                                autoRotation: true,
                            });
                            // 气泡点击
                            this.markerObj.siteNameMarker.on('click', e => {
                                this.openDraw(item);
                            });
                            this.markerObj.siteNameMarker.setMap(this.map);
                            // 打点圆圈
                            this.drokeRound(item);
                        }
                    }
                });
            }
        },
        drokeRound(item) {
            let colors = {
                0: '#CCCCCC',
                1: '#CCCCCC',
                2: '#0088FF',
                3: '#0088FF',
                4: '#17399E',
                5: '#0088FF',
                6: '#CCCCCC',
                7: '#2AC39B',
                8: '#2AC39B',
                9: '#2AC39B',
            };
            // 打点圆点位置
            let siteMarker = '';
            siteMarker = new AMap.CircleMarker({
                map: this.map,
                center: new AMap.LngLat(item.lon, item.lat),
                fillColor: '#fff',
                fillOpacity: 1,
                strokeColor: colors[item.type] || '#FFD700',
                strokeOpacity: 1,
                cursor: 'pointer',
                radius: 10,
                zIndex: 100,
                bubble: true,
            });
            siteMarker.setMap(this.map);
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },

        getNavg(pathIndex) {
            let that = this;
            if (!pathNavigs[pathIndex]) {
                //创建一个轨迹巡航器
                var navgtr = this.pathSimplifierIns.createPathNavigator(pathIndex, {
                    loop: false,
                    speed: parseInt($('#speedInp_' + pathIndex).val()),
                });

                var $msg = $('#routes-container')
                    .find('div.route-item[data-idx="' + pathIndex + '"]')
                    .find('.msg');
            }

            return pathNavigs[pathIndex];
        },

        initRoutesContainer(data) {
            let that = this;
            $('#routes-container').on('click', '.navigBtn', function () {
                var pathIndex = parseInt($(this).closest('.route-item').attr('data-idx'), 0);
                that.map.remove(that.marker);
                // that.map.remove(that.markerObj.oneMarker);

                // that.map.remove(that.markerObj.siteNameMarker);

                // that.map.remove(that.markerObj.siteMarker);
                var navg = that.getNavg(pathIndex);
                // navg[$(this).attr('data-act')]();
                // that.refreshNavgButtons();
            });
            if (!$('.navigBtn').length) {
                for (var i = 0, len = data.length; i < len; i++) {
                    that.initRouteItem(data[i], i);
                }
            }

            // that.refreshNavgButtons();
        },

        initRouteItem(pathData, idx) {
            let that = this;
            var $routeItem = $('<div class="route-item"></div>');
            $routeItem.attr('data-idx', idx);
            // for (var i = 0, len = this.navigBtnsConf.length; i < len; i++) {
            //     $('<button class="navigBtn" data-btnIdx="' + i + '" data-act="' + this.navigBtnsConf[i].action + '"></button>')
            //         .html(this.navigBtnsConf[i].name)
            //         .appendTo($routeItem);
            // }

            let $speedBox = $('<div class="speedBox"></div>').appendTo($routeItem);
            let speedRangeInput = $(
                '<input id="speedInp_' +
                    idx +
                    '" class="speedRange" style="width: 267px;border-radius: 2px;-webkit-appearance: none;height: 3px;background: #d8d8d8;" type="range" min="1000" max="100000" step="100" value="1000" />'
            ).appendTo($speedBox);

            let speedTxt = $('<div class="speedTxt">时速：1000km/h<div>').appendTo($speedBox);
            speedRangeInput.on('change', () => {
                let speed = parseInt(speedRangeInput.val(), 10);
                speedTxt.html('时速：' + speed + ' km/h');
                this.carSpeed = speed;

                // if (pathNavigs[idx]) {
                //     pathNavigs[idx].setSpeed(speed);
                // }
            });
            $speedBox.appendTo($routeItem);
            $routeItem.appendTo('#routes-container');
        },
    },
};
</script>

<style lang="scss">
@import '~@/assets/styles/mixin.scss';

.car-trajectory {
    padding: 0;
    position: absolute;
    top: 56px;
    right: 0;
    bottom: 0;
    left: 0;
    .arrow-border {
        // position: absolute;
        // width: 0;
        // height: 0;
        // border-width: 11px 7px 0;
        // border-style: solid;
        // border-color: #94a7d1 transparent transparent;
        // bottom: -10px;
        background-image: url('../../../assets/images/orderMap/arrow_down.png');
        background-repeat: no-repeat;
        background-position: bottom;
        // background-size: 14px 11px;
        width: 14px;
        height: 11px;
        position: absolute;
        bottom: -11px;
    }
    // .arrow-border::after {
    //     content: '';
    //     position: absolute;
    //     top: -10px;
    //     left: -5px;
    //     border-width: 10px 5px 0;
    //     border-style: solid;
    //     border-color: #516695 transparent transparent;
    // }
    .diabled-class {
        background: #f05259;
        font-weight: 500;
        color: #ffffff;
        border: none;
    }
    .drawerClass {
        background: rgba(32, 47, 82, 0.8);
        border-radius: 4px;
        width: 400px;
        height: 500px;
        overflow-y: auto;
        top: 32px;
        left: 42px;
        padding-bottom: 20px;
        .el-drawer__header {
            padding: 0;
            margin-bottom: 12px;
        }
    }
    .count-box::-webkit-scrollbar-corner,
    .count-box::-webkit-scrollbar-track,
    .el-drawer__body::-webkit-scrollbar-corner,
    .el-drawer__body::-webkit-scrollbar-track {
        /* 滚动条轨道 */
        background-color: rgba(32, 47, 82, 0.8) !important;
        box-shadow: none !important;
    }
    .count-box::-webkit-scrollbar,
    .el-drawer__body::-webkit-scrollbar {
        width: 8px !important;
        background-color: rgba(32, 47, 82, 0.8) !important;
    }
    .count-box::-webkit-scrollbar-thumb,
    .el-drawer__body::-webkit-scrollbar-thumb {
        /* 滚动条手柄 */
        background-color: #316cc6 !important;
    }
    .drawerBox {
        width: 100%;
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
                    margin-right: 20px;
                    display: inline-block;
                    text-align: left;
                }
                > span:last-child {
                    flex: 1;
                }
            }
        }
    }
    /deep/ .el-collapse-item__content {
        padding-bottom: 25px;
    }
    .search-box {
        // text-align: center;
        width: 100%;
        background: rgba(32, 47, 82, 0.8);
        border-radius: 4px;
        padding: 20px 16px;
        height: 288px;
        margin-top: 50px;

        .el-input {
            width: 280px;
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
        .el-date-editor .el-range-separator {
            width: 10px;
            padding: 0;
        }
        .el-range-editor .el-range-input {
            width: 75%;
        }
        .el-date-editor .el-range__close-icon {
            width: 0;
        }
    }

    #map-content {
        width: 100%;
        height: 100% !important;
        .amap-info-close {
            display: none;
        }
    }
    .clear-fix {
        &:after {
            content: '';
            display: inline-block;
            clear: both;
            visibility: hidden;
        }
    }
    .footer-left {
        margin-top: 16px;
        position: relative;
        .last-time {
            position: absolute;
            right: 20px;
            bottom: 10px;
        }
        dl {
            padding: 19px 26px 18px;
            background-color: #eff3f7;
            display: flex;
            align-items: center;

            .dt-title {
                text-align: right;
                float: left;
                margin-right: 12px;
                min-width: 112px;
            }
            dd {
                margin-right: 20px;
                float: left;
                padding: 45px 9px 0;
                cursor: pointer;
                color: #929292;
                &:last-child {
                    color: #0091ff;
                    margin-left: 11px;
                    padding-top: 0;
                }
            }
        }
    }

    .map-wrap {
        height: 100%;
        position: relative;
    }

    .count-box {
        position: absolute;
        right: 11px;
        top: 16px;
        .el-icon-arrow-right:before {
            content: '\E6E0';
        }
    }
    .car-trajectory /deep/ .el-switch__label.is-active {
        color: #303133;
    }
    .car-trajectory /deep/ .el-switch {
        height: auto;
        line-height: auto;
    }
    .set_box {
        width: 400px;
        background: rgba(32, 47, 82, 0.8);
        border-radius: 4px;

        padding: 20px 16px;
        position: absolute;
        top: 495px;
        z-index: 3;
        right: 0;
    }
    .el-checkbox__label {
        color: #fff !important;
    }
    #routes-container {
        background: rgba(32, 47, 82, 0.8);
        border-radius: 4px;

        padding: 20px 16px;
        position: absolute;
        top: 53px;
        z-index: 3;
        width: 100%;
        // border-bottom: none;
        .route-item .navigBtn {
            width: 88px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            margin-right: 2px;
            background: #f5f7fa;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
        }
        .route-item .navigBtn:first-child {
            border-radius: 5px 0px 0px 5px;
            color: #606266;
        }
        .route-item .navigBtn:nth-child(3) {
            border-radius: 0px 5px 5px 0px;
            margin-right: 0;
            color: #606266;
        }
        .speedTxt {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
        }
    }

    #loadingTip {
        z-index: 9999;
        left: 0;
        padding: 3px 10px;
        background: #fff;
        color: #fff;
        font-size: 13px;
    }

    .route-item {
        text-align: center;
        margin-top: 13px;
    }

    .route-item pre {
        margin: 0;
    }

    .hide {
        display: none;
    }

    .speedBox {
        padding: 5px 0;
    }

    .speedRange {
        vertical-align: middle;
        margin: 0;
        padding: 0;
        width: 100px;
    }

    input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;

        background: #f05259;
        border-radius: 4px;
        border: 2px solid #f05259;
    }
    .markerInfo {
        background: rgba(255, 255, 255, 0.7);
        padding: 2px 5px;
        border: 1px solid #ccc;
        white-space: nowrap;
    }
    .collapseMap {
        width: 400px;
        height: 46px;
        background: #ffffff;
        border-radius: 4px 4px 0px 0px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        border: none;
        position: relative;
        z-index: 2;
        .el-collapse-item__header {
            border-radius: 4px;
            padding: 20px 16px;
            font-size: 16px;
        }
        .el-collapse-item__wrap {
            position: absolute;
            top: 150px;
            border-radius: 0px 0px 4px 4px;
            border: none;
            border-top: none;
            // background: #252931;
            background: none;

            width: 100%;
        }
        .el-collapse-item {
            // padding: 16px 0;

            // div:last-child {
            //     margin-top: 10px;
            // }
        }
        .el-collapse-item__header.focusing:focus:not(:hover) {
            color: #333333;
        }
    }
    input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 16px;
        width: 16px;
        // margin-top: -3px; /*使滑块超出轨道部分的偏移量相等*/
        background: #ffffff;
        border-radius: 50%; /*外观设置为圆形*/
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    }
}
</style>
