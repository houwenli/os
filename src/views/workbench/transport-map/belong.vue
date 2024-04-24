<template>
    <div class="echart-map">
        <div class="data-box">
            <div class="search-box flex-box">
                <div style="font-size: 18px; font-weight: 500">城市：</div>
                <div>
                    <ws-city
                        ref="mcity"
                        class="city-cas"
                        v-model="searchOptions.registerCityCode"
                        :defaultProps="{ checkStrictly: true }"
                        placeholder="请输入要查询的省份、城市、区县名称"
                        :show-all-levels="false"
                        level="3"
                    ></ws-city>
                    <!-- {{ searchOptions.registerCityCode }} -->
                </div>
                <div style="margin-left: 16px">
                    <el-button
                        type="primary"
                        @click="handleSearch"
                        class="el-icon-search"
                        v-if="powerList.areaQuery"
                        :disabled="searchOptions.registerCityCode == '100000' || !searchOptions.registerCityCode"
                    >
                        查询
                    </el-button>
                </div>
                <div style="margin-left: 20px">
                    <i style="font-size: 24px; cursor: pointer" :class="isShowTable ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="isShowTable = !isShowTable"></i>
                </div>
            </div>

            <el-table :data="tableData" class="table-data" v-if="isShowTable">
                <el-table-column prop="driverStatus" label="运力类型" width="130">
                    <template slot-scope="scope">
                        <span>{{ driverFilter[scope.row.driverStatus] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="kc" label="快车" width="90"></el-table-column>
                <el-table-column prop="zc" label="专车" width="90"></el-table-column>
                <el-table-column prop="hhc" label="豪华车" width="90"></el-table-column>
                <el-table-column prop="swc" label="商务车" width="90"></el-table-column>
                <el-table-column prop="all" label="合计"></el-table-column>
            </el-table>
        </div>
        <div class="echartMap">
            <div style="height: 100%; width: 100%" ref="chartMapRef"></div>
        </div>
        <div class="btn-box">
            <el-button type="primary" @click="back()" size="mini" class="back" v-if="parentInfo.length > 1">返 回</el-button>
            <el-button type="primary" @click="refresh()" size="mini" class="refresh" icon="el-icon-refresh-left" v-if="powerList.areaQuery" :loading="loading">刷 新</el-button>
        </div>
        <div class="update-box">最后更新时间：{{ updateTime }}</div>
    </div>
</template>

<script>
import { param } from '../../../utils';
import mapData from './area.json';
export default {
    data() {
        return {
            driverFilter: {
                ALL: '合计',
                I_OFF: '服务中离线',
                I_ON: '服务中在线',
                F_OFF: '空闲中离线',
                F_ON: '空闲中在线',
                OUT: '未出车',
            },

            moduleName: '/workbench/transportMap',
            mapData: [],
            getGeoJson: {},
            parentInfo: [
                {
                    cityName: '全国',
                    code: '100000',
                },
            ],
            searchOptions: {
                registerCityCode: '100000',
            },

            myChart: {},
            tableData: [], // 表格运力数据
            areaDetailList: [], // 地图运力数据
            isShowTable: true, // 是否显示表格
            timer: '', //定义一个定时器的变量
            updateTime: new Date(), // 获取当前时间
            loading: false,
            zoom: 1.1,
            backMap: null,
        };
    },

    mounted() {
        this.myChart = this.$echarts.init(this.$refs.chartMapRef, null, { devicePixelRatio: 4 }); //这里是为了获得容器所在位置
        if (sessionStorage.getItem('map-cityCode')) {
            this.$nextTick(() => {
                // 特别行政区特殊处理
                switch (JSON.parse(sessionStorage.getItem('map-cityCode')).areaCode) {
                    case '110000':
                        this.searchOptions.registerCityCode = 110100; // 北京
                        break;
                    case '120000':
                        this.searchOptions.registerCityCode = 120100; // 天津
                        break;
                    case '310000':
                        this.searchOptions.registerCityCode = 310100; // 上海
                        break;
                    case '500000':
                        this.searchOptions.registerCityCode = 500100; // 重庆城区
                        break;
                    default:
                        this.searchOptions.registerCityCode = +JSON.parse(sessionStorage.getItem('map-cityCode')).areaCode;
                }
                if (JSON.parse(sessionStorage.getItem('map-parentInfo')) && !JSON.parse(sessionStorage.getItem('map-updateCode')) && !JSON.parse(sessionStorage.getItem('map-cityCode'))) {
                    this.parentInfo = JSON.parse(sessionStorage.getItem('map-parentInfo')).parentInfo;
                } else {
                    // 如果获取的数据不是全国，则加入到parentInfo数组中
                    if (JSON.parse(sessionStorage.getItem('map-updateCode')) && JSON.parse(sessionStorage.getItem('map-updateCode')).upCode != 100000) {
                        this.parentInfo.push({
                            cityName: JSON.parse(sessionStorage.getItem('map-updateCode')).upName,
                            code: +JSON.parse(sessionStorage.getItem('map-updateCode')).upCode,
                        });
                    }
                    if (JSON.parse(sessionStorage.getItem('map-cityCode')).areaCode != 100000) {
                        this.parentInfo.push({
                            cityName: JSON.parse(sessionStorage.getItem('map-cityCode')).cityName,
                            code: +JSON.parse(sessionStorage.getItem('map-cityCode')).areaCode,
                        });
                    }
                }

                this.search();
            });
        } else {
            this.search();
        }
        this.showUpdateTime();
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
        }
        if (!this.myChart) {
            return;
        }
        this.myChart.dispose();
        this.myChart = null;
    },

    methods: {
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
        back() {
            sessionStorage.removeItem('map-cityCode');
            sessionStorage.removeItem('map-updateCode');
            sessionStorage.removeItem('map-parentInfo');

            if (this.parentInfo.length === 1) {
                this.searchOptions.registerCityCode = '100000';
                return;
            } else if (this.parentInfo.length === 2) {
                this.searchOptions.registerCityCode = '100000';
            } else if (this.parentInfo.length === 3) {
                this.searchOptions.registerCityCode = +this.parentInfo[1].code;
            } else {
                this.searchOptions.registerCityCode = +this.parentInfo[this.parentInfo.length - 2].code;
            }

            this.parentInfo.pop();
            this.search();
        },
        refresh() {
            if (this.parentInfo.length === 1) {
                this.searchOptions.registerCityCode = '100000';
            }
            this.search(true);
        },
        handleSearch() {
            let arr = this.flatten(mapData);
            this.searchMapClick(arr);
        },

        searchMapClick(arr) {
            // this.myChart.clear()
            let cityCode = String(this.searchOptions.registerCityCode);
            let lng, lat;
            //如果当前是最后一级，那就直接return
            switch (cityCode) {
                case '110100':
                    cityCode = '110000'; // 北京
                    break;
                case '120100':
                    cityCode = '120000'; // 天津
                    break;
                case '310100':
                    cityCode = '310000'; // 上海
                    break;
                case '500100':
                    cityCode = '500000'; // 重庆城区
                    break;
                case '500200':
                    cityCode = '500000'; // 重庆郊区
                    break;
            }
            let data = arr.find(item => {
                return item.code == cityCode;
            });

            let that = this;
            if (!that.searchOptions.registerCityCode && that.parentInfo.length !== 1) {
                that.$message.error('请输入要查询的省份、城市、区县名称');
                return;
            }
            if (data && data.name) {
                AMap.plugin('AMap.Geocoder', function () {
                    var citySearch = new AMap.Geocoder({
                        city: cityCode,
                    });
                    citySearch.getLocation(data.name, function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            // 查询成功，result即为当前所在城市信息

                            let location = result.geocodes[0].location;

                            if (cityCode && cityCode.substr(cityCode.length - 2) > 0) {
                                sessionStorage.setItem(
                                    'map-cityCode',
                                    JSON.stringify({ areaCode: that.parentInfo[that.parentInfo.length - 1].code, cityName: that.parentInfo[that.parentInfo.length - 1].cityName })
                                );
                                sessionStorage.setItem(
                                    'map-parentInfo',
                                    JSON.stringify({
                                        parentInfo: that.parentInfo,
                                    })
                                );

                                that.$router.push({
                                    path: '/workbench/transportMap/cityMap',
                                    query: { lng: location.lng, lat: location.lat, areaCode: cityCode },
                                });
                                return;
                            }
                            if (that.parentInfo[that.parentInfo.length - 1].code != cityCode) {
                                sessionStorage.setItem(
                                    'map-cityCode',
                                    JSON.stringify({
                                        areaCode: cityCode,
                                        cityName: data.name,
                                    })
                                );

                                sessionStorage.setItem(
                                    'map-updateCode',
                                    JSON.stringify({
                                        upCode: that.parentInfo[that.parentInfo.length - 1].code,
                                        upName: that.parentInfo[that.parentInfo.length - 1].cityName,
                                    })
                                );
                                that.parentInfo.push({
                                    cityName: data.name,
                                    code: cityCode,
                                });

                                that.search();
                            }
                        }
                    });
                });
            } else {
                this.init(this.parentInfo[this.parentInfo.length - 1].code);
                return that.$message.error('当前城市无数据');
            }
        },

        flatten(arr) {
            let data = JSON.parse(JSON.stringify(arr));
            let newData = [];
            const callback = item => {
                (item.children || (item.children = [])).map(v => {
                    callback(v);
                });
                delete item.children;
                newData.push(item);
            };
            data.map(v => callback(v));
            return newData;
        },

        search(isRefresh = false) {
            // Q全国, P省，C市，X县
            let type = '';
            let registerCityCode = this.searchOptions.registerCityCode;
            if (!registerCityCode) {
                return this.$message.error('请输入要查询的省份、城市、区县名称');
            } else {
                registerCityCode = String(registerCityCode);
                // 特别市辖区跳转到对应的下级市
                switch (registerCityCode) {
                    case '110000':
                        registerCityCode = '110100'; // 北京
                        break;
                    case '120000':
                        registerCityCode = '120100'; // 天津
                        break;
                    case '310000':
                        registerCityCode = '310100'; // 上海
                        break;
                    case '500000':
                        registerCityCode = '500100'; // 重庆城区
                        break;
                }
                if (registerCityCode === '100000') {
                    type = 'Q';
                } else if (registerCityCode.substring(4) > 0) {
                    type = 'X';
                } else if (registerCityCode.substring(2, 4) > 0) {
                    type = 'C';
                } else if (registerCityCode.substring(0, 2) > 0) {
                    type = 'P';
                }
            }

            let data = {
                data: { type, code: registerCityCode },
                op: 'areaQuery',
            };
            if (isRefresh) {
                this.loading = true;
            }
            this.$axios(this.getModuleUrl(data.op), data)
                .then(res => {
                    let result = JSON.parse(res.data) || [];
                    this.tableData = result.transportDetail || [];
                    this.areaDetailList = result.areaDetailList || [];
                    this.loading = false;
                    this.init(this.parentInfo[this.parentInfo.length - 1].code);
                })
                .catch(() => {
                    this.loading = false;
                    this.init(this.parentInfo[this.parentInfo.length - 1].code);
                });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        init(adcode) {
            this.getGeoJsonFoo(adcode).then(data => {
                this.geoJson = data;
                this.getMapData();
            });
        },
        getGeoJsonFoo(adcode, childAdcode = '') {
            return new Promise((resolve, reject) => {
                function insideFun(adcode, childAdcode) {
                    AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
                        var districtExplorer = new DistrictExplorer();
                        districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
                            if (error) {
                                console.error(error);
                                reject(error);
                                return;
                            }
                            let Json = areaNode.getSubFeatures();
                            if (Json.length === 0) {
                                let parent = areaNode._data.geoData.parent.properties.acroutes;
                                insideFun(parent[parent.length - 1], adcode);
                                return;
                            }

                            if (childAdcode) {
                                Json = Json.filter(item => {
                                    return item.properties.adcode == childAdcode;
                                });
                            }
                            let mapJson = {
                                features: Json,
                            };
                            resolve(mapJson);
                        });
                    });
                }
                insideFun(adcode, childAdcode);
            });
        },
        //获取数据
        getMapData() {
            let pointData = [];
            this.geoJson.features.forEach(item => {
                let value = Math.random() * 3000;
                if (item.properties.name != '香港特别行政区' && item.properties.name != '澳门特别行政区') {
                    pointData.push({
                        name: item.properties.name,
                        value: [item.properties.center[0], item.properties.center[1], value],
                        cityCode: item.properties.adcode,
                        center: item.properties.center,
                    });
                }
            });
            // 遍历出地图上的点，只展示有运力数据的点
            let newArr = [];
            this.areaDetailList.forEach(item => {
                for (let i = pointData.length - 1; i >= 0; i--) {
                    if (pointData[i].cityCode === item.code) {
                        pointData[i].allCount = item.allCount;
                        if (pointData[i].allCount > 0) {
                            newArr.push(pointData[i]);
                        }
                        return;
                    }
                }
            });
            this.pointData = newArr;
            this.initEchartMap(newArr);
        },
        //渲染echarts
        initEchartMap(pointData) {
            //这里做个切换，全国的时候才显示南海诸岛  只有当注册的名字为china的时候才会显示南海诸岛
            this.$echarts.registerMap(this.parentInfo.length === 1 ? 'china' : 'map', this.geoJson);
            this.myChart.off('georoam', this.georoamMap);
            var option = {
                baseOption: {
                    backgroundColor: '#3C415E', //地图容器背景色
                    title: [
                        {
                            text: '【' + this.parentInfo[this.parentInfo.length - 1].cityName + '】',
                            left: 342,
                            top: 68,
                            textStyle: {
                                color: '#fff',
                                fontWeight: 500,
                                fontSize: 16,
                            },
                        },
                    ],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                        },
                    },
                    grid: {
                        right: '2%',
                        top: '12%',
                        bottom: '8%',
                        width: '20%',
                    },
                    geo: {
                        map: this.parentInfo.length === 1 ? 'china' : 'map',
                        roam: true,
                        zoom: this.parentInfo.length === 1 ? 1.5 : 1.2,
                        show: true,
                        // left: 'center',
                        top: this.parentInfo.length === 1 ? '25%' : 'center',
                        layoutSize: '100%',
                        tooltip: {
                            trigger: 'item',
                            formatter: p => {
                                if (!p.data) {
                                    return;
                                }
                                let txtCon = "<div style='text-align:left'>" + p.name + p.data.allCount + '</div>';
                                return txtCon;
                            },
                        },
                        label: {
                            emphasis: { show: false },
                        },
                        layoutSize: '100%',
                        itemStyle: {
                            normal: {
                                areaColor: '#292D49',
                                borderColor: '#353A53',
                                borderWidth: 1.3,
                            },
                            emphasis: {
                                areaColor: '#353A53',
                                shadowBlur: 10,
                            },
                        },
                    },
                    series: [
                        {
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            rippleEffect: {
                                period: 8,
                                scale: 3,
                                brushType: 'fill',
                            },
                            label: {
                                normal: {
                                    show: true,
                                    color: '#fff',
                                    position: 'inside',
                                    fontSize: 12,
                                    formatter: function (para) {
                                        if (para.data.name == '澳门特别行政区' || para.data.name == '香港特别行政区') return;
                                        return `${para.data.name}${para.data.allCount} `;
                                    },
                                },
                            },
                            itemStyle: {
                                color: '#BF5532',
                            },
                            symbol: 'circle',
                            data: pointData,
                            symbolSize: function (val) {
                                if (val[2] === 0) {
                                    return 0;
                                }
                                return 20;
                            },
                            zlevel: 1, // 地图和涟漪图分层，减少CPU占用内存
                            showEffectOn: 'render', //加载完毕显示特效
                        },
                    ],
                },
            };
            this.myChart.setOption(option, true);

            //点击前解绑，防止点击事件触发多次
            this.myChart.off('click');
            this.myChart.on('click', this.echartsMapClick);

            this.myChart.on('georoam', this.georoamMap);
        },
        georoamMap(e) {
            // 解决缩放时，地图中文字显示不清晰问题
            if (this.zoom > 1.45) {
                this.zoom = 1.1;
                //利用防抖防止频繁调用返回接口
                clearTimeout(this.backMap);
                this.backMap = setTimeout(() => {
                    this.initEchartMap(this.pointData);
                    this.init(this.parentInfo[this.parentInfo.length - 1].code);
                }, 500);
            }
            if (e.zoom) {
                this.zoom = 0.02 + this.zoom;
            }
        },
        //echarts点击事件
        echartsMapClick(params) {
            if (!params.data) {
                return;
            } else {
                let data = params.data;
                this.searchOptions.registerCityCode = params.data.cityCode;

                let lng, lat;
                //如果当前是最后一级，那就直接return
                data.cityCode = String(data.cityCode);

                if (data.cityCode && data.cityCode.substr(data.cityCode.length - 2) > 0) {
                    sessionStorage.setItem(
                        'map-cityCode',
                        JSON.stringify({ areaCode: this.parentInfo[this.parentInfo.length - 1].code, cityName: this.parentInfo[this.parentInfo.length - 1].cityName })
                    );

                    this.$router.push({
                        path: '/workbench/transportMap/cityMap',
                        query: { lng: data.center[0], lat: data.center[1], areaCode: data.cityCode },
                    });

                    return;
                }

                // 特别城区特殊处理，重庆默认跳转重庆城区
                switch (this.searchOptions.registerCityCode) {
                    case 110000:
                        this.searchOptions.registerCityCode = 110100; // 北京
                        break;
                    case 120000:
                        this.searchOptions.registerCityCode = 120100; // 天津
                        break;
                    case 310000:
                        this.searchOptions.registerCityCode = 310100; // 上海
                        break;
                    case 500000:
                        this.searchOptions.registerCityCode = 500100; // 重庆城区
                        break;
                }
                if (this.parentInfo[this.parentInfo.length - 1].code != data.cityCode) {
                    sessionStorage.setItem(
                        'map-cityCode',
                        JSON.stringify({
                            areaCode: data.cityCode,
                            cityName: data.name,
                        })
                    );
                    sessionStorage.setItem(
                        'map-updateCode',
                        JSON.stringify({
                            upCode: this.parentInfo[this.parentInfo.length - 1].code,
                            upName: this.parentInfo[this.parentInfo.length - 1].cityName,
                        })
                    );
                    this.parentInfo.push({
                        cityName: data.name,
                        code: data.cityCode,
                    });
                }
                // this.init(data.cityCode);
                this.init(this.parentInfo[this.parentInfo.length - 1].code);
                this.search();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
/deep/.el-icon-search {
    span {
        margin-left: 5px;
    }
}

.echart-map {
    position: relative;
    height: 100%;
    font-size: 14px;
}
.echartMap {
    height: 100%;
    width: 100%;
    // transform: translateY(-50%);
    // top: 45%;
    position: relative;
    .mapChoose {
        display: none;
        position: absolute;
        left: 0px;
        top: 0px;
        color: transparent;
        .title {
            cursor: pointer;
            font-size: 22px;
            font-weight: bolder;
        }
        .icon {
            font-family: 'simsun';
            font-size: 22px;
            margin: 0 11px;
        }
    }
}
.btn-box {
    position: absolute;
    top: 40px;
    right: 40px;
    button {
        width: 92px;
        padding: 10px 12px;
        font-size: 14px;
        border-color: transparent;
    }
    button.back {
        background: rgba(32, 47, 82, 0.8);
    }
    button.back:hover {
        background: rgba(32, 47, 82, 0.8) !important;
        border: 1px solid #202f52 !important;
    }
}
.update-box {
    position: absolute;
    bottom: 20px;
    right: 40px;
    color: #fff;
}
.flex-box {
    display: flex;
    align-items: center;
    // border: 1px solid #4b8df3;
    background: rgba(32, 47, 82, 0.8);
    border-radius: 4px;
    padding: 20px 16px;
    & > div {
        margin: 0 4px;
    }
}
.city-cas {
    /deep/.el-cascader .el-input {
        width: 360px !important;
    }
}
.el-table.table-data {
    margin-top: 4px;
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
}
/deep/.el-table::before {
    height: 0 !important;
}
.data-box {
    color: #fff;
    position: absolute;
    top: 110px;
    left: 20px;
    z-index: 10;
}
</style>
