import * as types from '../../mutation-types'

/**
 *
 * @param commit
 * @param parm
 * @returns {Promise<any>}
 * Action 通过 store.dispatch 方法触发，执行异步操作。例如：this.$store.dispatch('getCompanyInfo')
 * 组合Action使用：this.$store.dispatch('getCompanyInfo').then((response)=>{...})
 * 在组件中分发多个Action使用 mapActions 辅助函数
 */

//获取运力商列表
export const getCapacityInfo = async ({commit}) => {
    const data = {
        data: {},
        op: 'select'
    }
    let formData = await $vuex.$axios('/local/selectAlltransportCapacityName', data);
    return JSON.parse(formData.data);
}

//获取全部线路
export const getLineInfoIdFilters = async ({commit}) => {
    const data = {
        data: {},
        op: 'selectAllLineName'
    }
    let formData = await $vuex.$axios('/cityLine/info/select', data);
    return JSON.parse(formData.data);
}

// 获取订单详情
export const getOrderBaseInfo = async ({commit}, parms) => {
    let data = {
        data:parms.data,
        op:parms.op
    }
    const URL = $vuex.$getModuleUrl(parms.moduleName, parms.op);
    let formData = await $vuex.$axios(URL, data);
    return JSON.parse(formData.data);
}


/**
 * 行车路径
 * @param {*} param0 
 * @param {*} param Map 实例、 路径数据
 */
 export const initPath = ({commit}, param) => {
    param.map.clearMap();
    if (window.pathSimplifierIns) {
        //通过该方法清空上次传入的轨迹
        pathSimplifierIns.setData([]);
    };
    AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
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