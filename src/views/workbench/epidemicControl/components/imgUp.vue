<template>
    <div class="imgupload-box">
        <div class="pic-frame" :style="{'width': width + 'px', 'height': width + 'px'}">
            <div v-if="!src" class="noPic" v-loading="loading" @click="upClick">
                <i class="el-icon-plus"></i>
            </div>
            <div v-else class="viewBox">
                <el-image
                    ref="imgView"
                    style="width: 100%;height: 100%"
                    :src="src"
                    :preview-src-list="[src]"
                >
                    <div slot="error"></div>
                </el-image>
                <div class="mode" :style="{'line-height': width + 'px'}" @click="handelClick">
                    <!-- <i class="el-icon-search" /> -->
                    <img src="/static/images/icon_look.png" alt="">
                </div>
            </div>
        </div>
        <el-upload
            v-if="!disabled"
            class="upload-img"
            ref="upload"
            action=""
            :on-remove="handleRemove"
            :on-change="handelChange"
            :file-list="fileList"
            :auto-upload="false"
            :show-file-list="false"
            :limit="1"
            accept=".jpg,.jpeg,.png,.JPG,.PNG">
            <div v-show="src" ref="clickBtn">
                <el-button size="small" plain :loading="loading">更换图片</el-button>
            </div>
        </el-upload>
    </div>
</template>

<script>
export default {
    name: 'imgUp',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        },
        width: {
            type: [String, Number],
            default: 120
        },
        index: {
            type: Number,
            default: 0
        }
    },
    watch: {
        value: {
            handler(val) {
                this.src = val || ''
            },
            immediate: true
        }
    },
    data() {
        return {
            src: '',
            fileList: [],
            moduleName: '/workbench/BRepidemicControl',
            loading: false
        }
    },
    methods: {
        upClick() {
            !this.disabled && this.$refs.clickBtn.click()
        },
        handleRemove() {

        },
        handelChange(file, fileList) {
            // this.getBase64(file.raw).then(res => {
            //     this.src = res
            //     this.$emit('input', res)
            //     this.$emit('clearValidate', this.index)
            // }).catch(() => {
            //     this.$message.error('添加图片出错！');
            // })
            this.upload(file.raw)
            this.fileList = []
        },
        getBase64 (file) {
            return new Promise(function (resolve, reject) {
                let reader = new FileReader()
                let imgResult = ''
                reader.readAsDataURL(file)
                reader.onload = function () {
                    imgResult = reader.result
                }
                reader.onerror = function (error) {
                    reject(error)
                }
                reader.onloadend = function () {
                    resolve(imgResult)
                }
            })
        },
        handelClick() {
            if (this.$refs.imgView && this.$refs.imgView.clickHandler) {
                this.$refs.imgView.clickHandler()
            }
        },
        // 图片上传
        upload(file) {
            this.loading = true
            let op = 'uploadPic'
            let url = this.getModuleUrl(op)
            let formData = new FormData();
            let session = this.$baseMethod.getStore('_ccmUser');
            formData.append('file', file); // 默认不处理
            formData.append('data', JSON.stringify({}));
            formData.append('op', op);
            formData.append('token', session.token);
            this.$upLoad(url, formData).then(res => {
                // console.log(res)
                if (res.code === 1) {
                    const result = JSON.parse(res.data)
                    this.$emit('input', result.fileUrl)
                }
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    }
}
</script>

<style lang="scss" scoped>
.imgupload-box {
    display: flex;
    // .el-image {
    //     border: 1px solid #DCDFE6;
    //     border-radius: 8px;
    // }
    .pic-frame {
        margin-right: 16px;
        .noPic {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px dotted #DCDFE6;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            i {
                font-size: 24px;
                color: #C0C4CC;
            }
        }
    }
    .viewBox {
        position: relative;
        width: 100%;
        height: 100%;
        border: 1px solid #DCDFE6;
        border-radius: 8px;
        overflow: hidden;
        &:hover {
            .mode {
                z-index: 5;
            }
        }
        .mode {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            text-align: center;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 8px;
            z-index: -1;
            color: #fff;
            overflow: hidden;
            img {
                width: 24px;
                height: 24px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
}
</style>