<template>
    <div class="contentBox">
        <div class="btnBack">
            <div class="btnBox" v-show="isShow">
                <el-radio-group v-model="currentComponent">
                    <el-radio-button class="tab-btn" label="demandApplication">需求申请</el-radio-button>
                    <el-radio-button class="tab-btn" label="businessDemandManage" v-if="getModulePower('/business').businessDemandApplyAllList||getModulePower('/business').businessDemandApplyList">业务需求管理</el-radio-button>
                    <el-radio-button class="tab-btn" label="technicalRequirementsManage" v-if="getModulePower('/technologyDemand').demandApplyAllList||getModulePower('/technologyDemand').demandApplyList">技术需求管理</el-radio-button>
                    <el-radio-button class="tab-btn" label="driverRequirementsManage" v-if="getModulePower('/driverDemand').daijiaDemandApplyAllList||getModulePower('/driverDemand').daijiaDemandApplyList">代驾需求管理</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <keep-alive>
            <component :is="currentComponent" @transfer="getUser" @transfer1="getName" :resubmitName="resubmitName" :id="id" :type="handelType" @back="back" @emptyId="id = ''"></component>
        </keep-alive>
    </div>
</template>
<script>
import demandApplication from './components/demandApplication.vue';
import technicalRequirementsManage from './components/technicalRequirementsManage.vue';
import businessDemandManage from './components/businessDemandManage.vue';
import driverRequirementsManage from './components/driverRequirementsManage.vue';

export default {
    name: 'BRrequirement',
    components: {
        demandApplication,
        technicalRequirementsManage,
        businessDemandManage,
        driverRequirementsManage
    },
    data() {
        return {
            isShow: true,
            id: '',
            resubmitName: '',
            currentComponent: 'demandApplication',
            handelType: '',
        };
    },
    watch: {
        '$route.query.type': {
            handler(value) {
                if (value === 'back') {
                    this.isShow = true;
                    this.id = '';
                    this.currentComponent = 'technicalRequirementsManage';
                }
            },
        },
    },
    activated() {
        if (this.$route.query.name == 'edit') {
            this.currentComponent = 'demandApplication';
            this.isShow = false;
        }
    },
    methods: {
        back() {
            this.isShow = true;
            this.currentComponent = 'technicalRequirementsManage';
        },
        getUser(val) {
            this.isShow = true;
            this.currentComponent = val;
        },
        getName(id, name, msg, type) {
            this.isShow = false;
            this.id = id;
            this.resubmitName = name;
            this.currentComponent = msg;
            this.handelType = type;
        },
    },
};
</script>
<style lang="scss" scoped>
.tab-btn {
    /deep/ .el-radio-button__inner {
        width: 144px !important;
    }
}
/deep/ .el-radio-button__inner {
    background-color: #ebeef5;
    border-style: none;
    border-left: 0px solid #dcdfe6 !important;
    border-radius: 0px 3px 3px 0px;
}
.toggleBtn:focus {
    background-color: #f05259;
    border-color: #f05259;
    color: white;
}
.contentBox {
    height: 100%;
    .btnBack {
        background-color: white;
        border-radius: 8px 8px 0 0;
        .btnBox {
            margin-left: 50px;
            padding-top: 20px;
        }
    }
}
.toggleBtn {
    margin-left: 0;
}
</style>