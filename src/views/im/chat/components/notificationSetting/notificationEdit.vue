<template>
    <div class="wrap">
        <tiny-editor ref="editor" id="tinymce" :menubar="false" :value="form.content" :options="options"></tiny-editor>
        <div class="center">
            <el-button @click="handleCancle">取消</el-button>
            <el-button type="primary" @click="handleSuccess">发布</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'notificationEdit',
    components: {
        TinyEditor: () => import('./tinyEditor.vue'),
    },
    props: {
        conversation: {
            type: Object,
            default: () => {},
        },
        editInfo: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            op: {
                createGroupNotification: 'createGroupNotification',
            },
            id: '',
            type: '',
            form: {
                content: '',
                groupId: '',
            },
            options: {
                statusbar: true,
                menubar: true,
                toolbar: true,
            },
        };
    },
    watch: {
        conversation: {
            handler(newVal) {
                if (newVal) {
                    this.form.groupId = newVal.groupProfile.groupID;
                }
            },
            immediate: true,
            deep: true,
        },
        editInfo: {
            handler(newVal) {
                if (newVal) {
                    const { id, content, type } = newVal;
                    this.id = id;
                    this.type = type;
                    this.form.content = content;
                }
            },
            deep: true,
            immediate: true,
        },
    },
    mounted() {},
    methods: {
        handleCancle() {
            this.$parent.$parent.handleClose()
        },
        handleSuccess() {
            let that = this;
            if (!this.$refs.editor.getContent()) {
                this.$message.error('公告内容不能为空！')
                return
            }
            this.$confirm(`确定要发布吗`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                if (this.type === 'add') {
                this.handleCommit();
            } else if (this.type === 'edit') {
                this.handleUpdate();
            }
            });
        },
        handleCommit() {
            const reqData = {
                data: {
                    content: this.$refs.editor.getContent(),
                    groupId: this.form.groupId,
                },
                op: this.op.createGroupNotification,
            };
            let url = '/web/im/save';
            this.$axios(url, reqData)
                .then(result => {
                    if (result.code === 1) {
                        this.$message.success('发布成功');
                        this.handleCancle()
                    }
                })
                .catch(error => {
                    that.loading = false;
                });
        },
        handleUpdate() {
            const reqData = {
                data: {
                    id: this.id,
                    operater: '1',
                    content: this.$refs.editor.getContent(),
                },
                op: 'updateGroupNotification',
            };
            let url = '/web/im/update';
            this.$axios(url, reqData)
                .then(result => {
                    if (result.code === 1) {
                        this.$message.success('修改成功');
                        this.handleCancle()
                    }
                })
                .catch(error => {
                    that.loading = false;
                });
        },
    },
};
</script>

<style scoped lang="scss">
.center {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    bottom: 24px;
    right: 24px;
    /deep/.el-button {
        width: 96px;
        height: 36px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        
    }
    /deep/.el-button--primary {
        background: #F05259;
        border-color: 1px solid #F05259;
    }
}
.wrap {
    width: 100%;
    height: 100%;
}
#tinymce {
    width: 100%;
    height: 100%;
}
</style>
