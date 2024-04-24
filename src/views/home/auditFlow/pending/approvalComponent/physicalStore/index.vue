<template>
    <el-form label-position="right" label-width="150px" ref="el-form">
        <BaseInfo :dataObject="dataObject" />
        <div class="block_item_container">
            <span class="block_item_title">机构信息</span>
            <el-row class="block_item_wrap">
                <el-col :span="12" v-for="item in formItemList" :key="item.value">
                    <el-form-item :label="item.label">
                        <span :class="nodeForm.consoleList && nodeForm.consoleList.includes(item.value) ? 'red' : ''">{{ getVal(nodeForm[item.value], item.value) }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div class="block_item_container">
            <span class="block_item_title">变更信息</span>
            <el-row class="block_item_wrap">
                <el-col v-for="item in targetList" :key="item.value" :span="24">
                    <el-form-item :label="item.label">{{ getVal(nodeForm[item.value], item.value) }}</el-form-item>
                </el-col>
            </el-row>
        </div>
        <div class="block_item_container">
            <slot name="attachment"></slot>
            <div class="imgList">
                <div class="imgList_item">
                    <span v-for="(img, index) in nodeForm.files" :key="index">
                        <img :src="img.imgUrl" width="150px" height="150px" @click="onPreview(index)" />
                        <div :class="img.opType == 2 ? 'red imgName' : 'imgName'">{{ img.name }}</div>
                    </span>
                </div>
                <ws-image-viewer :visible.sync="visible" :src-list="srcList" :currentIndex="currentIndex" />
            </div>
        </div>
    </el-form>
</template>

<script>
import BaseInfo from '.././base/approvalInfo.vue'
import * as storeApprovalType from '../storeComm/data'
export default {
    components: { BaseInfo },
    props: {
        dataObject: {
            type: Object,
            default: () => {}
        },
        targetList: {
            type: Array,
            default: () => [],
        }
    },
    data() {
        return {
            formItemList: [
                { label: '实体店简称：', value: 'simpleName' },
                { label: '实体店编码：', value: 'agencyNumber' },
                { label: '店长：', value: 'contactPerson' },
                { label: '手机号：', value: 'contactPhone' },
                { label: '上级机构：', value: 'parentName' },
                { label: '门店状态：', value: 'openStatus' },
                { label: '运营状态：', value: 'status' },
                { label: '推广员数：', value: 'promoterNums' },
                { label: '入网司机数：', value: 'driverNums' },
                { label: '绩效分：', value: 'kpiScore' }
            ],
            visible: false,
            srcList: [],
            currentIndex: 1,
            storeApprovalType
        }
    },
    computed: {
        nodeForm() {
            return JSON.parse(this.dataObject.nodeFormJson)
        }
    },
    methods: {
        getVal(val, key) {
            if (val || val === 0) {
                if(key === 'kpiTransfer') return val == 0 ? '否':'是'
                if(key === 'changeOpenStatus') return this.storeApprovalType.openStatus[val]
                return val
            }
            return '-'
        },
        onPreview(index) {
            this.visible = true
            this.currentIndex = index
        },
        async getAuthfileUrl(list) {
            let opt = {
                data: {
                    urls: list
                },
                op: 'newUrl'
            }
            try {
                const res = await this.$axios('/new/flowable/form/select', opt)
                let result = JSON.parse(res.data)
                this.srcList = result.urls
                this.nodeForm.files = this.nodeForm.files.map((item, index) => {
                    item.imgUrl = result.urls[index]
                    return item
                })
            } catch (error) {}
        }
    },
    mounted() {
        // 机构审批，图片、附件权限处理
        if (this.nodeForm.files && this.nodeForm.files.length) {
            let list = this.nodeForm.files.map(({ imgUrl }) => imgUrl)
            this.getAuthfileUrl(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.imgList {
    margin-top: 16px;
}
.imgList_item {
    display: flex;
    flex-wrap: wrap;
    img,
    .imgName {
        text-align: center;
        margin-left: 16px;
    }
}
.red {
    color: #e05151;
}
</style>