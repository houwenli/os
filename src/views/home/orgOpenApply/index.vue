<template>
    <div>
        <div class="org-open-apply">
            <!-- 表单 -->
            <validate-form ref="validateForm" :ruleForm="ruleForm" :rules="rules" @chooseLocal="chooseLocal"></validate-form>

            <div class="org-open-apply-title">附件信息</div>
            <div class="currency-apply-upload">
                <ws-image-upload v-bind="options" />
            </div>
        </div>

        <!-- 审核流程 -->
        <audit-process ref="auditProcess" :actions="actions" :query="{ nameCode: ruleForm.orgType }"></audit-process>

        <!-- 底部导航 -->
        <footer-fixed backTo="index">
            <ws-throttle>
                <el-button type="primary" style="width: 160px;height: 40px;" @click="submitForm('validateForm')" v-if="oaPowerList.startOrg">提交审核</el-button>
            </ws-throttle>
        </footer-fixed>

        <!-- 地址采集 -->
        <a-map :show-search="true" v-if='mapShow' :show.sync="mapShow" :marker="marker" @select="getMapInfo" :cityOpt="cityOpt"></a-map>
    </div>
</template>

<script>
import ValidateForm from '../components/ValidateForm';
import FooterFixed from '../components/FooterFixed';
import AuditProcess from '@/components/AuditProcess';
import AMap from '@/components/AMap';
import { ruleForm, rules } from '../utils/validateForm';
export default {
    name: 'orgOpenApply',
    components: { ValidateForm, FooterFixed, AMap, AuditProcess },

    data() {
        return {
            moduleName: '/index/todo',
            options: {
                quantity: 0,
                actions: {
                    url: '/file/upload',
                    op: 'upload'
                },
                afterUpload: this.afterUpload,
                handleRemove: this.handleRemove
            },
            ruleForm,
            rules,
            actions: {
                moduleName: '/index/todo',
                op: 'flowNode'
            },
            mapShow: false,
            isUpload: false,
            cityOpt: {}
        };
    },

    computed: {
        marker() {
            const { longitude, latitude } = this.ruleForm;
            return longitude && latitude ? [{ longitude, latitude }] : [];
        }
    },

    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                let form = Object.assign(this.ruleForm, { submitProvinceCode: '', submitAreaCode: '', provinceCode: '', cityCode: '' });
                if (valid && this.isUpload) {
                    let opt = {
                        data: {
                            procDefId: this.$refs.auditProcess.procdefId,
                            approvalInfo: this.createdApprovalInfo(),
                            nodeFormJson: JSON.stringify(form),
                            attachmentInfoList: this.fileList,
                            flag: true
                        },
                        op: 'startOrg'
                    };
                    this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                        if (res.code == 1) {
                            this.isUpload = false;
                            this.$router.push({ path: '/applySuccess' });
                        }
                    });
                } else {
                    this.$message.info('请上传图片');
                }
            });
        },

        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },

        afterUpload({ data }) {
            this.isUpload = true;
            this.fileList = [...this.fileList, ...data];
            return data;
        },

        createdApprovalInfo() {
            let result = [],
                allList = this.$refs.auditProcess.allList;
            for (let i = 0; i < allList.length; i++) {
                const e = allList[i];
                let userIds = [];
                for (let j = 0; j < e.userInfos.length; j++) {
                    userIds.push(e.userInfos[j].id);
                }
                let obj = {
                    nodeId: e.nodeKey,
                    userIds
                };
                result.push(obj);
            }
            return result;
        },

        handleRemove() {
            this.isUpload = false;
        },

        chooseLocal(bool, cityOpt) {
            this.cityOpt = cityOpt;
            this.mapShow = bool;
        },

        getMapInfo({ lat, lng, formattedAddress }) {
            this.ruleForm.longitude = lng;
            this.ruleForm.latitude = lat;
            this.ruleForm.address = formattedAddress ? formattedAddress : '';
        }
    }
};
</script>

<style scoped lang="scss">
.org-open-apply {
    background: #ffffff;
    border-radius: 8px;
    padding: 32px 40px 8px 40px;

    &-title {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 20px;
    }
}
</style>