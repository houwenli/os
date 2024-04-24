<template>
    <div class="order-hot-box">
        <!--内容区域-->
        <div class="sensitiveThesaurus-menu toolbar">
            <el-form :model="filters" ref="filters" label-width="100px">
                <div>
                    <el-row>
                        <el-col :span="8" :md="8" :lg="8" :xl="8" v-if="orgType == 0">
                            <el-form-item label="选择机构:" prop="relationId">
                                <el-cascader placeholder="请选择机构" style="min-width: 255px;" v-model="relationId" @change="changeRelationId" filterable :props="relationProps" clearable></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16" :md="16" :lg="16" :xl="16">
                            <el-form-item label="日期:" prop="endDate">
                                <div class="dateTypeBox">
                                    <el-radio-group v-model="filters.dateType" @change="changeDateType" style="min-width: 255px;">
                                        <el-radio-button :label="0">今天</el-radio-button>
                                        <el-radio-button :label="-6">近7天</el-radio-button>
                                        <el-radio-button :label="-29">近30天</el-radio-button>
                                    </el-radio-group>
                                    <ws-date-range
                                        :startTime.sync="filters.startDate"
                                        :endTime.sync="filters.endDate"
                                        value-format="yyyy-MM-dd"
                                        :type="'daterange'"
                                        :pickerOptions="pickerOptions"
                                    ></ws-date-range>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :md="8" :lg="8" :xl="8">
                            <el-form-item label="订单类型:" prop="orderType">
                                <el-checkbox-group v-model="filters.orderType" @change="changeOrderType"  style="min-width: 240px;">
                                    <el-checkbox-button :label="1">实时单</el-checkbox-button>
                                    <el-checkbox-button :label="2">预约单</el-checkbox-button>
                                    <el-checkbox-button :label="3">扫码单</el-checkbox-button>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16" :md="16" :lg="16" :xl="16">
                            <el-form-item label="订单节点:" prop="orderNode">
                                <el-radio-group v-model="filters.orderNode">
                                    <el-radio-button :label="1">车主下单</el-radio-button>
                                    <el-radio-button :label="2">车主完单</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
        <div class="btn-box-map">
            <span class="refreshSpan">最后更新时间：{{refreshDate}}</span>
            <el-button-group>
                <el-button type="primary" icon="el-icon-search" v-if="powerList.getHotZoneCondition" @click="getListCX">查询</el-button>
                <ws-throttle>
                    <el-button class="resetBtn" type="primary" v-if="powerList.getHotZoneCondition" @click="resetForm('filters')" icon="el-icon-refresh-left"></el-button>
                </ws-throttle>
            </el-button-group>
        </div>
        <div v-loading="loading" class="container-box">
            <div class="map-float">
                <div class="panelBox">
                    <p>车主{{filters.orderNode == 1 ? '下单' : '完单'}}总数： {{total}} 单</p>
                </div>
                <div class="mapBottom">
                    <div class="signsBox">
                        <span class="signsBox-title">围栏颜色图例: </span>
                        <p class="color-box" @click="changeOrderNode(1)">
                            <span class="color-span"  :class="[filters.orderNode == 1 ? 'red' : '']"></span>
                            <label :style="{fontWeight: filters.orderNode == 1 ? '600': ''}">车主下单</label>
                        </p>
                        <p class="color-box" @click="changeOrderNode(2)">
                            <span class="color-span" :class="[filters.orderNode == 2 ? 'blue' : '']"></span>
                            <label :style="{fontWeight: filters.orderNode == 2 ? '600': ''}">车主完单</label>
                        </p>
                    </div>
                    <div class="level-box">
                            <p class="color-box" v-for="(item, index) in levelList" :key="index">
                                <span class="color-span" :style="{background: item.color}"></span>
                                <label v-if="index == 0">0-{{item.label}}</label>
                                <label v-else>{{levelList[index-1].label}}-{{item.label}}</label>
                            </p>
                        </div>
                    <div class="signsBox fence-box">
                        <span class="signsBox-title">电子围栏半径(m): </span>
                    </div>
                    <div>
                        <el-radio-group v-model="filters.hexagonRadius">
                            <el-radio :label="500">500</el-radio>
                            <el-radio :label="1000">1000</el-radio>
                            <el-radio :label="1500">1500</el-radio>
                        </el-radio-group>
                    </div>
                </div>
            </div>
            <div id="container" :style="{'height':clientHeight + 'px'}" style="border-radius: 8px;width: 100%"></div>
        </div>
    </div>
</template>

<script>
import * as util from "./utils/index";
// import SelectProvinces from "./components/selectProvincesedit"; // 订单起点城市
import { mapActions } from 'vuex';
import { mixins } from './mixins';

export default {
    name: "orderHotSpot",
    components: {
        // SelectProvinces,
    },
    mixins: [mixins],
    data() {
        return {
			refreshDate: null, // 最后刷新时间
			total: 0, // 下单总数
            clientHeight: "", //屏幕宽度
            moduleName: "/workbench/orderHotSpot",
            loading: false, // 加载
            lists: [],
            filters: {
                cityCode: null,
                // provinceCode: null,
                startDate: null,
                endDate: null,
                dateType: 0,
                orderType: [1, 2, 3],
                orderNode: 1,
				hexagonRadius: 500
            },
            levelRedList: [
                { label: "400", level: 1, color: "rgba(237,34,34, .24)" },
                { label: "600", level: 2, color: "rgba(237,34,34, .4)" },
                { label: "800", level: 3, color: "rgba(237,34,34, .56)" },
                { label: "1000", level: 4, color: "rgba(237,34,34, .72)" },
                { label: "1000", level: 5, color: "rgba(237,34,34, 1)" }
                
            ],
            levelBlueList: [
                { label: "400", level: 1, color: "rgba(3, 143, 255, .24)" },
                { label: "600", level: 2, color: "rgba(3, 143, 255, .4)" },
                { label: "800", level: 3, color: "rgba(3, 143, 255, .56)" },
                { label: "1000", level: 4, color: "rgba(3, 143, 255, .72)" },
				{ label: "1000", level: 5, color: "rgba(3, 143, 255, 1)" }
			],
            choiceDate: '',
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    this.choiceDate = minDate.getTime();
                    if (maxDate) {
                        this.choiceDate = '';
                    }
                },
                disabledDate: time => {
                    if (this.choiceDate) {
                        let current = new Date(new Date().toLocaleDateString()).getTime() + (86400000 - 1000);
                        let minDate2 = this.choiceDate
                        return time.getTime() > current || time.getTime() >=  Date.parse(util.getFinalDay(89, minDate2)) || time.getTime() <=  Date.parse(util.getFinalDay(-89, minDate2))
                    } else {
                        let current = new Date(new Date().toLocaleDateString()).getTime() + (86400000 - 1000);
                        return time.getTime() > current
                    }
                }
            },
            orderHotZoneList: [], // 经纬度
            map: null,
            infoWindow: null,
            address: '',
            list: [],
            interval: 1,
            polygon: null,
            label: null,
            hexagonObj: {}, // 热区信息
            relationId: [],
            relationProps: {
                expandTrigger: 'click',
                value: 'cityCode',
                label: 'name',
                checkStrictly: false,
                lazy: true,
                lazyLoad: this.lazyLoad
            },
        };
    },
    watch: {
        filters: {
            handler: 
            util.debounce(function() {
                if(!this.filters.cityCode || !this.filters.startDate || !this.filters.endDate) {
                    return false
                }
                this.getHotZoneCondition()
            }, 500),
            // function(){
            //     if(!this.filters.cityCode || !this.filters.startDate || !this.filters.endDate) {
            //         return false
            //     }
            //     this.getHotZoneCondition()
            // },
            deep: true
        }
    },
	computed: {
		levelList() {
			if(this.filters.orderNode == 1) {
                this.levelRedList.forEach((item, index) =>{
                    this.$set(item, 'label', this.interval*(index+1))
                })
				return this.levelRedList
			}else {
                this.levelBlueList.forEach((item, index) =>{
                   this.$set(item, 'label', this.interval*(index+1))
                })
				return this.levelBlueList
			}
		},
    },
    mounted() {
        // 获取浏览器可视区域高度
        this.clientHeight = `${document.documentElement.clientHeight}` - "400";
        this.refreshDate = util.timestampToTime13(new Date());
        this.map = new AMap.Map('container', {
            zoom: 9,
        });
        this.getSignInCity();
        window.sessionStorage.setItem('moduleName', '/dataServer/orderAnalysis/todayAchievement')
        window.addEventListener('resize', this.autoSize);
    },
    methods: {
        // 根据权限查询城市  0 为全国 其它都是城市
        async getSignInCity(orgId){
            let self = this;
            // self.map = new AMap.Map('container', {
            //     zoom: 9,
            // });
            let params = {
                op: 'getSignInCity',
                data: {
                    orgId
                }
            }
            let URL = self.powerList.getSignInCity;
            let result = await self.$axios(URL, params);
            if(result.code === 1){
                let res = JSON.parse(result.data)
                if(res.code === 1){
                    if(res.data.cityCode == 0){
                        self.getLocationClick();
                    }else{
                        self.getCityLngLat(res.data.cityCode, res.data.cityName)
                    }
                }else{
                    self.$message.error(res.msg)
                }
            }else{
                self.$message.error(result.msg)
            }
        },
        getCityLngLat(cityCode){
            let self = this;
            AMap.plugin('AMap.DistrictSearch', function () {
                // 创建行政区查询对象
                var district = new AMap.DistrictSearch({
                    // 返回行政区边界坐标等具体信息
                    extensions: 'base',
                    // 设置查询行政区级别为 区 
                    level: 'city'
                })

                district.search(cityCode + '', function(status, result) {
                    // 获取朝阳区的边界信息
                    if (status === 'complete' && result.districtList.length) {
                        let lnglat = result.districtList[0].center;
                        let position = new AMap.LngLat(lnglat.lng, lnglat.lat);  // 标准写法
                        self.map.setCenter(position); 
                        self.filters.cityCode = cityCode;
                        self.changeDateType(0)
                    }else{
                        self.$message.error('根据地址查询位置失败');
                    }
                })
            })
        },
        changeRelationId(v){
            this.getCityLngLat(v[2])
        },
        //查询
        getListCX() {
            if(!this.filters.endDate) {
                this.$message.error("请选择结束日期")
                return false
            }
            this.getHotZoneCondition()
        },
        //重置筛选条件
        resetForm(formName) {
            this.address = null
            this.$refs[formName].resetFields();
            this.filters.cityCode = null;
            this.filters.startDate = null;
            this.filters.endDate = null;
            this.filters.dateType = 0;
            this.filters.orderType = [1, 2, 3];
            this.filters.orderNode = 1;
            this.filters.hexagonRadius = 500;
            this.relationId = null;
            this.getSignInCity();            
        },
        //时间格式化
        dateFormat(timestamp) {
            if (timestamp) {
                return util.timestampToTime(timestamp);
            } else {
                return "--";
            }
        },
        //时间选择
        changeDateType(type) {
            if (type || type == 0) {
                let start = util.getFinalDay(type);
                let end = util.getFinalDay(0);
                this.filters.startDate = start
                this.filters.endDate = end
            }
        },
        // 获取当前定位信息
        async getLocationClick() {
            let self = this;
            if(!self.map){
                self.map = new AMap.Map('container', {
                    zoom: 9,
                });
            }
            //实例化城市查询类
            let citysearch = new AMap.CitySearch();
            //自动获取用户IP，返回当前城市
            await citysearch.getLocalCity(function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    if (result && result.city && result.bounds) {
                        // self.filters.provinceCode =  Number(`${result.adcode}`.slice(0,2) + "0000")
                        self.filters.cityCode = Number(`${result.adcode}`.slice(0,3) + "100")
                        self.address = result.city;
                        //地图显示当前城市
                        self.map.setBounds(result.bounds);
                        self.changeDateType(0)
                    }
                }
            });
        },
		changeOrderNode(data) {
			this.filters.orderNode = data
		},
        //
        changeOrderType(data) {
            if(data && data.length == 0) {
                this.filters.orderType = this.list
                return
            }
            this.list = data
        },
		// 查询热区列表
		async getHotZoneCondition() {
            let self = this;
            if(self.map){
                self.map.clearMap();
            }
            if(!self.filters.cityCode) {
                return false
            }
            if(self.filters.orderType.length == 0) {
                return false
            }
            let filters = {...self.filters}
            filters.orderType = self.filters.orderType.join(",")
			try {
                let params = {
                    op: 'getHotZoneCondition',
                    data: {
                        ...filters,
                        // 车主下单
                        // ...{"cityCode":440300,"provinceCode":440000,"startDate":"2022-05-01","endDate":"2022-07-29","dateType":null,"orderType":"1,2,3","orderNode":1,"hexagonRadius":1500}
                        // 车主完单
                        // ...{"cityCode":440300,"provinceCode":440000,"startDate":"2022-05-01","endDate":"2022-07-29","dateType":null,"orderType":"1,2,3","orderNode":2,"hexagonRadius":1500}
                    }
                }
                let URL = self.powerList.getHotZoneCondition;
                let result = await self.$axios(URL, params);
                self.orderHotZoneList = []
                if(result.code === 1){
                    let data = JSON.parse(result.data)
                    if (data.code == 1 && data.data) {
                        self.orderHotZoneList = data.data.orderHotZoneList;
                        let polygonList = [];
                        self.orderHotZoneList.forEach((item, index) => {
                            let hexagonList = []
                            item.hexagonList.forEach((ele, index2) => {
                                hexagonList.push([ele.lng, ele.lat])
                            })
                            let hexagonListPolygon = new AMap.Polygon({
                                bubble: true,
                                path: hexagonList, // 区域图形坐标集合
                                fillColor: self.getFillColor(item.level, self.filters.orderNode), // 图形颜色
                                strokeOpacity: 0, // 不显示边框
                            })
                            // 添加文本标记
                            self.creatMapText(item.orderCount, item.hexagonCenter, item.level, self.filters.orderNode, self)
                            // 获取位置名称
                            self.getPointName(item.hexagonCenter, item.hexagonId, item.orderCount, self)
                            // self.creatHoverText(item.orderCount, item.hexagonCenter, item.level, self.filters.orderNode, self)
                            // 添加hover属性
                            hexagonListPolygon.on('mouseover', () => {
                                // 创建信息窗体
                                self.creatHoverText(item.hexagonId, self)
                            })
                            hexagonListPolygon.on('mouseout', () => {
                                self.infoWindow.close()
                            })
                            polygonList.push(hexagonListPolygon)
                        });
                        self.map.add(polygonList);
                        self.map.setFitView();
                        self.total = data.data.total
                        self.refreshDate = data.data.refreshDate
                        self.interval = data.data.interval // 图例间隔
                    }else {
                        self.$message.error(data.msg || "查询热区失败")
                    }
                }else{
                    self.$message.error(result.msg)
                }
			} catch (error) {
			}
		},
        // 区域颜色
        getFillColor(level, type){
            if(type == 1){// 红色
                return this.levelRedList[level*1 - 1].color;
            }else{// 蓝色
                return this.levelBlueList[level*1 - 1].color;
            }
        },
        // 创建文本标记
        creatMapText(count, hexagonCenter, level, type, self){
            // 创建纯文本标记
            let text = new AMap.Text({
                text: count,
                anchor: 'center', // 设置文本标记锚点
                draggable: true,
                cursor: 'pointer',
                // title: count+'自定义', // hover
                angle:10,
                style:{
                    'border-width': 0,
                    'text-align': 'center',
                    'font-size': '12px',
                    'color': '#fff',
                    'opacity': '1',
                    'background': 'none'
                },
                position: [hexagonCenter.lng, hexagonCenter.lat]
            });
            text.setMap(self.map);
        },
        // 根据经纬度获取point
        async getPointName(hexagonCenter, hexagonId, count, self){
            let data = {
                op: 'getHotZoneInfo',
                data: {
                    lat: hexagonCenter.lat,
                    lng: hexagonCenter.lng
                }
            }
            let URL = self.powerList.getHotZoneInfo;
            let result = await self.$axios(URL, data);
            if(result.code === 1){
                let res = JSON.parse(result.data)
                if(res.code == 1 && res.data) {
                    self.hexagonObj[hexagonId] = {
                        address: res.data.address,
                        count: count,
                        hexagonCenter: hexagonCenter
                    }
                }else{
                    self.$message.error(res.msg)
                }
            }else{
                self.$message.error(result.msg)
            }
        },
        // 创建hover标识
        creatHoverText(hexagonId, self){
            // infowidnow 的 innerHTML
            let infoWindowContent =
                `<div class="orderHotSpot-customClass" style="">
                    <div style="margin-bottom: 8px;">
                        <label style="font-weight: lighter;">位置：</label><span>${self.hexagonObj[hexagonId].address}</span>
                    </div>
                    <div>
                        <label style="font-weight: lighter;">车主${self.filters.orderNode == 1 ? '下': '完'}单数：</label><span>${self.hexagonObj[hexagonId].count}</span>
                    </div>
                </div>
                `;
            // 创建一个自定义内容的 infowindow 实例
            self.infoWindow = new AMap.InfoWindow({
                isCustom: true, // 是否自定义
                position: new AMap.LngLat(self.hexagonObj[hexagonId].hexagonCenter.lng, self.hexagonObj[hexagonId].hexagonCenter.lat), // 信息展示的位置
                offset: new AMap.Pixel(0, -12), // hover信息中心点展示位置
                content: infoWindowContent
            });
            self.infoWindow.open(self.map);
        },
        ...mapActions('orderAnalysis', ['getOrgs', 'getArea']),
        lazyLoad(node, resolve) {
            let item = node.data;
            if (!item) {
                if (this.userArea && this.userArea.region) {
                    resolve(this.userArea.region);
                } else {
                    this.getArea().then(res => {
                        res.region.forEach(item => {
                            if (this.orgType === 5) {
                                item.leaf = true;
                            }
                            if (this.orgType === 30) {
                                item.leaf = true;
                            }
                            if (this.orgType === 40) {
                                item.leaf = true;
                            }
                        })
                        resolve(res.region);
                    });
                }
            } else {
                if (item.leaf) {
                    resolve(item);
                    return;
                }
                // const params = item ? (item.type === 0 ? { bigRegionNumber: item.number } : { regionNumber: item.number }) : {};
                let params = {}
                if (item) {
                    if (item.type === 0) {
                        params = { bigRegionNumber: item.number }
                    }
                    if (item.type === 10) {
                        params = { regionNumber: item.number }
                    }
                    if (item.type === 20) {
                        params = { companyNumberList: [item.number] }
                    }
                    if (item.type === 30) {
                        params = { centerNumber: item.number }
                    }
                }
                this.getOrgs(params).then(result => {
                    result.forEach(item => {
                        if (this.orgType<10) {
                            item.leaf = item.type === 20;
                        }
                        if (this.orgType === 20) {
                            item.leaf = item.type === 40;
                        }
                        if (this.orgType === 30) {
                            item.leaf = false;
                        }
                    });
                    resolve(result);
                });
            }
        },
        autoSize() {
            this.clientHeight = `${document.documentElement.clientHeight}` - "400";
        },
    }
};
</script>
<style>
.orderHotSpot-customClass{
    padding: 12px;
    border-radius: 4px;
    background: rgba(0,0,0,0.7);
    box-shadow: 0px 6px 17px 0px rgba(0,0,0,0.2);font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 20px;
    position: relative;
}
.orderHotSpot-customClass::before{
  content: '';
  position:absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid rgba(0,0,0,0.7);
  font-size: 0;
  line-height: 0;
  opacity: .9;
}
</style>
<style lang="scss" scoped>
.el-cascader {
    width: 100%;
}
.main-section .height-abs.order-hot-box {
    background: #fff !important;
    margin: 24px !important;
    height: 95% !important;
    overflow: hidden;
}
.sensitiveThesaurus-menu {
    margin-top: 8px;
    background: #F5F7FA;
    border-radius: 8px;
    border: 1px solid #EBEEF5;
    margin-bottom: 20px;
    padding: 24px;
}
.btn-box-map {
    margin-bottom: 20px;
    text-align: right;
}
.map-float {
    position: absolute;
    text-align: left;
    top: 16px;
    z-index: 20;
    left: 16px;
}
/** 总单数 */
.container-box {
	position: relative;
	.panelBox {
        text-align: left;
        padding: 13px 16px;
        background: #FFFFFF;
        border-radius: 4px;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        font-size: 16px;
        width: fit-content;
        box-shadow: 0px 6px 20px 0px rgba(0,0,0,0.12);
	}
}
.dateTypeBox {
    display: flex;
}
.refreshSpan {
    color: #666;
    margin-right: 14px;
}
.mapBottom {
    box-shadow: 0px 6px 20px 0px rgba(0,0,0,0.12);
    margin-top: 8px;
    background: #fff;
    border-radius: 4px;
    padding: 16px;
    font-size: 14px;
    .level-box {
        display: flex;
        margin-top: 17px;
        .color-span {
            border-radius: 50% !important;
            color: #606266;
            line-height: 20px;
        }
    }
    .fence-box {
        margin-top: 16px;
        margin-bottom: 13px;
    }
    .signsBox,
    .level-box {
        display: flex;
        align-items: center;
        .signsBox-title {
            color: #333;
            font-weight: 600;
            margin-right: 14px;
        }
        .color-box {
            display: flex;
            align-items: center;
            margin-right: 20px;
            .color-span {
                display: inline-block;
                width: 14px;
                height: 14px;
                margin-right: 4px;
                border-radius: 2px;
                background: #C0C4CC;
                &.red {
                    width: 12p;
                    height: 12p;
                    background: rgba(237, 34, 34, 0.96);
					border: 1px solid rgba(237, 34, 34, 0.96);
					cursor: pointer;
                }
                &.blue {
                    width: 12p;
                    height: 12p;
                    background: rgba(3, 143, 255, 0.96);
					border: 1px solid  rgba(3, 143, 255, 0.96);
					cursor: pointer;
                }
            }
        }
    }
}
.relation-class .el-radio__inner {
    top: -18px;
    left: -19px;
    border-radius: 0;
    border: 0;
    width: 170px;
    height: 34px;
    background-color: transparent;
    cursor: pointer;
    box-sizing: border-box;
    position: absolute;
}
 
.relation-class .el-radio__input.is-checked .el-radio__inner {
    background: transparent;
}
</style>
