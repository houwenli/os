<template>
    <div>
        <!-- 编辑实体店 opType为2 -->
        <div class="block_item_container">
            <span class="block_item_title">基础信息</span>
            <el-row class="block_item_wrap">
                <el-col v-for="item in basicInfo" :key="item.value" :span="12">
                    <el-form-item :label="item.label">
                        <span :class="nodeForm.consoleList && nodeForm.consoleList.includes(item.value) ? 'red' : ''">{{ getVal(nodeForm[item.value], item.value) }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div class="block_item_container" v-if="nodeForm.orgBusiness">
            <span class="block_item_title">营业执照信息</span>
            <el-row class="block_item_wrap">
                <el-col v-for="item in businessLicenseInfo" :key="item.value" :span="12">
                    <el-form-item :label="item.label">
                        <span :class="nodeForm.businessList && nodeForm.businessList.includes(item.value) ? 'red' : ''">{{ getVal(nodeForm.orgBusiness[item.value], item.value) }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    //分公司变更审批
    name: 'editStore',
    props: {
        nodeForm: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            basicInfo: [
                //基本信息
                { label: '实体店简称：', value: 'simpleName' },
                { label: '实体店全称：', value: 'name' },
                { label: '机构编码：', value: 'agencyNumber' },
                { label: '个人/对公账号：', value: 'broughtAccount' },
                { label: '业务城市：', value: 'businessCity' },
                { label: '上级机构：', value: 'parentName' },
                { label: '业务运营范围：', value: 'cityName' },
                { label: '机构所在地：', value: 'submitAreaName' },
                { label: '店面位置：', value: 'storeLocationName' },
                { label: '办公场地面积(m²)：', value: 'spaceArea' },
                { label: '详细地址：', value: 'address' }
            ],
            businessLicenseInfo: [
                //营业执照信息
                { label: '单位名称：', value: 'orgName' },
                { label: '单位性质：', value: 'bLUnitProperty' },
                { label: '法定代表人：', value: 'bLPersonChargeName' },
                { label: '办证日期：', value: 'bLHandleTime' },
                { label: '统一社会信用代码：', value: 'serviceNo' },
                { label: '实际经营场所：', value: 'address' },
                { label: '经营范围：', value: 'bLScope' }
            ]
        }
    },
    methods: {
        getVal(val, key) {
            if (val) {
                if (key === 'businessCity') return this.nodeForm.provinceName + this.nodeForm.cityName ? '-' + this.nodeForm.cityName : ''
                if (key === 'cityName') {
                    let newVal =
                        (this.nodeForm.areaNames && this.nodeForm.areaNames.map(k => [this.nodeForm.provinceName, this.nodeForm.cityName, k].filter(v => !!v).join('-')).join('，')) ||
                        [this.nodeForm.provinceName, this.nodeForm.cityName].join('-')
                    return this.nodeForm.businessScopeType == 2 ? '电子围栏' : newVal
                }
                if (key === 'submitAreaName') return this.nodeForm.submitProvinceName + '-' + this.nodeForm.submitCityName + '-' + this.nodeForm.submitAreaName || '-'
                if (key === 'address') return this.nodeForm.address + this.nodeForm.supplementAddress || '-'
                if (key === 'bLHandleTime') return this.nodeForm.orgBusiness.bLHandleTime ? this.nodeForm.orgBusiness.bLHandleTime.split(' ')[0] : '-'
                return val
            }
            return '-'
        }
    }
}
</script>