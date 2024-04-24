<template>
    <!-- 开业变更申请 -->
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <physical-store :nodeForm="nodeForm" :dataObject="dataObject" :targetList="targetList">
            </physical-store>
        </div>
    </div>
</template>

<script>
import PhysicalStore from './physicalStore/index.vue'
export default {
    //开业变更申请
    name: 'openingChangeApproval',
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
    },
    data() {
        return {
            targetList: [
                { label:'状态标记为：', value:'changeOpenStatus' },
                { label:'标记转移原因：', value:'reason' }
            ]
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
