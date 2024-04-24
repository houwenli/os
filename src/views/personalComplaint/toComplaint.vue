<template>
    <div>
        <!-- 我要投诉 -->
        <el-row class="cardBox">
            <h3 v-if="disabled" class="head" style="text-align:center;">投诉内容</h3>
            <el-form ref="complaintForm" :model="complaintForm" label-width="5.9375rem" :rules="rules">
                <!-- 标题内容 -->
                <el-row class="contentCenter">
                    <el-col :span="13">
                        <el-form-item prop="title" label="投诉标题：">
                            <el-input v-model.trim="complaintForm.title" placeholder="请输入投诉标题（最多40字）" :disabled="disabled" :maxlength="40" clearable />
                        </el-form-item>
                        <el-form-item prop="content" label="投诉内容：">
                            <el-input
                                type="textarea"
                                v-model.trim="complaintForm.content"
                                :rows="12"
                                :disabled="disabled"
                                maxlength="1000"
                                show-word-limit
                                placeholder="请您根据实际情况详细描述投诉事由(不少于20字)，切勿填写自己的隐私信息，禁止发布违反法律、行政法规以及不文明内容。捏造事实、诬陷诽谤他人、泄露他人隐私的投诉单将被驳回。"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 上传按钮 -->
                <el-row v-if="!disabled" class="contentCenter">
                    <el-form-item label="附件资料：" style="min-width:870px">
                        <span class="updateClick" @click="clickUpload">
                            <i class="el-icon-plus">
                                <br />
                                <span>上传图片</span>
                            </i>
                        </span>
                        <div class="updateTips">图片最多上传20张。大小不超过5M，支持jpg、png格式</div>
                    </el-form-item>
                </el-row>
                <!-- 已上传图片 -->
                <el-row class="contentCenter">
                    <el-form-item :label="disabled && urlList.length ? '附件资料：' : ''">
                        <ws-image-upload :isDelete="isDelete" v-bind="options" ref="imageUpload" :urlList="urlList" />
                    </el-form-item>
                </el-row>
            </el-form>
        </el-row>
        <!-- 提交 -->
        <el-row type="flex" justify="center" class="foot_btn">
            <el-button :type="disabled ? '' : 'primary'" @click="submit('complaintForm')">{{ disabled ? '取消' : '提交' }}</el-button>
        </el-row>
        <!-- 弹窗 -->
        <el-dialog custom-class="successDialog" title="" @close="$emit('submitSuccess')" :visible.sync="successDialog" width="40%" append-to-body center>
            <div class="dialogBox">
                <div class="dialogIcon"><i class="el-icon-success successIcon"></i></div>
                <h3 class="titile">投诉提交成功</h3>
                <div>投诉已提交成功，你可在“我的投诉单”中 查看提交详情。</div>
            </div>
            <span slot="footer">
                <el-button type="primary" @click="submitSuccess">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'toComplaint',
    props: {
        id: {}, // 有id ? 详情 : 投诉表单
        disabled: { default: false } // true ? 详情 : 投诉表单
    },

    data() {
        // 校验
        const contentValidate = (rule, value, cb) => {
            if (value.length < 20) {
                cb('投诉内容不少于20字');
            } else {
                cb();
            }
        };
        return {
            // 表单数据
            complaintForm: {
                title: '',
                content: ''
            },
            // 校验
            rules: {
                title: [
                    {
                        required: true,
                        message: '请输入投诉标题',
                        trigger: 'blur'
                    }
                ],
                content: [
                    {
                        required: true,
                        validator: contentValidate,
                        trigger: 'blur'
                    }
                ]
            },
            // update
            options: {
                quantity: 20,
                size: 5,
                actions: {
                    url: '/message/feedback/uploadFile', //上传地址，优先级高于moduleName
                    op: 'feedbackImgUpload' //上传op，优先级高于moduleName
                },
                afterUpload: this.afterUpload,
                handleRemove: this.handleRemove
            },
            successDialog: false, // 提交成功弹窗
            urlList: [], // 图片展示
            imgList: [], // 图片上传集合
            isDelete: true, // 图片删除
            op: 'feedbackDetail',
            moduleName: '/systemManage/complaint'
        };
    },
    methods: {
        // 图片上传后
        afterUpload(res) {
            let imgObj = JSON.parse(res.data);
            this.imgList.push(imgObj);
            return imgObj.fileUrl;
        },
        // 删除图片
        handleRemove(url) {
            if (this.imgList.length !== 0) {
                this.imgList = this.imgList.filter(item => {
                    return item.fileUrl !== url;
                });
            }
        },
        // 提交
        submit(complaintForm) {
            if (this.disabled) {
                if (this.$route.query.id) {
                    this.$router.push('complaint');
                } else {
                    this.$emit('close');
                }
            } else {
                this.$refs[complaintForm].validate(valid => {
                    if (valid) {
                        let { title, content } = this.complaintForm;
                        let data = {
                            op: 'feedbackSave',
                            data: {
                                title,
                                content,
                                files: this.imgList
                            }
                        };
                        this.$axios('/message/feedback/save', data)
                            .then(data => {
                                this.complaintForm.title = '';
                                this.complaintForm.content = '';
                                this.successDialog = true;
                            })
                            .catch(err => {});
                    }
                });
            }
        },
        // 关闭弹窗
        submitSuccess() {
            this.successDialog = false;
            this.$emit('submitSuccess');
        },
        // 图片上传限制
        clickUpload() {
            if (this.$refs.imageUpload.fileList.length < 20) {
                this.$refs.imageUpload.changeFile();
            } else {
                this.$message.error('图片最多上传20张');
            }
        },
        // 投诉详情请求
        async getComplaintDetails() {
            try {
                let id;
                if (this.$route.query.id) {
                    id = this.$route.query.id;
                } else {
                    id = this.id;
                }
                let data = {
                    op: this.op,
                    data: { id }
                };
                let res = await this.$axios('/message/feedback/select', data);
                let { title, content, files } = JSON.parse(res.data);
                this.complaintForm.title = title;
                this.complaintForm.content = content;
                files.forEach(item => {
                    this.urlList.push(item.fileUrl);
                });
            } catch (error) {}
        }
    },
    created() {
        if (this.$route.query.id) {
            this.op = 'feedbackDetailCtrl';
        }
        if (this.id || this.$route.query.id) {
            this.getComplaintDetails();
            this.isDelete = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.cardBox {
    padding: 48px;
    position: relative;
    .head {
        height: 52px;
        font-size: 20px;
        font-weight: 600;
    }
    .updateClick {
        display: inline-block;
        width: 150px;
        height: 150px;
        line-height: 180px;
        margin: 5px;
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        text-align: center;
        i {
            font-size: 28px;
            color: #8c939d;
            span {
                font-size: 14px;
                color: #c0c4cc;
            }
        }
    }
    .updateClick:hover {
        border-color: #f05259;
        color: #f05259;
    }
    .updateTips {
        position: absolute;
        display: inline;
        margin: 16px 0 0 12px;
        color: #909399;
        font-size: 13px;
    }
}
.submitBtn {
    margin-bottom: 40px;
}
.dialogBox {
    text-align: center;
    .dialogIcon {
        text-align: center;
        margin-bottom: 16px;
        .successIcon {
            width: 50px;
            height: 50px;
            font-size: 50px;
            color: #67c23a;
        }
    }
    .titile {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 20px;
    }
}
/deep/ .el-upload--picture-card {
    display: none !important;
}
/deep/ .el-textarea__inner {
    color: #606266 !important;
    cursor: default !important;
}
/deep/ .el-form-item__label {
    font-weight: 400 !important;
}
.foot_btn {
        z-index: 999;
        position: fixed;
        bottom: 0;
        left: 80px;
        width: 100%;
        height: 64px;
        background: #ffffff;
        box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
        display: flex;
        justify-content: center;
        align-items: center;

        .el-button {
            width: 160px;
            height: 36px;
        }
    }
.contentCenter {
    display: flex;
    justify-content: center;
}
</style>
