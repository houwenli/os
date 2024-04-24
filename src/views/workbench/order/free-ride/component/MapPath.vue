<template>
    <div class="path">
        <div id="map-content"></div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            // map: null,

            moduleName: '/workbench/mixedOrder',
            op: {
                selectMapInfo: 'selectMapInfoShare'
            }
        };
    },

    methods: {
        ...mapActions('order', ['initPath']),
        getData() {
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
                    result.forEach(item => {
                        if (item.type === 1 && item.pointList && item.pointList.length > 0) {
                            item.pointList.forEach(element => {
                                data[0].path.push([element.lon, element.lat]);
                            });
                        }
                    });

                    if (data.length > 0) {
                        this.initPath({ map: this.map, data });
                    }

                    this.fixedPoint(result);
                },
                error => {
                    this.$message.error(error.msg);
                }
            );
        },

        fixedPoint(pointArray) {
            this.map.clearMap();
            let imgUrl = '';
            let passenger = 0;
            for (let i = 0; i < pointArray.length; i++) {
                if (pointArray[i].type == 1) {
                    let driverPointArray = pointArray[i].mapPointList;
                    for (let j = 0; j < driverPointArray.length; j++) {
                        // （1-预约起点 2-预约终点 3-实际起点 4-实际终点）
                        let driverInfoWindow = []; // 司机信息窗体

                        switch (driverPointArray[j].pointType) {
                            case '1':
                                imgUrl = require('@/assets/icons/cct_icon2.png');
                                driverPointArray[j].address ? driverInfoWindow.push(`司机发单起点：${driverPointArray[j].address}`) : driverInfoWindow.push('');
                                driverPointArray[j].loctime
                                    ? driverInfoWindow.push(`<div>司机发布时间：${driverPointArray[j].loctime ? driverPointArray[j].loctime : ' '}</div>`)
                                    : driverInfoWindow.push(`<div></div>`);
                                break;

                            case '2':
                                imgUrl = require('@/assets/icons/map_end@2x.png');
                                driverPointArray[j].address ? driverInfoWindow.push(`司机发单终点：${driverPointArray[j].address}`) : driverInfoWindow.push('');
                                driverPointArray[j].loctime
                                    ? driverInfoWindow.push(`<div>确认费用时间：${driverPointArray[j].loctime ? driverPointArray[j].loctime : ' '}</div>`)
                                    : driverInfoWindow.push(`<div></div>`);
                                break;

                            case '3':
                                imgUrl = require('@/assets/icons/cct_icon3.png');
                                driverPointArray[j].address ? driverInfoWindow.push(`行程开始起点：${driverPointArray[j].address}`) : driverInfoWindow.push('');
                                driverPointArray[j].loctime
                                    ? driverInfoWindow.push(`<div>司机出发时间：${driverPointArray[j].loctime ? driverPointArray[j].loctime : ' '}</div>`)
                                    : driverInfoWindow.push(`<div></div>`);
                                break;

                            case '4':
                                imgUrl = require('@/assets/icons/map_get_off@2x.png');
                                driverPointArray[j].address ? driverInfoWindow.push(`司机订单终点：${driverPointArray[j].address}`) : driverInfoWindow.push('');
                                driverPointArray[j].loctime
                                    ? driverInfoWindow.push(`<div>结束行程时间：${driverPointArray[j].loctime ? driverPointArray[j].loctime : ' '}</div>`)
                                    : driverInfoWindow.push(`<div></div>`);
                                break;
                            default:
                                break;
                        }
                        let icon = new AMap.Icon({
                            size: new AMap.Size(42, 50), // 图标尺寸
                            image: imgUrl, // Icon的图像
                            imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
                            imageSize: new AMap.Size(42, 50) // 根据所设置的大小拉伸或压缩图片
                        });

                        let marker = new AMap.Marker({
                            position: new AMap.LngLat(driverPointArray[j].point.lon, driverPointArray[j].point.lat),
                            offset: new AMap.Pixel(-30, -10),
                            icon: icon, // 添加 Icon 实例
                            zoom: 13
                        });

                        this.map.add(marker);
                        this.setInfoWindow(driverInfoWindow, marker, 'driver');
                    }
                } else {
                    // pointArray[i].type == 2
                    let passengerPointArray = pointArray[i].mapPointList;
                    passenger += 1;

                    for (let j = 0; j < passengerPointArray.length; j++) {
                        // （1-预约起点 2-预约终点 3-实际起点 4-实际终点）
                        let passengerInfoWindow = [], // 乘客信息窗体
                            labelContent,
                            big = false;

                        switch (passengerPointArray[j].pointType) {
                            case '1':
                                imgUrl = require('@/assets/icons/cct_icon8.png');
                                big = true;
                                labelContent = `<div style="width: 105px;height: 50px;line-height: 43px;text-align: center;color: #00BDFF;font-size: 10px;transform: scale(.9)">乘客${passenger}发布起点</div>`;
                                pointArray[i].phone ? passengerInfoWindow.push(`乘客信息：${this.hidePhone(pointArray[i].phone)}`) : passengerInfoWindow.push('');
                                passengerPointArray[j].address ? passengerInfoWindow.push(`乘客计划上车点：${passengerPointArray[j].address}`) : passengerInfoWindow.push('');
                                passengerPointArray[j].loctime
                                    ? passengerInfoWindow.push(`计划上车时间：${passengerPointArray[j].loctime ? passengerPointArray[j].loctime : ' '}</div></div>`)
                                    : passengerInfoWindow.push(`</div></div>`);
                                break;
                            case '2':
                                imgUrl = require('@/assets/icons/cct_icon7.png');
                                big = true;
                                labelContent = `<div style="width: 105px;height: 50px;line-height: 43px;text-align: center;color: #FF9100;font-size: 10px;transform: scale(.9)">乘客${passenger}发布终点</div>`;
                                pointArray[i].phone ? passengerInfoWindow.push(`乘客信息：${this.hidePhone(pointArray[i].phone)}`) : passengerInfoWindow.push('');
                                passengerPointArray[j].address ? passengerInfoWindow.push(`乘客选择的订单终点：${passengerPointArray[j].address}`) : passengerInfoWindow.push('');
                                passengerPointArray[j].loctime
                                    ? passengerInfoWindow.push(`确认费用时间：${passengerPointArray[j].loctime ? passengerPointArray[j].loctime : ' '}</div></div>`)
                                    : passengerInfoWindow.push(`</div></div>`);
                                break;
                            case '3':
                                imgUrl = require('@/assets/icons/cct_icon1.png');
                                big = false;
                                labelContent = `<div style="width: 42px;height: 50px;line-height: 42px;text-align: center;color: #2587EF;font-size: 10px;transform: scale(.8)">乘客${passenger}上车</div>`;
                                passengerPointArray[j].address ? passengerInfoWindow.push(`确认乘客上车点：${passengerPointArray[j].address}`) : passengerInfoWindow.push('');
                                passengerPointArray[j].loctime
                                    ? passengerInfoWindow.push(`上车时间：${passengerPointArray[j].loctime ? passengerPointArray[j].loctime : ' '}</div></div>`)
                                    : passengerInfoWindow.push(`</div></div>`);
                                break;
                            case '4':
                                imgUrl = require('@/assets/icons/cct_icon5.png');
                                big = false;
                                labelContent = `<div style="width: 42px;height: 50px;line-height: 42px;text-align: center;color: #FFC11B;font-size: 10px;transform: scale(.8)">乘客${passenger}下</div>`;
                                passengerPointArray[j].address ? passengerInfoWindow.push(`确认乘客下车点：${passengerPointArray[j].address}`) : passengerInfoWindow.push('');
                                passengerPointArray[j].loctime
                                    ? passengerInfoWindow.push(`下车时间：${passengerPointArray[j].loctime ? passengerPointArray[j].loctime : ' '}</div></div>`)
                                    : passengerInfoWindow.push(`</div></div>`);
                                break;
                            case '6':
                                imgUrl = require('@/assets/icons/cct_icon10.png');
                                big = true;
                                labelContent = `<div style="width: 105px;height: 50px;line-height: 43px;text-align: center;color: red;font-size: 10px;transform: scale(.9)">乘客${passenger}确认到达</div>`;
                                passengerPointArray[j].address ? passengerInfoWindow.push(`乘客确认到达地点：${passengerPointArray[j].address}`) : passengerInfoWindow.push('');
                                passengerPointArray[j].loctime
                                    ? passengerInfoWindow.push(`乘客确认到达时间：${passengerPointArray[j].loctime ? passengerPointArray[j].loctime : ' '}</div></div>`)
                                    : passengerInfoWindow.push(`</div></div>`);
                                break;
                            default:
                                break;
                        }

                        let icon = new AMap.Icon({
                            size: big ? new AMap.Size(105, 50) : new AMap.Size(42, 50), // 图标尺寸
                            image: imgUrl, // Icon的图像
                            imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
                            imageSize: big ? new AMap.Size(105, 50) : new AMap.Size(42, 50) // 根据所设置的大小拉伸或压缩图片
                        });

                        let marker = new AMap.Marker({
                            position: new AMap.LngLat(passengerPointArray[j].point.lon, passengerPointArray[j].point.lat),
                            offset: new AMap.Pixel(5, -10),
                            icon: icon, // 添加 Icon 实例发布终点
                            zoom: 13,
                            label: {
                                content: labelContent,
                                offset: new AMap.Pixel(0, 0)
                            }
                        });

                        this.map.add(marker);

                        this.setInfoWindow(passengerInfoWindow, marker, 'passenger');
                    }
                }
            }
            this.map.setFitView();
        },

        hidePhone(val) {
            return `${val.substring(0, 3)} **** ${val.substring(val.length - 4)}`;
        },

        setInfoWindow(content, marker, type) {
            let infoWindow = new AMap.InfoWindow({
                offset: type == 'driver' ? new AMap.Pixel(-10, 0) : new AMap.Pixel(40, 0),
                content: content.join('<br/>')
            });
            marker.on('click',() => {
                infoWindow.open(this.map, marker.getPosition());
            })
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
