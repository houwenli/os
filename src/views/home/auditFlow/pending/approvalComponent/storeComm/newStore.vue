<template>
    <div>
        <!-- 新 - 实体店开业 opType为3 -->
        <div class="block_item_container">
            <span class="block_item_title">门店信息</span>
            <el-row class="block_item_wrap">
                <el-col v-for="item in storeInfo" :key="item.value">
                    <el-form-item :label="item.label">{{ getVal(nodeForm[item.value], item.value) }}</el-form-item>
                </el-col>
            </el-row>
        </div>
        <!-- 历史数据没有负责人信息，所以加个判断 -->
        <div v-if="nodeForm && nodeForm.rpcPersonChargeInfoAo" class="block_item_container">
            <span class="block_item_title">负责人信息</span>
            <el-row class="block_item_wrap">
                <el-col v-for="item in responsibleInfo" :key="item.value" :span="12">
                    <el-form-item :label="item.label">{{ getVal(nodeForm.rpcPersonChargeInfoAo[item.value], item.value) }}</el-form-item>
                </el-col>
            </el-row>
        </div>
        <div class="block_item_container" v-if="nodeForm.orgBusiness">
            <span class="block_item_title">营业执照信息</span>
            <el-row class="block_item_wrap">
                <el-col v-for="item in businessLicenseInfo" :key="item.value" :span="12">
                    <el-form-item :label="item.label">{{ getVal(nodeForm.orgBusiness[item.value], item.value) }}</el-form-item>
                </el-col>
            </el-row>
        </div>
        <div class="block_item_container">
            <span class="block_item_title">个人信息</span>
            <el-row class="block_item_wrap">
                <el-col v-for="item in personalInfo" :key="item.value" :span="12">
                    <el-form-item :label="item.label">{{ getVal(nodeForm.employee[item.value], item.value) }}</el-form-item>
                </el-col>
            </el-row>
            <!-- 家庭成员表格 -->
            <ws-table-el style="margin-top: 20px" :data="familyMemberList" ref="tableList" :multi="false" :indexColumn="false" :pagination="false" :filterColumns="true" height="50%" :page-size-list="[20, 30, 50]">
                <template>
                    <ws-table-column-el prop="member" label="家庭成员" width="300"></ws-table-column-el>
                    <ws-table-column-el prop="name" label="姓名" width="350"></ws-table-column-el>
                    <ws-table-column-el prop="relation" label="关系" width="350"></ws-table-column-el>
                    <ws-table-column-el prop="phone" label="联系方式"></ws-table-column-el>
                </template>
            </ws-table-el>
        </div>
    </div>
</template>

<script>
import * as storeApprovalType from './data'
export default {
    //分公司变更审批
    name: 'newStore',
    props: {
        nodeForm: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            storeInfo: [
                //门店信息
                { label: '实体店简称：', value: 'simpleName' },
                { label: '所属机构：', value: 'parentName' },
                { label: '门店所在地区：', value: 'fullParentName' },
                { label: '门店详细地址：', value: 'supplementAddress' }
            ],
            businessLicenseInfo: [
                //营业执照信息
                { label: '单位名称：', value: 'orgName' },
                { label: '企业性质：', value: 'bLUnitProperty' },
                { label: '个人/对公账户：', value: 'broughtAccount' },
                { label: '办证日期：', value: 'bLHandleTime' },
                { label: '统一社会信用代码：', value: 'serviceNo' },
                { label: '实际经营场所：', value: 'address' },
                { label: '经营范围：', value: 'bLScope' },
                { label: '备注：', value: 'remark' }
            ],
            personalInfo: [
                //个人信息
                { label: '学历：', value: 'highestEducation' },
                { label: '性别：', value: 'sex' },
                { label: '政治面貌：', value: 'politicalType' },
                { label: '身份证地址：', value: 'identityCardAddress' },
                { label: '目前住址：', value: 'currentAddress' }
            ],
            responsibleInfo: [
                //负责人信息
                { label: '负责人姓名：', value: 'personChargeName' },
                { label: '负责人身份证：', value: 'personChargeNo' },
                { label: '负责人职务：', value: 'personChargePostName' },
                { label: '负责人手机号：', value: 'personChargePhone' }
            ],
            storeApprovalType
        }
    },
    computed: {
        familyMemberList() {
            let tableList = this.nodeForm.employee.employeeFamilyMemberList
            for (var i = 0; i < tableList.length; i++) {
                tableList[i].member = '成员'+(i+1)
            }
            return tableList
        }
    },
    methods: {
        getVal(val, key) {
            if (val || val === 0) {
                if (key === 'supplementAddress') return this.nodeForm.address + this.nodeForm.supplementAddress
                if (key === 'bLHandleTime') return this.nodeForm.orgBusiness.bLHandleTime.split(' ')[0]
                if (key === 'highestEducation') return this.storeApprovalType.studyInfo[val]
                if (key === 'sex') return this.storeApprovalType.sexInfo[val]
                if (key === 'politicalType') return this.storeApprovalType.politicalInfo[val]
                return val
            }
            return '-'
        }
    }
}
</script>