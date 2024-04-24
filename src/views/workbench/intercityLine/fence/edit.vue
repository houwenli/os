<!--编辑围栏-->
<template>
    <div class="panel">
        <div class="quota-global-formcontent fence-formcontent" style="background: #fff; padding: 20px">
            <div class="base-content">
                <div style="display: flex">
                    <area-list-compl ref="areaselect" class="area-list" :multiple="false" @onCityChange="cityChange" v-if="isAdd"></area-list-compl>
                    <div class="inline-block" v-else>
                        <span>围栏城市:</span>
                        <span class="region-name">{{ getRegionName() }}</span>
                    </div>
                </div>
                <div class="is-flex">
                    <div>
                        <span class="label">
                            <span style="color: #f05259" v-if="isAdd">*</span>
                            围栏名称:
                        </span>
                        <el-input v-if="isAdd" class="address" v-model="dataOptions.fenceName" placeholder="请输入围栏名称" clearable></el-input>
                        <span v-else style="display: inline-block">{{ dataOptions.fenceName }}</span>
                    </div>
                    <div class="is-flex" style="margin-left: 20px">
                        <span style="color: #f05259">*</span>
                        业务类型:
                        <span style="display: inline-block">专线</span>
                    </div>
                </div>
                <fence-map :marker="marker" :disabled="isEdit" :cityCode="cityInfo.areaCode || cityInfo.cityCode" @select="confirmAddress" ref="fenceMap" @reset="resetAreaSelect"></fence-map>
                <div class="saveButon">
                    <el-button v-if="isEdit" plain @click="$router.push('/workbench/BRintercityLine')" class="buttons">返回</el-button>
                    <el-button v-else plain @click="$router.push('/workbench/BRintercityLine')" class="buttons">取消</el-button>
                    <ws-throttle>
                        <el-button :loading="isLoading" type="primary" @click="save" class="buttons">保存</el-button>
                    </ws-throttle>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import AreaListCompl from '../component/areaListTempl';
import fenceMap from '../component/fenceMap';
let nonSpecialCharacters = /^[\u4e00-\u9fa5\-_a-zA-Z0-9]+$/; //中英文 数字 - _
export default {
    name: 'intercityLineFenceEdit',
    components: {
        AreaListCompl,
        fenceMap
    },
    data() {
        return {
            cityInfo: {}, // 城市区域信息
            routerQuery: {}, //路由参数
            dataOptions: {
                fenceName: '', // 围栏名称
                busType: 0
            },
            selectPosition: {}, // 输入的特殊地形信息
            op: {
                save: 'addFence',
                update: 'updateFence',
                detail: 'queryFenceDetail'
            },
            moduleName: '/workbench/fence',
            locationCity: {
                // 定位城市
                provinceCode: '',
                cityCode: '',
                areaCode: ''
            },
            isLoading: false
        };
    },
    computed: {
        ...mapState(['areaList']),
        isAreaCodeChange() {
            return this.areaList.length && this.locationCity.areaCode;
        },
        isEdit() {
            return this.routerQuery.type == 'edit';
        },
        isAdd() {
            return this.routerQuery.type == 'add';
        },
        formContentTitle() {
            return {
                add: '新增',
                edit: '编辑'
            }[this.routerQuery.type];
        },
        marker() {
            let { lon, lat } = this.selectPosition;
            if (lon && lat) {
                return [{ lon, lat }];
            } else {
                return [];
            }
        }
        // 区域信息
    },
    mounted() {
        this.routerQuery = this.$route.query;
        this.routerQuery.id && this.getData(this.routerQuery.id);
        // 新增时获取当前位置
        if (this.isAdd) {
            this.getLocation();
        }
    },
    activated() {
        this.routerQuery = this.$route.query;
        this.routerQuery.id && this.getData(this.routerQuery.id);
        // 新增时获取当前位置
        if (this.isAdd) {
            this.getLocation();
        }
    },
    methods: {
        getRegionName() {
            let name = this.dataOptions.provinceName || '';
            if (this.dataOptions.cityName) {
                name += '-' + this.dataOptions.cityName;
            }
            if (this.dataOptions.areaName) {
                name += '-' + this.dataOptions.areaName;
            }
            return name;
        },
        //重置地区选择器
        resetAreaSelect(adcode) {
            let { provinceCode, cityCode, areaCode } = this.handleAdcode(adcode);
            if (cityCode == areaCode) {
                areaCode = 0;
            }
            this.locationCity = {
                provinceCode,
                cityCode,
                areaCode
            };
            this.cityInfo = {
                provinceCode,
                cityCode,
                areaCode
            };
            this.$refs.areaselect.cityCode = [provinceCode, cityCode, areaCode];
        },
        cityChange(cityCodeArr) {
            // 城市变化时清空详细地址、围栏地址、设置地图组件需要的位置值
            this.selectPosition = {};
            this.$refs.fenceMap.keyWord = '';
            this.$nextTick(() => {
                this.cityInfo = { provinceCode: cityCodeArr[0], cityCode: cityCodeArr[1], areaCode: cityCodeArr[2] };
                if (this.$refs.fenceMap.map) {
                    this.$refs.fenceMap.handleCheckMap();
                }
            });
            // this.handleGetAddress()
        },
        handleGetAddress() {
            this.$nextTick(() => {
                this.cityInfo = this.$refs.areaselect.getData();
            });
        },
        // 选择中心位置
        confirmAddress(data) {
            if (!data.location) {
                return;
            }
            let {
                name,
                location: { lat, lng },
                address,
                formattedAddress
            } = data;
            this.selectPosition = {
                address: formattedAddress || name || address,
                lat,
                lon: lng
            };
        },
        // 获取详情
        getData(id) {
            let data = {
                data: JSON.stringify({
                    id
                }),
                op: this.op.detail
            };
            let URL = this.getModuleUrl(data.op);
            this.$axios(URL, data).then(res => {
                if (res.code == 1) {
                    let { provinceCode, cityCode, areaCode, fenceName, address, locationPoint, polygon, polygonPoints, fenceType, cityName, provinceName, areaName } = JSON.parse(res.data) || {};
                    this.locationCity = { provinceCode, cityCode, areaCode };
                    this.cityInfo = { provinceCode, cityCode, areaCode };
                    this.selectPosition = { lat: locationPoint.lat, lon: locationPoint.lon };
                    this.$nextTick(() => {
                        let fenceMap = this.$refs.fenceMap;
                        fenceMap.address.name = address;
                        fenceMap.keyWord = address;
                        fenceMap.fenceType = fenceType === 2;
                        fenceMap.address.location = {
                            lng: locationPoint.lon,
                            lat: locationPoint.lat
                        };
                        setTimeout(() => {
                            if (fenceType === 1) {
                                fenceMap.viewFence('circles', { path: [locationPoint.lon, locationPoint.lat], radius: polygon });
                            } else {
                                let arr = polygonPoints.map(obj => {
                                    return [obj.lon, obj.lat];
                                });
                                fenceMap.viewFence('polygons', arr);
                            }
                        }, 1000);
                    });
                    this.dataOptions = { fenceName: fenceName, provinceName, areaName, cityName };
                }
            });
        },
        // 保存
        save() {
            if (!this.checkFrom()) {
                return false;
            }
            this.isLoading = true;
            let data = {
                busType: 0,
                ...this.cityInfo
            };
            if (this.routerQuery.id) {
                data.id = this.routerQuery.id;
                data.fenceId = this.routerQuery.fenceId;
            }
            data.fenceName = this.dataOptions.fenceName;
            let { fenceType, address, polygons, circles } = this.$refs.fenceMap;
            //true绘制面 false绘制圆
            data.fenceType = fenceType ? 2 : 1;
            data.address = address.name;
            data.location = `${address.location.lat},${address.location.lng}`;
            let arr = [];
            //数据结构要做下兼容 开始
            if (fenceType) {
                polygons.polyPath.map(item => {
                    if (item.lat) {
                        arr.push([item.lat, item.lng]);
                    } else {
                        arr.push([item[1], item[0]]);
                    }
                });
                data.polygon = arr.join(';');
            } else {
                // arr.push([circles.circlePath[1], circles.circlePath[0]])
                data.polygon = `${circles.radius}`;
            }
            // 计算围栏面积
            data.fenceArea = parseInt(this.calcArea(fenceType, this.$refs.fenceMap));
            //数据结构要做下兼容 结束
            let op = this.isAdd ? this.op.save : this.op.update;
            let opt = {
                data: JSON.stringify(data),
                op: op
            };
            let URL = this.getModuleUrl(op);
            this.$axios(URL, opt)
                .then(res => {
                    this.isLoading = false;
                    let data = JSON.parse(res.data).anwserCode;
                    if (data.code == 1) {
                        this.$message.success('保存成功');
                        this.$router.push('/workbench/BRintercityLine');
                    } else {
                        this.$message.error(data.message);
                    }
                })
                .catch(({ msg = '保存失败' } = {}) => {
                    this.isLoading = false;
                    this.$message.error(msg);
                });
        },
        // 校验
        checkFrom() {
            let { keyWord, polygons, circles, fenceType, markers } = this.$refs.fenceMap;
            let { fenceName } = this.dataOptions;
            if (this.cityInfo.areaCode == null) {
                this.$message.error('区域不能为空');
                return false;
            }
            if (!this.trim(fenceName)) {
                this.$message.error('围栏名称不能为空');
                return false;
            }
            if (!nonSpecialCharacters.test(fenceName)) {
                this.$message.error('围栏名称存在特殊字符');
                return false;
            }
            if (!this.trim(keyWord)) {
                this.$message.error('围栏中心位置不能为空');
                return false;
            }
            // 判断是否绘制过围栏
            let fenceJudgeStart = fenceType ? polygons.start : circles.start;
            let fenceJudge = fenceType ? polygons.polyPath.length : circles.circlePath.length;
            if (!fenceJudge) {
                this.$message.error('请绘制围栏');
                return false;
            }
            if (fenceJudgeStart) {
                this.$message.error('请先停止绘制围栏');
                return false;
            }
            if (fenceType) {
                if (polygons.polygon.getArea() > 40000000) {
                    this.$message.error('围栏面积超出范围');
                    return false;
                }
            } else {
                if (circles.radius > 10000) {
                    this.$message.error('围栏半径超出范围');
                    return false;
                }
            }
            if (markers.start) {
                this.$message.error('请确认中心点');
                return false;
            }
            return true;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        // 返回
        back(type) {
            this.$router.push({ path: this.moduleName, query: { moduleName: 'fence' } });
        },
        // 定位
        getLocation() {
            AMap.plugin(['AMap.Geolocation'], () => {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true //是否使用高精度定位，默认:true
                });
                geolocation.getCurrentPosition((status, result) => {
                    if (status == 'complete') {
                        if (result && result.addressComponent) {
                            let { adcode } = result.addressComponent;
                            let { provinceCode, cityCode, areaCode } = this.handleAdcode(adcode);
                            this.locationCity = { provinceCode, cityCode, areaCode };
                            this.cityInfo = { provinceCode, cityCode, areaCode };
                            this.$refs.areaselect.cityCode = [provinceCode, cityCode, areaCode];
                        }
                    } else {
                        // this.$message.error('定位失败');
                    }
                });
            });
        },
        //去掉首尾空格
        trim(s) {
            if (s === undefined || s === null) {
                return false;
            }
            return s.replace(/(^\s*)|(\s*$)/g, '');
        },
        // 格式化地区码
        handleAdcode(adcode) {
            return {
                provinceCode: Number(adcode.substring(0, 2) + '0000'),
                cityCode: Number(adcode.slice(0, 4) + '00'),
                areaCode: Number(adcode)
            };
        },
        // 计算围栏面积
        calcArea(fenceType, fenceMap) {
            //true绘制面 false绘制圆
            let { polygons, circles } = fenceMap;
            if (fenceType) {
                return polygons.polygon.getArea();
            } else {
                return Math.PI * Math.pow(circles.radius, 2);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.text {
    display: inline-block;
}

.address {
    width: 515px !important;
}

.btn {
    margin-left: 50px;
}

/deep/ .area-list {
    .inline-block:first-of-type {
        margin-right: 0;
    }
    .label{
        margin:0px;
    }
}

.is-flex {
    display: flex;
    align-items: center;
    height: 60px;
}

.fence-formcontent /deep/ .label {
    min-width: 80px !important;
    width: auto !important;
    text-align: left !important;
}
.fence-formcontent .region-name {
    margin-left: 25px;
}
.quota-global-formcontent{
    min-height: calc(100% - 64px);
    margin-bottom:60px;
    border-radius:8px;
}
.quota-global-formcontent .base-content .block /deep/ .label,
.quota-global-formcontent .base-content .inline-block /deep/ .label {
    text-align: left !important;
    margin-right: 15px;
}
.fence-formcontent /deep/ .inline-block {
    margin-right: 20px !important;
    margin-top: 15px !important;
}
.formcontent-btns {
    margin-top: 30px;
}
.saveButon {
        position: fixed;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 64px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .buttons {
            width: 160px;
            height: 40px;
            display: block;
        }
    }
</style>
