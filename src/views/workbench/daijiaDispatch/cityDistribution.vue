<template>
    <div class="order-hot-box">
        <!--内容区域-->
        <div>
            <screening-operation @func="getApi" :showBack='true' @goBack="goBack" :meunTitle="meunTitle"></screening-operation>
            <data-block :data="dataBlock"></data-block>
            <!--查询条件-->
            <div style="margin-bottom: 6px;display: flex;">
                <el-form style="display: inline-block;display: flex;flex: 1;" :inline="true" :model="filters" ref="filters">
                    <el-form-item label="司机姓名" prop="driverName">
                        <el-input v-model="filters.driverName" placeholder="车主姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="司机手机号" prop="driverPhone">
                        <el-input v-model="filters.driverPhone" placeholder="司机手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="司机工号" prop="jobNum">
                        <el-input v-model="filters.jobNum" placeholder="司机工号"></el-input>
                    </el-form-item>
                    <el-form-item label="所属机构" prop="relationId" v-if="orgType == 0">
                        <el-cascader placeholder="请选择机构" v-model="orgId" @change="changeRelationId" filterable :props="relationProps" clearable></el-cascader>
                    </el-form-item>
                </el-form>
                <el-button-group v-if="powerList.getDriverLocationList">
                    <el-button type="primary" icon="el-icon-search" @click="getListCX">查询</el-button>
                    <ws-throttle>
                        <el-button class="resetBtn" type="primary" @click="resetForm('filters')" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
            </div>
            <div class="toolbarMap">
                <dl class="dl">
                    <dt>代驾图例</dt>
                    <dd :class="[{'cur':2==filters.orderStatus}]" @click="onclassShow(2)"><img src="./image/car002.png" /><span>在线司机</span>
                    </dd>
                    <dd :class="[{'cur':1==filters.orderStatus}]" @click="onclassShow(1)"><img src="./image/car001.png" /><span>服务中</span></dd>
                </dl>
            </div>
            <div id="container" :style="{'height':clientHeight + 'px'}" class="mt10"></div>
        </div>
    </div>
</template>

<script>
import DataBlock from './components/dataBlock';
import ScreeningOperation from './components/screeningOperation';
import { mapActions } from 'vuex';
import { mixins } from './mixins';

export default {
    components: {
        ScreeningOperation,
        DataBlock
    },
    mixins: [mixins],
    data () {
        return {
            moduleName: '/workbench/distributionMap',
            clientHeight: '', // 屏幕高度
            classShow: true,//未接单显示数据
            classShow2: true,//进行中显示数据
            classShow3: true,//进行中显示数据
            meunTitle: '代驾司机分布图-',
            dataBlock: {},
            filters: {
                driverName: null,
                driverPhone: null,
                jobNum: null,
                organization: null,
                orderStatus: null,
            },
            orderType: null,
            driverIdLatlngs: [],
            relationId: [],
            relationProps: {
                expandTrigger: 'click',
                value: 'cityCode',
                label: 'name',
                checkStrictly: false,
                lazy: true,
                lazyLoad: this.lazyLoad
            },
            map: null,
            orgId: ''
        };
    },
    created () {
        this.filters.orderStatus = 2;
    },
    mounted () {
        // 获取浏览器可视区域高度
        this.clientHeight = `${document.documentElement.clientHeight}` - '400';
        this.name = this.$route.query.name; // 上级赋值
        this.cityCode = this.$route.query.cityCode; // 上级code
        this.meunTitle = '代驾司机分布图-' + this.name;//标题
        window.sessionStorage.setItem('moduleName', '/dataServer/orderAnalysis/todayAchievement')
        this.getDrivingStatistics();
        this.getDriverLocationListFun();
        window.addEventListener('resize', this.autoSize);
    },
    methods: {
        goBack(){
            this.$router.push({name: 'distributionMap'})
        },
        // 在线 / 服务中
        onclassShow (orderType) {
            this.filters.orderStatus = orderType;
            this.getDriverLocationListFun();
        },
        //查询
        getListCX () {
            this.latlngs = [];
            this.getDrivingStatistics();
            this.getDriverLocationListFun();
        },
        //重置筛选条件
        resetForm (formName) {
            this.$refs[formName].resetFields();
            this.orgId = null;
            this.cityCode = this.$route.query.cityCode;
            this.getDrivingStatistics();
            this.getDriverLocationListFun();
        },
        // 接口
        getApi (val) {
            this.getDrivingStatistics();
            this.getDriverLocationListFun();
        },
        //详情地图路线
        async getDrivingStatistics () {
            try {
                let params = {
                    op: 'getDrivingStatistics',
                    data: {
                        ...this.filters,
                        cityCode: this.cityCode,
                    },
                };
                if(params.data.orgId){
                    params.data.cityCode = ''
                }
                params.data = JSON.stringify(params.data);
                let URL = this.powerList.getDrivingStatistics;
                let result = await this.$axios(URL, params);
                // result = {"code":1,"msg":"响应成功","data":{"provinceCode":null,"provinceName":null,"cityCode":420100,"cityName":"武汉市","totalDriverNum":98,"newDriverNum":93,"oldDriverNum":5,"onlineDriverNum":1,"serviceDriverNum":1,"waitDriverNum":0,"totalOrderNum":0,"matchingOrderNum":0,"matchedOrderNum":0}}
                if(result.code === 1){
                    let resp = JSON.parse(result.data)
                    if (resp.code === 1 && resp.data) {
                        this.dataBlock = resp.data;
                    }else{
                        this.$message.error(resp.msg)
                    }
                }else{
                    this.$message.error(result.msg)
                }
            } catch (error) {
            }
        },
        //获取司机位置信息
        async getDriverLocationListFun () {
            let params = {
                op: 'getDriverLocationList',
                data: {
                    ...this.filters,
                    cityCode: this.cityCode,
                }
            };
            if(params.data.orgId){
                params.data.cityCode = ''
            }
            params.data = JSON.stringify(params.data);
            try {
                let URL = this.powerList.getDriverLocationList;
                let result = await this.$axios(URL, params);
                if(result.code === 1){
                    let resp = JSON.parse(result.data)
                    // let resp = {"code":1,"msg":"响应成功","data":[{"driverId":"101700363","lon":"114.408167","lat":"30.476807","type":2}]}
                    if (resp.code === 1 && resp.data) {
                        this.driverIdLatlngs = resp.data;
                    }else{
                        this.driverIdLatlngs = [];
                        this.$message.error(resp.msg)
                    }
                }else{
                    this.$message.error(result.msg)
                }
                // this.init();
                this.initMap();
            } catch (error) {
                console.log(error)
            }
        },
        // 初始化地图
        initMap() {
            let self = this;
            let { lng, lat } = this.$route.query;
            let center = [lng, lat]
            if(!this.map){
                this.map = new AMap.Map('container', {
                    zoom: 12,
                    resizeEnable: true,
                    viewMode: '2D', // Loca 自 1.2.0 起 viewMode 模式默认为 3D，如需 2D 模式，请显示配置。
                    center,
                    mapStyle: 'amap://styles/b265c2b3c5dc85d44e1fcedeac037ead',
                    zooms: [6, 14], //地图显示的缩放级别范围
                });
            }
            this.map.clearMap();
            let markers = [];
            for (var i = 0; i < this.driverIdLatlngs.length; i++) {
                (function (n) {
                    let icon;
                    if (self.driverIdLatlngs[n].type == 1) {
                        icon = require('./image/car004.png');
                    } else {
                        icon = require('./image/car003.png');
                    }
                    if(self.driverIdLatlngs[n].lon && self.driverIdLatlngs[n].lat){
                        let marker = new AMap.Marker({
                            position: [self.driverIdLatlngs[n].lon, self.driverIdLatlngs[n].lat],
                            icon,
                        });
                        markers.push(marker)
                    }
                })(i);
            }
            this.map.add(markers);
            this.map.setFitView();
        },
        changeRelationId(v){
            this.cityCode = v[2]
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
    }
};
</script>

<style scoped lang="scss">
.main-section .height-abs.order-hot-box {
    background: #fff !important;
    margin: 24px !important;
    height: 95% !important;
}
#container {
    min-width: 600px;
    min-height: 400px;
    border-radius: 8px;
}

.toolbarMap {
    position: absolute;
    z-index: 1;
    margin-top: 16px;
    margin-left: 16px;
    background: #fff;
    padding: 12px 16px;
    box-shadow: 0px 6px 20px 0px rgba(0,0,0,0.12);
    border-radius: 4px;
}

.dl dt {
    float: left;
    font-weight: bold;
    line-height: 47px;
    margin-right: 10px;
}

.dl dd {
    display: inline-block;
    background-color: white;
    padding: 5px 10px;
    border-radius: 5px;
    border: solid 1px #ffffff;
    vertical-align: middle;
    cursor: pointer;
    img {
        width: 25px;
        height: auto;
        margin-right: 10px;
    }

    span {
        vertical-align: top;
        line-height: 34px;
    }
}

.dl dd.cur {
    border: solid 1px #999999;
}
</style>
