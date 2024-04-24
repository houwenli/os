<template>
    <div class="path">
        <el-steps class="step" :active="active" align-center style="margin: 0 0 10px 0">
            <el-step :class="[item.loctime && index == 7 ? 'is-cancel' : '']" v-for="(item, index) in stepData" :key="index" :title="item.title" :description="item.loctime"></el-step>
        </el-steps>
        <div class="route-box">
            <div class="route-box-left">
                <div class="route-cost">
                    <div class="route-cost-list" v-if="estimatedPrice">
                        <p style="color: #f05259; font-size: 15px; font-weight: bold">￥{{ estimatedPrice }}</p>
                        <p style="color: #999">预估费用</p>
                    </div>
                    <div class="route-cost-list" v-if="orderPrice">
                        <p style="color: #f05259; font-size: 15px; font-weight: bold">￥{{ orderPrice }}</p>
                        <p style="color: #999">订单费用</p>
                    </div>
                </div>
                <div class="start-end">
                    <p class="first" v-if="startAdress">{{ startAdress }}</p>
                    <p class="last" v-if="endAdress">
                        {{ endAdress }}
                        <span v-if="alterEndAddress == 1" class="alterEndAddress">改</span>
                    </p>
                </div>
                <div class="item-route" v-if="this.amapEstimateTrackVos.length">
                    <p class="map-type">高德方案：</p>
                    <ul>
                        <li v-for="(item, index) in amapEstimateTrackVos" :key="index" :class="[amapType === 1 && index === selecteRoutes ? 'active' : '']" @click="choose(1, index)">
                            <p class="title">预估线路( {{ toChinesNum(index + 1) }} )</p>
                            <div>
                                <p style="display: inline-block">
                                    <span>{{ item.distance }}公里</span>
                                    <span>{{ item.costTime }}分钟</span>
                                    <span class="tips" style="border: 1px solid #ffca58" v-if="item.flag">{{ flag[item.flag] }}</span>
                                </p>
                                <p style="float: right; color: #f05259; font-weight: bold">预估:{{ item.estimatePrice }}元</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="item-route" v-if="this.teCentEstimateTrackVos.length">
                    <p class="map-type">腾讯方案：</p>
                    <ul>
                        <li v-for="(item, index) in teCentEstimateTrackVos" :key="index" :class="[amapType === 2 && index === selecteRoutes ? 'active' : '']" @click="choose(2, index)">
                            <p class="title">预估线路( {{ toChinesNum(index + 1) }} )</p>
                            <div>
                                <p style="display: inline-block">
                                    <span>{{ item.distance }}公里</span>
                                    <span>{{ item.costTime }}分钟</span>
                                    <span class="tips" style="border: 1px solid #ffca58" v-if="item.flag">{{ flag[item.flag] }}</span>
                                </p>
                                <p style="float: right; color: #f05259; font-weight: bold">预估:{{ item.estimatePrice }}元</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="route-box-right">
                <div class="careful">
                    注意：绿色线路为司机实际行驶线路
                    <br />
                    红色线路为系统预估线路
                </div>
                <div id="map-content"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    props: ['dataList'],
    data() {
        return {
            // map: null,
            routes: 'runningRoute', // 行驶路线-规划路线
            active: 0, // 行驶路线-进度条
            stepData: [], // 行驶路线-进度数据
            amapType: 1, // 地图类型 1、高德地图，2、腾讯地图
            selecteRoutes: 0, // 规划线路方案
            orderPrice: '',
            estimatedPrice: '',
            alterEndAddress: 0,
            flag: {
                1: '采用里程',
                2: '采用时长',
                3: '采用里程/时长'
            },
            amapEstimateTrackVos: [], // 规划路线高德
            teCentEstimateTrackVos: [], // 规划路线腾讯
            startAdress: '',
            endAdress: '',
            moduleName: '/workbench/mixedOrder',
            op: {
                selectMapInfo: 'selectMapInfoExp',
                getDriverArriveMapInfo: 'getDriverArriveMapInfoComment'
            }
        };
    },

    methods: {
        ...mapActions('order', ['initPath', 'fixedPoint']),
        choose(type, index) {
            let data = [];
            this.amapType = type;
            this.selecteRoutes = index;
            if (type == 1 && this.amapEstimateTrackVos.length) {
                data = [this.amapEstimateTrackVos[index].paths];
            } else if (type == 2 && this.teCentEstimateTrackVos.length) {
                data = [this.teCentEstimateTrackVos[index].paths];
            }
            if (data.length > 0) {
                this.initPath2({ map: this.map, data });
            }
        },
        stepDatas(getStepData) {
            // 行驶路线订单进度
            this.stepData = [
                {
                    title: '乘客下单',
                    pointType: 'dispatch',
                    loctime: ''
                },
                {
                    title: '司机接单',
                    pointType: 'rob',
                    loctime: ''
                },
                {
                    title: '司机到达乘客上车点',
                    pointType: 'arrive',
                    loctime: ''
                },
                {
                    title: '行程开始(开始计费)',
                    pointType: 'chargeStart',
                    loctime: ''
                },
                {
                    title: '司机点击到达目的地',
                    pointType: 'chargeEnd',
                    loctime: ''
                },
                {
                    title: '发起付款',
                    pointType: 'confirmPay',
                    loctime: ''
                },
                {
                    title: '完成车费支付',
                    pointType: 'completePay',
                    loctime: ''
                },
                {
                    title: '取消订单',
                    pointType: 'cancel',
                    loctime: ''
                }
            ];
            getStepData.map(x => {
                if (x.pointType == 'start') {
                    this.startAdress = x.address;
                }
                if (x.pointType == 'end') {
                    this.endAdress = x.address;
                }
            });
            let haveSuccess = false;
            this.stepData.map(x => {
                let typeTime = getStepData.find(y => y.pointType == x.pointType);
                if (typeTime != null) {
                    if (typeTime.pointType == 'payTime' && typeTime.loctime != '') {
                        haveSuccess = true;
                    }
                    x.loctime = typeTime.loctime;
                }
            });
            if (haveSuccess) {
                this.stepData = this.stepData.filter(x => x.pointType != 'cancel');
            }
            for (let i = 0; i < this.stepData.length; i++) {
                if (this.stepData[i].loctime == '' || i + 1 == this.stepData.length) {
                    this.active = i;
                    break;
                }
            }
        },
        getData() {
            // this.catchPerson();
            this.travelRoute();
        },
        // 接驾路线
        catchPerson() {
            const url = this.getModuleUrl(this.op.getDriverArriveMapInfo);
            // console.log("url---",url);

            let reqData = {
                data: { orderId: this.$route.query.orderId, type: 1 },
                op: this.op.getDriverArriveMapInfo
            };
            this.$axios(url, reqData).then(
                res => {
                    const result = JSON.parse(res.data);
                    // console.log("--result---1--", result);
                    if (result.tracks && result.tracks.length > 0) {
                        let data = [
                            {
                                name: '万顺叫车路线',
                                path: []
                            }
                        ];
                        result.tracks[0].points.forEach(x => {
                            data[0].path.push([x.lon, x.lat]);
                        });
                        // console.log("-datas---", data);
                        if (data.length > 0) {
                            this.pickUpRoute({ map: this.map, data });
                        }
                    }
                },
                error => {
                    this.$message.error(error.msg);
                }
            );
        },

        travelRoute() {
            let endArr = []; //修改终点
            const url = this.getModuleUrl(this.op.selectMapInfo);
            let reqData = {
                data: { orderId: this.$route.query.orderId },
                op: this.op.selectMapInfo
            };
            this.$axios(url, reqData).then(
                res => {
                    const result = JSON.parse(res.data);
                    let data = [
                        {
                            name: '万顺叫车路线',
                            path: []
                        }
                    ];
                    if (result.hasOwnProperty('orderPrice')) {
                        this.orderPrice = this.$baseMethod.regFenToYuan(result.orderPrice);
                    }
                    if (result.hasOwnProperty('estimatedPrice')) {
                        this.estimatedPrice = this.$baseMethod.regFenToYuan(result.estimatedPrice);
                    }
                    if (result.hasOwnProperty('alterEndAddress')) {
                        this.alterEndAddress = result.alterEndAddress;
                    }
                    if (result.pointList && result.pointList.length > 0) {
                        result.pointList.forEach(element => {
                            data[0].path.push([element.lon, element.lat]);
                        });
                    }
                    if (data.length > 0) {
                        this.initPath({ map: this.map, data });
                    }
                    if (result.endAddrList && result.endAddrList.length) {
                        result.endAddrList.forEach(item => {
                            endArr.push({
                                point: item.endPoint,
                                address: item.endAddr,
                                pointType: 'end'
                            });
                        });
                    }
                    // 新增修改终点纪录
                    let { endAddrList = [] } = result;
                    if (endAddrList.length) {
                        let list = endAddrList.map(({ endAddr, endPoint, updateTime }) => ({
                            point: endPoint,
                            pointType: 'update',
                            address: endAddr,
                            loctime: updateTime
                        }));
                        result.mapPointList.push(...list);
                    }
                    this.amapEstimateTrackVos = result.amapEstimateTrackVos.map(x => {
                        let { flag, orderId, serialNumber, tracks, estimatePrice } = x;
                        tracks = JSON.parse(tracks);
                        let { costTime, distance, points } = tracks;
                        estimatePrice = this.$baseMethod.regFenToYuan(estimatePrice);
                        costTime = this.$baseMethod.regSecondToMinute(costTime);
                        distance = this.$baseMethod.regRiceToKm(distance);
                        if (points != null) {
                            let arr = JSON.parse(points);
                            let result = [];
                            for (let i = 0; i < arr.length; i += 2) {
                                result.push([arr[i], arr[i + 1]]);
                            }
                            points = result;
                        }
                        return {
                            flag: flag,
                            orderId: orderId,
                            serialNumber: serialNumber,
                            orderId: orderId,
                            estimatePrice: estimatePrice,
                            costTime: costTime,
                            distance: distance,
                            paths: {
                                name: '万顺叫车路线',
                                path: points
                            }
                        };
                    });
                    this.teCentEstimateTrackVos = result.teCentEstimateTrackVos.map(x => {
                        let { flag, orderId, serialNumber, tracks, estimatePrice } = x;
                        tracks = JSON.parse(tracks);
                        let { costTime, distance, points } = tracks;
                        estimatePrice = this.$baseMethod.regFenToYuan(estimatePrice);
                        costTime = this.$baseMethod.regSecondToMinute(costTime);
                        distance = this.$baseMethod.regRiceToKm(distance);
                        if (points != null) {
                            let arr = JSON.parse(points);
                            let result = [];
                            for (let i = 0; i < arr.length; i += 2) {
                                result.push([arr[i], arr[i + 1]]);
                            }
                            points = result;
                        }
                        return {
                            flag: flag,
                            orderId: orderId,
                            serialNumber: serialNumber,
                            orderId: orderId,
                            estimatePrice: estimatePrice,
                            costTime: costTime,
                            distance: distance,
                            paths: {
                                name: '万顺叫车路线',
                                path: points
                            }
                        };
                    });
                    if (this.amapEstimateTrackVos.length) {
                        this.choose(1, 0);
                    }
                    if (!this.amapEstimateTrackVos.length && this.teCentEstimateTrackVos.length) {
                        this.choose(2, 0);
                    }
                    this.stepDatas(result.mapPointList);
                    this.fixedPoint({ map: this.map, pointArr: result.mapPointList.concat(endArr) });
                },
                error => {
                    this.$message.error(error.msg);
                }
            );
        },
        initPath2(param) {
            if (window.pathSimplifierIns2) {
                //通过该方法清空上次传入的轨迹
                pathSimplifierIns2.setData([]);
            }
            AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {
                if (!PathSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！无法展示路径');
                    return;
                }
                let pathSimplifierIns2 = new PathSimplifier({
                    zIndex: 99,
                    map: param.map,
                    getHoverTitle: function (pathData, pathIndex, pointIndex) {
                        // 鼠标悬停在节点之间的连线上
                        return pathData.name || '未知路径';
                    },
                    getPath: function (pathData, pathIndex) {
                        // 返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
                        return pathData.path;
                    },
                    data: param.data,
                    autoSetFitView: true,
                    renderOptions: {
                        // 轨迹线的样式
                        pathLineStyle: {
                            strokeStyle: '#E04356',
                            lineWidth: 10,
                            dirArrowStyle: true
                        }
                    }
                });
                window.pathSimplifierIns2 = pathSimplifierIns2;
                for (let i = 0; i < param.data.length; i++) {
                    if (param.data[i].path && param.data[i].path.length) {
                        pathSimplifierIns2
                            .createPathNavigator(
                                i, // 关联第1条轨迹
                                {
                                    loop: false, // 循环播放
                                    speed: 1000
                                }
                            )
                            .start();
                    }
                }
            });
        },
        pickUpRoute(param) {
            if (window.pathSimplifierIns3) {
                //通过该方法清空上次传入的轨迹
                pathSimplifierIns3.setData([]);
            }
            AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {
                if (!PathSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！无法展示路径');
                    return;
                }
                let pathSimplifierIns3 = new PathSimplifier({
                    zIndex: 99,
                    map: param.map,
                    getHoverTitle: function (pathData, pathIndex, pointIndex) {
                        // 鼠标悬停在节点之间的连线上
                        return pathData.name || '未知路径';
                    },
                    getPath: function (pathData, pathIndex) {
                        // 返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]

                        return pathData.path;
                    },
                    data: param.data,
                    autoSetFitView: true,
                    renderOptions: {
                        // 轨迹线的样式
                        pathLineStyle: {
                            strokeStyle: 'green',
                            lineWidth: 10,
                            dirArrowStyle: true
                        }
                    }
                });
                window.pathSimplifierIns3 = pathSimplifierIns3;
                // 这是模拟轨迹路线的巡航器(  xxx.createPathNavigator )
                for (let i = 0; i < param.data.length; i++) {
                    if (param.data[i].path && param.data[i].path.length) {
                        pathSimplifierIns3
                            .createPathNavigator(
                                i, // 关联第1条轨迹
                                {
                                    loop: false, // 循环播放
                                    speed: 1000
                                }
                            )
                            .start();
                    }
                }
            });
        },
        toChinesNum(num) {
            var changeNum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
                newNum = '',
                arr = num.toString().split('');
            arr[0] = parseInt(arr[0]) - 1;
            if (arr[0] == -1 && arr.length == 1) {
                return '零';
            }
            if (arr.length > 1) {
                arr[1] = parseInt(arr[1]) - 1;
                if (!arr[0]) {
                    newNum = !arr[0] && arr[1] == -1 ? changeNum[9] : changeNum[9] + changeNum[arr[1]];
                } else {
                    newNum = changeNum[arr[0]] + changeNum[9] + (changeNum[arr[1]] ? changeNum[arr[1]] : '');
                }
            } else {
                newNum = changeNum[arr[0]];
            }
            return newNum;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    },
    computed: {
        userInfo() {
            const info = window.sessionStorage.getItem('_ccmUser');
            return JSON.parse(info);
        }
    },
    mounted() {
        this.map = new AMap.Map('map-content',{animateEnable: false,});
        if (this.userInfo.registerPoint && this.userInfo.registerPoint.lon && this.userInfo.registerPoint.lat) {
            let defaultCenter = new AMap.LngLat(this.userInfo.registerPoint.lon, this.userInfo.registerPoint.lat);
            this.map.setCenter(defaultCenter);
        }
        this.getData();
    }
};
</script>

<style lang="scss" scoped>
#map-content {
    height: 642px;
}
.routes {
    text-align: center;
    margin: 15px;
}
.route-box {
    display: flex;
}
.route-box-left {
    padding: 10px 0;
    flex: 1;
    background-color: #fff;
    border: 1px solid #ddd;
    box-sizing: border-box;
    .route-cost {
        display: flex;
        padding: 5px 0px 10px 0;
        font-size: 10px;
        text-align: center;
        border-bottom: 1px solid #ddd;
        .route-cost-list {
            flex: 1;
            border-right: 1px solid #ddd;
        }
        .route-cost-list:last-child {
            border-right: none;
        }
    }
    .start-end {
        padding: 2px 10px;
        border-bottom: 1px solid #ddd;
        p.first {
            padding: 10px 0px 5px 30px;
            background: url(~@/assets/icons/map_origin@2x.png) left 8px no-repeat;
            background-size: auto 30px;
        }
        p.last {
            padding: 5px 0px 10px 30px;
            background: url(~@/assets/icons/map_end@2x.png) left 3px no-repeat;
            background-size: auto 30px;
        }
    }
    .item-route {
        .map-type {
            line-height: 30px;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            padding: 0 10px;
            background: rgba(240, 81, 89, 0.1);
        }
        ul li {
            font-size: 12px;
            padding: 10px;
            border-bottom: 1px solid #ddd;
            cursor: pointer;
            .title {
                font-size: 15px;
                font-weight: bold;
            }
            p {
                line-height: 22px;
                span {
                    padding: 0 5px;
                    border-right: 1px solid #ddd;
                }
                span:first-child {
                    padding: 0 5px 0 0;
                }
                span:last-child {
                    border-right: none;
                }
            }
            .el-button--primary {
                background-color: #ccc;
                border-color: #ccc;
            }
            .tips {
                color: #ffca58;
                border: 1px solid #ffca58;
                background: rgba(255, 202, 88, 0.15);
                padding: 0 5px;
            }
        }
    }
}
.route-box-left .item-route ul li.active .title {
    color: #f05259;
}
.route-box-right {
    flex: 5;
    position: relative;
    .careful {
        margin: 10px 10px 0;
        padding: 5px 15px;
        box-shadow: 3px 3px 0px rgba(33, 146, 31, 0.2);
        line-height: 1.5;
        font-size: 10px;
        background: rgb(230, 215, 215);
        color: rgb(224, 72, 80);
        position: absolute;
        top: 5px;
        left: 8px;
        z-index: 9999;
        border-radius: 8px;
    }
    /deep/ .is-cancel {
        .el-step__title {
            color: #f05259;
            border-color: #f05259;
        }
        .el-step__head {
            color: #f05259;
            border-color: #f05259;
        }
        .el-step__description {
            color: #f05259;
            border-color: #f05259;
        }
    }
    /deep/ .is-center {
        .el-step__title {
            font-size: 13px;
            line-height: 20px;
        }
    }
}
.step {
    /deep/ .is-cancel {
        .el-step__title {
            color: #f05259;
            border-color: #f05259;
        }
        .el-step__head {
            color: #f05259;
            border-color: #f05259;
        }
        .el-step__description {
            color: #f05259;
            border-color: #f05259;
        }
    }
    /deep/ .is-center {
        .el-step__title {
            font-size: 12px;
            line-height: 20px;
        }
    }
}
.alterEndAddress {
    padding: 2px 10px;
    background-color: #f05259;
    color: #fff;
    font-size: 10px;
    border-radius: 20px;
    margin-left: 5px;
}
.fr {
    float: right;
}
</style>
