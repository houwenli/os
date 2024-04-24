<template>
    <div class="dispatch-map">
        <div class="searchbox">
            <div class="form">
                <label class="label">订单筛选条件</label>
                <el-select v-model="searchOptions.orderStatus" placeholder="全部订单">
                    <el-option v-for="item in orderOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="searchOptions.timeType" placeholder="请选择日期">
                    <el-option v-for="item in timeTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <template v-if="searchOptions.timeType">
                    <!-- <el-date-picker v-model="date" type="date" :picker-options="pickerOptions" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :clearable="false"></el-date-picker> -->
                    <el-time-select
                        placeholder="开始时间"
                        v-model="searchOptions.startTime"
                        :picker-options="{
                            start: '00:00',
                            step: '01:00',
                            end: searchOptions.endTime ? searchOptions.endTime : '23:00',
                            maxTime: searchOptions.endTime,
                        }"
                    ></el-time-select>
                    <el-time-select
                        placeholder="结束时间"
                        v-model="searchOptions.endTime"
                        :picker-options="{
                            start: searchOptions.startTime ? searchOptions.startTime : '01:00',
                            step: '01:00',
                            end: '24:00',
                            minTime: searchOptions.startTime,
                        }"
                    ></el-time-select>
                </template>
                <el-select v-else v-model="searchOptions.fixedTime" clearable placeholder="自定义时间段">
                    <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input v-model.number.trim="searchOptions.min" placeholder="请输入订单数量域值"></el-input>
                <div class="btn-box">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="table-column-header-button" @click="reset" icon="el-icon-refresh-left">重置</el-button>
                    </ws-throttle>
                    <el-button style="margin-left: 10px" @click="goBack">返回</el-button>
                </div>
            </div>
        </div>
        <div class="map-content" style="height: 100%; width: 100%" id="map-content" ref="mapElement">
            <push-panel ref="pushPanel" :centerPoint.sync="centerPoint" :selectOptions="selectOptions" @push="getDriverCount"></push-panel>
            <div class="legend">
                <ul>
                    <li v-for="(item, i) in colors" :key="item" :style="{ background: item }">{{ legendNum[i] }}</li>
                </ul>
            </div>
        </div>
        <push-dialog v-if="dialogVisible" v-model="dialogVisible" :info="modalInfo" @confirm="confirmPush"></push-dialog>
    </div>
</template>

<script>
import PushPanel from '../components/push-panel';
import PushDialog from '../components/push-dialog';
import loadScript from '@/utils/loadScript';
import axios from 'axios';
const locaUrl = '//webapi.amap.com/loca?v=1.3.2&key=e12e6e76d6c6362c02efe99c2d9c4c5c';
let infoWin;
let infoWinData;
const extraCity = [110000, 120000, 310000, 500000]; // 直辖市
export default {
    name: 'cityMap',
    components: {
        PushPanel,
        PushDialog,
    },
    data() {
        return {
            dialogVisible: false,
            modalInfo: {}, // 确认弹窗数量
            legendNum: [5, 15, 30, 50, '∞'],
            colors: ['#4343EB', '#66FDB4', '#FCD030', '#FF8933', '#FC5832'],
            timePickerOptions: {
                start: '00:00',
                step: '01:00',
                end: '24:00',
            },
            date: this.$baseMethod.formatData(new Date(), 'yyyy-MM-dd'),
            orderOptions: [
                {
                    value: -1,
                    label: '全部订单',
                },
                {
                    value: 0,
                    label: '未接单数量',
                },
                {
                    value: 1,
                    label: '已接单数量',
                },
            ],
            timeTypeOptions: [
                {
                    value: 0,
                    label: '实时',
                    date: this.$baseMethod.formatData(new Date(), 'yyyy-MM-dd'),
                },
                {
                    value: 1,
                    label: '昨天',
                    date: this.$baseMethod.getBeforeDay(-1, 'yyyy-MM-dd'),
                },
                {
                    value: 3,
                    label: '前天',
                    date: this.$baseMethod.getBeforeDay(-2, 'yyyy-MM-dd'),
                },
            ],
            timeOptions: [
                {
                    value: 5,
                    label: '5分钟内',
                },
                {
                    value: 10,
                    label: '10分钟内',
                },
                {
                    value: 30,
                    label: '30分钟内',
                },
                {
                    value: 60,
                    label: '1小时内',
                },
                {
                    value: 120,
                    label: '2小时内',
                },
            ],
            searchOptions: {
                orderStatus: -1,
                timeType: 0,
                startTime: '',
                endTime: '',
                fixedTime: 60,
                min: 10,
            },
            showText: false,
            radius: 400, // 蜂窝半径
            centerPoint: {}, // 选中的蜂窝中心点数据
            selectOptions: [], // 机构权限数据
            op: {
                getOrderHexagon: 'getOrderHexagon',
                orgInfo: 'selectOptions',
                getHoneyCombRadius: 'getHoneyCombRadius', // 蜂窝配置
                driverCount: 'driverCount', // 司机数量
                driverPush: 'driverPush',
            },
            moduleName: '/workbench/orderMap/dispatch',
        };
    },
    computed: {
        cityCode() {
            let { adcode } = this.$route.query;
            return +adcode;
        },
    },
    watch: {
        showText(val) {
            // 切换文字图层
            try {
                // 无数据时蜂窝图层方法调用报错
                if (val) {
                    this.textLayer.show();
                    this.layer.hide();
                } else {
                    this.textLayer.hide();
                    this.layer.show();
                }
            } catch (error) {}
        },
    },
    created() {
        this.getOrgData();
    },
    async mounted() {
        this.initMap();
        // 加载loca sdk
        await loadScript(locaUrl);
        let { features } = await this.getGeoJson(this.cityCode);
        // 获取蜂窝半径
        try {
            await this.getHoneyCombRadius();
        } catch (e) {}
        // 创建城市底图
        this.createPolygonLayer(features);
        // 创建蜂窝图层
        this.createHexagonLayer();
        // 创建带文字的蜂窝图层
        this.createTextHexagonLayer();
        this.search();
        features = null;
    },
    beforeDestroy() {
        window.__onInfowindowClick = undefined;
        infoWin?.off('close', this.onInfoWinClose);
        this.textLayer?.off('click', this.onHexagonClick);
        this.layer?.off('click', this.onHexagonClick);
        this.map?.off('zoomchange', this.onZoomChange);
        this.myDestroy();
    },
    methods: {
        initMap() {
            window.__onInfowindowClick = this.add;
            let { center } = this.$route.query;
            this.map = new AMap.Map('map-content', {
                zoom: 12,
                resizeEnable: true,
                viewMode: '3D', // Loca 自 1.2.0 起 viewMode 模式默认为 3D，如需 2D 模式，请显示配置。
                center,
                mapStyle: 'amap://styles/b265c2b3c5dc85d44e1fcedeac037ead',
                // features: ['bg', 'road'],
                zooms: [6, 14], //地图显示的缩放级别范围
                // skyColor: '#eee'
                // pitch: 60
            });
        },
        disabledDate(time) {
            return time.getTime() > new Date();
        },
        async confirmPush() {
            this.loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            let { areaCode } = this.centerPoint;
            let { lng, lat } = this.modalInfo;
            let appParams = {
                ...this.currentSearchOptions,
                lng,
                lat,
                areaCode,
            };
            let reqData = {
                data: {
                    ...this.modalInfo,
                    params: JSON.stringify(appParams),
                },
                op: this.op.driverPush,
            };
            try {
                let res = await this.$axios(this.getModuleUrl(reqData.op), reqData);
                this.loading.close();
                let data = JSON.parse(res.data);
                if (data.anwserCode.code === 113) {
                    this.dialogVisible = false;
                    this.$message.error(data.anwserCode.message);
                    return;
                }
                if (data.count) {
                    this.dialogVisible = false;
                    this.$message.success('推送成功');
                    // 推送成功,清空面板
                    this.$refs.pushPanel.reset();
                } else {
                    this.$message.error('未查找到司机，发送失败');
                }
            } catch (error) {
                this.loading.close();
            }
        },
        // 获取推送司机数量
        async getDriverCount(data) {
            this.loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: '.map-content',
            });
            let reqData = {
                data,
                op: this.op.driverCount,
            };
            try {
                let res = await this.$axios(this.getModuleUrl(reqData.op), reqData);
                let { count } = JSON.parse(res.data);
                this.dialogVisible = true;
                this.modalInfo = {
                    ...data,
                    driverCount: count,
                };
            } catch (error) {}
            this.loading.close();
        },
        // 获取机构信息
        async getOrgData() {
            let reqData = {
                data: { cityCode: this.cityCode },
                op: this.op.orgInfo,
            };
            let url = this.getModuleUrl(this.op.orgInfo);
            let res = await this.$axios(url, reqData);
            let resData = JSON.parse(res.data);
            this.selectOptions = resData || [];
        },
        // 获取蜂窝图配置
        async getHoneyCombRadius() {
            let reqData = {
                data: { cityCode: this.cityCode },
                op: this.op.getHoneyCombRadius,
            };
            let url = this.getModuleUrl(this.op.getHoneyCombRadius);
            let res = await this.$axios(url, reqData);
            let radius = JSON.parse(res.data);
            this.radius = parseInt(radius / 2);
        },
        setOptions(layer, showText = false) {
            let colors = ['#4343EB', '#66FDB4', '#FCD030', '#FF8933', '#FC5832'];
            let options = {
                mode: 'count', // 聚合模式，可选值: sum(值求和)、max(最大值)、min(最小值)、mean(平均值)、median(中位数)、count(个数)
                unit: 'meter',
                style: {
                    color: value => {
                        if (value.count < this.searchOptions.min) {
                            return 'rgba(14, 28, 75, 0.556)';
                        } else if (value.count < 5) {
                            return colors[0];
                        } else if (value.count < 15) {
                            return colors[1];
                        } else if (value.count < 30) {
                            return colors[2];
                        } else if (value.count < 50) {
                            return colors[3];
                        } else {
                            return colors[4];
                        }
                    },
                    radius: this.radius, // 分箱距离/米
                    opacity: 0.9,
                    gap: 10, // 分箱间隔/米
                    // height: [0, 0]
                },
                // 选中的样式
                // selectStyle: {
                //     color: '#be3ecc'
                // }
            };
            if (showText) {
                options.style.text = {
                    content: v => {
                        return v.value.count >= this.searchOptions.min ? v.value.count : '';
                    },
                    direction: 'center', // 文字方位
                    //offset: [2, -5],  // 偏移大小
                    fontSize: 12, // 文字大小
                    // fillColor: '#03101F',
                    fillColor: '#fff',
                    strokeColor: 'rgba(255,255,255,0)', // 文字描边颜色
                    strokeWidth: 0, // 文字描边宽度
                };
            }
            layer.setOptions(options);
            // render && layer.render();
        },
        // 绘制城市区域
        async createPolygonLayer(data) {
            let cityGeo = data.map(res => {
                return {
                    name: res.properties.name,
                    center: res.properties.center,
                    coordinates: res.geometry.coordinates.flat(),
                    adcode: res.properties.adcode,
                };
            });
            this.districtLayer = new Loca.PolygonLayer({
                fitView: true,
                map: this.map,
                zIndex: 300,
            });
            this.districtLayer.setData(cityGeo, {
                lnglat: 'coordinates',
            });
            this.districtLayer.setOptions({
                style: {
                    color: 'rgba(14, 28, 75, 0.5)',
                    // opacity: 0.5,
                },
            });
            this.districtLayer.render();
            cityGeo = null;
        },
        // 蜂窝图层 https://lbs.amap.com/api/loca-api/guide/hexagon
        createHexagonLayer() {
            this.layer = new Loca.HexagonLayer({
                map: this.map,
                zIndex: 200,
                // fitView: true,
                eventSupport: true, // 开启图层事件
            });
            // 设置蜂窝样式
            this.setOptions(this.layer);
            // this.layer.on('click', this.onHexagonClick);
        },
        // 带文字的图层
        createTextHexagonLayer() {
            this.textLayer = new Loca.HexagonLayer({
                map: this.map,
                // fitView: true,
                visible: false,
                eventSupport: true, // 开启图层事件
                zIndex: 200,
            });
            // 设置蜂窝样式
            this.setOptions(this.textLayer, true);
            this.textLayer.on('click', this.onHexagonClick);
        },
        // 渲染蜂窝图层
        renderHexagonLayer(heatmapData) {
            // this.layer.setData(heatmapData, {
            //     lnglat: (v) => {
            //         let {lat,lon} = v.value
            //         return [lon,lat]
            //     },
            //     value: 'lat',
            //     type: 'tsv', // 默认json格式
            // });
            // this.textLayer.setData(heatmapData, {
            //     lnglat: (v) => {
            //         let {lat,lon} = v.value
            //         return [lon,lat]
            //     },
            //     value: 'lat',
            //     type: 'tsv', // 默认json格式
            // });
            this.layer.setData(heatmapData, {
                lnglat: 'lnglat',
                value: 'count',
                type: 'json', // 默认json格式
            });
            this.textLayer.setData(heatmapData, {
                lnglat: 'lnglat',
                value: 'count',
                type: 'json', // 默认json格式
            });
            this.textLayer.render();
            this.layer.render();
            this.loading.close();
            this.fitview();
            heatmapData = null;
            this.map.on('zoomchange', this.zoomchange);
        },
        zoomchange() {
            let zoom = this.map.getZoom();
            // 缩放层级大于12显示数字
            this.showText = zoom >= 11.5;
        },
        goBack() {
            this.$router.push({ path: this.moduleName });
        },
        reset() {
            this.searchOptions = {
                orderStatus: -1,
                timeType: 0,
                startTime: '',
                endTime: '',
                fixedTime: 60,
                min: 10,
            };
            this.search();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        fitview() {
            this.map.setFitView(null, false, [60, 60, 60, 60], 13);
        },
        search() {
            // 清空面板数据
            this.centerPoint = {};
            infoWin?.close();
            this.getOrderPoints();
        },
        // 蜂窝点击事件
        async onHexagonClick(event) {
            try {
                let res = await this.geocoder(event.lngLat);
                console.log('蜂窝中心点', res);
                // 边界条件处理，蜂窝中心不在该城市时不显示添加弹窗
                let { district, city, adcode } = res.addressComponent;
                let enterCode = +this.$route.query.adcode;
                let showModal = false;
                if (extraCity.includes(enterCode)) {
                    // 直辖市
                    showModal = parseInt(parseInt(+res.addressComponent.adcode / 1000) * 1000) === enterCode;
                } else {
                    showModal = enterCode === +adcode || this.$route.query.city.indexOf(city || district) === 0;
                }
                if (showModal) {
                    this.openInfoWin(event, res);
                } else {
                    this.$message.error(`该热区定位点中心不在${this.$route.query.city}`);
                }
            } catch (error) {}
        },
        // 地图消息弹窗
        openInfoWin(event, { formattedAddress, addressComponent: { adcode } }) {
            if (event.value < this.searchOptions.min) return;
            if (!infoWin) {
                infoWin = new AMap.InfoWindow({
                    autoMove: false,
                    // isCustom: true, //使用自定义窗体
                    offset: new AMap.Pixel(0, 0),
                    closeWhenClickMap: true, // 控制是否在鼠标点击地图后关闭信息窗体，默认false，鼠标点击地图后不关闭信息窗体
                });
                infoWin.on('close', this.onInfoWinClose);
            }
            infoWinData = {
                lngLat: event.lngLat,
                address: formattedAddress,
                areaCode: +adcode,
            };
            let trStr = `<div class="infowindow">
                <div class="address">${formattedAddress}</div>
                <div class="btn">
                    <button class="el-button el-button--primary el-button--medium" onclick="__onInfowindowClick(event)">添加</button>
                </div>
            </div>`;
            infoWin.setContent(trStr);
            infoWin.open(this.map, event.lngLat);
        },
        // 弹窗关闭回调
        onInfoWinClose() {
            infoWinData = null;
        },
        add(event) {
            // fix事件穿透，点击信息窗体的添加按钮可能会触发蜂窝的点击事件
            event.stopPropagation();
            this.centerPoint = infoWinData;
            infoWin?.close();
        },
        formatDate(time, suffix = ':00') {
            let { date } = this.timeTypeOptions.find(item => item.value === this.searchOptions.timeType);
            return date + ' ' + time + suffix;
        },
        // 获取订单数据
        async getOrderPoints() {
            let { orderStatus, timeType, fixedTime, startTime, endTime, min } = this.searchOptions;
            let searchOptions = {
                orderStatus,
                timeType,
                cityCode: this.cityCode,
            };
            if (timeType) {
                if (!startTime || !endTime) {
                    this.$message.error('请选择查询时间');
                    return;
                }
                searchOptions.startTime = this.formatDate(startTime);
                searchOptions.endTime = this.formatDate(endTime);
            } else {
                searchOptions.fixedTime = fixedTime;
            }
            let searchDate = this.$baseMethod.formatData(new Date());
            // 保存查询参数,app查询参数
            this.currentSearchOptions = {
                pushloctime: '热区定位：' + searchDate,
                pushordertips: '系统检测到该地区附近订单较多，您可点击导航前往接单',
                cityCode: this.cityCode,
                timeType,
                frompush: 1, //app用来判断是否推送数据
            };
            if (!timeType) {
                // 实时
                this.currentSearchOptions = {
                    ...this.currentSearchOptions,
                    fixedTime,
                    searchDate,
                    pushtimetitle: this.timeOptions.find(item => item.value == fixedTime).label,
                };
            } else {
                this.currentSearchOptions = {
                    ...this.currentSearchOptions,
                    startTime,
                    endTime,
                };
            }
            let data = {
                data: JSON.stringify(searchOptions),
                op: this.op.getOrderHexagon,
            };
            // DEMO
            // let tsvData = await axios.get('http://172.16.4.97:1024/city_location.csv?t=' + new Date().getTime());
            // this.renderHexagonLayer(tsvData.data);
            let url = this.getModuleUrl(this.op.getOrderHexagon);
            let heatmapData = [];
            try {
                this.loading = this.$loading({
                    lock: true,
                    text: '加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: '.map-content',
                });
                let res = await this.$axios(url, data, { timeout: 30000 });
                let orderList = JSON.parse(res.data);
                console.log(orderList);
                if (orderList.length) {
                    heatmapData = orderList.reduce((pre, next) => {
                        let { startLat, startLon } = next;
                        if (startLat && startLon) {
                            pre.push({
                                count: 1,
                                lnglat: [startLon, startLat],
                            });
                        }
                        return pre;
                    }, []);
                } else {
                    this.loading.close();
                }
            } catch (error) {
                this.loading.close();
            }
            this.renderHexagonLayer(heatmapData);
            // 渲染蜂窝数据
        },
        geocoder(lnglat) {
            return new Promise((resolve, reject) => {
                AMap.plugin('AMap.Geocoder', () => {
                    let geocoder = new AMap.Geocoder({
                        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                        city: this.cityCode,
                        // extensions: 'all',
                    });
                    geocoder.getAddress(lnglat, (status, result) => {
                        if (status === 'complete' && result.info === 'OK') {
                            // result为对应的地理位置详细信息
                            resolve(result.regeocode);
                        } else {
                            reject(result);
                        }
                    });
                });
            });
        },
        // 逆地理编码
        getGeoJson(adcode, childAdcode = '') {
            let name = '';
            return new Promise((resolve, reject) => {
                function insideFun(adcode, childAdcode) {
                    AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
                        let districtExplorer = new DistrictExplorer();
                        districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
                            if (error) {
                                reject(error);
                                return;
                            }
                            let Json = areaNode.getSubFeatures();
                            if (Json.length === 0) {
                                let parent = areaNode._data.geoData.parent.properties.acroutes;
                                name = areaNode.getName();
                                insideFun(parent[parent.length - 1], adcode);
                                return;
                            }

                            if (childAdcode) {
                                // 东莞、台湾问题处理
                                // Json = [areaNode.getSubFeatureByAdcode(childAdcode)]
                                Json = Json.filter(item => {
                                    return item.properties.adcode === childAdcode;
                                });
                            }
                            let mapJson = {
                                features: Json,
                                name: name || areaNode.getName(),
                            };
                            Json = null;
                            areaNode = null;
                            resolve(mapJson);
                        });
                    });
                }
                insideFun(adcode, childAdcode);
            });
        },
        myDestroy() {
            try {
                this.districtLayer.setMap(null);
                this.layer.setMap(null);
                this.textLayer.setMap(null);
            } catch (error) {}
            this.centerPoint = {};
            this.textLayer = null;
            this.layer = null;
            this.districtLayer = null;
            this.map.destroy();
            this.map = null;
        },
    },
};
</script>

<style scoped lang="scss">
.dispatch-map {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    #map-content {
        position: relative;
        width: 100%;
        // height: 100%;
        flex: 1;
        border-radius: 0 0 8px 8px;
    }
    // 地图窗体样式
    ::v-deep {
        .amap-logo {
            display: none !important;
        }
        .noSelect {
            visibility: hidden;
        }
        .amap-scale-text {
            color: #fff !important;
        }
        .amap-logo {
            display: none !important;
        }
        .amap-info-content {
            .infowindow {
                display: flex;
                align-items: center;
                padding: 10px 0 0;
                background: #fff;
                border-radius: 8px;
            }
            .btn {
                margin: 0 12px;
            }
            .amap-info-close {
                right: 10px !important;
            }
        }
    }
    .searchbox {
        background: #fff;
        .form {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            padding: 0 24px 12px;
            border-radius: 8px 8px 0 0;
            color: #333333;
            background: #f5f7fa;
            .label {
                margin-right: 10px;
                margin-top: 12px;
            }
        }
        .time-picker {
            margin-right: 12px;
            margin-top: 12px;
        }
        ::v-deep {
            .ws-daterange {
                margin-right: 12px;
                margin-top: 12px;
            }
            .el-input {
                width: 180px;
                margin-right: 12px;
                margin-top: 12px;
            }
        }
        .btn-box {
            margin-top: 12px;
        }
    }
    .legend {
        position: absolute;
        bottom: 8px;
        right: 8px;
        z-index: 1000;
        ul {
            display: flex;
            li {
                width: 40px;
                height: 20px;
                text-align: right;
                color: #fff;
            }
        }
    }
}
</style>
