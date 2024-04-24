<template>
    <el-dialog title="坐标采集" top="100px" :visible.sync="dialogVisible" :lock-scroll="true" width="56%">
            <div class="dialog-box">
                <div class="input-box">
                    <el-form :model="dialogForm" label-width="78px">
                        <el-col :span="12">
                            <el-form-item label="当前城市：">
                                <el-input :disabled="inputDisab" placeholder="" v-model.trim="dialogForm.city"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="坐标：">
                                <el-input :disabled="inputDisab" placeholder="" v-model.trim="dialogForm.latlng"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="地址：">
                                <el-input placeholder="" :disabled="inputDisab" v-model.trim="dialogForm.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <el-button class="determine-btn" type="primary" @click="addressSure">确定</el-button>
            </div>

            <div id="mapBox"></div>
        </el-dialog>
</template>

<script>
export default {
    name:'CoordinateDialog',
    props:{
        basicsParam:{
            type:Object,
            default: () => {}
        },
        inputDisab:{
            type: Boolean,
            default: true
        }
    },
    data(){
        return{
               dialogVisible:false,
               dialogForm:{}
        }
    },
    methods:{
        //地图
        async initMap() {
            try {
                let vm = this;
                let { longitude, latitude } = vm.basicsParam;
                let map = new AMap.Map('mapBox', {
                    zoom: 15, //初始化地图级别
                    center: [longitude, latitude], //初始化地图中心点位置
                    resizeEnable: true, // 调整任意窗口的大小，自适应窗口
                    animateEnable: false,
                });

                // 拖拽选址
                AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
                    let positionPicker = new PositionPicker({
                        mode: 'dragMap',
                        map: map
                    });
                    positionPicker.on('success', function (positionResult) {
                        let { address, position, regeocode } = positionResult;
                        vm.dialogForm = { latlng: `${position.lng},${position.lat}`, address, city: regeocode['addressComponent'].city || regeocode['addressComponent'].province };
                    });
                    positionPicker.on('fail', function (positionResult) {
                        console.log(`定位失败:` + positionResult);
                    });
                    positionPicker.start();
                    map.panBy(0, 0);
                });
            } catch (err) {
                throw err;
            }
        },
        choiceAddress() {
            this.dialogVisible = true;
            // 延迟地图加载，防止地图无法正常显示
            setTimeout(() => {
                this.initMap();
            }, 1);
        },
        addressSure(){
            this.$emit('addressSure');
        },
        isDialogVisible(){
            this.dialogVisible=false
        }
    }
}
</script>

<style lang="scss" scoped>
 #mapBox {
        width: 100%;
        height: 540px;
    }
</style>