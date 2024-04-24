import * as types from './mutation-types'

/**
 *
 * @param commit
 * @param parm
 * @returns {Promise<any>}
 * Action 通过 store.dispatch 方法触发，执行异步操作。例如：this.$store.dispatch('getCompanyInfo')
 * 组合Action使用：this.$store.dispatch('getCompanyInfo').then((response)=>{...})
 * 在组件中分发多个Action使用 mapActions 辅助函数
 */

//获取网约车订单-基础信息详情
export const getOrdinaryCarBaseInfo = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'selectDetail'
    }
    const URL = $vuex.$getModuleUrl('/order/ordinary-car', data.op);
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}

//获取网约车订单-费用明细
export const getOrdinaryCarExpenseDetails = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'selectExpOrderCost'
    }
    const URL = $vuex.$getModuleUrl('/order/ordinary-car', data.op);
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}
//获取网约车订单-费用明细-乘客和司机计价明细
export const getOrdinaryCarCostDetails = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'selectExpOrderValuation'
    }
    const URL = $vuex.$getModuleUrl('/order/ordinary-car', 'selectExpOrderCost');
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}
//获取网约车订单-费用明细-乘客预估明细
export const getOrdinaryCarEstimatedDetail = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'selectEstimatedDetail'
    }
    const URL = $vuex.$getModuleUrl('/order/ordinary-car', 'selectExpOrderCost');
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}


//获取街坊专车订单-基础信息详情
export const getRecohnitionBaseInfo = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'selectDetail'
    }
    const URL = $vuex.$getModuleUrl('/order/recohnition', data.op);
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}

//获取街坊专车订单-费用明细
export const getRecohnitionExpenseDetails = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'selectSpecialOrderCost'
    }
    const URL = $vuex.$getModuleUrl('/order/recohnition', data.op);
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}
//获取街坊专车订单-费用明细-乘客和司机计价明细
export const getRecohnitionCostDetails = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'selectSpecialOrderValuation'
    }
    const URL = $vuex.$getModuleUrl('/order/recohnition', 'selectSpecialOrderCost');
    let formData = await $vuex.$axios(URL, data);
    let response = JSON.parse(formData.data);
    return JSON.parse(formData.data);
}
//获取街坊专车订单-费用明细-乘客预估明细
export const getRecohnitionEstimatedDetail = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'selectEstimatedDetail'
    }
    const URL = $vuex.$getModuleUrl('/order/recohnition', 'selectSpecialOrderCost');
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}
//获取出租车订单-基础信息
export const getTaxiBaseInfo = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'selectDetail'
    }
    const URL = $vuex.$getModuleUrl('/order/taxi', data.op);
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}
//获取村村通订单- 司机订单信息
export const getFreeRideDriverOrderDetails = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'selectDriverOrderDetailsShare'
    }
    const URL = $vuex.$getModuleUrl('/workbench/mixedOrder', data.op);
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}
//获取村村通订单- 乘客订单信息
export const getFreeRidePassengerOrderDetails = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'selectPassengerOrderDetailsShare'
    }
    const URL = $vuex.$getModuleUrl('/workbench/mixedOrder', data.op);
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}
//获取平台费包干购买订单详情
export const getVipOrderDetails = async ({ commit }, parm) => {
    const data = {
        data: parm,
        op: 'detail'
    }
    const URL = $vuex.$getModuleUrl('/order/vip', data.op);
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}

export const getOrderBaseInfo = async ({ commit }, parms) => {
    let data = {
        data: parms.data,
        op: parms.op
    }
    const URL = $vuex.$getModuleUrl(parms.moduleName, parms.op);
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}

//获取运力商列表
export const getCapacityInfo = async ({ commit }) => {
    const data = {
        data: {},
        op: 'select'
    }
    let formData = await $vuex.$axios('/local/selectAlltransportCapacityName', data);
    return JSON.parse(formData.data);
}

/**
 * 行车路径
 * @param {*} param0 
 * @param {*} param Map 实例、 路径数据
 */
export const initPath = ({ commit }, param) => {
    param.map.clearMap();
    if (window.pathSimplifierIns) {
        //通过该方法清空上次传入的轨迹
        pathSimplifierIns.setData([]);
    };
    AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {
        if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！无法展示路径');
            return
        }
        let pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: param.map,
            getHoverTitle: function (pathData, pathIndex, pointIndex) {
                // 鼠标悬停在节点之间的连线上
                return pathData.name || '未知路径'
            },
            getPath: function (pathData, pathIndex) {
                // 返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
                return pathData.path
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
        window.pathSimplifierIns = pathSimplifierIns;
        for (let i = 0; i < param.data.length; i++) {
            if (param.data[i].path && param.data[i].path.length) {
                pathSimplifierIns.createPathNavigator(
                    i, // 关联第1条轨迹
                    {
                        loop: false, // 循环播放
                        speed: 1000,
                    }
                ).start()
            }
        }

    });
}

/**
 * marker 
 * @param {*} param0 
 * @param {*} param pointArr、map 实例
 */
export const fixedPoint = ({ commit }, param) => {
    param.map.clearMap();
    for (let i = 0; i < param.pointArr.length; i++) {
        let imgUrl = '';
        let info = [];
        let zIndex;

        switch (param.pointArr[i].pointType) {
            case 'start':
                // 起点
                imgUrl = require('../../../assets/icons/map_origin@2x.png');
                param.pointArr[i].address ? info.push(`乘客选择的订单起点：${param.pointArr[i].address}`) : info.push('')
                param.pointArr[i].loctime ? info.push(`下单时间：${param.pointArr[i].loctime ? param.pointArr[i].loctime : ' '}<div></div>`) : info.push(`<div></div>`)
                break;
            case 'end':
                // 终点
                imgUrl = require('../../../assets/icons/map_end@2x.png');
                param.pointArr[i].address ? info.push(`乘客选择的订单终点：${param.pointArr[i].address}`) : info.push('');
                param.pointArr[i].loctime ? info.push(`确认费用时间：${param.pointArr[i].loctime ? param.pointArr[i].loctime : ' '}<div></div>`) : info.push(`<div></div>`);
                break;
            case 'arrive':
                // 接到乘客
                imgUrl = require('../../../assets/icons/map_get_on@2x.png');
                param.pointArr[i].address ? info.push(`司机点击到达乘客上车地点：${param.pointArr[i].address}`) : info.push('');
                param.pointArr[i].loctime ? info.push(`到达上车点时间：${param.pointArr[i].loctime ? param.pointArr[i].loctime : ' '}<div></div>`) : info.push(`<div></div>`);
                break;
            case 'chargeStart':
                // 开始计费
                imgUrl = require('../../../assets/icons/cost@2x.png');
                param.pointArr[i].address ? info.push(`司机点击开始计费地点：${param.pointArr[i].address}`) : info.push('');
                param.pointArr[i].loctime ? info.push(`计费时间：${param.pointArr[i].loctime ? param.pointArr[i].loctime : ' '}<div></div>`) : info.push(`<div></div>`);
                break;
            case 'chargeEnd':
                // 结束计费
                imgUrl = require('../../../assets/icons/map_get_off@2x.png');
                param.pointArr[i].address ? info.push(`司机点击到达目的地位置：${param.pointArr[i].address}`) : info.push('');
                param.pointArr[i].loctime ? info.push(`结束行程时间：${param.pointArr[i].loctime ? param.pointArr[i].loctime : ' '}<div></div>`) : info.push(`<div></div>`);
                break;
            case 'confirmPay':
                // 发起支付
                imgUrl = require('../../../assets/icons/transparent.png');
                param.pointArr[i].address ? info.push(`司机点击到达目的地位置：${param.pointArr[i].address}`) : info.push('');
                param.pointArr[i].loctime ? info.push(`结束行程时间：${param.pointArr[i].loctime ? param.pointArr[i].loctime : ' '}<div></div>`) : info.push(`<div></div>`);
                break;
            case 'completePay':
                // 完成支付
                imgUrl = require('../../../assets/icons/transparent.png');
                param.pointArr[i].address ? info.push(`司机点击到达目的地位置：${param.pointArr[i].address}`) : info.push('');
                param.pointArr[i].loctime ? info.push(`结束行程时间：${param.pointArr[i].loctime ? param.pointArr[i].loctime : ' '}<div></div>`) : info.push(`<div></div>`);
                break;
            case 'dispatch':
                // 乘客下单地点
                imgUrl = require('../../../assets/icons/map_xd.png');
                param.pointArr[i].address ? info.push(`乘客下单地点：${param.pointArr[i].address}`) : info.push('');
                param.pointArr[i].loctime ? info.push(`下单时间：${param.pointArr[i].loctime ? param.pointArr[i].loctime : ' '}<div></div>`) : info.push(`<div></div>`);
                break;
            case 'rob':
                // 司机接单地点
                imgUrl = require('../../../assets/icons/map_jdck.png');
                param.pointArr[i].address ? info.push(`司机接单地点：${param.pointArr[i].address}`) : info.push('');
                param.pointArr[i].loctime ? info.push(`接单时间：${param.pointArr[i].loctime ? param.pointArr[i].loctime : ' '}<div></div>`) : info.push(`<div></div>`);
                break;
            case 'cancel':
                // 取消订单地点
                zIndex = 10;
                imgUrl = require('../../../assets/icons/map_qxdd.png');
                param.pointArr[i].address ? info.push(`取消订单地点：${param.pointArr[i].address}`) : info.push('')
                param.pointArr[i].loctime ? info.push(`取消订单时间：${param.pointArr[i].loctime ? param.pointArr[i].loctime : ' '}<div></div>`) : info.push(`<div></div>`)
                break;
            case 'update':
                // 取消订单地点
                imgUrl = require('../../../assets/icons/map_update.png');
                param.pointArr[i].address ? info.push(`修改地点：${param.pointArr[i].address}`) : info.push('')
                // param.pointArr[i].address ? info.push(`修改人${param.pointArr[i].address}`) : info.push('')
                param.pointArr[i].loctime ? info.push(`修改时间：${param.pointArr[i].loctime ? param.pointArr[i].loctime : ' '}<div></div>`) : info.push(`<div></div>`)
                break;
            default:
                break;
        }

        let icon = new AMap.Icon({
            size: new AMap.Size(42, 50), // 图标尺寸
            image: imgUrl, // Icon的图像
            imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
            imageSize: new AMap.Size(42, 50)   // 根据所设置的大小拉伸或压缩图片
        });

        let marker = new AMap.Marker({
            position: new AMap.LngLat(
                param.pointArr[i].point.lon,
                param.pointArr[i].point.lat
            ),
            offset: new AMap.Pixel(-10, -10),
            icon: icon, // 添加 Icon 实例
            zoom: 13,
            zIndex: zIndex ? zIndex : 1
        });

        let infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, 0),
            content: info.join('<br/>')
        });
        marker.on('click', () => {
            infoWindow.open(param.map, marker.getPosition());
        })

        param.map.add(marker);
        param.map.setFitView();
    }
}

/**
 * @description: 查询所属运力商
 * @param {*} commit
 * @param {*} param
 * @return {*}
 */
export const getAllTransportList = ({ commit }, param = {}) => {
    const opt = {
        data: param,
        op: 'select',
    };
    const URL = 'local/selectAlltransportCapacityName';
    return new Promise((resolve, reject) => {
        $vuex.$axios(URL, opt).then((response) => {
            if (response.code === 1) {
                let dataList = JSON.parse(response.data);
                commit(types.GET_TRANSPORT_LIST, dataList);
                resolve(response.data);
            } else {
                reject(response.data);
            }
        }, (response) => {
            reject(response.data);
        })
    })
};