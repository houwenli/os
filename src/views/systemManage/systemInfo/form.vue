<template>
    <div class="settle-payCompang-form">
        <el-card class="mainForm">
            <!-- 系统信息及基础配置 -->
            <systemForm :system-data="systemData" @searchDetail="searchDetail" />

            <!-- 功能菜单配置 -->
            <div v-show="funcMenu">
                <div class="title">
                    <span>功能菜单配置</span>
                </div>
                <div class="title2">
                    <div class="circle" />
                    <div>系统功能列表</div>
                </div>
                <el-row type="flex" justify="space-between" style="margin-left: 15px">
                    <el-col :span="11" class="leftBox">
                        <!-- 查询新增按钮 -->
                        <div class="searchBox">
                            <el-input v-model.trim="filterText" placeholder="请搜索系统功能" :maxlength="20" clearable class="search" />
                            <el-button
                                v-if="this.routerType !== 'detail'"
                                type="primary"
                                class="addNew"
                                @click="
                                    addMenu(0, '新增一级菜单');
                                    systemData.systemInfo.id && (formInfo.menuId = systemData.menus[0].id);
                                "
                            >
                                +新增一级菜单
                            </el-button>
                        </div>
                        <!-- tree -->
                        <div>
                            <ws-tree
                                ref="tree"
                                :filter-node-method="filterNode"
                                :tree-data="systemData.menus[0] && systemData.menus[0].children"
                                :default-props="defaultProps"
                                :draggable="draggable"
                                :filterable="filterable"
                                :set-node-expand="setNodeExpand"
                                @node-click="handleNodeClick"
                                @node-add="handleNodeAdd"
                                @node-delete="handleNodeDelete"
                            />
                        </div>
                    </el-col>

                    <el-col :span="13" class="rightBox">
                        <div class="title3">{{ titleName }}</div>
                        <menuForm ref="topTab" :form-info="formInfo" :menu-data="menuData" @selectNodeFun="selectNodeFun" />
                    </el-col>
                </el-row>
            </div>

            <!-- 修改记录 -->
            <div v-if="this.routerType !== 'add'">
                <div class="title">
                    <span>修改记录</span>
                </div>
                <el-row type="flex" justify="space-between" style="margin-left: 15px">
                    <el-col :span="11" style="margin-right: 16px">
                        <tableList :table-data="createData" :table-style="{ width: '100%' }" />
                    </el-col>
                    <el-col :span="13">
                        <tableList :table-data="editData" :table-style="{ width: '100%' }" />
                    </el-col>
                </el-row>
            </div>
        </el-card>

        <el-dialog append-to-body title="删除" :visible.sync="showDelete" width="30%" center :lock-scroll="false">
            <span>确认删除菜单？</span>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 98px" :loading="btnLoading" @click="showDelete = false">取 消</el-button>
                <el-button style="width: 98px" :loading="btnLoading" type="primary" @click="deleteMenu()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../../../components/TableList/index.vue'; //修改记录
import wsTree from '../../../components/Tree'; //tree
import menuForm from './components/menuForm.vue'; //菜单表单
import systemForm from './components/systemForm.vue'; //系统表单

export default {
    name: 'systemInfoForm',
    components: { tableList, wsTree, menuForm, systemForm },
    data() {
        return {
            systemData: {
                createTime: '',
                createUserName: '',
                functions: [],
                menus: [],
                sysTypeCode: '',
                sysTypeName: '',
                systemInfo: {},
                updateTime: '',
                updateUserName: ''
            },

            menuData: {
                functions: [],
                id: '',
                menuDesc: '',
                menuType: '',
                name: '',
                parentId: '',
                pic: '',
                sort: '',
                sysInfoId: '',
                url: '',
                imgName: '',
                category: 1 //1菜单 2功能op
            },

            showDelete: false,
            // 面包屑
            breadList: [],
            // 系统信息

            moduleName: '/systemManage/systemInfo',

            defaultProps: {
                children: 'children',
                label: 'name'
            },
            draggable: false, //关闭拖拽
            filterable: false,
            //上级跳转类型
            routerType: '',
            titleName: '新增一级菜单',
            //修改记录
            createData: [
                { label: '创建人', value: '' },
                { label: '创建时间', value: '' }
            ],
            editData: [
                { label: '修改人', value: '' },
                { label: '修改时间', value: '' }
            ],
            delNodeId: '',
            filterText: '',
            copyData: {},
            formInfo: {
                formType: 'edit',
                menuId: '',
                systemId: ''
            },
            selectNode: {},
            btnLoading: false,
            funcMenu: false
        };
    },
    watch: {
        //tree搜索监听方法
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {
        this.routerType = this.$route.query.type;
        this.$route.meta.title = { add: '新增', edit: '修改', detail: '详情' }[this.routerType];
        if (this.routerType == 'add') {
            this.formInfo.formType = 'add';
        }
        if (this.$route.query.id) {
            this.formInfo.systemId = this.$route.query.id;
            this.searchDetail(this.$route.query.id);
        }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        //详情查询
        searchDetail(id, type) {
            let data = {
                data: JSON.stringify({
                    id: id
                }),
                op: 'selectSystemDetail'
            };
            this.$axios(this.getModuleUrl(data.op), data).then(res => {
                this.systemData = JSON.parse(res.data);
                this.formInfo.systemId = this.systemData.systemInfo.id;
                this.createData[0].value = this.systemData.createUserName;
                this.createData[1].value = this.systemData.createTime;
                this.editData[0].value = this.systemData.updateUserName;
                this.editData[1].value = this.systemData.updateTime;
                this.formInfo.menuId = this.systemData.menus[0].id;
                this.funcMenu = true;
                if (!type) {
                    this.sedInfo();
                }
            });
        },
        //菜单右侧显示
        sedInfo() {
            if (this.systemData.menus[0].children == null || this.systemData.menus[0].children.length == 0) {
                this.addMenu(0, '新增一级菜单');
            } else {
                this.menuData = this.systemData.menus[0].children[0];
                this.titleName = this.systemData.menus[0].children[0].name;
                this.formInfo.formType = 'edit';
                let node = this.$refs.tree.$refs.tree.getNode(this.menuData.id);
                this.selectNode = { node, data: this.menuData };
            }
        },
        // tree
        setNodeExpand(node, data) {
            this.selectNode = { node, data };
            if (this.routerType == 'detail') {
                return false;
            }
            if (data.category == 2) {
                data.banAdd = true;
            }
            return true;
        },
        //点击加号
        handleNodeAdd(node, data) {
            this.selectNode = { node, data };
            this.formInfo.menuId = data.id;
            this.addMenu(!data.url ? 0 : 1, '新增下级菜单');
        },
        //删除菜单弹窗
        handleNodeDelete(node, data) {
            this.selectNode = { node, data };
            this.delNodeId = data.id;
            this.showDelete = true;
        },
        //新增修改菜单后调用
        selectNodeFun(data, type) {
            this.filterText = '';
            this.editData[1].value = data.updateTime;
            this.editData[0].value = data.updateUserName;
            let treeData = this.$refs.tree.data || (this.$refs.tree.data = []);
            if (this.titleName == '新增一级菜单') {
                treeData.push(data);
            } else {
                if (type == 'updateMenu') {
                    Object.assign(this.selectNode.data, data);
                    return this.clickReset(this.selectNode.data);
                }
                if (!this.selectNode.data.children) {
                    this.$set(this.selectNode.data, 'children', []);
                }
                this.selectNode.data.children.push(data);
            }
            this.clickReset(data);
        },
        clickReset(data) {
            this.$nextTick(() => {
                this.$refs.tree.$refs.tree.setCurrentKey(data.id);
                let node = this.$refs.tree.$refs.tree.getNode(data.id);
                this.selectNode = { node, data };
                this.handleNodeClick(data, node);
            });
        },
        //删除菜单接口
        deleteMenu() {
            let data = {
                data: JSON.stringify({
                    id: this.delNodeId
                }),
                op: 'deleteMenu'
            };
            this.btnLoading = true;
            this.$axios(this.getModuleUrl(data.op), data)
                .then(res => {
                    this.$message.success('删除成功!');
                    this.filterText = '';
                    this.editData[1].value = JSON.parse(res.data).updateTime;
                    this.editData[0].value = JSON.parse(res.data).updateUserName;
                    this.showDelete = false;
                    this.btnLoading = false;
                    let parent = this.selectNode.node.parent;
                    let children = parent.data.children || parent.data;
                    let index = children.findIndex(d => d.id === this.delNodeId);
                    if (this.selectNode.node.level == 1) {
                        this.$refs.tree.data.splice(index, 1);
                    } else {
                        children.splice(index, 1);
                    }
                    this.formInfo.menuId = this.systemData.menus[0].id;
                    this.addMenu(0, '新增一级菜单');
                })
                .catch(() => {
                    this.btnLoading = false;
                });
        },
        handleNodeClick(data, node) {
            this.breadList = [];
            this.getTreeNode(node);
            this.titleName = this.breadList.join(' / ');
            this.menuData = { ...JSON.parse(JSON.stringify(data)) };
            this.formInfo.formType = 'edit';
            this.$refs.topTab.$refs.form.resetFields();
        },
        //面包屑
        getTreeNode(node) {
            //获取当前树节点和其父级节点
            if (node && node.label !== undefined) {
                this.breadList.unshift(node.label);
                this.getTreeNode(node.parent); //递归
            }
        },
        //新增菜单
        addMenu(menuType, titleName) {
            this.titleName = titleName;
            this.formInfo.formType = 'add';
            this.menuData = {
                functions: [],
                id: '',
                menuDesc: '',
                menuType: menuType,
                name: '',
                parentId: '',
                pic: '',
                sort: '',
                sysInfoId: this.systemData.systemInfo.id,
                url: '',
                category: 1
            };
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 24px 15px;
    font-size: 16px;
    font-weight: 600;
}
.mainForm {
    padding: 0 25px 0 10px;
    border-radius: 8px;
}
.inBox {
    display: flex;
    margin-left: 15px;
}
.leftBox {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 6px 16px 16px 16px;
    margin-right: 16px;
}
.rightBox {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 32px 16px 16px;
    overflow: hidden;
}
.circle {
    width: 12px;
    height: 12px;
    background: #c0c4cc;
    border-radius: 50%;
    margin-right: 8px;
}
.title2 {
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    margin-left: 15px;
    font-weight: 600;
}
.title3 {
    font-size: 16px;
    display: flex;
    align-items: center;
    padding: 20px 0 40px 15px;
    font-weight: 600;
}
.search {
    width: calc(100% - 165px);
    min-width: 180px;
    // background: #f0f2f5;
    margin: 10px 0;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06);
}
.addNew {
    width: 150px;
    background: #ffffff;
    color: #f05259;
    margin: 10px 0;
}
.searchBtn {
    width: 6%;
    min-width: 70px;
    margin: 10px 0;
}
.searchBox {
    flex-wrap: wrap;
    display: flex;
    justify-content: space-between;
}
.addBtn {
    width: 95px;
    height: 40px;
    background: #ffffff;
    color: #f05259;
}
.tableLeft {
    width: 700px;
    border: 1px solid #dcdfe6;
    margin-right: 16px;
    border-radius: 4px;
}
.tableRight {
    width: 804px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}
.editlLog {
    display: flex;
    justify-content: center;
    margin-left: 15px;
}
/deep/ .custom-tree-node {
    display: flex;
    justify-content: space-between;
    width: 100%;
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
/deep/ .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa !important;
}
.picLabel {
    display: flex;
    align-items: center;
}
.formAll {
    /deep/ .el-form-item__label {
        width: 110px;
        min-width: 110px;
    }
}
.deleteDialog {
    /deep/ .el-dialog {
        padding: 24px 0 20px 0;
    }
    /deep/ .el-dialog__header {
        text-align: center;
        padding: 0;
        .el-dialog__title {
            font-size: 18px;
            font-weight: 600;
            color: #303133;
        }
    }
    /deep/ .el-dialog__body {
        text-align: center;
        padding: 0;
        margin: 10px 0 22px 0;
        color: #606266;
    }
}
/deep/ .el-table {
    border-radius: 8px;
}
/deep/ .node-content {
    font-size: 14px !important;
}
/deep/ .node-content-level1 {
    font-size: 14px !important;
}
/deep/ label {
    font-weight: 400 !important;
}
</style>
