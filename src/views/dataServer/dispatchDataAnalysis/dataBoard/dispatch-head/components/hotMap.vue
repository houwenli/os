<template>
    <div class="map-box">
        <p class="text-right map-info">
            当前播放时间点：{{ labelMessage.startTime }} - {{ labelMessage.endTime }}
        </p>
        <div class="map-box">
            <!-- 地图 -->
            <div style="width: 100%; height: 600px" :id="id"></div>
            <!-- 地图统计面板 -->
            <div class="map-text">
                <p>调度失败总订单: {{ dispatchOrderCount.failedOrderCnt || '0' }}</p>
                <p>
                    调度超时取消订单总量: {{ dispatchOrderCount.scheduleTimeoutCancelOrderCnt || '0' }}
                </p>
                <p>乘客主动取消订单总量: {{ dispatchOrderCount.passengerCancelOrderCnt || '0' }}</p>
            </div>
            <!-- 地图关闭按钮 -->
            <div v-if="showMapClose" class="map-close" @click="$emit('closeMap', false)">
                <i class="el-icon-close"></i>
            </div>

            <!-- 围栏颜色图例 -->
            <div class="color-charts">
                <p class="mr20 info-text">围栏颜色图例</p>
                <div class="color-item mr20" v-for="item in colorChartsList" :key="item.label">
                    <span class="item-icon" :style="{ background: `rgba(217,0,27,${item.value})` }"></span>
                    <span>{{ item.label }}</span>
                </div>
                <p class="info-text">电子围栏半径(m)</p>
            </div>
        </div>

        <!-- 热力对比饼图 -->
        <el-dialog :visible.sync="dialogPieCharts.dialogVisible" width="580px" :before-close="handleClose">
            <div v-if="dialogPieCharts.dialogVisible" :id="dialogPieCharts.pieCharts" style="width: 500px; height: 400px; margin: 0 auto"></div>
        </el-dialog>
    </div>
</template>

<script>
import { pieCharts, colorChartsList } from './charts';

export default {
    props: {
        // 是否显示图例上面的关闭按钮
        showMapClose: {
            type: Boolean,
            default: false,
        },
        dispatchOrderCount: {
            type: Object,
            default: () => {
                return {
                    failedOrderCnt: '0', // 取消订单量
                    scheduleTimeoutCancelOrderCnt: '0', // 调度超时取消订单量
                    passengerCancelOrderCnt: '0', // 乘客主动取消订单量
                };
            },
        },
    },
    data() {
        return {
            dialogPieCharts: {
                dialogVisible: false,
                pieCharts: `pieCharts${Math.random()}`,
            },
            // map: null,
            id: `container${Math.random()}`,
            polygon: null,
            infoWindow: null,
            label: null,
            colorChartsList,
            labelMessage: {
                startTime: '', // 开始时间
                endTime: '', // 结束时间
            },
        };
    },
    mounted() {
        function loadScript() {
            let scriptDOM = document.querySelector(`#tengxun-map`);
            if (scriptDOM) {
                window.initMap();
                return true;
            }
            let script = document.createElement('script');
            script.id = 'tengxun-map';
            script.type = 'text/javascript';
            script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&callback=initMap';
            document.body.appendChild(script);
        }
        window.initMap = this.initMap;
        loadScript();
    },
    destroyed() {
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
    },
    methods: {
        initMap() {
            const _this = this;
            const center = new TMap.LatLng(39.916527, 116.397128); //设置中心点坐标
            this.map = new TMap.Map(document.getElementById(this.id), {
                center,
                mapStyleId: 'style2',
            });

            // 设置控件位置
            let control = this.map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
            control.setPosition(TMap.constants.CONTROL_POSITION.BOTTOM_RIGHT);

            // 加载覆盖块和显示文字
            // this.setMapPolygon();

            //监听地图平移
            this.map.on('center_changed', function () {
                const { lat, lng } = _this.map.getCenter();
                _this.$emit('mapCenterChange', lat, lng);
                // console.log("latlng:" + _this.map.getCenter())
            });

            this.map.on('dragstart', function () {
                _this.pauseMoveProgress();
                // console.log('地图开始发生拖拽交互时触发。');
            });

            // 地图缩放时触发
            this.map.on('zoom_changed', function () {
                // console.log(_this.map.getZoom());
                _this.pauseMoveProgress();
                _this.$emit('setZoomSize', _this.map.getZoom());
            });

            this.polygon = new TMap.MultiPolygon({
                id: 'polygon-layer', //图层id
                map: this.map, //显示多边形图层的底图
                styles: this.setStyleBox(),
                geometries: [],
            });

            this.polygon.on('click', ev => {
                this.dialogPieCharts.dialogVisible = true;
                const { geometry } = ev;
                this.$nextTick(() => {
                    this.initPieChars(geometry);
                });
                // console.log(ev, "点击了热力图-==============");
            });

            // 初始化文本标记
            this.label = new TMap.MultiLabel({
                id: 'label-layer',
                map: this.map,
                styles: {
                    label: new TMap.LabelStyle({
                        color: '#fff', //颜色属性
                        size: 20, //文字大小属性
                        offset: { x: 0, y: 0 }, //文字偏移属性单位为像素
                        angle: 0, //文字旋转属性
                        alignment: 'center', //文字水平对齐属性
                        verticalAlignment: 'middle', //文字垂直对齐属性
                    }),
                },
                geometries: [],
            });

            // 监听地图是否加载完成
            // this.map.on("tilesloaded", function () {
            //   console.log("地图瓦片已加载完成");
            // });
        },

        // 设置自适应调整地图显示范围并设置当前片段的调度订单数据
        setMapAutoPosition(currentFragment) {
            // console.log(currentFragment);

            const list = [...currentFragment.areaHexagonList];

            if (list.length) {
                const coords = list
                    .map(item => {
                        return item.hexagonList;
                    })
                    .flat(1)
                    .map(path => {
                        return new TMap.LatLng(path.lat, path.lng);
                    });

                let latlngBounds = new TMap.LatLngBounds();
                //将坐标传入extend方法，latlngBounds根据传入坐标扩展
                for (var i = 0; i < coords.length; i++) {
                    latlngBounds.extend(coords[i]);
                }

                this.map.fitBounds(latlngBounds);
            }

            // 获取当前帧的开始-结束时间
            this.labelMessage = {
                startTime: currentFragment.startTimeStr,
                endTime: currentFragment.endTimeStr,
            };
        },

        // 设置地图的蜂窝热力图
        setMapPolygon(list) {
            // console.log(list);
            // 解绑之前绑定过得事件
            if (this.polygon) {
                try {
                    this.polygon.setGeometries([]);
                    this.label.setGeometries([]);
                } catch {}
            }
            let MultiLabelGeometries = [],
                MultiPolygonGeometries = [];

            list.forEach((item, index) => {
                let [lng, lat] = item.hexagonId.split(',');
                // 根据调度失败订单量设置不同的颜色图例
                let level = 0;
                this.colorChartsList.forEach(levelItem => {
                    if (levelItem.min <= item.failedOrderCnt && levelItem.max >= item.failedOrderCnt) {
                        level = levelItem.level;
                    }
                });
                // 拼装蜂窝热力图数据
                MultiPolygonGeometries.push({
                    id: 'polygon', //多边形图形数据的标志信息
                    styleId: `polygon${level}`, //样式id
                    paths: item.hexagonList.map(latLng => {
                        return new TMap.LatLng(latLng.lat, latLng.lng);
                    }), //多边形的位置信息
                    properties: {
                        //多边形的属性数据
                        ...item,
                    },
                });

                // 拼装热力图上显示数据文字
                MultiLabelGeometries.push({
                    id: 'label' + index,
                    styleId: 'label', //样式id
                    position: new TMap.LatLng(lat, lng), //标注点位置
                    content: item.failedOrderCnt + '', //标注文本
                    properties: {
                        //标注点的属性数据
                        ...item,
                    },
                });
            });
            // console.log(MultiLabelGeometries, MultiPolygonGeometries);

            // 设置热力图数据和遮罩层数据
            if (this.polygon) {
                this.polygon.setGeometries(MultiPolygonGeometries);
                this.label.setGeometries(MultiLabelGeometries);
                return false;
            }
        },

        // 设置地图中心点
        setMapLatLng(lat, lng) {
            const latLng = this.map.getCenter();
            if (lat == latLng.lat && lng == latLng.lng) {
                return false;
            }
            if (lat && lng) {
                // console.log('触发了滑动', this.id);
                this.map.setCenter(new TMap.LatLng(lat, lng));
            }
        },

        // 设置地图缩放等级
        setMapZoomSize(zoom) {
            const currentZoom = this.map.getZoom();
            if (zoom && currentZoom != zoom) {
                // console.log('触发了缩放', this.id);
                this.map.setZoom(zoom);
            }
        },

        // 初始化热力饼图数据
        initPieChars(geometry) {
            const { passengerCancelOrderRatio, scheduleTimeoutCancelOrderRatio, passengerCancelOrderCnt, scheduleTimeoutCancelOrderCnt } = geometry.properties;
            let options = this.$baseMethod.deepClone(pieCharts);
            options.series[0].data = [
                {
                    value: passengerCancelOrderRatio,
                    name: '乘客主动取消总量',
                    orderCount: passengerCancelOrderCnt,
                },
                { value: scheduleTimeoutCancelOrderRatio, name: '调度超时总量', orderCount: scheduleTimeoutCancelOrderCnt },
            ];

            this.$echarts.init(document.getElementById(this.dialogPieCharts.pieCharts)).setOption(options);
        },

        handleClose(done) {
            done();
        },
        // 暂停视频帧的播放
        pauseMoveProgress() {
            this.$emit('pauseMoveProgress');
        },

        // 等级颜色样式
        initStyle(type, opa) {
            return new TMap.PolygonStyle({
                color: `rgba(${type == 1 ? '237, 34, 34' : '3, 143, 255'}, ${opa})`, //面填充色
                showBorder: true, //是否显示拔起面的边线
                borderColor: '#f2f2f2', //边线颜色
            });
        },

        // 设置属性
        setStyleBox() {
            return {
                //多边形的相关样式
                polygon1: this.initStyle(1, 0.2),
                polygon2: this.initStyle(1, 0.4),
                polygon3: this.initStyle(1, 0.8),
                polygon4: this.initStyle(1, 1),
            };
        },
    },
};
</script>

<style lang="scss">
.map-box {
    position: relative;
    .rotate-circle {
        display: none;
    }
    .map-text {
        z-index: 1001;
        position: absolute;
        top: 10px;
        left: 10px;
        padding: 10px 30px;
        background: #fff;
        border: 1px solid #999;
        border-radius: 10px;
    }
    .map-close {
        position: absolute;
        z-index: 1001;
        top: 4px;
        right: 4px;
        background: #fff;
        color: #333;
        font-size: 20px;
        padding: 5px 10px;
        cursor: pointer;
    }
    .color-charts {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 10px;
        .info-text {
            color: #333;
            font-size: 20px;
        }
        .mr20 {
            margin-right: 20px;
        }
        .color-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 18px;
            .item-icon {
                display: inline-block;
                width: 30px;
                height: 15px;
                background: red;
                margin-right: 10px;
            }
        }
    }
    .map-info {
        text-align: right;
        color: #333;
        margin: 10px 0;
    }
}
</style>