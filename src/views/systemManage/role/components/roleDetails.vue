<template>
    <div>
        <div class="treeBox">
            <div :class="roleType === 1 ? 'treeSmallBox' : 'treeSmall'">
                <!-- <div class="head" v-if="roleType === 1">
                    <el-radio-group v-model="complaint" @change="onChangeFeatureMode">
                        <el-radio-button label="web">Web端oa</el-radio-button>
                        <el-radio-button label="app">云办公App</el-radio-button>
                        <el-radio-button label="applet">DataBI小程序</el-radio-button>
                    </el-radio-group>
                </div> -->
                <div class="title">{{ roleType === 1 ? '功能权限' : 'Web端OA系统功能权限' }}</div>
                <div class="treeContent">
                    <ws-tree
                        v-show="complaint == 'web'"
                        emptyText="当前模块无内容选中"
                        :defaultProps="treeProps"
                        node-key="id"
                        v-loading="webloading"
                        :tree-data="webTree"
                        :set-node-expand="setNodeExpand"
                    ></ws-tree>
                    <ws-tree
                        v-show="complaint == 'app'"
                        emptyText="当前模块无内容选中"
                        :defaultProps="treeProps"
                        node-key="id"
                        v-loading="apploading"
                        :tree-data="appTree"
                        :set-node-expand="setNodeExpand"
                    ></ws-tree>
                    <ws-tree
                        v-show="complaint == 'applet'"
                        emptyText="当前模块无内容选中"
                        :defaultProps="treeProps"
                        node-key="id"
                        v-loading="appletloading"
                        :tree-data="appletTree"
                        :set-node-expand="setNodeExpand"
                    ></ws-tree>
                </div>
            </div>

            <!-- <div v-if="roleType == 1 && orgType == 0" class="treeSmallBox">
                <div class="head"></div>
                <div class="title">机构权限</div>
                <div class="treeContent" >
                    <div v-if='showCountyForOrg'>全国</div>
                    <ws-tree ref="tree" v-else emptyText="当前模块无内容选中" :defaultProps="treeProps" node-key="id" v-loading="cityLoading" @load="this.getOrgTreeData" lazy :set-node-expand="setNodeExpand"></ws-tree>
                </div>
            </div>
            <div v-if="orgType == 0 || orgType == 20 || orgType == 30 || orgType == 40" :class="roleType === 1 ? 'treeSmallBox' : 'treeSmall'">
                <div class="head" v-if='roleType === 1'></div>
                <div class="title">{{ roleType === 1 ? '城市权限' : '云办公App功能权限' }}</div>

                <div class="treeContent" >
                  <div v-if='showCountyForCity'>全国</div>
                  <ws-tree ref="tree" v-else  emptyText="当前模块无内容选中" :defaultProps="treeProps" node-key="id" :tree-data="cityTree" v-loading="cityLoading" :set-node-expand="setNodeExpand"></ws-tree>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
import wsTree from '@/components/Tree';
export default {
    name: 'roleDetails',
    components: { wsTree },
    props: {
        roleIds: {
            type: Array,
            default: () => {},
        },
        // 机构类型/角色层级(0_总部;4_总区;5_大区;20_分公司;30_服务中心;40_实体店)
        orgType: {
          type: [String, Number]
        },
        // 权限类型(1_总部权限;2_分支机构权限)
        roleType: {
          type: Number,
          require: true
        }
    },

    data() {
        return {
            treeProps: {
                id: 'id',
                label: 'name',
                children: 'children',
                isLeaf: 'isLeaf',
            },
            apploading: false,
            webloading: false,
            cityLoading: false,
            appletloading: false,
            //城市树数据
            cityTree: [],
            //功能树数据
            appTree: [],
            webTree: [],
            appletTree: [],
            timer: null,
            complaint: 'web',
            routeType: this.$route.query,
            type: '',

            showCountyForOrg: false,
            showCountyForCity: false
        };
    },

    created() {
        this.getWebtree(this.orgType);

        if(this.roleType == 2) {
            // 万顺福app的数据  后端做了防抖2.5秒后调用
            this.cityLoading = true;
            setTimeout(()=>{
                this.getWsAppTree()
            },2500)
        } else {
            // 城市授权数据
            this.getCitytree();
        }

    },
    methods: {
        //根据角色查询机构权限树懒加载
        async loadNodeMech(node, resolve) {
            if (node.level == 0) {
                let arr = await this.getTree(this.roleIds) || []
                resolve(arr);
                return arr
            }
            if (node.level > 0) {
                let arr = await this.getLoadTree(this.roleIds, node.data.id) || []
                resolve(arr || [])

                return arr
            }
        },
        //获取第一级树
        async getTree(roleIdList) {
            let res = await this.$axios('/authority/role/select', {
                op: 'rolesOrgTreeLazy',
                data: { roleIdList, parentId: null, debounce: true },
            });
            if (res.code == 1) {
                let data = JSON.parse(res.data);
                return data;
            }
        },
        //懒加载下一级接口
        async getLoadTree(roleIdList, parentId) {
            let res = await this.$axios('/authority/role/select', {
                op: 'rolesOrgTreeLazy',
                data: { roleIdList, parentId, debounce: false },
            });
            if (res.code == 1) {
                let data = JSON.parse(res.data);
                this.fucloading = false;
                return data;
            }
        },
        //根据角色查询功能树
        getApptree(orgType) {
            this.apploading = true;
            this.$axios('/authority/role/select', {
                op: 'rolesFuncTree',
                data: { roleIdList: this.roleIds, orgType, clientType: 2 },
            }).then(res => {
                let data = JSON.parse(res.data);
                if (this.roleType == 2) {
                    this.cityTree = data;
                    this.cityLoading = false;
                } else {
                    this.appTree = data;
                    this.apploading = false;
                }
            });
        },
        getWebtree(orgType) {
            this.webloading = true;
            this.$axios('/authority/role/select', {
                op: 'rolesFuncTree',
                data: { roleIdList: this.roleIds, orgType, clientType: 1 },
            }).then(res => {
                let data = JSON.parse(res.data);
                this.webTree = data;
                this.webloading = false;
            });
        },
        getApplettree(orgType) {
            this.webloading = true;
            this.$axios('/authority/role/select', {
                op: 'rolesFuncTree',
                data: { roleIdList: this.roleIds, orgType, clientType: 3 },
            }).then(res => {
                let data = JSON.parse(res.data);
                this.appletTree = data;
                this.appletloading = false;
            });
        },
        //根据角色查询城市树
        getCitytree() {
            this.cityLoading = true;
            this.$axios('/authority/role/select', {
                op: 'rolesCityTree',
                data: { roleIdList: this.roleIds },
            }).then(res => {
                let data = JSON.parse(res.data);
                this.cityTree = data || []
                if (data.length && data[0].id === -99) {
                  this.showCountyForCity = true
                }
                this.cityLoading = false;
            });
        },
        async getWsAppTree() {
            try {
                const res = await this.$axios('/authority/role/select', {
                    op: 'rolesFuncTree',
                    data: { roleIdList: this.roleIds, orgType:this.orgType, clientType: 2 },
                })
                if(res.code == 1) {
                    let data = JSON.parse(res.data);
                    this.cityTree = data || []
                }
            } catch (error) {

            } finally {
              this.cityLoading = false;
            }
        },
        //防止报错，勿删
        setNodeExpand(node, data) {},

        /**
         * 切换功能授权-才调用接口
         * 这里的接口和账号管理详情接口是一样的，后端做了防抖，不能并发请求同一个接口
         */
        onChangeFeatureMode(value) {
          if (value === 'app') {
            this.getApptree(this.orgType);
          }

          if (value === 'applet') {
            this.getApplettree(this.orgType)
          }
        },

        async getOrgTreeData(node, resolve) {
          const list = await this.loadNodeMech(node, resolve) || []
          if (list.length && list[0].id === -99) {
            this.showCountyForOrg = true
          }
        }
    }
};
</script>

<style lang="scss" scoped>
.treeBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    .treeSmallBox {
        width: 33.3%;
        margin-right: 17px;
    }
    .treeSmall {
        width: 50%;
        margin-right: 17px;
    }
    .title {
        height: 30px;
        font-size: 14px;
        font-weight: 500;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #303133;
        line-height: 30px;
        margin-bottom: 16px;
        &:before {
            content: '';
            height: 12px;
            width: 12px;
            display: inline-block;
            background-color: #c0c4cc;
            border-radius: 50%;
            margin-right: 8px;
        }
    }
    .head {
        height: 22px;
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        margin: 16px 0;
    }
    .treeContent {
        height: 580px;
        border: 1px solid #dcdfe6;
        border-radius: 3px;
        padding: 16px 0 16px 16px;
        overflow: auto;
    }
}
/deep/ .el-radio-button--medium .el-radio-button__inner {
    width: 124px !important;
    height: 30px !important;
    padding: 8px 12px 13px;
}
/deep/ .node-content-level1 {
    font-size: 14px !important;
}
</style>
