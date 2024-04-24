<template>
    <!-- 转移机构申请 -->
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <physical-store :nodeForm="nodeForm" :dataObject="dataObject" :targetList="targetList">
                <template v-slot:attachment>
                    <span class="block_item_title" v-if="showAttacgmentTitle">转移凭证附件</span>
                </template>
            </physical-store>
        </div>
    </div>
</template>

<script>
import PhysicalStore from './physicalStore/index.vue'

export default {
    //转移机构申请
    name: 'transferMechanismApproval',
    components: { PhysicalStore },
    props: {
        dataObject: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        nodeForm() {
            return JSON.parse(this.dataObject.nodeFormJson)
        },
        showAttacgmentTitle() {
            return (
                this.nodeForm.files &&
                this.nodeForm.files.some(item => {
                    return item.imgUrl
                })
            )
        }
    },
    data() {
        return {
            targetList: [
                { label: '目标机构：', value: 'targetParentName' },
                { label: '是否迁移历史绩效分：', value: 'kpiTransfer' }, //0为否，1为是
                { label: '转移原因：', value: 'reason' }
            ]
        }
    }
}
</script>
