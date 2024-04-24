<template>
    <div class="currency-apply">
        <div class="up-flag" v-if="upFlag"></div>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" v-if="pageType !== 'detail'">
                <el-upload
                    :action="uploadFile"
                    :data="actionQuery"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
                    :show-file-list="false"
                    :submitName="submitName"
                    :on-progress="handleProgress"
                    :on-error="handleError"
                    ref="file"
                    v-show="isUpload"
                >
                    <div class="upload-box">
                        <el-button>
                            <div class="upload-btn">
                                <img src="@/assets/images/ic-upload.png" alt />
                                <span>上传文件</span>
                            </div>
                        </el-button>
                        <span class="ma-lf">{{ uploadDesc }}</span>
                    </div>
                </el-upload>
            </el-col>

            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="upload-list">
                <div :class="['grid-content-center', item.isinput ? 'ma-tp' : '']" v-for="(item, index) in pageFileList" :key="index">
                    <img src="@/assets/images/file_icon.png" alt />
                    <main>
                        <section>
                            <el-tooltip class="item" effect="dark" :content="item.fileName" placement="bottom-start" v-if="!item.isinput">
                                <div class="ma-lf upload-name">{{ item.fileName }}</div>
                            </el-tooltip>
                            <el-input
                                style="width: 167px; margin-left: 10px"
                                v-model="item.fileName"
                                v-else
                                @blur="saveFileName(item)"
                                maxlength="40"
                            ></el-input>

                            <div class="ma-lf-42 color-blue">
                                <span v-if="isShowPreview">
                                    <span @click="handlePreview(item)" v-if="['.xlsx', '.doc', '.docx', '.xls', '.ppt', '.ppts'].includes(item.fileType)">
                                        预览
                                    </span>

                                    <a
                                        class="color-blue"
                                        :href="item.fileUrl"
                                        v-else-if="['.pdf', '.png', '.jpg', '.jpeg'].includes(item.fileType) && item.fileUrl"
                                        target="_blank"
                                    >
                                        预览
                                    </a>
                                </span>
                                <span @click="handleDownLoad(item)" class="ma-lf-16" v-if="isShowDownload && item.fileUrl">下载</span>

                                <!-- <span v-if="isShowRename && !item.isinput" @click.stop.prevent="handleRename(item)" class="ma-lf-16">
                                    <button :class="[item.isinput ? 'disabled-btn' : '']">重命名</button>
                                </span>
                                <span v-else @click.stop.prevent="handleRanameText(item)" class="ma-lf-16">
                                    <button>重命名</button>
                                </span> -->
                                <span v-if="isShowDelete" @click.stop="handleCloseFile(item, index)" class="ma-lf-16" style="color: #f05259">删除</span>
                            </div>
                            <div class="ma-lf-42" v-if="submitName">
                                <span style="margin-left: 15px">提交人:</span>
                                <el-input v-model.trim="loginName" :disabled="true" style="display: inline-block; width: 80px; margin-left: 38px"></el-input>
                            </div>
                        </section>
                        <section :class="['ma-lf ', 'file-size', item.isinput ? 'ma-tp' : '']">{{ item.fileSize }}</section>
                    </main>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import download from './download.js';
export default {
    name: 'uploadFile',

    props: {
        pageType: {
            type: String,
            default: 'add'
        }, // 页面类型 add detail update
        fileList: {
            type: Array,
            default: () => []
        }, // 详情页传过来的数组
        uploadDesc: {
            type: String,
            default: 'word excel pdf最多3个'
        }, // 描述
        op: {
            type: String,
            default: ''
        }, // 接口
        docType: {
            type: Number,
            default: 2
        }, // 文档类型 1-项目文档 2-公共文档
        moduleName: {
            type: String,
            default: '' // 模块名称
        },
        isShowDownload: {
            type: Boolean,
            default: true
        }, // 是否展示下载按钮
        isShowPreview: {
            type: Boolean,
            default: true
        }, // 是否展示预览按钮
        isShowRename: {
            type: Boolean,
            default: true
        }, // 是否展示重命名按钮
        isShowDelete: {
            type: Boolean,
            default: true
        }, // 是否展示删除按钮
        limitCount: {
            type: [Number, String],
            default: 'infinite' // 'infinite' 代表无限制
        }, // 限制附件数量
        //提交人名称
        submitName: null,
        fileType: {
            type: [Array],
            default: () => ['png', 'jpg', 'jpeg', 'xlsx', 'doc', 'docx', 'xls', 'ppt', 'ppts', 'pdf']
            // default: 'infinite' sql不支持预览，只支持下载
        },
        fileTypeMessage: {
            type: Array,
            default: () => ['png', 'jpg', 'jpeg', 'xlsx', 'doc', 'docx', 'xls', 'ppt', 'ppts', 'pdf']
        },
        picSize: {
            type: Number,
            default: 5120000 // 限制大小默认5M
        },
        isUpload: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            actionQuery: {
                op: 'upload',
                data: {},
                token: $vuex.$baseMethod.getStore('_ccmUser').token
            },
            pageFileList: [],
            fileName: '',
            loginName: JSON.parse(sessionStorage.getItem('_ccmUser')).loginName,
            upFlag: false
        };
    },
    watch: {
        fileList: function (newval) {
            if (this.pageType === 'update' || this.pageType === 'detail') {
                this.pageFileList = newval;
            }
        }
    },
    mounted() {
        this.pageFileList.forEach(item => {
            item.isinput = false;
        });
    },
    computed: {
        uploadFile() {
            // return `http://10.208.2.8:23650/personnel/file/select`;
            // 地址需替换为文件服务器地址
            return `${process.env.VUE_APP_BASE_API}/personnel/file/select`;
        }
    },

    methods: {
        saveFileName(item) {
            if (item.fileName.trim() === '') {
                this.$message.warning('文件名不能为空');
                item.fileName = item.newFileName;
                return;
            }

            let param = {
                op: 'fileRename',
                data: {
                    fileId: item.fileId,
                    fileName: item.fileName,
                    docId: this.docId,
                    docType: 2
                }
            };

            this.$axios('/project/docManagement/update', param)
                .then(res => {
                    if (res.code === 1) {
                        this.$message.success('重命名成功');
                        item.isinput = false;
                    }
                })
                .catch(() => {
                    item.isSave = true;
                    item.isinput = false;
                    item.fileName = item.newFileName;
                });
        },
        // 下载使用download.js,支持多种格式 官方地址-http://danml.com/download.html#Download
        handleDownLoad(item) {
            download(item.fileUrl);
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        handleRanameText(item) {
            if (!item.isSave) {
                item.isinput = !item.isinput;
            } else {
                item.isinput = false;
            }
        },
        handleRename(item) {
            item.newFileName = item.fileName;
            this.$set(item, 'isinput', true);
        },
        handlePreview(item) {
            // 使用微软方式预览
            window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(item.fileUrl)}`);
        },
        handleProgress(event) {
            if (event.percent < 100) {
                this.upFlag = true;
            } else {
                this.upFlag = false;
            }
        },
        beforeUpload(file) {
            let upFileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            if (file.name.length > 40) {
                this.$message.error(`文件名不能大于40个字符长度`);
                return false;
            }
            if (!this.fileType.includes(upFileType)) {
                this.$message.error('文件格式不支持上传');
                return false;
            }
            if (file.size > this.picSize) {
                this.$message.error(`文件超过20M，无法上传`);
                return false;
            }

            if (this.pageFileList.length >= this.limitCount) {
                this.$message.warning(`文件上传数量超过限制，无法上传`);
                return false;
            }
            this.pageFileList.forEach(item => {
                this.$set(item, 'isinput', false);
            });
            this.$message.success('文件正在上传中，请稍后...');
        },
        handleSuccess(response, file, fileList) {
            if (response.code === 1) {
                this.pageFileList.unshift(JSON.parse(response.data));
                this.$message.success('上传成功');
            } else {
                this.$message.error(response.msg);
            }
            this.$emit('getFile', this.pageFileList);
        },
        handleError() {
            this.upFlag = false;
        },
        handleCloseFile(item, index) {
            this.pageFileList.splice(index, 1);
            item.isinput = false;
            this.$emit('delFetailFileList');
            this.$emit('getFile', this.pageFileList);
        },
        cancel(){
            this.$refs.file.abort()
        }
    }
};
</script>

<style lang="scss" scoped>
.currency-apply {
    background: #ffffff;
    position: relative;
    .up-flag {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 36px;
        z-index: 99;
        cursor: not-allowed;
    }
    .upload-box {
        display: flex;
        align-items: center;
        .el-button {
            width: 113px;
            padding: 9px 16px;
            height: 36px;
            .upload-btn {
                display: flex;
                align-items: center;
                flex-direction: row;
                align-items: center;
            }
            img {
                width: 18px;
                height: 18px;
            }
            span {
                color: #f05259;
                margin-left: 2px;
                font-size: 14px;
            }
        }
        > span {
            color: #909399;
            font-size: 12px;
        }
    }

    .ma-lf {
        margin-left: 10px;
    }
    .ma-tp {
        margin-top: 8px;
    }
    .ma-lf-42 {
        margin-left: 42px;
    }
    .ma-lf-16 {
        margin-left: 16px;
    }
    .disabled-btn {
        cursor: not-allowed;
    }
    button {
        color: #0088ff;
        font-size: 14px;
        cursor: pointer;
    }
    .color-blue {
        color: #0088ff;
        cursor: pointer;
        font-size: 14px;
    }
    .upload-list {
        display: flex;
        flex-direction: column;
        .file-size {
            font-size: 12px;
            color: #c0c4cc;
        }
        .grid-content-center {
            display: flex;
            flex-direction: row;
            align-items: center;
            main {
                margin-top: 16px;
                section {
                    display: flex;
                    line-height: 1;
                    .el-input {
                        /deep/ .el-input__inner {
                            height: 30px !important;
                        }
                    }
                }
                section:first-child {
                    line-height: 22px;
                }
            }
            img {
                width: 22px;
                height: 22px;
            }
            .upload-name {
                width: 167px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
