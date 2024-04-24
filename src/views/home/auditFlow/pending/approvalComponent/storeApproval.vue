<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="150px" ref="el-form">

                <!-- 基本信息 -->
                <BaseInfo :dataObject="dataObject" />
                
                <!-- 变动类型 -->
                <div class="block_item_container">
                    <span class="block_item_title">变动类型</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="变动类型：">{{ nodeForm.opType | opTypeFilter }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <!-- 旧 - 新增实体店 opType为1 -->
                <add-store v-if="nodeForm.opType == 1" :nodeForm="nodeForm" :category="category"></add-store>

                <!-- 编辑实体店 opType为2 -->
                <edit-store v-else-if="nodeForm.opType == 2" :nodeForm="nodeForm" :category="category"></edit-store>

                <!-- 新 - 新增实体店  opType为3，从app里面操作的实体店开业-->
                <new-store v-else :nodeForm="nodeForm" :category="category"></new-store>
            
                <!-- 附件资料 -->
                <!-- <new-attachment v-if="nodeForm.opType == 3" :nodeForm="nodeForm" :category="category"></new-attachment> -->
                <new-attachment v-if="nodeForm.opType == 3" :nodeForm="nodeForm" :category="category"></new-attachment>
                <old-attachment v-else :nodeForm="nodeForm" :category="category"></old-attachment>
            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
import AddStore from './storeComm/addStore.vue';
import Attachment from './storeComm/attachment.vue';
import EditStore from './storeComm/editStore.vue';
import NewAttachment from './storeComm/newAttachment.vue';
import NewStore from './storeComm/newStore.vue';
import OldAttachment from './storeComm/oldAttachment.vue';
export default {
    //分公司变更审批
    name: 'changebranchApproval',
    components: { BaseInfo, AddStore, EditStore, NewStore, Attachment, OldAttachment, NewAttachment },
    props: {
        nodeFormJson: {
            type: Object,
            default: () => {}
        },
        dataObject: {
            type: Object,
            default: () => {}
        },
        category: {
            type: String,
        }
    },
    filters: {
        opTypeFilter: function (val) {
            let type;
            if (val == 1 || val == 3) {
                type = '实体店开业';
            } else if (val == 2) {
                type = '编辑实体店';
            }
            return type;
        }
    },
    computed: {
        nodeForm() {
            return JSON.parse(this.dataObject.nodeFormJson);
        }
    },
    data() {
        return {};
    },
};
</script>
