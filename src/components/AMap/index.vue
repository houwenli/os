<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" custom-class="map-dialog" top="100px" width="60%"
        :close-on-click-modal="false">
        <div v-if="showSearch" class="dialog-box">
            <div class="input-box">
                <el-form label-width="78px">
                    <el-col :span="12">
                        <el-form-item label="当前城市：">
                            <el-input :disabled="true" placeholder v-model="cityOpt.label"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="坐标：">
                            <el-input :disabled="true" placeholder v-model="coordinate"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="地址：">
                            <el-autocomplete v-model="keyWord" placeholder="请输入详细地址搜索" :fetch-suggestions="searchByKey"
                                value-key="name" :trigger-on-focus="false" @select="selectedPoi" clearable
                                style="width: 100%"></el-autocomplete>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
            <el-button class="determine-btn" type="primary" @click="onClose(true)">确 定</el-button>
        </div>

        <div id="mapBox"></div>
    </el-dialog>
</template>

<script>
import { bindEventListener, removeEventListener } from './events';

export default {
    name: 'AMap',
    props: {
        title: {
            type: String,
            default: '地址采集',
        },
        show: {
            type: Boolean,
            default: false,
        },
        zoom: {
            type: Number || String,
            default: 14,
        },
        marker: {
            type: Array,
            default: () => [],
        },
        showSearch: {
            type: Boolean,
            default: true,
        },
        //城市code
        cityOpt: {
            type: Object,
            default: () => {
                return {
                    cityCode: '',
                };
            },
        },
    },
    data() {
        return {
            address: {
                lat: '',
                lng: '',
                formattedAddress: '',
            },
            keyWord: '',
            /** 地图实例 */
            // map: null,
            state: '',
        };
    },
    computed: {
        dialogVisible: {
            get() {
                return this.show;
            },
            set() {
                this.$emit('update:show', false);
            },
        },
        cityCode() {
            return this.cityOpt.cityCode;
        },

        coordinate() {
            let { lng, lat } = this.address;
            return lng && lat ? lng + ',' + lat : '-';
        },
    },
    mounted() {
        AMap.plugin(['AMap.Driving', 'AMap.Scale', 'AMap.ToolBar', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MouseTool'], () => {
            this.initMap()
        })
    },
    // 强烈建议父组件使用v-if 控制地图组件的显示隐藏
    beforeDestroy() {
        this.destory();
    },
    methods: {
        // 选择
        selectedPoi(val) {
            let { lng, lat } = val.location;
            this.map.clearMap();
            let position = new AMap.LngLat(lng, lat);
            this.map.setZoomAndCenter(this.zoom, position);
            // 创建标记marker
            this.addMarker([{ lat, lon: lng }]);
            this.address = { ...val, lng, lat, formattedAddress: val.name };
        },
        addMarker(marker = []) {
            // 创建一个 Icon
            let startIcon = new AMap.Icon({
                // 图标尺寸
                size: new AMap.Size(0, 0),
                // // 图标的取图地址（隐藏图标icon，采用拖拽选址icon）
                // image:
                //     "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
                // // 图标所用图片大小
                // imageSize: new AMap.Size(53, 68),
                // 图标取图偏移量
                imageOffset: new AMap.Pixel(0, 0),
            });
            if (marker.length) {
                marker.map(({ lat, lon }) => {
                    let position = new AMap.LngLat(lon, lat);
                    new AMap.Marker({
                        map: this.map,
                        position,
                        icon: startIcon,
                        autoRotation: true,
                        offset: new AMap.Pixel(-26.5, -68),
                        anchor: 'top-left', // 设置锚点方位
                    });
                });
                this.map.setFitView();
                this.map.setZoom(15);
            }
        },
        // 地图初始化
        initMap() {
            console.log('地图初始化');

            this.$nextTick(() => {
                // 实例化地图
                this.map = new AMap.Map('mapBox', {
                    zoom: this.zoom, //级别
                    animateEnable: false,
                });

                // 添加事件
                bindEventListener(this);
            });
        },

        onClose(isSubmit) {
            if (isSubmit) {
                if (this.coordinate === '-') {
                    this.$message.info('请选择位置');
                    return;
                }

                this.$emit('select', this.address);
            }

            this.$emit('update:show', false);
        },
        // 关键字查询
        searchByKey(val, cb) {
            //输入提示
            AMap.plugin(['AMap.PlaceSearch'], () => {
                let placeSearchOptions = {
                    //设置PlaceSearch属性
                    citylimit: true,
                    city: this.cityCode, //城市
                    // type: "150000", //数据类别 POI类型 150000交通设施服务
                    pageSize: 10, //每页结果数,默认10
                    pageIndex: 1, //请求页码，默认1
                    extensions: 'all', //返回信息详略，默认为base（基本信息）
                };
                let placeSearch = new AMap.PlaceSearch(placeSearchOptions); //构造地点查询类
                placeSearch.search(val, (status, res) => {
                    if (status === 'complete') {
                        let { poiList = {}, info } = res || {};
                        let { pois = [] } = poiList;
                        pois = pois.filter(({ name, location }) => name && location);
                        cb(pois);
                    } else {
                        cb([]);
                    }
                });
            });
        },

        destory() {
            this.address = this.$options.data().address;
            this.keyWord = '';

            removeEventListener(this);
        },
    },
};
</script>

<style lang="scss" scoped>
.dialog-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;

    .input-box {
        flex: 1;
    }

    .el-form-item {
        margin: 18px 0 0 0 !important;
    }

    .determine-btn {
        margin-left: 60px;
    }
}

#mapBox {
    width: 100%;
    height: 540px;
}

/deep/ .el-form-item__label {
    padding: 0 !important;
    font-weight: 500;
}

/deep/ .el-dialog__title {
    font-weight: 600 !important;
}

/deep/ .el-dialog__body {
    padding: 18px 32px 32px !important;
}
</style>
