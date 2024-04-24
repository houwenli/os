<template>
    <el-row :gutter="40" class="upload-file">
        <el-col :span="6" v-for="(item, index) in fileList" :key="index">
            <div class="grid-content bg-purple">
                <img src="@/assets/index/file_icon.png" alt width="40" style="margin-right: 16px" />
                <div style="width: 80%">
                    <div class="grid-content-title">{{ item.fileName }}</div>
                    <div class="grid-content-size">{{ item.fileSize }}</div>
                </div>
                <i class="el-icon-error" style="position: absolute; top: -6px; right: -6px; color: #8d9096; cursor: pointer" @click.stop="handleCloseFile(index)"></i>
            </div>
        </el-col>
        <el-col :span="6" v-if="uploadFileMax">
            <div class="grid-content bg-purple">
                <el-upload :action="uploadFile" :data="actionQuery" :on-success="handleSuccess" :before-upload="beforeUpload" :show-file-list="false">
                    <img class="upload-file-btn" width="40" src="@/assets/index/add-img.png" alt />
                    <span class="upload-file-text">上传附件</span>
                </el-upload>
            </div>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: 'FileUpload',

    props: {
        actionQuery: {
            type: Object,
            default: () => {}
        }
    },

    data() {
        return {
            fileList: []
        };
    },

    computed: {
        uploadFile() {
            return `${process.env.VUE_APP_PROCESS_API}/file/upload`;
        },

        uploadFileMax() {
            return this.fileList.length < this.actionQuery.maxLimit;
        }
    },

    methods: {
        handleCloseFile() {},

        handleSuccess(response) {
            if (response.code === 1) {
                this.fileList.push(response.data);
            }
        },

        handleCloseFile(index) {
            this.fileList.splice(index, 1);
        },

        beforeUpload(file) {
            const whiteList = ['audio/mpeg', 'application/msword', 'application/vnd.ms-excel', 'application/x-zip-compressed', 'officedocument.spreadsheetml.sheet', 'image/png', 'image/jpeg'];
            if (!whiteList.includes(file.type)) {
                this.$message.error('上传文件格式错误!');
                return false;
            }
            return this.fileList.length < this.actionQuery.maxLimit;
        }
    }
};
</script>

<style scoped lang="scss">
.upload-file {
    .grid-content {
        display: flex;
        border-radius: 4px;
        min-height: 80px;
        margin-bottom: 24px;
        position: relative;

        .grid-content-title {
            font-size: 14px;
            color: #606266;
            margin-bottom: 8px;
            width: 90%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .grid-content-size {
            color: #c0c4cc;
            font-size: 12px;
        }
    }
    .bg-purple {
        background: #f5f7fa;
        border-radius: 8px;
        padding: 16px;
    }
    .upload-file-btn {
        background: #fff;
        padding: 4px;
        border-radius: 4px;
        box-sizing: content-box;
    }
    /deep/ .el-upload--text {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        text-align: left;
        display: flex;
        align-items: center;
    }
    .upload-file-text {
        margin-left: 16px;
        font-size: 14px;
        color: #606266;
    }
}
</style>
