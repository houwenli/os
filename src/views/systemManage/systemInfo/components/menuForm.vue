<template>
    <div>
        <el-form ref="form" label-width="7rem" :model="menuOptios" :rules="rules">
            <!-- <el-form-item class="picLabel" label="菜单图标：" v-if="!menuOptios.menuType||menuOptios.menuType !== 1">
                <div style="display: flex; align-items: center">
                    <ws-image-upload v-if="picPart" :urlList="fileUrlArr" :isDelete="!edit" style="display: inline-block; margin-right: 12px" v-bind="options" :inputReadyOnly="routerType == 'detail'|| edit" />
                    <div v-if="routerType!=='detail'">
                        <div class='picTips'>
                            固定尺寸750px*200px，png格式
                        </div>
                        <div v-if='!menuOptios.pic' style="color: #f56c6c; line-height: 40px;">*请上传菜单图标</div>
                        <div v-else style="color: #f56c6c; line-height: 40px;">*已上传</div>
                    </div>
                </div>
            </el-form-item> -->
            <el-form-item prop="name" label="新增类型：">
                <!-- 编辑时不允许修改类型 -->
                <el-radio-group v-model="menuOptios.category" :disabled="this.routerType == 'detail' || edit || menuOptios.id !== ''">
                    <el-radio :label="1">菜单</el-radio>
                    <el-radio :label="2" v-if="menuOptios.menuType !== 0">功能</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="name" label="菜单名称：">
                <el-input
                    style="width: 55%"
                    v-model.trim="menuOptios.name"
                    :placeholder="this.routerType == 'detail' || edit ? '' : '请输入菜单名称'"
                    maxlength="10"
                    :disabled="this.routerType == 'detail' || edit"
                ></el-input>
            </el-form-item>
            <template v-if="menuOptios.category == 1">
                <el-form-item label="字体图标：">
                    <el-input
                        maxlength="30"
                        style="width: 55%"
                        v-model.trim="menuOptios.imgName"
                        :placeholder="this.routerType == 'detail' || edit ? '' : '请输入字体图标'"
                        :disabled="this.routerType == 'detail' || edit"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="sort" label="展示优先级：">
                    <el-input
                        style="width: 55%"
                        v-model.trim="menuOptios.sort"
                        :placeholder="this.routerType == 'detail' || edit ? '' : '请输入级别1-100'"
                        oninput="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{if(this.value>100){this.value=100}else{this.value=this.value.replace(/\D/g,'')}}"
                        :disabled="this.routerType == 'detail' || edit"
                    ></el-input>
                </el-form-item>
            </template>
            <template v-else></template>

            <el-form-item
                v-if="formInfo.formType == 'add' || this.menuData.url || this.menuOptios.url"
                :prop="!menuOptios.menuType || menuOptios.menuType !== 1 ? '' : 'url'"
                :label="menuOptios.category == 1 ? '页面路径：' : '方法：'"
            >
                <el-input
                    maxlength="100"
                    style="width: 55%"
                    v-model.trim="menuOptios.url"
                    :placeholder="this.routerType == 'detail' || edit ? '' : menuOptios.category == 1 ? '请输入页面路径' : '请输入方法'"
                    :disabled="this.routerType == 'detail' || edit"
                ></el-input>
            </el-form-item>

            <el-form-item label="菜单描述：">
                <el-input
                    maxlength="50"
                    type="textarea"
                    :rows="3"
                    style="width: 55%"
                    v-model.trim="menuOptios.menuDesc"
                    :placeholder="this.routerType == 'detail' || edit ? '' : '请输入菜单描述，不超过50个字符'"
                    :disabled="this.routerType == 'detail' || edit"
                ></el-input>
            </el-form-item>
        </el-form>

        <template v-if="menuOptios.category == 2">
            <div class="title">
                <span>功能配置</span>
                <el-button v-if="this.routerType !== 'detail' && !this.edit" type="primary" @click="addRow()" icon="el-icon-circle-plus" class="addBtn">新增</el-button>
            </div>
            <el-table ref="table" :data="menuOptios.functions" border class="functionsTable" :header-cell-style="{ background: '#F5F7FA' }">
                <el-table-column label="功能名称" width="200">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.name" maxlength="20" clearable :disabled="routerType == 'detail' || edit" placeholder="请输入功能名称"></el-input>
                    </template>
                </el-table-column>

                <el-table-column label="op" width="250">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.op" maxlength="50" clearable :disabled="routerType == 'detail' || edit" placeholder="请输入op"></el-input>
                    </template>
                </el-table-column>

                <el-table-column prop="updateUserName" label="修改人"></el-table-column>

                <el-table-column prop="updateTime" label="修改时间" width="170"></el-table-column>

                <el-table-column label="操作" v-if="this.routerType !== 'detail' && !this.edit">
                    <template slot-scope="scope">
                        <el-button @click="confirmDelete(scope.$index)" slot="reference" size="mini" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>

        <!-- 按钮 -->
        <template v-if="this.routerType !== 'detail'">
            <el-row type="flex" justify="center" class="btnBox">
                <el-button v-if="edit" style="width: 160px" type="primary" @click="edit = false">修改</el-button>

                <template v-else>
                    <el-col :span="12" style="margin-right: 15px">
                        <el-button :loading="btnLoading" style="width: 160px; float: right" type="primary" @click="submitForm()">保存</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-button :loading="btnLoading" style="width: 160px" @click="cancel()">取消</el-button>
                    </el-col>
                </template>
            </el-row>
        </template>

        <el-dialog append-to-body :lock-scroll="false" title="删除" :visible.sync="showDelete" width="30%" center>
            <span>确认删除功能配置？</span>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 98px" @click="showDelete = false">取 消</el-button>
                <el-button style="width: 98px" type="primary" @click="deleteRow()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: ['menuData', 'formInfo'],
    data() {
        return {
            rules: {
                name: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入菜单名称',
                    },
                ],
                sort: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入展示优先级',
                    },
                ],
                url: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入url',
                    },
                ],
            },
            //图片上传
            options: {
                quantity: 1,
                actions: {
                    url: '/file/upload', //上传地址，优先级高于moduleName
                    op: '', //上传op，优先级高于moduleName
                },
                afterUpload: this.afterUpload,
                handleRemove: this.handleRemove,
                fileExt: ['png'],
            },
            fileUrlArr: [],
            edit: this.$route.query.type == 'add' ? false : true,
            moduleName: '/systemManage/systemInfo',
            menuOptios: {},
            picPart: true,
            btnLoading: false,
            showDelete: false,
            deleteIndex: '',
        };
    },
    watch: {
        menuData: {
            handler(val) {
                this.menuOptios = JSON.parse(JSON.stringify(val));
                this.reload();
                this.fileUrlArr = this.menuOptios.pic ? [this.menuOptios.pic] : [];
            },
            immediate: true,
        },
        'formInfo.formType'(val) {
            if (val == 'add') {
                this.edit = false;
            }
        },
    },
    computed: {
        op() {
            return { add: 'saveMenu', edit: 'updateMenu' }[this.formInfo.formType];
        },
        routerType() {
            return this.$route.query.type;
        },
    },
    methods: {
        afterUpload(res, files) {
            this.menuOptios.pic = res.data;
        },
        handleRemove() {
            this.menuOptios.pic = '';
        },
        validateAddFields(data, cb) {
            //如果data不存在，则为第一次点击新增且表单数据为空。不用验证直接显示input框
            //cb用来返回是验证的结果
            if (!data) {
                return cb(true);
            }
            //验证必填项
            for (let item of data) {
                for (let key in item) {
                    if (!item[key] && ['name', 'op'].includes(key)) {
                        this.$message.error(`${{ name: '功能名称', op: 'op' }[key]}为必填项!`);
                        return cb(false);
                    }
                }
            }

            cb(true);
        },
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.validateAddFields(this.menuOptios.functions, funValid => {
                        if (funValid) {
                            if (this.formInfo.systemId) {
                                let _url = this.getModuleUrl(this.op);
                                let { url, parentId } = this.menuOptios;

                                let data = {
                                    data: JSON.stringify({
                                        ...this.menuOptios,
                                        parentId: this.formInfo.formType === 'add' ? this.formInfo.menuId : parentId,
                                        menuType: !url ? 0 : this.menuOptios.menuType !== 1 ? 2 : 1, // type 0：无页面菜单，1：功能菜单（方法）2：有页面菜单
                                        sysInfoId: this.formInfo.systemId,
                                    }),
                                    op: this.op,
                                };
                                this.btnLoading = true;
                                this.$axios(_url, data)
                                    .then(res => {
                                        this.edit = true;
                                        this.menuOptios = JSON.parse(res.data);
                                        this.$emit('selectNodeFun', JSON.parse(res.data), this.op);
                                        this.formInfo.formType = 'edit';
                                        this.$message.success('保存成功!');
                                        this.btnLoading = false;
                                    })
                                    .catch(() => {
                                        this.btnLoading = false;
                                    });
                            } else {
                                this.$message.error('请先保存系统!');
                            }
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        cancel() {
            this.edit = true;
            this.$refs.form.resetFields();
            this.menuOptios = JSON.parse(JSON.stringify(this.menuData));
            this.reload();
            if (this.menuOptios.pic) {
                this.fileUrlArr = [this.menuOptios.pic];
            } else {
                this.fileUrlArr = [];
            }
        },
        //table新增
        addRow() {
            let data = this.menuOptios.functions || [];
            this.validateAddFields(data, funValid => {
                if (funValid) {
                    this.menuOptios.functions.push({
                        name: '',
                        op: '',
                    });
                }
            });
        },
        reload() {
            this.picPart = false;
            this.$nextTick(() => (this.picPart = true));
        },
        //删除确认
        confirmDelete(index) {
            this.showDelete = true;
            this.deleteIndex = index;
        },
        //table删除
        deleteRow(index, row) {
            this.menuOptios.functions.splice(this.deleteIndex, 1);
            this.showDelete = false;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        clear() {
            if (this.menuOptios.sort > 0 && this.menuOptios.sort < 100) {
                this.menuOptios.sort = '';
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.picLabel {
    /deep/ .el-form-item__label {
        margin-top: 2.5rem;
    }
    /deep/ .el-form-item__content {
        line-height: 0;
    }
}

.addBtn {
    width: 95px;
    height: 40px;
    background: #ffffff;
    color: #f05259;
}
.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 24px 15px;
    font-size: 16px;
    font-weight: 600;
    line-height: 40px;
}
.picTips {
    width: 220px;
    color: #909399;
    line-height: 40px;
}
.functionsTable {
    width: calc(100% - 15px);
    margin-left: 15px;
    margin-bottom: 16px;
}
.btnBox {
    margin: 40px 0 15px 15px;
}
/deep/ .el-textarea.is-disabled {
    .el-textarea__inner {
        color: #606266;
        cursor: auto;
    }
}
/deep/ .el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
