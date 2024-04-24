<template>
    <!-- 门店合并申请 -->
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <physical-store :nodeForm="nodeForm" :dataObject="dataObject" :targetList="targetList">
                <template v-slot:attachment>
                    <span class="block_item_title" v-if="showAttacgmentTitle">合并凭证附件</span>
                </template>
            </physical-store>
        </div>
    </div>
</template>

<script>
import PhysicalStore from './physicalStore/index.vue'
export default {
    //门店合并申请
    name: 'storeConsolidationApproval',
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
                { label: '目标实体店：', value: 'targetName' },
                { label: '原实体店状态：', value: 'afterOldOrgStatus' },
                { label: '合并原因：', value: 'reason' }
            ]
        }
    }
}
</script>
<style></style>
