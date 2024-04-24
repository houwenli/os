<template>
    <!-- 代驾司机入网申请 -->
    <div class="__approval_field_wrap_container">
        <div class="imgList_wrap_container">
            <p class="flow_title">司机相关证件({{ imgUrlList.length }}张)</p>
            <div class="imgList_container">
                <el-carousel ref="carousel" :autoplay="false" arrow="hover" indicator-position="none" @change="setSelectIndex">
                    <el-carousel-item v-for="(item, index) in imgUrlList" :key="index + 'one'">
                        <div class="img_container" @click="onPreview(index)">
                            <div class="img_content"><img :src="item.src" /></div>
                            <h3 class="img_title">{{ item.title }}</h3>
                        </div>
                    </el-carousel-item>
                </el-carousel>
                <ws-image-viewer :visible="visible" :src-list="srcList" :currentIndex="currentIndex" :onClose="closeView" />
                <div class="viewer-navList">
                    <ul class="viewer-list">
                        <ScrollPane ref="scrollContainer" :vertical="false">
                            <div class="viewer_list_content">
                                <div class="ul_list_item" @click="setActiveItem(index)" v-for="(item, index) in imgUrlList" :key="index + 'two'">
                                    <div :class="selectIndex === index ? '' : 'item_dialog'"></div>
                                    <img :src="item.src" />
                                </div>
                            </div>
                        </ScrollPane>
                    </ul>
                </div>
            </div>
        </div>
        <div class="block_container">
            <el-form class="flow_form" :inline="true" label-width="140px" :model="dataObject">
                <dataForm v-for="(item, index) in confingList(0, 1)" :key="index + 'three'" :formConfig="item.formConfig" :formData="dataObject" :title="item.title"></dataForm>
                <dataForm
                    v-for="(item, index) in confingList(1, activtyConfig.length - 1)"
                    :key="index"
                    :formConfig="item.formConfig"
                    :formData="dataObject.nodeFormJson.driverApprovalInfo"
                    :title="item.title"
                ></dataForm>
            </el-form>
        </div>
    </div>
</template>

<script>
import ScrollPane from '@/layout/components/TagsView/ScrollPane'
import dataForm from '../../components/dataForm.vue'
export default {
    name: 'valetDriverAccessApplication',
    components: { ScrollPane, dataForm },
    props: {
        dataObject: {
            type: Object,
            default: () => {}
        }
    },
    created() {
        console.log(this.dataObject, 'dataObject')
    },
    mounted() {
        this.getSrcList()
    },
    computed: {
        srcList() {
            return this.imgUrlList.map(item => item.src)
        },
        confingList() {
            return function (start, end) {
                let config = this.$baseMethod.deepClone(this.activtyConfig)
                return config.splice(start, end)
            }
        }
    },
    data() {
        return {
            formData: {},
            imgOffset: 210,
            imgUrlList: [],
            imgName: '',
            visible: false,
            currentIndex: 0,
            selectIndex: 0,
            activtyConfig: [
                {
                    title: '审批发起信息',
                    formConfig: [
                        {
                            label: '审批编号',
                            key: 'procdefNo'
                        },
                        {
                            label: '审批类型',
                            key: 'name'
                        },
                        {
                            label: '发起时间',
                            key: 'startTime'
                        },
                        {
                            label: '发起人',
                            key: 'startUserName'
                        },
                        {
                            label: '所属部门',
                            key: 'startDeptName'
                        }
                    ]
                },
                {
                    title: '司机信息',
                    formConfig: [
                        {
                            label: '司机ID',
                            key: 'driverId'
                        },
                        {
                            label: '手机号码',
                            key: 'phone'
                        },
                        {
                            label: '姓名',
                            key: 'name'
                        },
                        {
                            label: '身份证号码',
                            key: 'identityNum'
                        },
                        {
                            label: '所属机构',
                            key: 'organizationStr'
                        }
                    ]
                },
                {
                    title: '驾驶员信息',
                    formConfig: [
                        {
                            label: '姓名',
                            key: 'driverName'
                        },
                        {
                            label: '驾驶证号码',
                            key: 'licenseNum'
                        },
                        {
                            label: '初次领证日期',
                            key: 'licenseTime'
                        },
                        {
                            label: '驾龄',
                            key: 'drivingExperience'
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        setActiveItem(index) {
            this.selectIndex = index
            this.$refs['carousel'].setActiveItem(index)
        },
        setSelectIndex(index) {
            this.selectIndex = index
        },
        getSrcList() {
            let obj = {
                idCardBackUrl: '身份证国徽面',
                idCardFrontUrl: '身份证人像面',
                licenseFirstUrl: '驾驶证正本照',
                licenseSecondUrl: '驾驶证副页照',
                iconUrl: '司机头像'
            }
            this.$nextTick(() => {
                Object.keys(this.dataObject.nodeFormJson.driverApprovalInfo).forEach(item => {
                    if (['idCardBackUrl', 'idCardFrontUrl', 'licenseFirstUrl', 'licenseSecondUrl', 'iconUrl'].includes(item) && this.dataObject.nodeFormJson.driverApprovalInfo[item]) {
                        this.imgUrlList.push({
                            src: this.dataObject.nodeFormJson.driverApprovalInfo[item],
                            title: obj[item]
                        })
                    }
                })
            })
        },
        onPreview(index) {
            this.currentIndex = index
            this.visible = true
        },
        changeImg(index) {
            this.currentIndex = index
        },
        changeOffset(newIndex, oldIndex) {
            this.imgOffset = 210 - newIndex * 65
            this.imgName = this.imgList[newIndex].alias
        },
        enlarge(index) {
            this.currentIndex = index
            this.visible = true
        },
        closeView() {
            this.visible = false
        }
    }
}
</script>

<style lang="scss" scoped>
.__approval_field_wrap_container {
    padding: 0px 40px 0 40px;
    .imgList_wrap_container{
        margin-top: 32px;
    }
    .flow_title {
        font-weight: bold;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #303133;
        padding-left: 8px;
        position: relative;
    }
    .flow_title::after {
        content: '';
        position: absolute;
        left: 0;
        top: 3px;
        width: 4px;
        height: 16px;
        background: #f05259;
        border-radius: 0px 84px 84px 0px;
    }
    .right {
        flex: 1;
    }
}
</style>
