<template>
    <div class="currency-apply">
        <el-row>
            <el-col :md="24" :lg="24" v-if="pageType !== 'detail' && uploadFileMax">
                <div class="grid-content bg-purple">
                    <el-upload :action="uploadFile" :data="actionQuery" :on-success="handleSuccess" :before-upload="beforeUpload" :show-file-list="false" :submitName="submitName" ref="file">
                        <img class="upload-file-btn" width="40" src="@/assets/index/add-img.png" alt />
                        <span class="upload-file-text">{{ fileMap.name }}</span>
                    </el-upload>
                </div>
            </el-col>

            <el-col :md="24" :lg="24" v-if="!uploadFileMax">
                <div class="grid-content bg-purple accessory-items" v-for="(item, index) in pageFileList" :key="index">
                    <img style="margin-right: 16px" width="40" src="@/assets/index/file_icon.png" alt />
                    <div style="display: flex; align-items: center; width: 80%">
                        <div class="grid-content-title">{{ fileMap.name }}</div>
                    </div>
                    <div class="opt-btn">
                        <div class="opt-btn-item" v-if="isShowPreview">
                            <span
                                @click="handlePreview(item)"
                                v-if="
                                    item.imgUrl.indexOf('msword') > -1 ||
                                    item.imgUrl.indexOf('document') > -1 ||
                                    item.imgUrl.indexOf('ms-excel') > -1 ||
                                    item.imgUrl.indexOf('sheet') > -1 ||
                                    item.imgUrl.indexOf('docx') > -1 ||
                                    item.imgUrl.indexOf('doc') > -1 ||
                                    item.imgUrl.indexOf('xls') > -1 ||
                                    item.imgUrl.indexOf('xlsx') > -1
                                "
                            >
                                <i class="el-icon-zoom-in"></i>
                            </span>

                            <a
                                class="color-blue"
                                :href="item.imgUrl"
                                v-if="(item.imgUrl.indexOf('pdf') > -1 || item.imgUrl.indexOf('png') > -1 || item.imgUrl.indexOf('jpeg') > -1 || item.imgUrl.indexOf('jpg') > -1) && item"
                                target="_blank"
                            >
                                <i class="el-icon-zoom-in"></i>
                            </a>
                        </div>
                        <div class="opt-btn-item" v-if="isShowDelete" @click.stop="handleCloseFile(item, index)"><i class="el-icon-delete"></i></div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'uploadFileSystem',

    props: {
        orgType:{

        }, // 机构类型
        pageType: {
            type: String,
            default: 'add'
        }, // 页面类型 add detail edit
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
        },
        fileMap: {
            type: Object,
        },
        index:{
            type: Number,
        },

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
            isShow:true,
        };
    },
    watch: {
        fileList: function(newval) {
            if(!newval[0].imgimgUrl){
                   this.isShow=true
            }
            if (this.pageType === 'edit' || this.pageType === 'detail') {
                if(this.orgType==60){
                    this.pageFileList =this.getimgUrlList(newval[0]);
                }else{
                    this.pageFileList = newval;
                }

            }
        }
    },
    mounted() {
        if(this.fileList.length){
           this.isShow=false
        }
    },
    computed: {
        uploadFile() {
            return `${process.env.VUE_APP_OAORG_API}/orgWeb/file/addAttachment`;
            // 地址需替换为文件服务器地址
            // return `https://httpbin.org/post`;
        },
        uploadFileMax() {
            return this.pageFileList.length < this.limitCount;
        },
    },

    methods: {
        //处理附件数据
        getimgUrlList(item) {
            let imgUrl;
            if (item.waterMarkImageimgUrl) {
                imgUrl = item.waterMarkImageimgUrl;
            } else {
                imgUrl = item.imgimgUrl;
            }

            if (imgUrl) {
                return [{imgUrl}];
            }
        },
        handlePreview(item) {
            // 使用微软方式预览
            window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(item.imgUrl)}`);
        },
        beforeUpload(file) {
            if (file.name.length > 20) {
                this.$message.error(`文件名不能大于20个字符长度`);
                return false;
            }
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
                this.$message.error(`上传附件大小不能超过 ${this.picSize / 1048576}M！`);
                return false;
            }

            if (this.pageFileList.length >= this.limitCount) {
                this.$message.warning(`最多上传${this.limitCount}个附件`);
                return false;
            }
        },
        handleSuccess(response, file, fileList) {
            if (response.code === 1) {
                let data = {
                    imgUrl: JSON.parse(response.data).publicDownUrl,
                    attachmentTypeID: this.fileMap.id
                }
                this.pageFileList.push(data);
                this.isShow=false
            } else {
                this.$message.error(response.msg);
            }
            this.$emit('getFile', this.pageFileList,this.index);
        },

        handleCloseFile(item, index) {
            this.pageFileList.splice(index, 1);
            this.isShow = true
            this.$emit('delFetailFileList',this.index);
        },
    }
};
</script>

<style lang="scss" scoped>
.currency-apply {
    .grid-content {
        display: flex;
        border-radius: 4px;
        min-height: 80px;
        margin-top: 16px;
        position: relative;

        .grid-content-title {
            font-size: 14px;
            color: #606266;
            width: 90%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .grid-content-size {
            color: #c0c4cc;
            font-size: 12px;
            & > span:first-child {
                margin-right: 10px;
            }
            & > span:hover {
                cursor: pointer;
            }
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
        margin: 0 20px;
        font-size: 14px;
        color: #606266;
    }
    .accessory-items {
        position: relative;
        overflow: hidden;
        .opt-btn {
            width: 100%;
            visibility: hidden;
            opacity: 0;
            transition: all 0.3s ease;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            justify-content: center;
            .opt-btn-item {
                cursor: pointer;
                width: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                display: inline-block;
                color: #fff;
                font-size: 20px;
                box-sizing: content-box;
                &:nth-child(1) {
                    margin-right: 20px;
                }
            }
        }
        &::before {
            content: '';
            display: inline-block;
            visibility: hidden;
            opacity: 0;
            transition: all 0.3s ease;
            transition-property: opacity, background;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
        &:hover {
            &::before {
                visibility: visible;
                opacity: 1;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 8px;
                margin-right: 5px;
            }
            .opt-btn {
                visibility: visible;
                opacity: 1;
            }
        }
    }
}
</style>
