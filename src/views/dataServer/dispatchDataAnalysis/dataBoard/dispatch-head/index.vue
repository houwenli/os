<template>
    <div v-loading="loading" class="dispath-head ws-table-warp">
        <hotMenu ref="hotMenu" @handleClickRefresh="handleClickRefresh" @handleCityChange="$emit('handleCityChange', $event)"></hotMenu>
        <el-button v-if="oaPowerList.getAreaHexagon" icon="el-icon-plus" type="primary" @click="handleHotMapContrast">运力缺口对比</el-button>

        <hotMap ref="hotMap01" :dispatchOrderCount="currentBasePathObj" @pauseMoveProgress="handleVideoPause" @mapCenterChange="setMapCenter" @setZoomSize="setZoomSize"></hotMap>

        <!-- 滚动条 -->
        <div class="slider-container">
            <i v-show="!sliderInterval" class="el-icon-video-play slider-icon" @click="initSliderScroll"></i>
            <i v-show="sliderInterval" class="el-icon-video-pause slider-icon" @click="handleVideoPause"></i>
            <el-slider v-model="sliderValue" class="slider" :min="1" :max="30" show-stops @change="handleSliderChange"></el-slider>
            <div class="slider-time">
                {{ sliderValue.toString().padStart(2, "0") }}:30
            </div>
        </div>

        <hotMap ref="hotMap02" v-if="showContrastMap" :showMapClose="true" :dispatchOrderCount="selectBasePathObj" @closeMap="
        showContrastMap = false;
        selectBasePathObj = {};
      " @pauseMoveProgress="handleVideoPause" @mapCenterChange="setMapCenter" @setZoomSize="setZoomSize"></hotMap>

        <!-- 运力缺口对比弹窗 -->
        <el-dialog title=" 请添加时间，进行对比" :visible.sync="dialogContrast.dialogVisible" width="680px">
            <div class="dialog-box">
                <div>
                    <span>当前选择时间：</span>
                    <iDateTimePicker :startDate="dialogContrast.options.currentStartDate" :startTime="dialogContrast.options.currentStartTime" :endDate="dialogContrast.options.currentEndDate" :endTime="dialogContrast.options.currentEndTime" :disabled="dialogContrast.isDisabledCurrentTime"
                        @dateTimeChange="handleCurrentDateTimeChange"></iDateTimePicker>
                </div>
                <div class="mt10">
                    <span>添加一个时间：</span>
                    <iDateTimePicker :startDate="dialogContrast.options.selectStartDate" :startTime="dialogContrast.options.selectStartTime" :endDate="dialogContrast.options.selectEndDate" :endTime="dialogContrast.options.selectEndTime" @dateTimeChange="handleSelectDateTimeChange"></iDateTimePicker>

                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCloseDialogTime">返回</el-button>
                <el-button type="primary" @click="handleCreateHotDiagram">生成热力对比图</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import hotMenu from './components/hotMenu';
import hotMap from './components/hotMap';
import iDateTimePicker from './components/idateTimePicker.vue';
export default {
    components: {
        hotMenu,
        hotMap,
        iDateTimePicker,
    },
    data() {
        return {
            loading: false,
            sliderValue: 1,
            sliderInterval: null,

            // 热力对比弹窗
            dialogContrast: {
                dialogVisible: false,
                isDisabledCurrentTime: false,
                // 热力对比弹窗中开始时间的限制
                pickerOptions: {
                    disabledDate(time) {
                        let curDate = Date.now();
                        let three = 90 * 86400000;
                        let threeMonths = curDate - three;
                        let current = new Date(new Date().toLocaleDateString()).getTime() + (86400000 - 1000);
                        return time.getTime() > current || time.getTime() < threeMonths;
                    },
                },
                // 根据当前选择时间的开始时间的限制
                pickerCurrentEndOptions: {
                    disabledDate: time => {
                        return this.pickerEndTimeOptions(time, this.dialogContrast.options.currentStartTime);
                    },
                },
                // 根据添加一个时间的开始时间的限制
                pickerSelectEndOptions: {
                    disabledDate: time => {
                        return this.pickerEndTimeOptions(time, this.dialogContrast.options.selectStartTime);
                    },
                },
                options: {
                    currentStartTimeList: [],
                    currentEndTimeList: [],
                    currentStartDate: '',
                    currentStartTime: '',
                    currentEndDate: '',
                    currentEndTime: '',

                    selectStartDate: '',
                    selectStartTime: '',
                    selectEndDate: '',
                    selectEndTime: '',
                },
            },
            showContrastMap: false, // 是否显示热力对比图例
            moduleName: '/dataServer/dispatchDataAnalysis',
            op: {
                getAreaHexagon: 'getAreaHexagon',
            },
            currentBasePathObj: {}, // 原始接口返回的路径信息
            selectBasePathObj: {}, // 原始接口返回的路径信息
            menuParams: {},
        };
    },
    mounted() {},

    methods: {
        handleSelectDateTimeChange(oDateTime) {
            let { startDate = '', endDate = '', startTime = '', endTime = '' } = oDateTime;
            this.dialogContrast.options.selectStartDate = startDate;
            this.dialogContrast.options.selectEndDate = endDate;
            this.dialogContrast.options.selectStartTime = startTime;
            this.dialogContrast.options.selectEndTime = endTime;
        },

        handleCurrentDateTimeChange(oDateTime) {
            let { startDate = '', endDate = '', startTime = '', endTime = '' } = oDateTime;
            this.dialogContrast.options.currentStartDate = startDate;
            this.dialogContrast.options.currentEndDate = endDate;
            this.dialogContrast.options.currentStartTime = startTime;
            this.dialogContrast.options.currentEndTime = endTime;
        },
        handleCreateHotDiagram() {
            let params = this.$refs['hotMenu'].getParams();

            const dateTimeOptions = this.dialogContrast.options;

            if (!params.localCode) {
                this.$message.error('请选择城市');
                return false;
            }

            const column = Object.keys(dateTimeOptions).filter(item => item != 'currentStartTimeList' && item != 'currentEndTimeList');
            if (!column.every(key => dateTimeOptions[key])) {
                this.$message.error('请完善日期时间选择项');
                return false;
            }

            let currentStartTime = `${dateTimeOptions.currentStartDate} ${dateTimeOptions.currentStartTime}:00`;
            let currentEndTime = `${dateTimeOptions.currentEndDate} ${dateTimeOptions.currentEndTime}:00`;
            let selectStartTime = `${dateTimeOptions.selectStartDate} ${dateTimeOptions.selectStartTime}:00`;
            let selectEndTime = `${dateTimeOptions.selectEndDate} ${dateTimeOptions.selectEndTime}:00`;

            if (this.checkTimeRequire(currentStartTime, currentEndTime) || this.checkTimeRequire(selectStartTime, selectEndTime)) {
                return false;
            }

            let currentParams = {
                ...params,
                startDate: currentStartTime,
                endDate: currentEndTime,
                dateType: 'CUSTOM',
            };
            let selectParams = {
                ...params,
                startDate: selectStartTime,
                endDate: selectEndTime,
                dateType: 'CUSTOM',
            };

            Promise.all([this.getHotData(currentParams), this.getHotData(selectParams)])
                .then(values => {
                    // console.log(values, 'valuesvaluesvaluesvalues');
                    if (values[0].code == 1) {
                        // 主图例数据
                        this.currentBasePathObj = JSON.parse(values[0].data);
                        // 热力对比副图例数据
                        this.selectBasePathObj = JSON.parse(values[1].data);

                        this.$nextTick(() => {
                            this.getLatlngBounds(0);
                            this.initSliderScroll();
                        });
                    }
                })
                .finally(() => {
                    this.loading = false;
                    this.dialogContrast.dialogVisible = false;
                    this.showContrastMap = true;
                });
        },
        // 获取热力图数据
        getHotData(params) {
            const op = this.op.getAreaHexagon;
            // this.loading = true;
            // 初始化数据
            this.currentBasePathObj = {};
            this.selectBasePathObj = {};
            // 重置进度条
            this.sliderValue = 1;
            this.handleVideoPause();

            let data = {
                data: {
                    ...params,
                },
                op,
            };
            let URL = this.getModuleUrl(op);
            return this.$axios(URL, data);
        },

        // 根据当前帧热力图, 调用地图能力显示范围
        getLatlngBounds(index) {
            const hotMap01 = this.$refs['hotMap01'];
            // console.log(this.currentBasePathObj);
            const hotMap01Fragment = this.currentBasePathObj.frameDetailList[index];
            // 生成热力对比图后, 调用附图例中的数据调整地图到指定大小
            if (this.showContrastMap) {
                const hotMap02 = this.$refs['hotMap02'];
                const hotMap02Fragment = this.selectBasePathObj.frameDetailList[index];
                hotMap02Fragment && hotMap02.setMapAutoPosition(hotMap02Fragment);
                hotMap02Fragment.areaHexagonList && hotMap02.setMapPolygon(hotMap02Fragment.areaHexagonList);
            }
            hotMap01Fragment.areaHexagonList && hotMap01.setMapPolygon(hotMap01Fragment.areaHexagonList);
            hotMap01Fragment && hotMap01.setMapAutoPosition(hotMap01Fragment);
        },

        // 设置地图中心点位置(主/对比图例移动时触发另一个地图移动到相同的位置)
        setMapCenter(lat, lng) {
            this.$refs['hotMap01'].setMapLatLng(lat, lng);
            // 只有显示了对比图例才会对对比图例操作移动
            if (this.showContrastMap) {
                this.$refs['hotMap02'].setMapLatLng(lat, lng);
            }
        },

        // 两个图例设置相同的缩放等级
        setZoomSize(zoom) {
            this.$refs['hotMap01'].setMapZoomSize(zoom);
            // 只有显示了对比图例才会对对比图例操作移动
            if (this.showContrastMap) {
                this.$refs['hotMap02'].setMapZoomSize(zoom);
            }
        },

        // 查询热力图
        handleClickRefresh(params) {
            // OA权限控制
            if (!this.oaPowerList.getAreaHexagon) {
                return false;
            }
            this.menuParams = params || {};
            // 时间必填, 且校验时间的最大和最小选择范围
            if (this.checkTimeRequire(params.startDate, params.endDate)) {
                return false;
            }
            this.getHotData(params)
                .then(res => {
                    if (res.code == 1) {
                        const ret = JSON.parse(res.data);
                        this.currentBasePathObj = ret;
                        this.getLatlngBounds(0);
                        this.initSliderScroll();
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 时间必填, 且校验时间的最大和最小选择范围
        checkTimeRequire(startTime, endTime) {
            let flag = false;
            if (!startTime && !endTime) {
                this.$message.error('请完善选择时间');
                flag = true;
            } else {
                let startDate = new Date(startTime).getTime();
                let endDate = new Date(endTime).getTime();
                let total = endDate - startDate;
                if (total > 86400000 || total < 1800000) {
                    this.$message.error('时间可选最大24h, 最小可选择30min');
                    flag = true;
                }
            }
            return flag;
        },

        // 关闭运力缺口弹窗
        handleCloseDialogTime() {
            this.dialogContrast.options = {
                currentStartTimeList: [],
                currentEndTimeList: [],
                currentStartDate: '',
                currentStartTime: '',
                currentEndDate: '',
                currentEndTime: '',

                selectStartDate: '',
                selectStartTime: '',
                selectEndDate: '',
                selectEndTime: '',
            };
            this.dialogContrast.dialogVisible = false;
            this.dialogContrast.isDisabledCurrentTime = false;
        },

        // 运力缺口对比
        handleHotMapContrast() {
            this.handleCloseDialogTime();
            let params = this.$refs['hotMenu'].getParams();
            let { startDate, endDate } = params;
            if (startDate != ' :00' && endDate != ' :00') {
                startDate = startDate.substr(0, 16);
                endDate = endDate.substr(0, 16);
                this.dialogContrast.isDisabledCurrentTime = Boolean(startDate && endDate);

                this.dialogContrast.options.currentStartTimeList = startDate.split(' ');
                this.dialogContrast.options.currentEndTimeList = endDate.split(' ');

                this.dialogContrast.options.currentStartDate = startDate.split(' ')[0];
                this.dialogContrast.options.currentEndDate = endDate.split(' ')[0];
                this.dialogContrast.options.currentStartTime = startDate.split(' ')[1];
                this.dialogContrast.options.currentEndTime = endDate.split(' ')[1];
            }

            this.dialogContrast.dialogVisible = true;
        },

        // 暂停按钮
        handleVideoPause() {
            clearInterval(this.sliderInterval);
            this.sliderInterval = null;
        },

        // 初始化播放进度条
        initSliderScroll() {
            if (this.sliderInterval) {
                clearInterval(this.sliderInterval);
            }
            this.sliderInterval = setInterval(() => {
                if (this.sliderValue == 30) {
                    clearInterval(this.sliderInterval);
                    this.sliderInterval = null;
                    return '';
                }
                this.getLatlngBounds(this.sliderValue - 1);
                this.sliderValue++;
            }, 1000);
        },

        handleSliderChange(value) {
            clearInterval(this.sliderInterval);
            this.sliderInterval = null;
            this.getLatlngBounds(this.sliderValue - 1);
            // console.log(value, "----------------");
        },

        pickerEndTimeOptions(time, startTime) {
            // 根据开始时间去限制结束时间的可选范围
            if (startTime) {
                return time.getTime() < new Date(startTime) || time.getTime() > new Date().getTime();
            }
            let curDate = Date.now();
            let three = 90 * 86400000;
            let threeMonths = curDate - three;
            let current = new Date(new Date().toLocaleDateString()).getTime() + (86400000 - 1000);
            return time.getTime() > current || time.getTime() < threeMonths;
        },

        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
    beforeDestroy() {
        // 在离开页面的时候关闭定时器
        this.handleVideoPause();
    },
};
</script>

<style lang="scss">
.dispath-head {
    .el-slider__bar {
        background-color: #fff;
    }
    .el-slider__runway {
        background-color: #909399;
    }
    .el-dialog__wrapper .el-dialog {
        padding: 0 10px;
    }
}
</style>
<style lang="scss" scoped>
.slider-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: rgba(92, 90, 90, 0.3);
    padding: 0 10px;
    margin: 10px 0;

    .slider-icon {
        font-size: 24px;
        cursor: pointer;
        color: #fff;
    }
    .slider {
        margin-left: 20px;
        flex: 1;
    }
    .slider-time {
        width: 40px;
        text-align: center;
        margin-left: 10px;
        color: #fff;
    }
}
.mt10 {
    margin-top: 10px;
}
</style>
