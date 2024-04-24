<!--围栏详情-->
<template>
    <div class="panel">
        <div class="ws-table-warp">
            <div class="channel-info">
                <div class="title"><span>围栏规则</span></div>
                <div class="channel-content">
                    <div class="inline-block">
                        <label for class="label">围栏城市：</label>
                        <span class="text">{{ fenceInfo.provinceName }}-{{ fenceInfo.cityName }}-{{ fenceInfo.areaName }}</span>
                    </div>
                    <div class="inline-block">
                        <label for class="label">围栏名称：</label>
                        <span class="text">{{ fenceInfo.fenceName }}</span>
                    </div>
                    <div class="inline-block">
                        <label for class="label">中心位置：</label>
                        <span class="text">{{ fenceInfo.address }}</span>
                    </div>
                    <div class="inline-block">
                        <label for class="label">围栏面积：</label>
                        <span class="text">{{ fenceInfo.fenceArea }}㎡</span>
                    </div>
                    <div v-if="fenceInfo.fenceType == 2" class="inline-block">
                        <label for class="label">经纬度组：</label>
                        <el-input disabled v-model="polygons"></el-input>
                        <el-button type="primary" @click="viewFence()">查看围栏</el-button>
                    </div>
                    <div v-if="fenceInfo.fenceType == 1" class="inline-block">
                        <label for class="label">围栏圆心：</label>
                        <el-input disabled v-model="fenceInfo.location"></el-input>
                        <el-button type="primary" @click="viewFence()">查看围栏</el-button>
                    </div>
                    <div v-if="fenceInfo.fenceType == 1" class="inline-block">
                        <label for class="label">围栏半径(米)：</label>
                        <el-input disabled v-model="fenceInfo.fenceRadius"></el-input>
                    </div>
                </div>
            </div>
            <div class="channel-info">
                <div class="title"><span>记录信息</span></div>
                <div class="flexCenter recordInfo">
                    <div class="recordBox flexStart">
                        <label class="label">最后修改人：</label>
                        {{ fenceInfo.updateUserName }}
                    </div>
                    <div class="recordBox flexStart">
                        <label class="label">最后修改时间：</label>
                        {{ fenceInfo.updateTime }}
                    </div>
                </div>
            </div>
            <div class="marginTop15 flexCenter saveButon">
                <el-button plain @click="$router.push('/workbench/BRintercityLine')" class="buttons">返 回</el-button>
            </div>
            <el-dialog title="查看围栏" :visible.sync="dialogVisible" width="50%" :destroy-on-close="true">
                <fence-map :showSearch="false" cityCode="440304" ref="fence-map"></fence-map>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import fenceMap from '../component/fenceMap';
export default {
    name: 'intercityLineFenceForm',
    components: {
        fenceMap
    },
    data() {
        return {
            op: {
                detail: 'queryFenceDetail'
            },
            moduleName: '/workbench/fence',
            routerQurey: {},
            dialogVisible: false,
            fenceInfo: {},
            polygons: ''
        };
    },
    mounted() {
        this.routerQurey = this.$route.query;
        this.getData(this.routerQurey.id);
    },
    methods: {
        // 查看围栏
        viewFence() {
            this.dialogVisible = true;
            this.$nextTick(() => {
                let arr = [];
                if (this.fenceInfo.fenceType === 1) {
                    arr.push([this.fenceInfo.locationPoint.lon, this.fenceInfo.locationPoint.lat]);
                    this.$refs['fence-map'].viewFence('circles', { path: arr[0], radius: this.fenceInfo.fenceRadius });
                } else {
                    this.fenceInfo.polygonPoints.forEach(obj => {
                        arr.push([obj.lon, obj.lat]);
                    });
                    this.$refs['fence-map'].viewFence('polygons', arr);
                }
            });
        },
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
                    let data = JSON.parse(res.data);
                    if (data.anwserCode.code == 1) {
                        this.fenceInfo = data;
                        let polygonArr = this.fenceInfo.polygon.split(';');
                        let polygons = [];
                        polygonArr.forEach((obj, idx) => {
                            polygons += `[${obj.split(',')}]${idx != polygonArr.length - 1 ? '，' : ''} `;
                        });
                        this.polygons = polygons;
                    } else {
                        this.$message.error(data.anwserCode.message);
                    }
                }
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        back() {
            this.$router.push({ path: this.moduleName, query: { moduleName: 'fence' } });
        }
    }
};
</script>

<style lang="scss" scoped>
.channel-info {
    // background: #f0f2f5;
    border-radius: 8px;
    // border: 1px solid #dcdfe6;
    .channel-content {
        padding-bottom: 32px;
    }
    .title {
        font-size: 18px;
        color: #606266;
        border-bottom: 1px solid #dfe2e8;
        padding: 0px 10px 15px;
        span {
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #303133;
            font-size: 16px;
        }
    }
    .channel-content {
        flex-wrap: wrap;
        .block,
        .inline-block {
            width: 100%;
            margin-top: 30px;
            display: flex;
            .label {
                display: inline-block;
                text-align: right;
                vertical-align: top;
                margin-right: 15px;
                width: 150px !important;
            }
            .el-input{
                width: 50% !important;
                margin-right: 10px;
            }
            .text {
                word-break: break-all;
            }
            .lat-lon-list {
                width: 70%;
                padding: 20px;
                background: #e0e0e0;
                border-radius: 5px;
            }
        }
    }
}
.flexCenter {
    display: flex;
    justify-content: center;
}
.flexStart {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.recordInfo {
    height: 60px;
    .recordBox {
        width: 50%;
        .label {
            width: 124px;
            text-align: right;
        }
    }
}
.marginTop15 {
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
/deep/.ws-table-warp{
    min-height: calc(100% - 64px);
}
</style>
