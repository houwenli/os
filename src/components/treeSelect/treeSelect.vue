<template>
    <el-dialog :title="title" :visible.sync="isDialogVisible" width="1141px" :lock-scroll="false" :top="'10vh'" :close-on-click-modal="false" append-to-body :before-close="handleClose">
        <div class="mechanism">
            <div class="rowDiv">
                <div class="leftDiv">
                    <div class="leftTitle">
                        <div></div>
                        <span>选择</span>
                    </div>
                    <div class="leftBody">
                        <el-select
                            v-model="searchVal"

                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入名字"
                            style="width: 100%"
                            @change="handleSelect"
                            :remote-method="handleInput"
                            ref="select"
                            no-data-text="没有匹配到任何结果"
                            popper-class="treeSelectMenu"
                            :popper-append-to-body="false"
                            @blur.native.capture="handleBlur"
                        >
                            <el-option v-for="item in selectOpts" :key="item.id" :label="item.name" :value="item.id">
                                <div class="addr" v-html="item.name">{{ item.name }}</div>
                                <div class="addpart">{{ item.partimeString }}</div>
                                <div class="adddep">{{ item.department }}</div>
                            </el-option>
                        </el-select>

                        <div align="left">
                            <div class="breadcrumb" v-if="breadcrumbList.length > 1">
                                <i @click="backToLevel" class="el-icon-arrow-left"></i>
                                <div>
                                    <span v-for="(item, index) in breadcrumbList" :key="item.id" class="el-breadcrumb__item">
                                        <span style="margin: 0 3px" class="breadName" @click="handleBreadClick(item, index)">{{ item.label }}</span>
                                        <span v-if="index != breadcrumbList.length - 1">/</span>
                                    </span>
                                </div>
                            </div>
                            <el-checkbox class="checkboxAll" :indeterminate="isIndeterminate" v-if="isCheckAllVisiable" v-model="isCheckAll" @change="funcRoleCheckAll" :disabled="isDisabled">
                                全选
                            </el-checkbox>
                        </div>
                        <el-tree
                            show-checkbox
                            icon-class="el-icon-arrow-right"
                            node-key="id"
                            @check-change="checkChange"
                            @node-click="handleNodeClick"
                            @node-expand="handeleNodeExpend"
                            :expand-on-click-node="expandOnClickNode"
                            :default-checked-keys="funcDefaultKeys"
                            class="filter-tree"
                            :style="{ height: breadcrumbList.length > 1 ? (isCheckAllVisiable ? 'calc(100% - 150px)' : 'calc(100% - 90px)') : 'calc(100% - 50px)' }"
                            v-loading="treeLoading"
                            :data="treeData"
                            :props="funcRoleProps"
                            :default-expand-all="false"
                            :lazy="true"
                            :load="loadNode"
                            ref="personTree"
                        >
                            <span class="custom-tree-node" slot-scope="{ data }">
                                <span class="bigSpan" v-if="data.type === 'staff'">
                                    {{ data.name }}
                                    <el-tooltip :disabled="data.partimeString == null || data.partimeString.length == 0" class="item" effect="dark" placement="top-end">
                                        <span class="rightSpan" slot="content">
                                            {{ data.partimeString }}
                                        </span>
                                        <span style="padding: 0 10px 0 5px" class="leftSpan">
                                            {{ data.partimeString ? `(${data.partimeString.length > 15 ? `${data.partimeString.substring(0, 15)}...` : data.partimeString})` : '' }}
                                        </span>
                                    </el-tooltip>
                                </span>
                                <span v-else class="elseSpan">{{ data.name }} ({{ data.depCount || 0 }}人)</span>
                            </span>
                        </el-tree>
                    </div>
                </div>
                <div class="gap"></div>
                <div class="rightDiv">
                    <div class="rightTitle">
                        <div></div>
                        <span>已选</span>
                        <span class="personCount" v-if="maxCount < Number.MAX_SAFE_INTEGER">{{ '(' + checkedNodeList.length + '/' + maxCount + ')' }}</span>
                        <span v-else class="personCount">{{ '(' + checkedNodeList.length + '人' + ')' }}</span>
                    </div>
                    <div class="cardDiv">
                        <el-card shadow="never" v-for="(item, index) in checkedNodeList" :key="item.id">
                            <div class="content">
                                <span>{{ item.name }}</span>
                                <img src="../../assets/images/icon_off.png" @click="removeCheckedNode(item, index)" alt="" />
                            </div>
                        </el-card>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
           <el-button @click="handleCancle">取消</el-button>
            <el-button type="primary" @click="handleCommit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script>
import {cloneDeep} from 'lodash-es'

export default {
    name: 'treeSelect',
    props: {
        funcDefaultNode: {
            type: Array,
            default: () => {
                return [];
            }
        },
        isDisabled: { default: false },
        title: { type: String, default: '指定成员' },
        dialogVisible: { type: Boolean, default: false },
        expandOnClickNode: { type: Boolean, default: false },
        moduleName: { type: String, default: '/systemManage/taskFlow' },
        listModuleName: { type: String, default: '/systemManage/taskFlow' },
        opObj: {
            type: Object,
            default: () => {
                return {
                    selectTree: 'selectOrganizationalTreeByidNew', //查询树数据
                    selectList: 'listByFuzzyName' //模糊查询列表
                };
            }
        },
        funcRoleProps: {
            type: Object,
            default: () => {
                return {
                    label: 'name',
                    value: 'id',
                    children: 'children',
                    disabled: () => {
                        return function (data, node) {
                            return node.children && node.children.length;
                        };
                    }
                };
            }
        },
        maxCount: { type: Number, default: 50 }
    },
    data() {
        return {
            breadcrumbList: [{ label: '深圳万顺叫车技术有限公司' }],
            searchVal: '', // tree搜索
            treeData: [], // tree 数据
            treeLoading: false, // 功能授权loading
            isDialogVisible: this.dialogVisible,
            isCheckAll: false,
            isCheckAllVisiable: false,
            isIndeterminate: false, // 全选的半选状态值
            checkedNodeList: [],
            children: [], //一级树数据
            funcDefaultKeys: [], //默认选中的树节点
            autoClass: '', //搜索树样式
            selectOpts: [],
            oldSelectOpts: [],
            treeKey: 0
        };
    },
    watch: {
        dialogVisible(val) {
            this.isDialogVisible = val;
            if (val) {
                let childrenData = this.children;
                childrenData.forEach(item => (item.leaf = !(item.depLevel && item.depLevel !== null)));
                this.treeData = childrenData;
                this.isCheckAllVisiable = false;
                this.breadcrumbList = [{ label: '深圳万顺叫车技术有限公司' }];
                this.setDefaultCheckedNodeList(this.funcDefaultNode);
            } else {
                this.treeData = [];
                this.checkedNodeList = [];
            }
        },
        isDialogVisible(val) {
            this.$emit('visibleChanged', val);
        },
        funcDefaultNode: {
            handler(val, oldval) {
                if (this.dialogVisible) {
                    this.setDefaultCheckedNodeList(val);
                }
            },
            immediate:true
        },
        checkedNodeList: {
            handler(val, oldval) {
                let oldCheckedKeys = val.map(item => {
                    return item.id;
                });
                if (this.$refs.personTree) {
                    this.$refs.personTree.setCheckedKeys(oldCheckedKeys, false);
                }
                this.setIsIndeterminate();
            },
            immediate: true,
            deep: true
        },

    },
    methods: {
        handleInput(val) {
            this.oldSelectOpts = [];
            this.selectOpts = [];
            // this.searchVal.push(val);
            this.$axios('/authority/employ/select', {
                op: this.opObj.selectList,
                data: { employName: val }
            }).then(res => {
                this.selectOpts = JSON.parse(res.data);
                this.oldSelectOpts = JSON.parse(res.data);
                let newVal = `<span style='color:#0088ff'>${val}</span>`;
                this.selectOpts.forEach(item => {
                    item.name = item.name.replace(val, newVal);
                });
            });
        },
        handleBlur(){
            //失去焦点时清空模糊查询结果项
            // 清空选项需在选中选项之后（选项选中也执行了清空）
            setTimeout(()=>{
                this.selectOpts=[];
            },200)

        },
        //设置右侧列表默认选择项目
        setDefaultCheckedNodeList(nodeData) {
            this.$nextTick(() => {
                this.funcDefaultKeys = nodeData.map(item => {
                    return item.id;
                });
                this.$refs.personTree.setCheckedKeys(this.funcDefaultKeys, false);
                this.$nextTick(() => {
                    this.checkedNodeList = cloneDeep(nodeData);
                });
            });
        },
        querySearch(queryString, cb) {
            this.$axios('/authority/employ/select', {
                op: 'listByFuzzyName',
                data: { employName: this.searchVal }
            }).then(res => {
                if (res.code == 1) {
                    let data = JSON.parse(res.data);
                    if (data.length > 0) {
                        this.autoClass = 'my-autocomplete';
                        cb(data);
                    } else {
                        this.autoClass = 'no-person';
                        cb([{ noName: '没有匹配到任何搜索结果' }]);
                    }
                }
            });
        },
        handleSelect(item) {
            // 判断是否有选中的id 有则删除
            let index = this.checkedNodeList.map(i => i.id).indexOf(item);
            if (index >= 0) {
                // 清空searchVal ，防止出现选中tags
                this.searchVal = '';
                // 清空模糊查询结果选项
                this.selectOpts=[];
                this.checkedNodeList.splice(index, 1);
                return;
            }
            if (1 + this.checkedNodeList.length > this.maxCount) {
                this.searchVal = '';
                // 清空模糊查询结果选项
                this.selectOpts=[];
                this.$message.warning(`最多只能选${this.maxCount}个人员！`);
                return;
            }
            this.searchVal = '';
            if (
                !this.checkedNodeList.find(d => {
                    return d.id === item;
                })
            ) {
                this.selectOpts.forEach((i, index) => {
                    if (i.id == item) {
                        this.checkedNodeList.push(this.oldSelectOpts[index]);
                    }
                });
                let oldCheckedKeys = this.checkedNodeList.map(item => {
                    return item.id;
                });
                if (this.$refs.personTree) {
                    this.$refs.personTree.setCheckedKeys(oldCheckedKeys, false);
                    // 清空模糊查询结果选项
                    this.selectOpts=[];
                }
            }
            // this.oldSelectOpts = [];
            // this.selectOpts = [];
        },
        handleIconClick() {},

        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        // 功能授权全选
        funcRoleCheckAll(val) {
            let treePersonData = this.treeData.filter(item => {
                return item.leaf;
            });
            if (val) {
                if (treePersonData.length + this.checkedNodeList.length > this.maxCount) {
                    this.$message.warning(`最多只能选${this.maxCount}个人员！`);
                    this.isCheckAll = false;
                    return;
                } else {
                    if (treePersonData.length) {
                        treePersonData.map(item => {
                            if (
                                !this.checkedNodeList.find(item2 => {
                                    return item2.id == item.id;
                                })
                            ) {
                                this.checkedNodeList.push(item);
                            }
                        });
                        this.$refs.personTree.setCheckedKeys(
                            this.checkedNodeList.map(item => {
                                return item.id;
                            }),
                            false
                        );
                    }
                }
            } else {
                if (treePersonData.length) {
                    treePersonData.map((item, index) => {
                        let findIndex = this.checkedNodeList.findIndex(item2 => {
                            return item2.id == item.id;
                        });
                        if (findIndex >= 0) {
                            this.checkedNodeList.splice(findIndex, 1);
                        }
                    });
                    this.$refs.personTree.setCheckedKeys(
                        this.checkedNodeList.map(item => {
                            return item.id;
                        }),
                        false
                    );
                }
            }
        },
        // tree 懒加载
        async loadNode(node, resolve) {
            // debugger
            if (node.level === 0) {
                const arr = await this.getTreeData('0', '0');
                let childrenData;
                // 走二级菜单加载方法【原因：后端返回数据连同1/2级数据都返回，需要处理分段加载】
                childrenData = this.children;
                childrenData.forEach(item => (item.leaf = !(item.depLevel && item.depLevel !== null)));
                resolve(childrenData || []);
            }
            if (node.level >= 1 && node.data.type === 'department') {
                const childreAarr = await this.getTreeData(node.data.id, node.level);
                resolve(childreAarr || []); // 加上这个，防止在该节点没有子节点时一直转圈的问题发生。
            }
        },

        // 获取组织架构数据
        async getTreeData(id, type) {
            try {
                this.treeLoading = true;
                const param = {
                    data: { organizationalid: id },
                    op: this.opObj.selectTree
                };
                const url = '/authority/Organizational/select';
                url && type < 2;
                const res = await this.$axios(url, param);
                this.treeLoading = false;
                let list;
                if (res.code == 1) {
                    //  type === '0' && (this.treeNode.childNodes = []);
                    const result = res.data ? JSON.parse(res.data) : null;
                    // list = [result]
                    list = type === '0' ? this.firstTree([result]) : this.childrenHandle(result);
                } else {
                    list = [];
                    this.isCheckAll = false;
                    this.isIndeterminate = false;
                }
                return list;
            } catch (err) {
                this.treeLoading = false;
                return [];
            } finally {
            }
        },
        firstTree(list) {
            if (!list || list.length == 0) {
                this.isCheckAllVisiable = false;
                this.children = [];
                return;
            }
            const data = list.map(item => {
                const { employschildren,employVoChildren, departmentChildren } = item;
                this.children = [...(employschildren || []), ...(departmentChildren || []), ...(employVoChildren || [])];
                // 处理子数据，区分部门和员工
                this.children.forEach(item => (item.type = item.depLevel && item.depLevel !== null ? 'department' : 'staff'));
                return {
                    ...item,
                    banDelete: true,
                    type: 'department'
                };
            });
            this.isCheckAllVisiable = false;

            return this.children;
        },
        childrenHandle(data) {
            if (!data) {
                return [];
            }
            const { departmentChildren, employVoChildren, employschildren } = data;
            const childrenData = [...(departmentChildren || []), ...(employschildren || []), ...(employVoChildren || [])];
            childrenData.forEach(item => {
                item.type = item.depLevel && item.depLevel !== null ? 'department' : 'staff';
                item.leaf = !(item.depLevel && item.depLevel !== null);
            });
            this.isCheckAllVisiable =
                childrenData.some(item => {
                    return item.leaf;
                }) && childrenData.length;
            return childrenData;
        },
        checkChange(data, a, b) {
            const isInclude = this.checkedNodeList.map(i=>i.id).includes(data.id)//当前点击节点是否存在选中的节点内
            if (!isInclude && (1 + this.checkedNodeList.length > this.maxCount)) {
                this.$message.warning(`最多只能选${this.maxCount}个人员！`);
                this.$refs.personTree.setCheckedKeys(
                    this.checkedNodeList.map(item => {
                        return item.id;
                    }),
                    false
                );
                return;
            }
            if (a) {
                if (
                    !this.checkedNodeList.find((item, index) => {
                        return item.id === data.id;
                    })
                ) {
                    this.checkedNodeList.push(data);
                }
            } else {
                let keyIndex = this.checkedNodeList.findIndex(items => items.id === data.id);
                if (keyIndex >= 0) {
                    this.checkedNodeList.splice(keyIndex, 1);
                }
            }
        },
        //设置权限框的状态
        setIsIndeterminate() {
            //  let treeSelectedNode = this.$refs.personTree.getCheckedKeys(true)
            if (!this.checkedNodeList.length || !this.$refs.personTree) {
                this.isCheckAll = false;
                this.isIndeterminate = false;
                return;
            }
            let treeData = this.$refs.personTree.data
                .filter(data => {
                    return data.leaf;
                })
                .map(item => {
                    return item.id;
                });
            let isAllExit = treeData.every(item => {
                return (
                    this.checkedNodeList.findIndex(item2 => {
                        return item2.id == item;
                    }) >= 0
                );
            });
            let isSomeExit = treeData.some(item => {
                return (
                    this.checkedNodeList.findIndex(item2 => {
                        return item2.id == item;
                    }) >= 0
                );
            });
            if (isAllExit) {
                this.isCheckAll = true;
                this.isIndeterminate = false;
            } else if (isSomeExit && !isAllExit) {
                this.checkAll = false;
                this.isIndeterminate = true;
            } else if (!isSomeExit) {
                this.isCheckAll = false;
                this.isIndeterminate = false;
            }
        },

        handleNodeClick(data, node, nodeCom) {
            this.handeleNodeExpend(data, node, nodeCom);
        },
        async handeleNodeExpend(data, node, nodeCom) {
            let name = data.name ? data.name : '';
            let item = { id: node.data.id, label: name, level: node.level, data: node.data };
            if (!node.isLeaf) {
                this.breadcrumbList.push(item);
                this.treeData = await this.getTreeData(data.id, node.level);
            }
            this.isCheckAll = false;
            this.isIndeterminate = false;
            this.$nextTick(() => {
                this.setIsIndeterminate();
            });
        },
        async handleBreadClick(item, index) {
            this.breadcrumbList.splice(index + 1, this.breadcrumbList.length - index - 1);
            this.setDataByBread();
        },
        async backToLevel() {
            this.breadcrumbList.splice(this.breadcrumbList.length - 1, 1);
            this.setDataByBread();
        },
        async setDataByBread() {
            if (this.breadcrumbList.length > 1) {
                let item = this.breadcrumbList[this.breadcrumbList.length - 1];
                this.treeData = await this.getTreeData(item.id, item.level);
            } else {
                this.treeData = await this.getTreeData('0', '0');
            }
            let CheckedKeys = this.checkedNodeList.map(item => {
                return item.id;
            });
            this.$nextTick(() => {
                this.$refs.personTree.setCheckedKeys(CheckedKeys, false);
                this.setIsIndeterminate();
            });
        },
        removeCheckedNode(item, index) {
            let keyIndex = this.checkedNodeList.findIndex(items => items.id === item.id);
            this.checkedNodeList.splice(keyIndex, 1);

            let CheckedKeys = this.checkedNodeList.map(item => {
                return item.id;
            });
            this.$refs.personTree.setCheckedKeys(CheckedKeys, false);
        },
        handleCancle() {
            this.$emit('update:dialogVisible', false);
            this.isDialogVisible = false;
        },
        handleCommit() {
            this.$emit('update:dialogVisible', false);
            this.$emit('checkedNodeChange', cloneDeep(this.checkedNodeList));
            this.isDialogVisible = false;
        },
        handleClose(done) {
            this.$emit('update:dialogVisible', false);
        }
    }
};
</script>
<style lang="scss" scoped>
/deep/ .el-select-dropdown__list {
    width: 470px !important;
    padding: 0;
}
.el-select-dropdown__item {
    height: auto !important;
    padding: 14px 24px !important;
    position: relative;

    .name_text {
        font-size: 16px;
        line-height: 16px;
    }

    .explan_txt {
        color: #8492a6;
        font-size: 13px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 8px;
        line-height: 14px;
    }

    body {
        .no-person {
            width: 466px;
            height: 66px;
            background: #f5f7fa;
            box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.06);
            border-radius: 4px;
            border: 1px solid #d8dce6;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #909399;
            li:hover {
                cursor: default !important;
            }
        }
        .my-autocomplete {
            margin-top: 5px !important;
            .content {
                display: flex;
                flex-direction: column;
                padding: 14px 0;
            }
            li.highlighted,
            li:hover {
                box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.06);
                border-radius: 4px;
                border: 1px solid #d8dce6;
                margin: 0 8px 0 5px;
            }
        }
    }
}

.el-select-dropdown__item {
    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 24px;
        height: 1px;
        width: 100%;
        background: #e7e9e9;
    }
    &:last-child {
        content: '';
    }
}
</style>
<style scoped lang="scss">
.addr {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    width: 413px;
    height: 16px;
    line-height: 16px;
}
.addpart {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    width: 413px;
    height: 14px;
    line-height: 14px;
    margin-top: 8px;
    text-overflow: ellipsis;
    overflow: hidden;
}
.adddep {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #909399;
    width: 413px;
    line-height: 16px;
    white-space: normal !important;
    margin-top: 8px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
/deep/ .el-dialog {
    .el-dialog__title {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #303133;
    }
    .el-dialog__body {
        padding: 0 24px 30px 24px;
    }
}

.mechanism {
  max-height: 450px;
  height: 450px;

    flex-wrap: wrap;
    .rowDiv {
        height: 100%;
        background: white;
        display: flex;
        width: 100%;
        flex-direction: row;
        background: white;
        .leftTitle,
        .rightTitle {
            display: flex;
            height: 50px;
            align-items: center;
            div {
                width: 12px;
                height: 12px;
                background: #c0c4cc;
                border-radius: 50%;
                margin-right: 5px;
            }
            span {
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #303133;
            }
        }
        .leftDiv {
            height: 100%;
            width: calc(50% - 10px);
            .leftBody {
                height: calc(100% - 50px);
                padding: 12px;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                .checkboxAll {
                    margin: 10px 0 5px 5px;
                    color: #303133;
                }
                .breadcrumb {
                    display: flex;
                    height: fit-content;
                    margin-top: 10px;
                    .el-icon-arrow-left {
                        cursor: pointer;
                        font-size: 16px;
                        margin: 6px 5px 0 0;
                        color: #0088ff;
                    }
                    /deep/ .el-breadcrumb__item {
                        padding: 5px 0;
                        color: #303133;
                        &:last-child {
                            span {
                                color: #909399 !important;
                            }
                        }
                        .breadName {
                            font: 15px;
                            font-family: 'Trebuchet MS';
                            &:hover {
                                color: #0088ff !important;
                                cursor: pointer;
                            }
                        }
                    }
                }
                .filter-tree {
                    flex: 1;
                    width: 100%;
                    margin-top: 5px;
                    overflow: hidden auto;
                    /deep/ .el-tree__empty-block {
                        background: url(./icons/img_no_data.png) left 50% top calc(50% - 80px) no-repeat;
                    }
                    /deep/ .el-tree-node {
                        padding-left: 5px;
                        height: 36px;
                        line-height: 36px;
                        .el-checkbox {
                            &.is-disabled {
                                visibility: hidden;
                            }
                        }
                    }
                    /deep/ .el-tree-node__content {
                        height: 36px;
                        line-height: 36px;
                        color: #303133;
                        .el-icon-arrow-right {
                            color: #909399 !important;
                        }
                    }
                    /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
                        position: absolute;
                        right: 0;
                        color: rgb(20, 141, 221);
                        font-size: 15px;
                    }

                    /deep/ .el-tree-node__content .is-leaf {
                        color: transparent !important;
                        cursor: default;
                    }

                    .bigSpan {
                        color: #303133;
                        .leftSpan {
                            color: #909399 !important;
                        }
                        .rightSpan {
                            width: 500px;
                            color: #909399;
                        }
                    }
                    .elseSpan {
                        font-size: 14px;
                        :first-child {
                            font-weight: 600;
                        }
                    }
                }
            }
        }
        .gap {
            width: 20px;
            height: 100%;
        }
        .rightDiv {
            width: calc(50% - 10px);
            position: relative;
            .cardDiv {
                height: calc(100% - 50px);
                overflow-y: auto;
                overflow-x: hidden;
                padding: 12px;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                background: #f5f7fa;
                .el-card {
                    margin: 5px;
                    border: none;
                    background: #f5f7fa;
                    /deep/ .el-card__body {
                        padding: 12px;
                    }
                    &:hover {
                        background: #f0f2f5;
                    }
                    .content {
                        display: flex;
                        position: relative;
                        img {
                            width: 18px;
                            height: 18px;
                            position: absolute;
                            right: 0;
                            cursor: pointer;
                        }
                    }
                }
            }

            .personCount {
                margin-left: 5px;
                color: #909399;
            }
        }
    }
}

// 人员选择器模糊查询
.treeSelectMenu{
  position: absolute!important;
  left: auto!important;
  top: auto!important;
  .el-select-dropdown__wrap{
    height: 412px;
    max-height: 412px;
  }
}

</style>
