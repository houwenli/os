<template>
    <div class="system">
        <!-- 系统信息 -->
        <div>
            <div class="title">
                <span>系统信息</span>
                <el-button type="primary" @click="back()" class="addBtn">返回</el-button>
            </div>
            <el-form ref="onelevel" label-position="right" label-width="7rem" :model="formOptions.systemInfo" :rules="rules">
                <el-form-item class="picLabel" label="系统图标：">
                    <div style="display: flex; align-items: center">
                        <ws-image-upload
                            class="picBox"
                            v-if="picPart"
                            :key="fileUrlArr[0]"
                            ref="imageUpload"
                            :urlList="fileUrlArr"
                            :inputReadyOnly="routerType == 'detail' || edit"
                            :isDelete="!edit"
                            v-bind="options"
                        />
                        <div v-if="routerType !== 'detail'">
                            <div class="typeTips">固定尺寸64px*64px，支持jpg、png格式</div>
                            <div v-if="!formOptions.systemInfo.pic" class="picTips">*请上传菜单图标</div>
                            <div v-else class="picTips">*已上传</div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item prop="name" label="系统名称：">
                    <el-input
                        style="width: 41%"
                        maxlength="20"
                        v-model.trim="formOptions.systemInfo.name"
                        :placeholder="this.routerType == 'detail' || edit ? '' : '请输入系统名称'"
                        :disabled="this.routerType == 'detail' || edit"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="url" label="页面路径：">
                    <el-input
                        style="width: 41%"
                        maxlength="200"
                        v-model.trim="formOptions.systemInfo.url"
                        :placeholder="this.routerType == 'detail' || edit ? '' : '请输入页面路径'"
                        :disabled="this.routerType == 'detail' || edit"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="sort" label="展示优先级：">
                    <el-input
                        style="width: 41%"
                        v-model.trim="formOptions.systemInfo.sort"
                        :placeholder="this.routerType == 'detail' || edit ? '' : '请输入级别1-100'"
                        oninput="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{if(this.value>100){this.value=100}else{this.value=this.value.replace(/\D/g,'')}}"
                        :disabled="this.routerType == 'detail' || edit"
                    ></el-input>
                </el-form-item>
                <el-form-item label="业务类型：">
                    <el-select style="width: 41%" :disabled="this.routerType == 'detail' || edit" v-model="formOptions.systemInfo.sysType" filterable placeholder="业务类型">
                        <el-option v-for="item in businessTypeList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统描述：">
                    <el-input
                        type="textarea"
                        maxlength="50"
                        :rows="2"
                        style="width: 41%"
                        v-model.trim="formOptions.systemInfo.sysDesc"
                        :placeholder="this.routerType == 'detail' || edit ? '' : '请输入系统描述，不超过50个字符'"
                        :disabled="this.routerType == 'detail' || edit"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>

        <!-- 基础配置 -->
        <div>
            <div class="title">
                <span>基础配置</span>
                <el-button v-if="!edit" type="primary" @click="addRow()" icon="el-icon-circle-plus" class="addBtn">新增</el-button>
            </div>

            <el-table :data="formOptions.functions" border style="width: calc(100% - 15px); margin-left: 15px" :header-cell-style="{ background: '#F5F7FA' }">
                <el-table-column label="序号" type="index" width="50"></el-table-column>

                <el-table-column :render-header="addRedStar" label="功能名称" width="250">
                    <template slot-scope="scope">
                        <el-input
                            placeholder="请输入功能名称"
                            maxlength="20"
                            v-if="!edit && !scope.row.id && scope.$index === formOptions.functions.length - 1"
                            v-model.trim="scope.row.name"
                            clearable
                        ></el-input>
                        <span v-else>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column :render-header="addRedStar" label="URL" width="300">
                    <template slot-scope="scope">
                        <el-input
                            placeholder="请输入URL"
                            maxlength="100"
                            v-if="!edit && !scope.row.id && scope.$index === formOptions.functions.length - 1"
                            v-model.trim="scope.row.url"
                            clearable
                        ></el-input>
                        <span v-else>{{ scope.row.url }}</span>
                    </template>
                </el-table-column>

                <el-table-column :render-header="addRedStar" label="OP">
                    <template slot-scope="scope">
                        <el-input
                            placeholder="请输入OP"
                            maxlength="50"
                            v-if="!edit && !scope.row.id && scope.$index === formOptions.functions.length - 1"
                            v-model.trim="scope.row.op"
                            clearable
                        ></el-input>
                        <span v-else>{{ scope.row.op }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="功能描述" width="400" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-input
                            placeholder="请输入功能描述"
                            maxlength="50"
                            v-if="!edit && !scope.row.id && scope.$index === formOptions.functions.length - 1"
                            v-model.trim="scope.row.funDesc"
                            clearable
                        ></el-input>
                        <span v-else>{{ scope.row.funDesc }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" v-if="!edit">
                    <template slot-scope="scope">
                        <el-button @click="confirmDelete(scope.$index)" slot="reference" style="height: 28px" size="mini" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 按钮 -->
        <template v-if="this.routerType !== 'detail'">
            <el-row type="flex" justify="center" class="btnBox">
                <el-button v-if="edit" class="editBtn" type="primary" @click="edit = false">修改</el-button>
                <template v-else>
                    <el-col :span="11" style="margin-right: 15px">
                        <el-button :loading="btnLoading" class="confirmBtn" type="primary" @click="testForm()">保存</el-button>
                    </el-col>
                    <el-col :span="13">
                        <el-button :loading="btnLoading" style="width: 160px" @click="cancel()">取消</el-button>
                    </el-col>
                </template>
            </el-row>
        </template>

        <el-dialog append-to-body title="删除" :visible.sync="showDelete" width="30%" center :lock-scroll="false">
            <span>确认删除基础配置？</span>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 98px" @click="showDelete = false">取 消</el-button>
                <el-button style="width: 98px" type="primary" @click="deleteRow()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    props: ['systemData'],
    data() {
        return {
            edit: this.$route.query.type == 'add' ? false : true,
            moduleName: '/systemManage/systemInfo',
            // 业务类型
            businessTypeList: [],
            // 系统信息
            rules: {
                name: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入菜单名称'
                    }
                ],
                sort: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入展示优先级'
                    }
                ],
                url: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入页面路径'
                    }
                ]
            },
            //图片上传
            options: {
                quantity: 1,
                actions: {
                    url: '/file/upload', //上传地址，优先级高于moduleName
                    op: '' //上传op，优先级高于moduleName
                },
                afterUpload: this.afterUpload,
                handleRemove: this.handleRemove
            },
            fileUrlArr: [],
            formOptions: {},
            picPart: true,
            btnLoading: false,
            deleteIndex: '',
            showDelete: false
        };
    },
    computed: {
        routerType() {
            return this.$route.query.type;
        },
        op() {
            return { add: 'saveSystem', edit: 'updateSystem' }[this.formOptions.systemInfo.id ? 'edit' : 'add'];
        }
    },
    watch: {
        systemData: {
            handler(val) {
                this.formOptions = JSON.parse(JSON.stringify(val));
            },
            immediate: true
        },
        'formOptions.systemInfo.pic'(val) {
            if (val) {
                this.fileUrlArr = [val];
            }
        }
    },
    created() {
        this.getBusinessOptions();
    },
    methods: {
        ...mapActions('systemManage', ['getBusinessType']),
        //获取业务类型选项
        getBusinessOptions() {
            this.getBusinessType().then(res => {
                this.businessTypeList = res;
                if (this.routerType == 'add') {
                    this.systemData.systemInfo.sysType = 1;
                    this.formOptions = JSON.parse(JSON.stringify(this.systemData));
                }
            });
        },
        afterUpload(res, files) {
            this.formOptions.systemInfo.pic = res.data;
            this.fileUrlArr = [res.data];
            this.reload();
        },
        handleRemove() {
            this.formOptions.systemInfo.pic = '';
            this.fileUrlArr = [];
            this.reload();
        },
        //配置验证
        validateAddFields(data, cb) {
            //如果data不存在，则为第一次点击新增且表单数据为空。不用验证直接显示input框
            //cb用来返回是验证的结果
            if (!data) {
                return cb(true);
            }
            //验证必填项
            for (let key in data) {
                if (!data[key] && ['name', 'op', 'url'].includes(key)) {
                    this.$message.error(`${{ name: '功能名称', op: 'op', url: 'url' }[key]}为必填项!`);
                    return cb(false);
                }
            }
            cb(true);
        },
        //基础配置新增弹框
        addRow() {
            let data = this.formOptions.functions[this.formOptions.functions.length - 1] || {};
            this.validateAddFields(data, funValid => {
                if (funValid) {
                    this.formOptions.functions.push({
                        name: '',
                        url: '',
                        op: '',
                        funDesc: ''
                    });
                }
            });
        },
        //基础配置表头样式
        addRedStar(h, { column }) {
            // 给表头加必选标识
            return [h('span', { style: 'color: #F05259' }, '*'), h('span', ' ' + column.label)];
        },
        //删除确认
        confirmDelete(index) {
            this.showDelete = true;
            this.deleteIndex = index;
        },
        // 删除
        deleteRow() {
            this.formOptions.functions.splice(this.deleteIndex, 1);
            this.showDelete = false;
        },
        //保存
        testForm() {
            this.$refs['onelevel'].validate(valid => {
                if (valid) {
                    if (this.formOptions.systemInfo.pic) {
                        let dataTable = this.formOptions.functions[this.formOptions.functions.length - 1] || {};
                        this.validateAddFields(dataTable, funValid => {
                            if (funValid) {
                                let _url = this.getModuleUrl(this.op);
                                let { systemInfo, functions } = this.formOptions;
                                let data = {
                                    data: JSON.stringify({
                                        systemInfo,
                                        functions
                                    }),
                                    op: this.op
                                };
                                this.btnLoading = true;
                                this.$axios(_url, data)
                                    .then(res => {
                                        this.$message.success('保存成功!');
                                        this.edit = true;
                                        let id = res.data ? JSON.parse(res.data).systemInfo.id : systemInfo.id;
                                        this.$emit('searchDetail', id, this.op);
                                        this.btnLoading = false;
                                    })
                                    .catch(() => {
                                        this.btnLoading = false;
                                    });
                            }
                        });
                    } else {
                        this.$message.error(`请上传系统图标!`);
                    }
                } else {
                    return false;
                }
            });
        },
        cancel() {
            this.edit = true;
            this.$refs.onelevel.resetFields();
            this.formOptions = JSON.parse(JSON.stringify(this.systemData));
            this.reload();
            if (this.formOptions.systemInfo.pic) {
                this.fileUrlArr = [this.formOptions.systemInfo.pic];
            } else {
                this.fileUrlArr = [];
            }
        },
        back() {
            this.$router.push({ name: 'systemInfo' });
        },
        reload() {
            this.picPart = false;
            this.$nextTick(() => (this.picPart = true));
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
.system {
    display: flex;
    flex-direction: column;
}
.picTips {
    color: #f56c6c;
    line-height: 40px;
}
.picBox {
    display: inline-block;
    margin-right: 12px;
}
.typeTips {
    color: #909399;
    line-height: 40px;
}
.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 24px 15px;
    font-size: 16px;
    height: 40px;
    font-weight: 600;
}
.addBtn {
    width: 95px;
    height: 36px;
    background: #ffffff;
    color: #f05259;
}
/deep/ .el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
.btnBox {
    margin: 40px 0 15px 15px;
}
.confirmBtn {
    width: 160px;
    float: right;
}
.editBtn {
    width: 160px;
    margin-right: 8rem;
}
/deep/ .el-table .cell {
    line-height: 28px;
}
.subBtn {
    text-align: center;
    padding-top: 20px;
}
.picLabel {
    /deep/ .el-form-item__label {
        margin-top: 2.5rem;
    }
    /deep/ .el-form-item__content {
        line-height: 0;
    }
}
.overDiv {
    overflow: hidden;
    text-overflow: ellipsis;
}
/deep/ .el-upload--picture-card {
    height: 120px;
    width: 120px;
    line-height: 120px;
}
/deep/ .image-viewer {
    width: 120px;
    height: 120px;
}
/deep/ .el-textarea.is-disabled {
    .el-textarea__inner {
        color: #606266;
        cursor: auto;
    }
}
</style>
