<template>
    <div class="oa_system">
        <!-- 基础配置 -->
        <div class="title" :style="sysType !=3 ?'justify-content: flex-end;':''">
            <span v-if="sysType==3">基础配置</span>
            <el-button v-show="!isDisabled" type="primary" @click="addRow()" icon="el-icon-circle-plus">新增</el-button>
        </div>

        <el-table class="oa_system_config" :data="copyBasicsInfo" border :header-cell-style="{ background: '#F5F7FA' }">
            <el-table-column label="序号" type="index" width="50"></el-table-column>

            <el-table-column :render-header="addRedStar" label="功能名称">
                <template slot-scope="scope">
                    <el-input placeholder="请输入功能名称" :disabled="isDisabled" maxlength="50" v-model.trim="scope.row.name" clearable></el-input>
                </template>
            </el-table-column>

            <el-table-column :render-header="addRedStar" label="URL">
                <template slot-scope="scope">
                    <el-input placeholder="请输入URL" :disabled="isDisabled" maxlength="100" v-model.trim="scope.row.url" clearable></el-input>
                </template>
            </el-table-column>

            <el-table-column :render-header="addRedStar" label="OP" >
                <template slot-scope="scope">
                    <el-input placeholder="请输入OP" :disabled="isDisabled" maxlength="60" v-model.trim="scope.row.op" clearable></el-input>
                </template>
            </el-table-column>

            <el-table-column label="描述" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-input placeholder="请输入菜单描述" :disabled="isDisabled" maxlength="50" v-model.trim="scope.row.funDesc" clearable></el-input>
                </template>
            </el-table-column>

            <el-table-column label="操作" v-if="!isDisabled" width="100">
                <template slot-scope="scope">
                    <!-- <el-button icon="el-icon-plus" size="mini" @click="addRow()" circle></el-button> -->
                    <el-button icon="el-icon-minus" @click="confirmDelete(scope.$index)" size="mini" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 按钮 -->
        <template v-if="isOperation && (sysType==3 ? powerControl(['updateSystem', 'saveSystem'], 'some') : true)">
            <el-row type="flex" justify="center" class="btnBox">
                <el-button v-if="isDisabled" class="editBtn" type="primary" @click="systemEdit">修改</el-button>
                <div v-else>
                    <el-button v-if="this.systemInfo.id" :loading="btnLoading" class="cel_btn" @click="cancel">取消</el-button>
                    <el-button :loading="btnLoading" type="primary" @click="tableSave">保存</el-button>
                </div>
            </el-row>
        </template>

        <el-dialog append-to-body title="删除" :visible.sync="showDelete" width="30%" center :lock-scroll="false">
            <p style="text-align: center">确认删除基础配置？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDelete = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        basicsOptions: {
            type: Array,
            default: () => []
        },
        systemInfo: {
            type: Object,
            default: () => {}
        },
        isOperation: {
            // 是否能操作
            type: Boolean,
            default: false
        },
        sysName: {
            type: String,
            default: ''
        },
        sysCode:  {
            type: String,
            default: ''
        },
        moduleName: {
            type: String,
            default: ''
        },
        sysType: {
            type: [String,Number],
            default: ''
        }
    },
    data() {
        return {
            copyBasicsInfo: [],
            btnLoading: false,
            isDisabled: true,
            tableData: [],
            showDelete: false,
            deleteIndex: null // 记录删除数据下标
        };
    },
    watch: {
        basicsOptions: {
            handler(val) {
                // 备份基础信息数据,取消重置表格数据
                this.copyBasicsInfo = this.$baseMethod.deepClone(val);
            },
            deep: true,
            immediate: true
        }
    },

    methods: {
        // 保存【保存到数据库】
        async tableSave() {
            try {
                let { id, name, orgType } = this.systemInfo;
                let operationType = this.$route.query.type
                // 类型为新添加/编辑系统，并且没有输入系统名称
                if ((operationType == 'add' || operationType == 'edit') && !this.sysName) return this.$message.error('请输入系统名称');
                if ((operationType == 'add' && !this.sysCode)) return this.$message.error('请输入系统编码');

                //基础信息-- 非小程序
                if ((operationType == 'add' && !id && this.sysType!=3)) return this.$message.error('请保存系统名称与系统编码');

                let isSave = this.copyBasicsInfo.map(item => this.validateAddFields(item)).every(k => k === true);
                if (!isSave) return;

                let param={}
                let url=''
                //不为小程序OP
                if(this.sysType!=3){
                    param = {
                        id,
                        op:'updateBasicFunctions',
                        functions :this.copyBasicsInfo
                    };
                    url = '/authority/systemInfo/update'
                }else{
                    // 系统有id,则是编辑
                    let op = this.systemInfo.id ? 'updateSystem' : 'saveSystem';
                    url = this.systemInfo.id ? '/authority/systemInfo/update' : '/authority/systemInfo/save';
                    let keys = {
                        0: 'headFunctions', // 总部基础信息
                        20: 'firstOrgFunctions', // 一级机构基础信息
                        30: 'secondOrgFunctions', // 二级机构基础信息
                        40: 'stationFunctions' // 实体店基础信息
                    };
                    let key = keys[orgType];
                    param = {
                        id,
                        name: this.sysName || name,
                        sysCode: this.sysCode,
                        op,
                        orgType,
                        sysType: this.$parent.$parent.$parent.sysType,
                        activeMenu:this.$attrs.activeMenu,
                        port:this.$attrs.port,
                    };
                    param[key] = this.copyBasicsInfo;
                }

                let res = await this._axios(param, this.moduleName, url);
                if (res.code == 1) {
                    this.$message.success('保存成功!');
                    this.isDisabled = true;
                    this.$parent.$parent.$parent.sysNameDisb = true;
                    let id = res.data ? res.data.id : id;
                    this.$emit('pageInit', id);
                }
            } catch (_err) {
                throw _err;
            }
        },

        systemEdit() {
            this.isDisabled = false;
            this.$parent.$parent.$parent.sysNameDisb = false;
        },

        // 取消操作
        cancel() {
            this.isDisabled = true;
            if(this.sysType==3){
                this.copyBasicsInfo = this.$baseMethod.deepClone(this.basicsOptions);
                this.$parent.$parent.$parent.sysNameDisb = true;
                this.$parent.$parent.$parent.sysName = this.systemInfo.name || ''
                this.$parent.$parent.$parent.sysCode = this.systemInfo.sysCode || ''
            }else{
                this.$emit('pageInit', this.systemInfo.id || '');
            }
        },

        // 删除基础配置
        confirmDelete(index) {
            this.showDelete = true;
            this.deleteIndex = index;
        },

        // 确认删除
        deleteRow() {
            this.copyBasicsInfo.splice(this.deleteIndex, 1);
            this.showDelete = false;
        },

        // 新增基础配置
        addRow() {
            let data = this.copyBasicsInfo[this.copyBasicsInfo.length - 1] || {};
            let isAdd = this.validateAddFields(data);
            let rowKeys = { name: '', url: '', op: '', funDesc: '' };
            isAdd && this.copyBasicsInfo.push(rowKeys);
            //新增时滚动到div的最下面
            this.$nextTick(() => {
                var container = this.$el.querySelector('.el-table__body-wrapper');
                container.scrollTop = container.scrollHeight;
            })

        },

        //配置验证
        validateAddFields(data) {
            //验证必填项
            for (let key in data) {
                if (!data[key] && ['name', 'op', 'url'].includes(key)) {
                    this.$message.error(`${{ name: '功能名称', op: 'op', url: 'url' }[key]}为必填项!`);
                    return false;
                }
            }
            return true;
        },

        //基础配置表头样式
        addRedStar(h, { column }) {
            // 给表头加必选标识
            return [h('span', { style: 'color: #F05259' }, '*'), h('span', ' ' + column.label)];
        }
    }
};
</script>

<style lang="scss" scoped>
.oa_system {
    display: flex;
    flex-direction: column;

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
        margin: 18px 0 24px;
        font-size: 16px;
        height: 40px;
        font-weight: 600;
    }
    /deep/ .el-dialog .el-dialog__body {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .btnBox {
        margin-top: 24px;

        .el-button {
            width: 160px;
        }
    }
    .cel_btn {
        margin-right: 14px;
    }
    /deep/ .el-table .cell {
        line-height: 28px;
    }
    .subBtn {
        text-align: center;
        padding-top: 20px;
    }

    /deep/ .oa_system_config {
        border-radius: 8px 8px 0 0;
        tr {
            border-radius: 35px 35px 0 0;

            th {
                height: 40px;
                padding: 0;
            }
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
    /deep/ .is-circle {
        height: 28px;
        width: 28px;
        background: #f05259;
        border: none;
        color: #fff;
    }

    .ml-40 {
        margin-left: 40px;
    }
}
</style>
