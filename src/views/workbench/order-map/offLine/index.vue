<template>
    <div class="order-map">
        <tabs></tabs>
        <div class="map-view">
            <div class="amap-title">
                <div>订单分布图（历史）</div>
                <div>{{ currentInfo.name }}</div>
            </div>
            <el-button type="primary" @click="back" size="mini" class="back" v-if="currentInfo.code != 100000">返回</el-button>
            <el-button type="primary" @click="refreshBtn" size="mini" class="back refresh">刷新</el-button>
            <div class="echartMap">
                <div style="height: 100%; width: 100%" id="myChart" ref="myEchart"></div>
            </div>
            <!-- <div class="time">最后更新时间：{{lastUpdateTime}}</div> -->
        </div>
    </div>
</template>

<script>
import tabs from '../components/tabs.vue';
const chinaCode = 100000; // 全国
const extraCity = [110000, 120000, 310000, 500000]; // 直辖市
export default {
    name: 'offLineProvinceMap',
    components: {
        tabs,
    },
    data() {
        return {
            chart: null,
            currentInfo: {
                name: '全国',
                code: chinaCode,
            },
            url: location.href,
            op: {
                listProvince: 'listProvince',
                listCity: 'listCity',
            },
            lastUpdateTime: '',
            moduleName: '/workbench/orderMap/offLine',
        };
    },
    mounted() {
        this.chart = this.$echarts.init(this.$refs.myEchart);
        this.chart.on('click', this.goDown);
        window.addEventListener('resize', this.autoSize);
        this.genEchartMap(this.currentInfo.code); // 加载全国数据
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.autoSize);
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
    methods: {
        async genEchartMap(adcode = chinaCode) {
            // 只需注册一次
            let curGeo = this.$echarts.getMap(this.currentInfo.name);
            if (!curGeo) {
                curGeo = await this.getGeoJson(adcode);
                this.geoJson = curGeo;
                // 注册地图
                this.$echarts.registerMap(curGeo.name, curGeo);
            } else {
                curGeo = curGeo.geoJson;
            }
            // 获取城市权限
            this.getAuthCode(curGeo);
        },
        // 获取有权限的城市
        async getAuthCode(geo) {
            let opt = {
                data: JSON.stringify({}),
                op: this.op.listProvince,
            };
            let url = this.getModuleUrl(this.op.listProvince);
            // 查询省车主分布图传参
            if (this.currentInfo.code !== chinaCode) {
                opt = {
                    data: JSON.stringify({
                        provinceId: this.currentInfo.code,
                    }),
                    op: this.op.listCity,
                };
                url = this.getModuleUrl(this.op.listCity);
            }
            // nationwideCity=true是全国权限
            let cityList = [];
            let nationwideCity = false;
            try {
                let res = await this.$axios(url, opt);
                ({ nationwideCity, cityList } = JSON.parse(res.data));
            } catch (error) {}
            // let res = await this.$axios(url, opt);
            // let resData = JSON.parse(res.data);
            // [71000,81000,82000]港澳台
            // let resData = [
            //     120000, 320000, 360000, 440000, 520000, 640000, 130000, 210000, 330000, 370000, 410000, 450000, 530000, 610000, 650000, 140000, 220000, 340000, 420000, 460000, 500000, 540000, 620000,
            //     110000, 150000, 230000, 310000, 350000, 430000, 510000, 630000,
            // ];
            let mapData = geo.features.map(item => {
                let { adcode, name, level, center } = item.properties;
                return {
                    value: nationwideCity || cityList.includes(adcode),
                    name,
                    adcode,
                    level: extraCity.includes(adcode) ? 'city' : level, // 直辖市级别转换
                    center,
                };
            });
            this.initEcharts(geo.name, mapData);
        },
        getGeoJson(adcode, childAdcode = '') {
            let name = '';
            return new Promise((resolve, reject) => {
                function insideFun(adcode, childAdcode) {
                    AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
                        let districtExplorer = new DistrictExplorer();
                        districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
                            if (error) {
                                console.error(error);
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
                                Json = Json.filter(item => {
                                    return item.properties.adcode === childAdcode;
                                });
                            }
                            let mapJson = {
                                features: Json,
                                // name: areaNode.getName() === '全国' ? 'china' : areaNode.getName()
                                name: name || areaNode.getName(),
                            };
                            resolve(mapJson);
                        });
                    });
                }
                insideFun(adcode, childAdcode);
            });
        },
        initEcharts(name, data) {
            let option = {
                // backgroundColor: '#060820', //地图容器背景色
                visualMap: {
                    type: 'piecewise',
                    pieces: [
                        { value: 0, label: '无权限', color: 'rgba(14, 28, 75, 0.2)' },
                        { value: 1, label: '有权限', color: 'rgba(14, 28, 75, 1)' },
                    ],
                    show: false,
                },
                // geo: {
                //     map: name,
                //     show: true,
                //     // zoom: 1.1,
                //     top: this.currentInfo.code === chinaCode ? '20%' : '10%',
                //         zoom: this.currentInfo.code === chinaCode ? 1.3 : 1.0,
                //     label: {
                //         emphasis: { show: true },
                //     },
                //     itemStyle: {
                //         normal: {
                //             borderColor: new this.$echarts.graphic.LinearGradient(
                //                 0,
                //                 0,
                //                 0,
                //                 1,
                //                 [
                //                     {
                //                         offset: 0,
                //                         color: 'rgba(4, 255, 255, 1)',
                //                     },
                //                     {
                //                         offset: 1,
                //                         color: 'rgba(4, 255, 255, 1)',
                //                     },
                //                 ],
                //                 false
                //             ),
                //             areaColor: {
                //                 x: 0,
                //                 y: 0,
                //                 x2: 0,
                //                 y2: 1,
                //                 colorStops: [
                //                     {
                //                         offset: 0,
                //                         color: 'rgba(14, 28, 75, 1)', // 省份 0% 处的颜色
                //                     },
                //                     {
                //                         offset: 1,
                //                         color: 'rgba(14, 28, 75, 1)', // 省份 100% 处的颜色
                //                     },
                //                 ],
                //             },
                //             borderWidth: 2,
                //             shadowColor: 'rgba(11, 61, 225, 0.56)', // 地图背景色
                //             shadowOffsetX: 2,
                //             shadowOffsetY: 8,
                //             shadowBlur: 20,
                //         },
                //     },
                // },
                series: [
                    {
                        type: 'map',
                        map: name,
                        aspectScale: 0.75, //长宽比
                        top: this.currentInfo.code === chinaCode ? '20%' : '10%',
                        zoom: this.currentInfo.code === chinaCode ? 1.3 : 1.0,
                        roam: true,
                        label: {
                            show: true,
                            color: '#fff',
                            formatter: p => {
                                switch (p.name) {
                                    case '内蒙古自治区':
                                        p.name = '内蒙古';
                                        break;
                                    case '西藏自治区':
                                        p.name = '西藏';
                                        break;
                                    case '新疆维吾尔自治区':
                                        p.name = '新疆';
                                        break;
                                    case '宁夏回族自治区':
                                        p.name = '宁夏';
                                        break;
                                    case '广西壮族自治区':
                                        p.name = '广西';
                                        break;
                                    case '香港特别行政区':
                                        p.name = '';
                                        break;
                                    case '澳门特别行政区':
                                        p.name = '';
                                        break;
                                    case '台湾省':
                                        p.name = '';
                                    default:
                                    // code
                                }
                                let txtCon = p.value ? p.name : '';
                                return txtCon;
                            },
                        },
                        itemStyle: {
                            areaColor: 'rgba(14, 28, 75, 1)',
                            borderColor: 'rgba(218, 221, 248, 0.32)',
                            borderWidth: 1,
                            // shadowColor: 'rgba(11, 61, 225, 0.56)',
                            // shadowBlur: 24,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 8,
                        },
                        select: {
                            itemStyle: {
                                areaColor: 'rgba(25, 57, 216, 0.24)',
                                borderColor: 'rgba(86, 132, 248, 1)',
                                borderWidth: 2,
                            },
                        },
                        emphasis: {
                            label: {
                                show: true,
                                color: '#fff',
                            },
                            itemStyle: {
                                areaColor: 'rgba(25, 57, 216, 0.24)',
                                borderColor: 'rgba(86, 132, 248, 1)',
                                borderWidth: 2,
                            },
                        },
                        data,
                    },
                ],
            };
            if (this.currentInfo.code === 460000) {
                // 海南地图缩放问题
                option.series[0].center = [109.844902, 19.0392];
                option.series[0].layoutCenter = ['50%', '50%'];
                option.series[0].layoutSize = '600%';
            }
            this.chart.setOption(option, true);
        },
        // 下钻
        goDown(e) {
            if (!e.data || !e.data.value) {
                this.$message.error(`暂无${e.name}查看权限`);
                return;
            }
            let { name, adcode, level, center } = e.data;
            this.currentInfo = {
                name,
                code: adcode,
            };
            if (level === 'city') {
                // 跳转到地图
                this.$router.push({ path: '/workbench/orderMap/offLine/city', query: { lng: center[0], lat: center[1], adcode, city: name } });
                return;
            }
            this.genEchartMap(adcode);
        },
        autoSize() {
            let { clientWidth, clientHeight } = document.getElementsByClassName('map-view') && document.getElementsByClassName('map-view')[0];
            let mapChart = document.getElementById('myChart');
            mapChart.style.width = clientWidth + 'px';
            mapChart.style.height = clientHeight + 'px';
            this.chart.resize();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        back() {
            this.currentInfo = {
                name: '全国',
                code: chinaCode,
            };
            this.genEchartMap();
        },
        refreshBtn() {
            this.genEchartMap(this.currentInfo.code);
        },
    },
};
</script>
<style scoped lang="scss">
.order-map {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.time {
    position: absolute;
    right: 30px;
    bottom: 30px;
    color: #fff;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
}
.map-view {
    flex: 1;
    // margin-top: 20px;
    // height: 100%;
    border-radius: 0 0 8px;
    // border: 1px solid #dcdfe6;
    box-shadow: 0 10px 14px 0 rgba(0, 0, 0, 0.16);
    // overflow: hidden;
    position: relative;
    .amap-title {
        position: absolute;
        top: 2%;
        left: 3%;
        font-size: 15px;
        font-weight: bold;
        color: #f5f5f5;
        z-index: 9;
        text-align: center;
    }

    .back {
        position: absolute;
        right: 110px;
        top: 24px;
        background: #ffffff;
        box-shadow: 0px 6px 9px 0px rgba(0, 0, 0, 0.5);
        border-radius: 2px;
        z-index: 9;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        border: none;
    }
    .refresh {
        right: 24px;
    }
    .echartMap {
        height: 100%;
        width: 100%;
        border-radius: 8px;
        position: relative;
        background: url('~@/assets/images/map-bg.png');
        background-size: cover;
    }
}
</style>
