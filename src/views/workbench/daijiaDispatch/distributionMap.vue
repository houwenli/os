<template>
  <div class="order-hot-box">
    <!--内容区域-->
    <screening-operation @func="genEchartMap" :showBack='showBack' @goBack="goBack" :meunTitle="meunTitle"></screening-operation>
    <data-block :data="dataBlock"></data-block>
    <div class="echartMap">
        <div style="width: 100%" id="myChart" ref="myEchart"></div>
    </div>
  </div>
</template>

<script>
  import ehcarts from './utils/echarts'
  import DataBlock from './components/dataBlock';
  import ScreeningOperation from './components/screeningOperation';
  const chinaCode = 100000; // 全国
  const extraCity = [110000, 120000, 310000, 500000]; // 直辖市
  export default {
    components: {
      ScreeningOperation,
      DataBlock
    },
    data() {
      return {
        moduleName: '/workbench/distributionMap',
        meunTitle: '代驾司机分布图-全国',
        dataBlock: {},
        orderStats: [],
        chart: null,
        currentInfo: {
            name: '全国',
            code: chinaCode,
        },
        url: location.href,
        mapChart: null,
        showBack: false,
        orderStatsObj: {},
        geoObj: {},
        geoObjNameToAdcode: {}
      };
    },
    mounted() {
        this.chart = ehcarts.init(this.$refs.myEchart);
        this.chart.on('click', this.goDown);
        window.addEventListener('resize', this.autoSize);
        this.genEchartMap(this.currentInfo.code); // 加载全国数据
    },
    methods: {
        goBack(){
            this.currentInfo = {
                name: '全国',
                code: chinaCode,
            };
            this.genEchartMap();
        },
        async genEchartMap(adcode = chinaCode) {
            // 只需注册一次
            let curGeo = ehcarts.getMap(this.currentInfo.name);
            if(this.currentInfo.code == chinaCode){
                this.showBack = false;
            }else{
                this.showBack = true;
            }
            this.meunTitle = '代驾司机分布图-' + this.currentInfo.name;
            if (!curGeo) {
                curGeo = await this.getGeoJson(adcode);
                // 注册地图
                ehcarts.registerMap(curGeo.name, curGeo);
            } else {
                curGeo = curGeo.geoJson;
            }
            // 获取城市权限
            this.getAuthCode(curGeo);
        },
        // 获取有权限的城市
        async getAuthCode(geo) {
            let self = this;
            let op = '';
            let data = {};
            if(self.currentInfo.code == chinaCode){
                op = 'getAllProvinceDrivingStatistics';
            }else{
                op = 'getAllCityDrivingStatistics';
                data = {
                    provinceCode: self.currentInfo.code
                }
            }
            let opt = {
                data: JSON.stringify(data),
                op,
            };
            let url = this.getModuleUrl(op);
            try {
                let result = await this.$axios(url, opt);
                if(result.code === 1){
                    let res = JSON.parse(result.data)
                    console.log(res)
                    if(res.code === 1){
                        self.orderStats = res.data;
                        // 组装datablock数据
                        self.getDataBlock();
                        let tMapData = []
                        geo.features.map(item => {
                            let { adcode, name, level, center } = item.properties;
                            self.geoObjNameToAdcode[name] = adcode;
                            self.geoObj[adcode] = {
                                value: self.orderStatsObj.hasOwnProperty(adcode) ? true : false,
                                name,
                                adcode,
                                level: extraCity.includes(adcode) ? 'city' : level, // 直辖市级别转换
                                center,
                                isShow: self.orderStatsObj.hasOwnProperty(adcode) ? true : false,
                            };
                            if(self.orderStatsObj.hasOwnProperty(adcode)){
                                tMapData.push({
                                    value: self.orderStatsObj.hasOwnProperty(adcode) ? true : false,
                                    name,
                                    adcode,
                                    level: extraCity.includes(adcode) ? 'city' : level, // 直辖市级别转换
                                    center,
                                    isShow: self.orderStatsObj.hasOwnProperty(adcode) ? true : false,
                                })
                            }
                            // return {
                            //     value: self.orderStatsObj.hasOwnProperty(adcode) ? true : false,
                            //     name,
                            //     adcode,
                            //     level: extraCity.includes(adcode) ? 'city' : level, // 直辖市级别转换
                            //     center,
                            //     isShow: self.orderStatsObj.hasOwnProperty(adcode) ? true : false,
                            // };
                        });
                        self.initEcharts(geo.name, tMapData, geo.features);
                    }else{
                        self.$message.error(res.msg)
                    }
                }else{
                    self.$message.error(result.msg)
                }
            } catch (error) {}
        },
        // 组装datablock数据
        getDataBlock(){
            let self = this;
            self.dataBlock = {}
            self.orderStats.forEach((item) => {
                if(self.currentInfo.code == chinaCode){
                    self.orderStatsObj[item.provinceCode] = item.totalDriverNum
                }else{
                    self.orderStatsObj[item.cityCode] = item.totalDriverNum
                }
                Object.entries(item).forEach(([field, value]) => {
                    if (!field.endsWith('Num')) {
                        return
                    }
                    if (!self.dataBlock[field]) {
                        self.dataBlock[field] = 0
                    }
                    let val = Number(value)
                    if (Number.isNaN(val)) {
                        val = 0
                    }
                    self.dataBlock[field] += val
                })
            })
        },
        getGeoJson(adcode, childAdcode = '') {
            let name = '';
            return new Promise((resolve, reject) => {
                function insideFun(adcode, childAdcode) {
                    AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer, SimpleMarker) => {
                        let districtExplorer = new DistrictExplorer();
                        districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
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
        // 初始化地图配置
        initEcharts(name, data, features) {
            let self = this;
            let geoCoordMap = [];
            features.map(function (e, item) {
                geoCoordMap[e.properties.name] = e.properties.center;
            });
            const convertData = function (data) {
                const res = [];
                for (let i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(self.orderStatsObj[data[i].adcode]),
                            adcode: data[i].adcode,
                            level: data[i].level,
                            center: data[i].center,
                            isShow: data[i].isShow
                        });
                    }
                }
                return res;
            };
            let option = {
                visualMap: {
                    type: 'piecewise',
                    pieces: [
                        { value: 0, label: '无权限', color: 'rgba(14, 28, 75, 0.2)' },
                        { value: 1, label: '有权限', color: 'rgba(14, 28, 75, 1)' },
                    ],
                    show: false,
                },
                // 地图展示
                geo: {
                    map: name || 'china',  // 引入地图 省份或者 国家
                    layoutCenter: ["50%", "50%"], //设置后left/right/top/bottom等属性无效
                    layoutSize: "45%",
                    roam: true, //开启鼠标缩放和漫
                    zoom: 2,
                    // data,
                    itemStyle: {
                        areaColor: 'rgba(14, 28, 75, 1)',
                        borderColor: 'rgba(218, 221, 248, 0.32)',
                        borderWidth: 1,
                    },
                    select: {
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
                    label: {
                        normal: {
                            //静态的时候展示样式
                            show: true, //是否显示地图省份得名称
                            textStyle: {
                                color: "#fff",
                                fontSize: 10,
                                fontFamily: "Arial"
                            },
                            formatter: ( p ) => {
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
                                        p.name = '香港';
                                        break;
                                    case '澳门特别行政区':
                                        p.name = '澳门';
                                        break;
                                    case '台湾省':
                                        p.name = '台湾';
                                    default:
                                }
                                return p.name;
                            },
                        },
                        emphasis: {  // 高亮状态下的样式
                            //动态展示的样式
                            color: "#fff",
                            show: true,
                        },
                    },
                },
                series: [
                    {
                        name: '点',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        symbol: 'image://'+require('./image/icon_distr_map@2x.png'), //气泡
                        symbolSize: [30, 38], // 气泡尺寸 [宽，高]
                        // symbolOffset: ['-50%', '-80%'], // 气泡位置
                        label: {
                            normal: {
                                formatter: '{@[2]}',
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 14,
                                }
                            }
                        },
                        itemStyle: {
                            position: ['50%', '50%'],
                            normal: {
                                textStyle: {
                                    color: '#F05259',
                                    
                                },
                                color: '#F05259', // 标志颜色坐标背景色
                                fontSize: 24,
                            }
                        },
                        position: 'left',
                        zlevel: 6,
                        // data: [{"name":"天津市","value":[117.4219,39.4189,1]}],
                        data: convertData(data)
                    },
                ]
            };
            if (this.currentInfo.code === 460000) {
                // 海南地图缩放问题
                option.series[0].center = [109.844902, 19.0392];
                option.series[0].layoutCenter = ['50%', '50%'];
                option.series[0].layoutSize = '600%';
            }
            this.chart.setOption(option, true);
            this.autoSize();
        },
        // 下钻
        goDown(e) {
            if(e.componentType === 'geo'){
                let adCode = this.geoObjNameToAdcode[e.name]
                e['data'] = {
                    name: this.geoObj[adCode].name, 
                    adcode: this.geoObj[adCode].adcode,  
                    level: this.geoObj[adCode].level,  
                    center: this.geoObj[adCode].center,
                    value: this.geoObj[adCode].value,
                    isShow: this.geoObj[adCode].isShow,
                }
            }
            if (!e.data || !e.data.isShow || !e.data.name) {
                this.$message.error(`暂无${e.name}查看权限`);
                return;
            }
            let { name, adcode, level, center } = e.data;
            if (level === 'city') {
                const municipalityList = {
                    110000: 110100, // 北京
                    120000: 120100, // 天津
                    310000: 310100, // 上海
                    500000: 500100, // 重庆
                }
                if(municipalityList[adcode]){
                    adcode = municipalityList[adcode]
                }
                const [lng, lat] = center
                // 跳转到地图
                // this.$router.push({ path: '/workbench/orderMap/dispatch/city', query: { center, adcode, city: name } });
                this.$router.push({
                    path: '/workbench/distributionMap/city',
                    query: {
                        name: name,
                        cityCode: adcode,
                        lng,
                        lat
                    }
                });
                return;
            }
            this.currentInfo = {
                name,
                code: adcode,
            };
            this.genEchartMap(adcode);
        },
        autoSize() {
            let { clientWidth, clientHeight } = document.getElementsByClassName('order-hot-box') && document.getElementsByClassName('order-hot-box')[0];
            let mapChart = document.getElementById('myChart');
            if(mapChart){
                mapChart.style.width = clientWidth + 'px';
                mapChart.style.height = (clientHeight - 200) + 'px';
                this.chart.resize();
            }
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
    }
  };
</script>

<style scoped lang="scss">
.main-section .height-abs.order-hot-box {
    background: #fff !important;
    margin: 24px !important;
    height: 95% !important;
    overflow: hidden;
}
  #chart-china {
    width: 100%;
    height: 600px;
    margin-top: 20px;
  }
.echartMap {
    // height: 84%;
    width: 100%;
    border-radius: 8px;
    position: relative;
    background: #F5F7FA;
    background: url('~@/assets/images/map-bg.png');
    background-size: cover;
}
</style>
