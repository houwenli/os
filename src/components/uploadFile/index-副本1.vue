<template>
    <div class="currency-apply">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" v-if="pageType !== 'detail'">
                <el-upload :action="uploadFile" :data="actionQuery" :on-success="handleSuccess" :before-upload="beforeUpload" :show-file-list="false" ref="file">
                    <div class="upload-box">
                        <el-button>
                            <div class="upload-btn">
                                <img src="@/assets/images/ic-upload.png" alt="" />
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
                                <div class="ma-lf upload-name">
                                    {{ item.fileName }}
                                </div>
                            </el-tooltip>
                            <el-input style="width: 167px; margin-left: 10px" v-model="item.fileName" v-else @blur="saveFileName(item)"></el-input>

                            <div class="ma-lf-42 color-blue">
                                <span v-if="isShowPreview">
                                    <span
                                        @click="handlePreview(item)"
                                        v-if="
                                            item.fileType.indexOf('msword') > -1 ||
                                            item.fileType.indexOf('document') > -1 ||
                                            item.fileType.indexOf('ms-excel') > -1 ||
                                            item.fileType.indexOf('sheet') > -1
                                        "
                                    >
                                        预览
                                    </span>

                                    <a
                                        class="color-blue"
                                        :href="item.fileUrl"
                                        v-else-if="(item.fileType.indexOf('pdf') > -1 || item.fileType.indexOf('png') > -1 || item.fileType.indexOf('jpeg') > -1) && item.fileUrl"
                                        target="_blank"
                                    >
                                        预览
                                    </a>
                                </span>
                                <span @click="handleDownLoad(item)" class="ma-lf-16" v-if="isShowDownload && item.fileUrl">下载</span>

                                <span v-if="isShowRename" @click="handleRename(item)" class="ma-lf-16">重命名</span>
                                <span v-if="isShowDelete" @click.stop="handleCloseFile(item, index)" class="ma-lf-16">删除</span>
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
// import download from '../../../public/static/download.js';
export default {
    name: 'uploadFileSystem',

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
        fileType: {
            type: [Array, String],
            default: () => [
                'image/png',
                'image/jpeg', // 图片
                // 'image/gif', 'image/svg+xml', // 图片
                // 'text/plain', // text
                // 'application/json', // json
                'application/msword', // doc
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
                'application/pdf', // pdf
                'application/vnd.ms-excel', // xls
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // xlsx
            ] // 'infinite' 代表不限制文件类型
            // default: 'infinite' sql不支持预览，只支持下载
        },
        fileTypeMessage: {
            type: Array,
            default: () => [
                'png',
                'jpg', // 图片
                // 'gif', 'svg+xml', // 图片
                // 'text', // text
                // 'json', // json
                'word', // word
                'pdf', //PDF
                'excel' // Excel
            ] // 对应上面fileType的的类型
        },
        picSize: {
            type: Number,
            default: 5120000 // 限制大小默认5M
        }
    },
    data() {
        return {
            actionQuery: {
                op: 'fileUpload',
                data: {},
                token: $vuex.$baseMethod.getStore('_ccmUser').token
            },
            pageFileList: [],
            previewUrl: '', // 预览地址
            isSave: false
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
        // this.$nextTick(() => {
        // if (this.pageType === 'update' || this.pageType === 'detail') {
        //     this.pageFileList = this.fileList;
        // }
        this.pageFileList.forEach(item => {
            item.isinput = false;
        });
        // });
    },
    computed: {
        uploadFile() {
            return `${process.env.VUE_APP_SYSTEM_API}/project/docManagement/uploadFile`;
            // 地址需替换为文件服务器地址
            // return `https://httpbin.org/post`;
        }
    },

    methods: {
        saveFileName(item) {
            this.isSave = true;
            if (item.fileName.trim() === '') {
                this.$message.warning('文件名不能为空');
                return;
            }
            item.isinput = false;
            let param = {
                op: 'fileRename',
                data: {
                    fileId: item.fileId,
                    fileName: item.fileName,
                    docId: this.docId,
                    docType: 2
                }
            };
            this.$axios('/project/docManagement/update', param).then(res => {
                this.isSave = false;
                if (res.code === 1) {
                    this.$message.success('重命名成功');
                }
            });
        },
        // 下载使用download.js,支持多种格式 官方地址-http://danml.com/download.html#Download
        handleDownLoad(item) {
            this.$baseMethod.exportFileByUrl(item.fileUrl);
            // download(url);
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        handleRename(ele) {
            if (ele.fileName.trim() === '') {
                this.$message.warning('文件名不能为空');
                return;
            }
            this.pageFileList.forEach(item => {
                if (item.fileId === ele.fileId) {
                    if (this.isSave) {
                        if (item.isinput) {
                            this.$set(item, 'isinput', false);
                        }
                    } else {
                        this.$set(item, 'isinput', !item.isinput);
                    }
                }
            });
        },
        handlePreview(item) {
            if (this.pageFileList.length > 0) {
                let res = item;
                item.fileUrl = res.fileUrl;
            }
            this.previewUrl = encodeURIComponent(item.fileUrl);
            // 使用微软方式预览
            window.open(`https://view.officeapps.live.com/op/view.aspx?src=${this.previewUrl}`);
        },
        beforeUpload(file) {
            if (this.fileType !== 'infinite') {
                let fileType = this.fileType.some(item => {
                    return file.type.indexOf(item) > -1;
                });
                if (!fileType) {
                    this.$message.error(`上传附件只能是 ${this.fileTypeMessage.join('、')}格式`);
                    return false;
                }
            }
            if (file.size > this.picSize) {
                this.$message.error(`上传附件大小不能超过 ${this.picSize / 1024000}M！`);
                return false;
            }

            if (this.pageFileList.length >= this.limitCount) {
                this.$message.warning(`最多上传${this.limitCount}个附件`);
                return false;
            }
            this.pageFileList.forEach(item => {
                this.$set(item, 'isinput', false);
            });
        },
        handleSuccess(response, file, fileList) {
            if (response.code === 1) {
                this.pageFileList.push(JSON.parse(response.data));
            }
            this.$emit('getFile', this.pageFileList);
        },

        handleCloseFile(item, index) {
            this.pageFileList.splice(index, 1);
            item.isinput = false;
            this.$emit('delFetailFileList');
        }
    }
};
</script>

<style lang="scss" scoped>
.currency-apply {
    background: #ffffff;
    .upload-box {
        display: flex;
        align-items: center;
        // line-height: 45px;
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
            font-size: 13px;
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
