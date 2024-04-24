<template>
    <div class="box">
        <div class="wrap">
            <div v-if="opType=='add'">
                <span class="required">*</span>手机号码：<el-input v-model.trim="phone" placeholder="请输入需要管控的司机手机号" clearable></el-input>
                <ws-enter-event>
                    <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                </ws-enter-event>
            </div>
            <ws-descriptions title="基础信息" :showToggle="false">
                <ws-descriptions-item label="姓名">{{ getObj.name }}</ws-descriptions-item>
                <ws-descriptions-item label="司机ID">{{ getObj.driverId }}</ws-descriptions-item>
                <ws-descriptions-item label="身份证号">{{ getObj.idNumber }}</ws-descriptions-item>
                <ws-descriptions-item label="手机号">{{ getObj.phone }}</ws-descriptions-item>
                <ws-descriptions-item label="车牌号">{{ getObj.carNum }}</ws-descriptions-item>
                <ws-descriptions-item label="所属机构">{{ getObj.agencyName }}</ws-descriptions-item>
                <ws-descriptions-item label="上报状态">{{ getObj.reportStatus | reportStatusFilters }}</ws-descriptions-item>
            </ws-descriptions>
            <el-steps align-center v-if="opType=='detail'">
                <el-step v-for="item in getObj.detectRecordList" :key="item.operationTime" :status="statusMap(item.status)">
                    <div slot="description">
                        <p>{{$baseMethod.formatData(item.operationTime, 'yyyy-MM-dd')}}</p>
                        <p>{{item.status | detectStatusFilters}}</p>
                    </div>
                </el-step>
            </el-steps>
        </div>
        <div class="footer">
            <el-button @click="handleCancel()">返 回</el-button>
            <el-button type="primary" @click="handleSave()" :loading="saveLoading">确 定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            moduleName: '/workbench/BRepidemicControl',
            getObj: {},
            phone: '',
            saveLoading: false
        }
    },
    computed: {
        opType() {
            return this.$route.query.type;
        }
    },
    created() {
        if (this.$route.query.id) {
            this.getDetail();
        }
    },
    methods: {
        getDetail() {
            let params = {
                data: JSON.stringify({
                    id: this.$route.query.id
                }),
                op: 'monitorDetail',
            };
            let URL = this.powerList[params.op];
            this.$axios(URL, params)
                .then(res => {
                    this.getObj = JSON.parse(res.data);
                })
        },
        search() {
            if (!this.$regexList.get('mobile').test(this.phone)) {
                this.$message.error('请输入正确的手机号码');
                return;
            }
            let params = {
                data: JSON.stringify({
                    phone: this.phone
                }),
                op: 'queryDriver',
            };
            let URL = this.powerList[params.op];
            this.$axios(URL, params)
                .then(res => {
                    this.getObj = JSON.parse(res.data);
                })
        },
        handleSave() {
            if (!this.getObj.driverId) {
                this.$message.error('请选择要添加的司机');
                return;
            }
            this.saveLoading = true;
            let params = {
                data: JSON.stringify({
                    driverId: this.getObj.driverId
                }),
                op: 'monitorAdd',
            };
            let URL = this.powerList[params.op];
            this.$axios(URL, params)
                .then(res => {
                    this.$message.success('添加成功');
                    this.$router.push(this.moduleName);
                }).finally(() => {
                    this.saveLoading = false;
                })
        },
        handleCancel() {
            this.$router.push(this.moduleName);
        },
        statusMap(status) {
            return { 
                100: 'success',
                101: 'error',
                102: 'wait'
            }[status]
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    background: #fff;
    border-radius: 8px;
    padding: 20px 40px 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    margin-bottom: 64px;
    .required {
        color: red;
    }
    .el-input {
        width: 250px;
        margin-right: 20px;
    }
    .ws-descriptions {
        margin-top: 10px;
    }
}
.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: calc(100% + 166px);
    height: 64px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    .el-button {
        width: 160px;
        height: 40px;
    }
}
</style>