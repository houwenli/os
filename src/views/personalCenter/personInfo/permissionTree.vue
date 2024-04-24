<template>
    <div class="permission-wrap">
        <el-row style="width: 100%">
            <el-col class="tree-wrap" :span="8">
                <div class="mr">
                    <span class="tree-title">功能权限</span>
                    <div class="filter-tree">
                        <div class="inputBox">
                            <el-select v-model="permissionType" @change="changeOrgType" :popper-append-to-body="false">
                                <el-option v-for="item in perTypeOpstion" :key="item.id" :label="item.value" :value="item"></el-option>
                            </el-select>
                        </div>
                        <ws-tree v-if="oaPowerList.employFuncTree" v-loading="funcLoading" ref="tree" nodeKey="employFuncTree" :treeData="funcData" :defaultProps="treeProps"></ws-tree>
                    </div>
                </div>
            </el-col>
            <el-col class="tree-wrap" :span="8">
                <div class="mr">
                    <span class="tree-title">机构权限</span>
                    <ws-tree
                        v-if="oaPowerList.employOrgTree"
                        v-loading="orgLoading"
                        class="filter-tree"
                        ref="tree"
                        @load="loadNode"
                        :lazy="true"
                        nodeKey="id"
                        :treeData="orgData"
                        :defaultProps="treeProps"
                    ></ws-tree>
                </div>
            </el-col>
            <el-col class="tree-wrap" :span="8">
                <div class="mr">
                    <span class="tree-title">城市权限</span>
                    <ws-tree v-if="oaPowerList.employCityTree" v-loading="cityLoading" class="filter-tree" ref="tree" nodeKey="employCityTree" :treeData="cityData" :defaultProps="treeProps"></ws-tree>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import wsTree from '../../../components/Tree';
export default {
    name: 'permissionTree',
    components: {
        wsTree
    },
    data() {
        return {
            moduleName: '/personalCenter/personInfo',
            requestUrl: '/authority/personalCenter/select',
            funcData: [],
            orgData: [],
            cityData: [],
            funcLoading: false,
            orgLoading: false,
            cityLoading: false,
            treeProps: {
                label: 'name',
                value: 'id',
                children: 'children',
                isLeaf: 'isLeaf'
            },
            perTypeOpstion: [
                {
                    value: 'web端oa总部',
                    clientType: 1,
                    orgType: 0
                },
                {
                    value: 'web端oa一级机构',
                    clientType: 1,
                    orgType: 20
                },
                {
                    value: 'web端oa二级机构',
                    clientType: 1,
                    orgType: 30
                },
                {
                    value: 'web端oa实体店',
                    clientType: 1,
                    orgType: 40
                },
                {
                    value: 'app总部',
                    clientType: 2,
                    orgType: 0
                },
                {
                    value: 'app分公司',
                    clientType: 2,
                    orgType: 20
                },
                {
                    value: 'app服务中心',
                    clientType: 2,
                    orgType: 30
                },
                {
                    value: 'app实体店',
                    clientType: 2,
                    orgType: 40
                }
            ],
            permissionType: '', //权限类型
            clientType: 1, //权限类型前缀
            orgType: 0 //权限类型后缀
        };
    },
    created() {
        this.getTreeData('employFuncTree');
        // this.getTreeData('employOrgTree')
        this.getTreeData('employCityTree');
    },
    methods: {
        async getUserClientOrgType() {
            let param = {
                op: 'selectUserClientOrgType'
            };
            await this.$axios('/authority/personalCenter/select ', param).then(res => {
                this.perTypeOpstion = this.filter(JSON.parse(res.data));
            });
        },
        filter(data) {
            let perTypeOpstion = [];
            data.forEach(item => {
                this.perTypeOpstion.forEach(item2 => {
                    if (item.orgType + item.clientType === item2.orgType + item2.clientType) {
                        perTypeOpstion.push(item2);
                    }
                });
            });
            this.permissionType = perTypeOpstion[0];
            return perTypeOpstion;
        },
        //下拉框获取功能权限类型
        changeOrgType(item) {
            this.orgType = item.orgType;
            this.clientType = item.clientType;
            this.getTreeData('employFuncTree','change');
        },
        async loadNode(node, resolve) {
            let vm = this;

            if (node.level === 0) {
                let arr = await vm.getOrgTree();
                resolve(arr);
            }
            if (node.level >= 1) {
                let childrenData = await this.getOrgTree(node.data.id);
                resolve(childrenData || []);
            }
        },

        async getOrgTree(id = null) {
            let vm = this;
            let param = {
                op: 'employOrgTreeLazy',
                data: JSON.stringify({ parentId: id })
            };
            id === '0' && (vm.orgLoading = true);
            try {
                let res = await vm.$axios('/authority/personalCenter/select', param);
                vm.orgLoading = false;
                if (res.code == 1) {
                    let orgList = res.data ? JSON.parse(res.data) : [];
                    return orgList;
                }
            } catch (err) {
                vm.orgLoading = false;
                throw err;
            }
        },

        // 获取组织架构数据
        async getTreeData(op,type = '') {
            let param = {
                op
            };
            if (op === 'employFuncTree') {
                if(type !== 'change'){
                    await this.getUserClientOrgType();
                        this.orgType = this.perTypeOpstion[0].orgType,
                        this.clientType = this.perTypeOpstion[0].clientType
                }
                param.data = {
                    orgType: this.orgType,
                    clientType: this.clientType
                };
            }
            this.funcLoading = op === 'employFuncTree' ? true : this.funcLoading;
            // this.orgLoading = op === 'employOrgTree' ? true : this.orgLoading
            this.cityLoading = op === 'employCityTree' ? true : this.cityLoading;
            this.$axios(this.requestUrl, param)
                .then(res => {
                    if (res.code == 1) {
                        let result = JSON.parse(res.data);
                        switch (op) {
                            case 'employFuncTree':
                                this.funcData = result;
                                this.funcLoading = false;
                                break;
                            // case 'employOrgTree':
                            //   this.orgData = result
                            //   this.orgLoading = false
                            //   break;
                            case 'employCityTree':
                                this.cityData = result;
                                this.cityLoading = false;
                                break;
                        }
                    }
                })
                .catch(() => {
                    this.funcLoading = op === 'employFuncTree' ? false : this.funcLoading;
                    this.orgLoading = op === 'employOrgTree' ? false : this.orgLoading;
                    this.cityLoading = op === 'employCityTree' ? false : this.cityLoading;
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.permission-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tree-wrap {
        width: 33%;
    }
    .mr {
        margin-right: 17px;
        position: relative;
    }
    .tree-title {
        font-size: 14px;
        font-weight: 600;
        font-family: PingFangSC-Regular, PingFang SC;
        &::before {
            content: '';
            height: 12px;
            width: 12px;
            display: inline-block;
            background-color: #c0c4cc;
            border-radius: 50%;
            margin-right: 8px;
        }
    }
    .filter-tree {
        height: 427px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        margin: 16px 17px 32px 0;
        overflow: auto;
        padding: 16px;
        font-weight: 400;
        width: 100%;
        .inputBox {
            background: rgb(255, 255, 255);
            width: calc(100% - 32px);
            position: absolute;
            z-index: 19;
            height: 50px;
            display: flex;
            flex-direction: column-reverse;
            /deep/ .el-select {
                width: calc(100% - 2px);
                z-index: 20;
            }
        }
        /deep/.ws-tree-warp{
            height:auto;
        }
        /deep/ .el-tree-node__children {
            overflow: visible;
        }
        /deep/ .el-icon-caret-right:before {
            font-size: 20px;
        }
        /deep/ .el-tree-node__label {
            font-family: PingFangSC-Medium, PingFang SC;
            font-size: 16px;
            font-weight: 400;
        }
        /deep/ .node-content {
            font-family: PingFangSC-Regular, PingFang SC;
            font-size: 14px;
            color: #303133;
        }
        /deep/ .node-content-level1 {
            font-size: 14px;
        }
        /deep/ .node-content-level2 {
            color: #303133;
        }
    }
    /deep/ .el-row .tree-wrap:first-of-type .filter-tree {
        padding-top: 0px;
    }
    /deep/ .el-row .tree-wrap:first-of-type .el-tree {
        margin-top: 51px !important;
    }
    /deep/.el-tree__empty-block{
        margin-top: 20px;
    }
}
</style>
