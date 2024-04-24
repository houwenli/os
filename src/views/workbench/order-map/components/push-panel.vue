<!--
 * @Author: DaiYu
 * @Date: 2022-09-15 09:23:04
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-10-12 10:22:45
 * @FilePath: \main\src\views\workbench\order-map\components\push-panel.vue
-->
<template>
    <div class="panel" @click.stop>
        <div class="city">
            当前定位城市：{{ $route.query.city }}
            <div class="icon" @click="iconClick">
                <i :class="panelShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </div>
        </div>
        <div v-show="panelShow" class="form">
            <div>
                <div class="title">订单热区：</div>
                <div class="cell">
                    <span class="label">热区定位点</span>
                    <el-input placeholder="请在地图点击热区添加地址" :value="centerPoint.address"></el-input>
                </div>
            </div>
            <div>
                <div class="title">推送司机：</div>
                <div class="cell">
                    <span class="label">司机状态</span>
                    <el-select v-model="driverStatus" placeholder="请选择" @change="driverStatusSelect">
                        <el-option v-for="item in driverStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div v-if="driverStatus == 1" class="cell check">
                    <span class="label"></span>
                    <el-select ref="driverSelect" v-model="statusList" v-click-outside="hide" multiple placeholder="请选择">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div v-if="driverStatus == 1" class="cell">
                    <span class="label">推送范围</span>
                    <el-input placeholder="调度范围【1，10】" v-model="scope" @input="oninput">
                        <template slot="append">KM</template>
                    </el-input>
                </div>
                <div class="cell">
                    <span class="label">所属机构</span>
                    <virtual-select ref="virtualSelect" :selectOptions="selectOptions" v-model="agencyNumberList" placeholder="请选择司机所属机构" clearable collapse-tags @change="selectChange"></virtual-select>
                </div>
            </div>
            <div class="cell">
                <span class="label title">推送方式：</span>
                <el-radio v-model="mode" :label="1">PUSH</el-radio>
            </div>
            <div class="footer">
                <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import virtualSelect from '@/components/VirtualSelect';
export default {
    name: 'PushPanel',
    components: {
        virtualSelect,
    },
    props: {
        selectOptions: {
            // 机构下拉框数据
            type: Array,
            default: () => [],
        },
        centerPoint: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            panelShow: true,
            mode: 1,
            driverStatus: -1,
            scope: '',
            agencyNumberList: [],
            statusList: [],
            multiple: true,
            driverStatusOptions: [
                {
                    value: -1,
                    label: '全部',
                },
                {
                    value: 0,
                    label: '未出车',
                },
                {
                    value: 1,
                    label: '出车',
                },
            ],
            statusOptions: [
                {
                    value: 1,
                    label: '出车离线',
                },
                {
                    value: 2,
                    label: '出车空闲',
                },
                {
                    value: 3,
                    label: '服务中在线',
                },
                {
                    value: 4,
                    label: '服务中离线',
                },
            ],
            agencyProps: {
                expandTrigger: 'click',
                value: 'agencyNumber',
                label: 'orgName',
                lazy: true,
                // checkStrictly: true,
                multiple: true,
                lazyLoad: this.lazyLoad,
            },
            moduleName: '/workbench/orderMap/dispatch',
        };
    },
    watch: {
        centerPoint() {
            this.panelShow = true
        },
    },
    methods: {
        iconClick(event) {
            event.stopPropagation();
            this.panelShow = !this.panelShow;
        },
        confirm() {
            let { mode, centerPoint, driverStatus, agencyNumberList, scope, statusList, selectOptions } = this;
            if (agencyNumberList.includes(0)) {
                agencyNumberList = selectOptions.map(item => item.agencyNumber);
            }
            if (!centerPoint.address) {
                    this.$message.error('请在点图点击热区添加地址');
                    return
            }
            if (driverStatus === 1) {
                if (!statusList.length) {
                    this.$message.error('请选择司机出车状态');
                    return
                }
                if (!scope) {
                    this.$message.error('请选择推送范围');
                    return
                }
            }
            if (!agencyNumberList.length) {
                this.$message.error('请选择司机所属机构');
                return
            }
            let {
                address,
                lngLat: [lng, lat],
            } = centerPoint;

            let data = {
                cityCode: +this.$route.query.adcode,
                mode,
                driverStatus,
                agencyNumberList,
                regionName: address,
                lat,
                lng,
            };
            if (driverStatus === 1) {
                data.scope = +scope;
                data.statusList = statusList
            }
            this.$emit('push', data);
        },
        reset() {
            this.$emit('update:centerPoint', {});
            this.mode = 1;
            this.driverStatus = -1;
            this.statusList = []
            this.scope = '';
            this.agencyNumberList = [];
        },
        selectChange(value) {
            if (value[value.length - 1] === 0) {
                this.agencyNumberList = [0];
                this.$refs['virtualSelect'].hide();
            } else {
                this.agencyNumberList = value.filter(i => i);
            }
        },
        hide() {
            this.$refs['driverSelect'].blur()
        },
        /**
         * oninput 限制输入框小数点位数，多出的过滤掉
         * @param  Number     {num}
         * @param  Number     {limit}
         */
        oninput(str, limit = 1, min = 1, max = 10) {
            let len1 = str.substr(0, 1);
            let len2 = str.substr(1, 1);
            //如果第一位是0，第二位不是点，就用数字把点替换掉
            if (str.length > 1 && len1 == 0 && len2 != '.') {
                str = str.substr(1, 1);
            }
            //第一位不能是.
            if (len1 == '.') {
                str = '';
            }
            if (str < min || str > max) {
                str = '';
            }
            //限制只能输入一个小数点
            if (str.indexOf('.') != -1) {
                let str_ = str.substr(str.indexOf('.') + 1);
                if (str_.indexOf('.') != -1) {
                    str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1);
                }
            }
            //正则替换
            str = str.replace(/[^\d^\.]+/g, ''); // 保留数字和小数点
            if (limit / 1 === 1) {
                str = str.replace(/^\D*([0-9]\d*\.?\d{0,1})?.*$/, '$1'); // 小数点后只能输 1 位
            } else {
                str = str.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, '$1'); // 小数点后只能输 2 位
            }
            this.scope = str;
        },
        // 选项切换
        driverStatusSelect(value) {
            this.statusList = [];
            this.scope = ''
        },
    },
};
</script>

<style lang="scss" scoped>
.panel {
    position: absolute;
    top: 24px;
    left: 24px;
    z-index: 1000;
    background: rgba(37, 41, 49, 0.7);
    // border: 1px solid #979797;
    border-radius: 4px;
    // overflow: hidden;
    ::v-deep .el-scrollbar__bar.is-vertical {
        z-index: -1 !important;
        display: none;
    }
    .city {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 340px;
        height: 46px;
        color: #333;
        background: #ffffff;
        padding: 0 16px;
        border-radius: 4px 4px 0px 0px;
        .icon {
            flex: 0 0 40px;
            font-size: 20px;
            text-align: right;
        }
    }
    .form {
        padding: 16px;
        width: 340px;
        user-select: none;
    }
    .title {
        color: #f95e5e;
    }
    .cell {
        margin: 16px 0;
        .label {
            width: 87px;
            display: inline-block;
            font-size: 14px;
            text-align: left;
            color: #ffffff;
        }
        .title {
            color: #f95e5e;
        }
        ::v-deep {
            .el-input {
                width: 220px;
            }
        }
    }
    .footer {
        display: flex;
        justify-content: center;
        margin-top: 12px;
    }
}
</style>
