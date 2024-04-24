<template>
    <div class="path">
        <div id="map-content"></div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    props: ['dataList'],
    data() {
        return {
            // map: null,

            moduleName: '/workbench/mixedOrder',
            op: {
                selectMapInfo: 'selectMapInfoExp',
                getDriverArriveMapInfo: 'getDriverArriveMapInfoExp'
            }
        };
    },

    methods: {
        ...mapActions('order', ['initPath', 'fixedPoint']),
        getData() {
            this.catchPerson();
            this.travelRoute();
        },
        // 接驾路线
        catchPerson() {
            const url = this.getModuleUrl(this.op.getDriverArriveMapInfo);
            let reqData = {
                data: { orderId: this.$route.query.orderId },
                op: this.op.getDriverArriveMapInfo
            };
            this.$axios(url, reqData).then(
                res => {
                    const result = JSON.parse(res.data);
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
        // 行程路线
        travelRoute() {
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
                    if (result.pointList && result.pointList.length > 0) {
                        result.pointList.forEach(element => {
                            data[0].path.push([element.lon, element.lat]);
                        });
                    }

                    if (data.length > 0) {
                        this.initPath({ map: this.map, data });
                    }
                    // 新增修改终点纪录
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
                    this.fixedPoint({ map: this.map, pointArr: result.mapPointList });
                },
                error => {
                    this.$message.error(error.msg);
                }
            );
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
</style>
