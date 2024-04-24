<template>
    <div>
        <div class="block search-wrap" v-if="showSearch">
            <span class="label">
                <span style="color: #f05259" v-if="!disabled">*</span>
                选择围栏中心地址:
            </span>
            <div>
                <el-autocomplete
                    class="autocomplete"
                    v-if="!disabled"
                    v-model="keyWord"
                    placeholder="请输入地址"
                    :fetch-suggestions="searchByKey"
                    value-key="name"
                    :trigger-on-focus="false"
                    @select="selectedPoi"
                    clearable
                ></el-autocomplete>
                <span v-else style="display: inline-block">{{ keyWord }}</span>
            </div>
            <div class="serial_type" v-if="$route.query.type == 'add'">
                <el-radio-group v-if="!disabled" v-model="fenceType" size="medium" @change="handleCheckMap">
                    <el-radio-button :label="true">绘制面</el-radio-button>
                    <el-radio-button :label="false">绘制圆</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="map-container">
            <div id="container"></div>
            <div id="panel"></div>
            <div class="tool" v-if="showSearch">
                <button :class="{ toolBtn: true, isClick: markers.start }" :disabled="!fenceType || disabled" @click="handleFenceMap('markers')">
                    {{ markers.start ? '确认中心点' : '标记中心点' }}
                </button>
                <button class="toolBtn" :disabled="disabled" @click="handleFenceMap('clear')">清除围栏</button>
                <button class="toolBtn" @click="handleFenceMap('stop')">停止绘制</button>
                <button :class="{ toolBtn: true, isClick: polygons.start || circles.start }" @click="handleFenceMap('start')">开始绘制</button>
                <!-- <div @click="handleFenceMap('drawPolygon')">自定义绘制</div> -->
                <button class="toolBtn" @click="toggle()">{{ fullscreen ? '退出全屏' : '全屏地图' }}</button>
            </div>
            <div class="tool" v-else>
                <button class="toolBtn" @click="toggle()">{{ fullscreen ? '退出全屏' : '全屏地图' }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import fullscreen from '@/utils/fullscreen'; //全屏
export default {
    props: {
        cityCode: {
            type: Number | String,
        },
        marker: {
            type: Array,
            default: () => [],
        },
        //是否显示搜索框，也就是false为查看围栏，turn为围栏编辑管理
        showSearch: {
            type: Boolean,
            default: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        cityCode(val) {
            if (val) {
                this.initMap();
            }
        }
    },
    data() {
        return {
            address: {},
            keyWord: '',
            // map: null,
            // 绘制面参数
            polygons: {
                start: false, // 是否点击了开始绘制
                polygon: null,
                polyEditor: null,
                polyPath: [], // 电子围栏
                mouseTool: null,
            },
            // 绘制圆参数
            circles: {
                start: false, // 是否点击了开始绘制
                circle: null,
                circleEditor: null,
                circlePath: [],
                radius: 1000, // 半径
                mouseTool: null,
            },
            // 绘制中心点
            markers: {
                start: false,
            },
            startIcon: null, // 地图上的图标
            fenceType: true, // true绘制面 false绘制圆
            fullscreen: false, // 全屏
        };
    },
    mounted() {
        this.map = new AMap.Map('container', { zoom: 14,animateEnable: false, });
    },
    methods: {
        toggle() {
            fullscreen.toggle(document.querySelector('.map-container'), {
                wrap: false,
                callback: this.fullscreenChange,
            });
        },
        fullscreenChange(fullscreen) {
            this.fullscreen = fullscreen;
        },
        // 查看围栏
        viewFence(type = 'polygons', data) {
            if (type === 'polygons') {
                this.initMap(data[0]); //初始化地图
                this.polygons.polyPath = data; //赋值覆盖物参数
                this.drawPolygon(); //绘制
            } else if (type === 'circles') {
                this.initMap(data.path);
                this.circles.circlePath = data.path;
                this.circles.radius = data.radius;
                this.drawCircle(data.radius);
            }
        },
        // 设置默认电子围栏参数
        setAddres() {
            let { lng, lat } = this.address.location;
            if (this.fenceType) {
                // 绘制以location为中心的正方形
                // this.polygons.polyPath = this.centerPointGetFourPoint({lat, lng})
                // 调度系统默认以location为某一点的三角形 产品经理确认跟调度系统保持一致
                this.polygons.polyPath = [
                    [lng, lat],
                    [lng - 0.002, lat - 0.001],
                    [lng + 0.002, lat + 0.003],
                ];
            } else {
                this.circles.circlePath = [lng, lat];
                this.circles.radius = 1000;
            }
        },
        // 简单实现绘制正方形，side 正方形边长，单位米
        centerPointGetFourPoint({ lat, lng }, side = 3000) {
            const centerPoint = new AMap.LngLat(lng, lat);
            const upLeftPoint = centerPoint.offset(-side / 2, side / 2);
            const upRightPoint = centerPoint.offset(side / 2, side / 2);
            const leftBottomPoint = centerPoint.offset(-side / 2, -side / 2);
            const rightBottomPoint = centerPoint.offset(side / 2, -side / 2);
            return [
                [upLeftPoint.lng, upLeftPoint.lat],
                [upRightPoint.lng, upRightPoint.lat],
                [rightBottomPoint.lng, rightBottomPoint.lat],
                [leftBottomPoint.lng, leftBottomPoint.lat],
            ];
        },
        // 清除所有遮罩物
        clearMap() {
            if (Object.keys(this.address).length) {
                let { lng, lat } = this.address.location;
                this.map.clearMap();
                this.addMarker([{ lat, lon: lng }]);
            } else {
                this.map.clearMap();
            }
        },
        //切换绘制工具
        handleCheckMap() {
            this.polygons.polyPath = [];
            this.circles.circlePath = [];
            this.polygons.start = false;
            this.circles.start = false;
            this.markers.start = false;
            this.clearMap(); //清除覆盖物
        },
        // 清除围栏覆盖
        clearFence() {
            this.fenceType ? this.polygons.polygon && this.map.remove(this.polygons.polygon) : this.circles.circle && this.map.remove(this.circles.circle);
        },
        offMarker() {
            if (this.fenceType && this.polygons.polyPath.length != 0 && !this.polygons.polygon.contains([this.address.location.lng, this.address.location.lat])) {
                this.$message.error('围栏中心点未在围栏覆盖范围内');
                return;
            }
            if (this.markers.start) {
                this.markers.start = false;
                this.map.off('click', this.clickMarker);
            }
        },
        // 绘制围栏工具
        handleFenceMap(toolName) {
            switch (toolName) {
                case 'clear':
                    if (this.polygons.start || this.circles.start) {
                        this.stop();
                    }
                    this.polygons.start = false;
                    this.circles.start = false;
                    this.clearMap();
                    this.offMarker();
                    this.polygons.polyPath = [];
                    this.circles.circlePath = [];
                    break;
                case 'start':
                    if (!this.keyWord) {
                        return this.$message.error('请选择围栏中心位置');
                    }
                    this.clearMap();
                    this.offMarker();
                    this.fenceType ? this.drawPolygon() : this.drawCircle();
                    break;
                case 'stop':
                    this.stop();
                    this.offMarker();
                    break;
                case 'drawPolygon':
                    this.clearMap();
                    this.offMarker();
                    this.fenceType ? this.drawCustomizePolygon() : this.drawCustomizeCircle();
                    break;
                case 'markers':
                    if (!this.markers.start) {
                        if (this.polygons.start || this.circles.start) {
                            this.stop();
                        }
                        this.map.on('click', this.clickMarker);
                        this.markers.start = true;
                    } else {
                        this.offMarker();
                    }
                    break;
                default:
                    break;
            }
        },
        clickMarker(e) {
            // 创建标记marker
            let local = {
                lat: e.lnglat.lat,
                lng: e.lnglat.lng,
            };
            this.getPositionByLonLats(local);
        },
        drawCustomizePolygon() {
            let _this = this;
            this.polygons.start = true;
            this.polygons.mouseTool = new AMap.MouseTool(this.map);
            this.polygons.mouseTool.polygon({
                strokeColor: '#FF33FF',
                strokeOpacity: 1,
                strokeWeight: 6,
                strokeOpacity: 0.2,
                fillColor: '#1791fc',
                fillOpacity: 0.4,
                // 线样式还支持 'dashed'
                strokeStyle: 'solid',
                // strokeStyle是dashed时有效
                // strokeDasharray: [30,10],
            });
            this.polygons.mouseTool.on('draw', function (event) {
                // event.obj 为绘制出来的覆盖物对象
                // log.info('覆盖物对象绘制完成')
                _this.polyCustomizeProgress(event);
            });
        },
        polyCustomizeProgress(event) {
            let path = event.obj.getPath(); //event.target.Ce.path 这个路径居然会变
            let polyPath = [];
            for (let i = 0; i < path.length; i++) {
                polyPath.push([path[i]['lng'], path[i]['lat']]);
            }
            this.polygons.polyPath = polyPath;
            // 先清除地图所有覆盖物
            this.clearMap();
            this.drawPolygon();
        },
        drawCustomizeCircle() {
            let _this = this;
            this.circles.start = true;
            this.circles.mouseTool = new AMap.MouseTool(this.map);
            this.circles.mouseTool.circle({
                //同Circle的Option设置
                fillColor: '#00b0ff',
                strokeColor: '#80d8ff',
            });
            this.circles.mouseTool.on('draw', function (event) {
                // event.obj 为绘制出来的覆盖物对象
                // log.info('覆盖物对象绘制完成')
                _this.circleCustomizeProgress(event);
            });
        },
        // 保存自定义绘制圆的进度
        circleCustomizeProgress(event) {
            let circle = event.obj;
            let { lat, lng } = circle.getCenter();
            this.circles.radius = circle.getRadius();
            this.circles.circlePath = [lng, lat];
            this.clearMap();
            this.drawCircle();
        },
        stop() {
            // 点击停止绘制，调整页面数据为最新
            if (this.fenceType) {
                if (!this.polygons.polygon.contains([this.address.location.lng, this.address.location.lat])) {
                    this.$message.error('围栏中心点未在围栏覆盖范围内');
                    return;
                }
                if (this.polygons.polyEditor) {
                    if (!this.polygons.polyPath.length) {
                        return false;
                    }
                    this.polygons.polyEditor.close();
                    this.polygons.start = false;
                }
            } else {
                if (this.circles.circleEditor) {
                    if (!this.circles.circlePath.length) {
                        return false;
                    }
                    this.circles.circleEditor.close();
                    this.circles.start = false;
                }
            }
        },
        //绘制多边形
        drawPolygon() {
            if (!this.polygons.polyPath.length) {
                this.setAddres();
            }
            this.polygons.start = true;
            this.polygons.polygon = new AMap.Polygon({
                path: this.polygons.polyPath,
                strokeColor: '#F81814',
                strokeWeight: 4,
                strokeOpacity: 0.6,
                fillOpacity: 0.5,
                fillColor: '#FDC7C2',
                zIndex: 50,
                bubble: true,
            });
            this.map.add(this.polygons.polygon);
            // 缩放地图到合适的视野级别
            this.map.setFitView([this.polygons.polygon]);
            if (this.showSearch) {
                this.polygons.polyEditor = new AMap.PolyEditor(this.map, this.polygons.polygon);
                this.polygons.polyEditor.open();
                let _this = this;
                this.polygons.polyEditor.on('end', function (event) {
                    _this.polyProgress(event);
                });
                this.polygons.polyEditor.on('adjust', function (event) {
                    _this.polyProgress(event);
                });
                this.polygons.polygon.on('dragging', function (event) {
                    _this.$baseMethod.debounce(_this.polyProgress(event));
                });
            }
        },
        // 保存多边形的进度
        polyProgress(event) {
            let path = this.polygons.polygon.getPath(); //event.target.Ce.path 这个路径居然会变
            let polyPath = [];
            for (let i = 0; i < path.length; i++) {
                polyPath.push([path[i]['lng'], path[i]['lat']]);
            }
            this.polygons.polyPath = polyPath;
        },
        //绘制多圆
        drawCircle() {
            if (!this.circles.circlePath.length) {
                this.setAddres();
            }
            this.circles.start = true;
            this.circles.circle = new AMap.Circle({
                center: this.circles.circlePath,
                radius: this.circles.radius || 1000, //半径
                borderWeight: 3,
                strokeColor: '#F81814',
                strokeWeight: 4,
                strokeOpacity: 0.6,
                fillOpacity: 0.5,
                fillColor: '#FDC7C2',
                strokeStyle: 'dashed',
                strokeDasharray: [10, 10],
                zIndex: 50,
            });
            this.map.add(this.circles.circle);
            // 缩放地图到合适的视野级别
            this.map.setFitView([this.circles.circle]);
            if (this.showSearch) {
                this.circles.circleEditor = new AMap.CircleEditor(this.map, this.circles.circle);
                this.circles.circleEditor.open();
                let _this = this;
                this.circles.circleEditor.on('adjust', function (event) {
                    _this.circleProgress(event);
                });
                this.circles.circleEditor.on('end', function (event) {
                    _this.circleProgress(event);
                });
                this.circles.circleEditor.on('move', function (event) {
                    if (_this.disabled) {
                        _this.$message.warning('编辑状态下圆形围栏圆心不可修改');
                        _this.circles.circle.setCenter(_this.circles.circlePath);
                        return;
                    } else {
                        _this.$baseMethod.debounce(_this.circleProgress(event));
                    }
                });
            }
        },
        // 保存绘制圆的进度
        circleProgress(event) {
            let circle = this.circles.circle;
            let { lat, lng } = circle.getCenter();
            this.circles.radius = circle.getRadius();
            this.circles.circlePath = [lng, lat];
        },
        // 选择
        selectedPoi(val) {
            let { lng, lat } = val.location;
            // 先清除地图所有覆盖物
            this.map.clearMap();
            let position = new AMap.LngLat(lng, lat);
            // 切换地图中心为选中的位置
            this.map.setZoomAndCenter(14, position);
            // 创建标记marker
            this.addMarker([{ lat, lon: lng }]);
            this.address = val;
            this.polygons.polyPath = [];
            this.circles.circlePath = [];
        },
        // 创建标记marker
        addMarker(marker = []) {
            let startIcon;
            // 创建之前先删掉标记
            this.startIcon && this.map.remove(this.startIcon);
            // 创建一个 Icon
            new AMap.Icon({
                // 图标尺寸
                size: new AMap.Size(53, 68),
                // 图标的取图地址
                image: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
                // 图标所用图片大小
                imageSize: new AMap.Size(53, 68),
            });
            if (marker.length) {
                marker.map(({ lat, lon }) => {
                    let position = new AMap.LngLat(lon, lat);
                    startIcon = new AMap.Marker({
                        map: this.map,
                        position,
                        icon: startIcon,
                        autoRotation: true,
                        offset: new AMap.Pixel(0, 0),
                        anchor: 'bottom-center', // 设置锚点方位
                    });
                    this.startIcon = startIcon;
                });
                this.map.setFitView();
            }
        },
        // 地图初始化
        initMap(center = []) {
            // 实例化地图
            // if (!this.map) {
            //     this.map = new AMap.Map('container', { zoom: 14 });
            // }
            if (center.length) {
                this.map.center = center;
            } else {
                let adcode = [110103, 110104].indexOf(this.cityCode) >= 0 ? 110102 : this.cityCode;
                this.map.setCity(adcode);
            }
            if (this.marker.length) {
                this.addMarker(this.marker);
            }
        },
        // 点击停止绘制时，更新地图以及输入框数据
        getPositionByLonLats(lnglat) {
            let _this = this;
            let lnglatXY = [lnglat.lng, lnglat.lat];
            new AMap.plugin('AMap.Geocoder', function () {
                // 回调函数
                let geocoder = new AMap.Geocoder({});
                geocoder.getAddress(lnglatXY, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        let res = result.regeocode;
                        let name = res.formattedAddress;
                        _this.address = {
                            location: {
                                ...lnglat,
                            },
                            name,
                        };
                        _this.keyWord = name;
                        if (!_this.disabled) {
                            _this.$emit('reset', res.addressComponent.adcode);
                        }
                        let { lng, lat } = lnglat;
                        _this.addMarker([{ lat, lon: lng }]);
                    } else {
                    }
                });
            });
        },
        // 关键字查询
        searchByKey(val, cb) {
            // 处理选择市辖区
            let cityCode = this.cityCode.toString();
            if (cityCode.slice(4, 6) == '01') {
                cityCode = cityCode.slice(0, 4) + '00';
            }
            AMap.plugin(['AMap.PlaceSearch'], () => {
                let placeSearchOptions = {
                    //设置PlaceSearch属性
                    citylimit: true,
                    city: cityCode, //城市
                    // type: "150000", //数据类别 POI类型 150000交通设施服务
                    pageSize: 30, //每页结果数,默认30
                    pageIndex: 1, //请求页码，默认1
                    extensions: 'all', //返回信息详略，默认为base（基本信息）
                };
                let placeSearch = new AMap.PlaceSearch(placeSearchOptions); //构造地点查询类
                placeSearch.search(val, (status, res) => {
                    if (status === 'complete') {
                        let { poiList = {}, info } = res || {};
                        let { pois = [] } = poiList;
                        pois = pois.filter(({ adcode, name, location }) => {
                            // 处理选择市辖区
                            if (this.cityCode.toString().slice(4, 6) == '01') {
                                return adcode.includes(cityCode.slice(0, 4)) && name && location;
                            } else {
                                return adcode == cityCode && name && location;
                            }
                        });
                        cb(pois);
                    } else {
                        cb([]);
                    }
                });
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.map-container {
    position: relative;
}

#container {
    width: 100%;
    min-height: 500px;
    height: 100%;
}

.search-wrap {
    margin-bottom: 10px;
    // margin-top: 15px !important;
    display: flex;
    align-items: center;
    .label {
        margin-right: 15px;
    }
    .el-autocomplete {
        flex: 1;
        margin-right: 20px;
    }
    /deep/ .el-input__inner {
        width: 473px !important;
    }
    .autocomplete {
        width: 473px !important;
    }
    .check-map {
        margin: 30px 0 30px 50px;
        & div {
            display: inline-block;
            height: 30px;
            line-height: 30px;
            background: #ffffff;
            border: 1px solid #02a7f0;
            margin: 5px;
            padding: 0 5px;
            text-align: center;
            color: #000000;
            width: 100px;
            cursor: pointer;
        }
        .div_select {
            background: #02a7f0;
            color: #ffffff;
        }
    }
}
.tool {
    position: absolute;
    right: 5px;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    .toolBtn {
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        background: #f05259;
        margin: 5px;
        padding: 0 10px;
        text-align: center;
        color: #ffffff;
        border-radius: 5px;
    }
    .toolBtn:disabled {
        background: #c6c6c6;
    }
    .toolBtn.isClick {
        transform: scale(0.9);
    }
}
.address {
    width: 300px;
}
.serial_type {
    margin-left: 10px;
}
</style>
