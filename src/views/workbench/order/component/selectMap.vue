<template>
    <div>
        <el-dialog title="获取定位" :visible.sync="dialogVisible" @close="handleClose" custom-class="map-dialog" width="50%" :close-on-click-modal="false">
            <div class="search-wrap">
                <el-autocomplete
                    class="autocomplete"
                    v-model="keyWord"
                    :placeholder="placeholderTxt"
                    :fetch-suggestions="searchByKey"
                    value-key="name"
                    :trigger-on-focus="false"
                    @select="selectedPoi"
                    clearable
                    @clear="clearSearch"
                ></el-autocomplete>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
            <div id="container"></div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        cityCode: {
            type: Number | String
        },
        placeholderTxt: {
            type: String
        },
        // 围栏数据
        fenceData: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            dialogVisible: false,
            selectedObj: {},
            keyWord: '',
            // map: null,
            defaultCenter: null,
            $marker: null,
            $circle: null,
            $polygon: null
        };
    },
    watch: {
        show(val) {
            if (val) {
                this.dialogVisible = true;
                this.$nextTick(function () {
                    this.initMap();
                });
            } else {
                this.dialogVisible = false;
            }
        }
    },
    mounted() {},
    computed: {
        polygonPoints() {
            return this.fenceData.polygonPoints.map(item => {
                return [item.lon, item.lat];
            });
        }
    },
    methods: {
        // 选择
        selectedPoi(val) {
            // 先清除地图所有覆盖物
            if (this.fenceData) {
                if (!this.calcRange(val.location)) {
                    return;
                }
                this.map.remove(this.$marker);
            } else {
                this.map.clearMap();
            }

            let { lng, lat } = val.location;

            let position = new AMap.LngLat(lng, lat);
            // 切换地图中心为选中的位置
            this.map.setZoomAndCenter(14, position);
            // 创建标记marker
            this.addMarker([{ lat, lon: lng }]);
            this.fenceData && this.$marker.setDraggable(true);
            this.selectedObj = {
                address: val.name,
                adcode: val.adcode,
                lat,
                lon: lng,
                id: val.id,
                fullAddress: val.address.indexOf(val.cityname) === 0 ? val.address : val.cityname + val.address,
            };
        },
        // 创建标记marker
        addMarker(marker = []) {
            // 创建之前先删掉标记
            this.$marker && this.map.remove(this.$marker);
            // 创建一个 Icon
            let startIcon = new AMap.Icon({
                // 图标尺寸
                size: new AMap.Size(53, 68),
                // 图标的取图地址
                image: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
                // 图标所用图片大小
                imageSize: new AMap.Size(53, 68)
            });
            if (marker.length) {
                marker.map(({ lat, lon }) => {
                    let position = new AMap.LngLat(lon, lat);
                    this.$marker = new AMap.Marker({
                        map: this.map,
                        position,
                        icon: startIcon,
                        autoRotation: true,
                        offset: new AMap.Pixel(0, 0),
                        anchor: 'bottom-center', // 设置锚点方位
                        draggable: false
                    });
                });
                this.map.setFitView();
                this.$marker.on('dragging', this.$baseMethod.debounce(this.handleMarkerDrag));
            }
        },
        // 地图初始化
        initMap() {
            let _this = this;
            let marker;
            if (!_this.map) {
                _this.map = new AMap.Map('container', { zoom: 13,animateEnable: false, });
                // 点击地图获取定位，定位没有poi名称，会造成地址过长
                // _this.map.on('click', this.clickMarker)
            }
            _this.map.setCity(this.cityCode);
            // fenceType 2多边形  1圆形
            if (this.fenceData) {
                const {
                    fenceType,
                    locationPoint: { lon, lat }
                } = this.fenceData;
                fenceType === 1 ? this.addCircle([lon, lat]) : this.addPolygon();
            }
        },
        clickMarker(e) {
            // 创建标记marker
            let local = {
                lat: e.lnglat.lat,
                lng: e.lnglat.lng
            };
            this.getPositionByLonLats(local);
        },
        // 根据经纬度查询地址信息
        getPositionByLonLats(lnglat) {
            let _this = this;
            let lnglatXY = [lnglat.lng, lnglat.lat];
            new AMap.plugin('AMap.Geocoder', function () {
                // 回调函数
                let geocoder = new AMap.Geocoder({ extensions: 'all' });
                geocoder.getAddress(lnglatXY, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        let {
                            regeocode: { pois, addressComponent }
                        } = result;
                        // 直接解析的地址太长移动端无法展示，获取距离最近的poi名称
                        let tem = pois[0];
                        pois.forEach(poi => {
                            if (poi.distance < tem.distance) {
                                tem.distance = poi.distance;
                            }
                        });
                        let name = tem.name;
                        _this.selectedObj = {
                            address: tem.name,
                            adcode: addressComponent.adcode,
                            lat: lnglat.lat,
                            lon: lnglat.lng
                        };
                        _this.keyWord = name;
                        let { lng, lat } = lnglat;
                        // _this.addMarker([{ lat, lon: lng }]);
                    } else {
                    }
                });
            });
        },
        // 关键字查询
        searchByKey(val, cb) {
            // 处理选择市辖区
            let cityCode = `${this.cityCode}`;
            if (cityCode.slice(4, 6) == '01') {
                cityCode = cityCode.slice(0, 4) + '00';
            }
            AMap.plugin(['AMap.PlaceSearch'], () => {
                let placeSearchOptions = {
                    //设置PlaceSearch属性
                    city: cityCode, //城市
                    citylimit: true,
                    pageSize: 50, //每页结果数,默认30
                    pageIndex: 1, //请求页码，默认1
                    extensions: 'all' //返回信息详略，默认为base（基本信息）
                };
                let placeSearch = new AMap.PlaceSearch(placeSearchOptions); //构造地点查询类
                placeSearch.search(val, (status, res) => {
                    if (status === 'complete') {
                        let { poiList = {}, info } = res || {};
                        let { pois = [] } = poiList;
                        pois = pois.filter(({ adcode, name, location }) => {
                            let adcode_r = adcode.slice(0, 4) + '00';
                            // 处理选择市辖区
                            return adcode_r == cityCode && adcode && name && location;
                        });
                        cb(pois);
                    } else {
                        cb([]);
                    }
                });
            });
        },
        // 确定
        handleSubmit() {
            if (!this.selectedObj.address || !this.keyWord) {
                this.$message.error('请选择位置');
                return;
            }
            this.$emit('select', this.selectedObj);
            this.selectedObj = {};
            this.keyWord = null;
            this.dialogVisible = false;
        },
        handleClose() {
            this.$emit('select', null);
            this.selectedObj = {};
            this.keyWord = null;
            this.map.clearMap();
            this.$marker = null;
            this.$circle = null;
            this.$polygon = null;
            this.dialogVisible = false;
        },
        // 创建圆形围栏
        addCircle(center) {
            this.$circle = new AMap.Circle({
                center,
                radius: this.fenceData.fenceRadius || 1000, //半径
                borderWeight: 3,
                strokeColor: '#F81814',
                strokeWeight: 4,
                strokeOpacity: 0.6,
                fillOpacity: 0.5,
                fillColor: '#FDC7C2',
                strokeStyle: 'dashed',
                strokeDasharray: [10, 10],
                zIndex: 50
            });
            this.$circle.setMap(this.map);
            const { lng, lat } = this.$circle.getCenter();
            this.addMarker([{ lat, lon: lng }]);
            // 缩放地图到合适的视野级别
            setTimeout(() => {
                this.map.setFitView([this.$circle]);
                this.$marker && this.$marker.setDraggable(true);
                this.getPositionByLonLats({ lng, lat });
            }, 500);
        },

        //创建多边形围栏
        addPolygon() {
            this.$polygon = new AMap.Polygon({
                path: this.polygonPoints,
                strokeColor: '#F81814',
                strokeWeight: 4,
                strokeOpacity: 0.6,
                fillOpacity: 0.5,
                fillColor: '#FDC7C2',
                zIndex: 50,
                bubble: true
            });
            this.map.add(this.$polygon);
            const { lng, lat } = this.getCenter(this.polygonPoints);
            this.addMarker([{ lat, lon: lng }]);
            // 缩放地图到合适的视野级别
            setTimeout(() => {
                this.map.setFitView([this.$polygon]);
                this.$marker && this.$marker.setDraggable(true);
                this.getPositionByLonLats({ lng, lat });
            }, 500);
        },

        // marker拖拽事件
        handleMarkerDrag(e) {
            this.calcRange() && this.getPositionByLonLats(e.lnglat);
        },

        // 计算marker是否在围栏内
        calcRange(pos) {
            pos = pos || this.$marker.getPosition();
            // 判断是否在围栏内
            const { fenceType } = this.fenceData;
            let _fence = fenceType === 1 ? this.$circle : this.$polygon;

            let center;
            if (fenceType === 1) {
                center = this.$circle.getCenter();
            } else {
                const { lng, lat } = this.getCenter(this.polygonPoints); //接口返回的中心点误差太大，这里自己计算
                center = new AMap.LngLat(lng, lat);
            }

            if (!_fence.contains(pos)) {
                this.$message.warning('地址不能超过围栏范围');
                this.$marker.setPosition(center);
                this.getPositionByLonLats(center);
            }
            return _fence.contains(pos);
        },
        // 获取中心点
        getCenter(path) {
            var lng = 0,
                lat = 0;
            for (var k = 0; k < path.length; k++) {
                lng = lng + parseFloat(path[k].lng);
                lat = lat + parseFloat(path[k].lat);
            }
            lng = lng / path.length;
            lat = lat / path.length;
            return { lng, lat };
        },
        // 清空输入框
        clearSearch() {
            this.selectedObj = {};
        }
    }
};
</script>

<style lang="scss" scoped>
#container {
    width: 100%;
    height: 500px;
}
.search-wrap {
    margin-bottom: 10px;
    display: flex;
    .el-autocomplete {
        flex: 1;
        margin-right: 20px;
    }
}
.el-dialog__wrapper {
    /deep/ .map-dialog {
        padding: 20px !important;
    }
}
</style>
