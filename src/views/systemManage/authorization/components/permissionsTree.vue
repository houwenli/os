<template>
    <div>
        <div class="treeBox">
            <div class="treeSmallBox">
                <div class="title">功能权限</div>
                <div class="treeContent">
                    <div class="inputBox">
                        <el-select v-model="permissionType" @change="changeOrgType" :popper-append-to-body="false">
                            <el-option v-for="item in typeOpstion" :key="item.id" :label="item.value" :value="item"></el-option>
                        </el-select>
                    </div>
                    <ws-tree ref="tree" :defaultProps="treeProps" node-key="id" v-loading="fucloading" :tree-data="fucTree" :set-node-expand="setNodeExpand" class="fucTreeBox"></ws-tree>
                </div>
            </div>
            <!-- <div class="treeSmallBox" v-if="deptType == 0">
                <div class="title">机构权限</div>
                <div class="treeContent">
                <div  v-if='showCountyForOrg'>全国</div>
                    <ws-tree  v-else ref="tree" :defaultProps="treeProps" node-key="id" v-loading="loading" @load="loadNodeMech" lazy :set-node-expand="setNodeExpand"></ws-tree>
                </div>
            </div>
            <div class="treeSmallBox" v-if="deptType == 0">
                <div class="title">城市权限</div>
                <div class="treeContent">
                <div v-if='showCountyForCity'>全国</div>
                    <ws-tree  v-else ref="tree" :defaultProps="treeProps" node-key="id" :tree-data="cityTree" v-loading="cityloading" :set-node-expand="setNodeExpand"></ws-tree>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
// 帐号管理（详情，编辑）和职务授权公用的组件
import wsTree from '@/components/Tree';

export default {
    name: 'permissionsTree',
    components: { wsTree },
    props: {
        /**
         * 角色id
         */
        roleIds: {
            type: Array,
            default: () => [],
        },
        // 部门-也可以是叫组织 orgType
        deptType: {
            type: [String, Number],
            required: true,
        },
    },
    data() {
        return {
            treeProps: {
                id: 'id',
                label: 'name',
                children: 'children',
                isLeaf: true,
            },
            node: '',
            resolve: null,
            loading: false,
            fucloading: false,
            cityloading: false,
            //城市树数据
            cityTree: [],
            //功能树数据
            fucTree: [],
            timer: null,
            typeOpstion: [],
            perTypeOpstion: [
                {
                    value: 'web端oa总部',
                    clientType: 1,
                    orgType: 0,
                },
                {
                    value: 'web端oa一级机构',
                    clientType: 1,
                    orgType: 20,
                },
                {
                    value: 'web端oa二级机构',
                    clientType: 1,
                    orgType: 30,
                },
                {
                    value: 'web端oa实体店',
                    clientType: 1,
                    orgType: 40,
                },
                {
                    value: 'app总部',
                    clientType: 2,
                    orgType: 0,
                },
                {
                    value: 'app分公司',
                    clientType: 2,
                    orgType: 20,
                },
                {
                    value: 'app服务中心',
                    clientType: 2,
                    orgType: 30,
                },
                {
                    value: 'app实体店',
                    clientType: 2,
                    orgType: 40,
                },
            ],
            permissionType: '', //权限类型
            clientType: 1, //权限类型前缀
            orgType: this.$route.query.deptId, //权限类型后缀
            personelType: this.$route.query.type,
            id: this.$route.query.id,

            showCountyForOrg: false,
            showCountyForCity: false
        };
    },
    watch: {
        roleIds: {
            deep: true,
            handler: async function () {
              this.loadNodeMech(this.node, this.resolve)
              this.getCitytree()
              this.getPermissionType()
            }
        },
    },
    created() {
        // 避免重复调用
        if (this.roleIds.length !== 0) {
            this.getPermissionType();
            this.getCitytree();
        }
    },
    methods: {
        // 获取功能权限类型
        async getPermissionType () {
            let url = '';
            let params = {};
            url = '/authority/role/select';
            params = {
                op: 'selectUserClientOrgTypeByRoles',
                data: {
                    roleIdList: this.roleIds,
                },
            };
            try {
                const res = await this.$axios(url, params);

                // 后台设置为1.5s防抖， 1.5s内所有请求，都返回 code=1, msg='重复请求' data是[]  前端不关心中间的过程，只取最后一次结果
                if (res.code === 1 && res.msg === '响应成功') {
                  let data = JSON.parse(res.data);
                  if (data.length === 0) {
                      this.typeOpstion = [];
                      this.permissionType = '';
                      this.getFuctree();
                  } else {
                      this.perTypeOpstion.forEach(item => {
                          data.forEach(val => {
                              if (item.clientType == val.clientType && item.orgType == val.orgType) {
                                  val.value = item.value;
                              }
                          });
                      });
                      this.typeOpstion = data;
                      this.permissionType = this.typeOpstion[0];
                      this.orgType = this.typeOpstion[0].orgType;
                      this.clientType = this.typeOpstion[0].clientType;
                      this.getFuctree();
                  }
                }
            } catch (error) {}
        },
        //下拉框获取功能权限类型
        changeOrgType(item) {
            this.orgType = item.orgType;
            this.clientType = item.clientType;
            this.getFuctree();
        },
        //根据角色查询机构权限树懒加载
        async loadNodeMech(node, resolve) {
          try {
            if (node.level == 0) {
                this.loading = true;
                this.node = node;
                this.resolve = resolve;

                let arr = await this.getTree(this.roleIds);
                this.$nextTick(() => {
                    this.node.childNodes = [];
                    resolve(arr || []);
                });
                this.loading = false;
            }
            if (node.level > 0) {
                let arr = await this.getLoadTree(this.roleIds, node.data.id);
                this.$nextTick(() => {
                    resolve(arr || []);
                });
            }
          } catch (error) {
          }
        },
        //获取第一级树
        async getTree(roleIdList) {
            try {
                let data;
                data = {
                    op: 'rolesOrgTreeLazy',
                    data: { roleIdList, parentId: null, debounce: true },
                };

                let res = await this.$axios('/authority/role/select', data);
                if (res.code === 1 && res.msg === '响应成功') {
                    let data = JSON.parse(res.data) || []

                    if (data.length && data[0].id === -99) {
                      this.showCountyForOrg = true
                    } else {
                      this.showCountyForOrg = false
                    }

                    return data;
                }
            } catch {
                this.loading = false;
            }
        },
        //懒加载下一级接口
        async getLoadTree(roleIdList, parentId) {
            let data;
            data = {
                op: 'rolesOrgTreeLazy',
                data: { roleIdList, parentId, debounce: false },
            };
            let res = await this.$axios('/authority/role/select', data);
            if (res.code === 1 && res.msg === '响应成功') {
                let data = JSON.parse(res.data) || []
                if (data.length && data[0].id === -99) {
                  this.showCountyForOrg = true
                } else {
                  this.showCountyForOrg = false
                }
                return data;
            }
        },
        //根据角色查询功能树
        async getFuctree() {
            this.fucloading = true;
            let data;
            data = {
                op: 'rolesFuncTree',
                data: {
                    roleIdList: this.roleIds,
                    orgType: this.orgType,
                    clientType: this.clientType,
                },
            };

            try {
              const res = await this.$axios('/authority/role/select', data)

              if (res.code === 1 && res.msg === '响应成功') {
                let list = JSON.parse(res.data) || []
                this.fucTree = list;
                this.fucloading = false;


              }
            } catch (error) {

            } finally {
              this.fucloading = false;
            }
        },
        //根据角色查询城市树
        async getCitytree() {
            this.cityloading = true;
            let params;
            let url = '/authority/role/select';
            params = {
                op: 'rolesCityTree',
                data: { roleIdList: this.roleIds },
            }

            try {
                let res = await this.$axios(url, params);
                if (res.code === 1 && res.msg === '响应成功') {
                    let data = JSON.parse(res.data);
                    this.cityTree = data;
                    this.cityloading = false;

                    if (data.length && data[0].id === -99) {
                      this.showCountyForCity = true
                    } else {
                      this.showCountyForCity = false
                    }
                } else {
                    this.cityloading = false;
                }
            } catch (error) {}
        },
        //防止报错，勿删
        setNodeExpand(node, data) {}
    },
};
</script>

<style lang="scss" scoped>
.treeBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 600px;
    z-index: -1;
    .treeSmallBox {
        width: 33.3%;
        margin-right: 17px;
        height: 600px;
        position: relative;
        .title {
            height: 30px;
            font-size: 14px;
            font-weight: 500;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #303133;
            line-height: 30px;
            margin-bottom: 16px;
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
        .treeContent {
            height: 550px;
            border: 1px solid #dcdfe6;
            border-radius: 3px;
            padding: 16px 16px 16px 16px;
            overflow: auto;
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

            .fucTreeBox {
                overflow: visible;
                margin-top: 51px;
                height: auto;
            }
        }
    }
}
/deep/ .node-content-level1 {
    font-size: 14px !important;
}
/deep/ .el-loading-mask {
    z-index: 998;
}
/deep/ .treeBox .treeSmallBox:first-of-type .treeContent {
    padding-top: 0px;
}
/deep/.el-tree__empty-block {
    margin-top: 20px;
}

.county-btn {
  width: 160px;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid #DCDFE6;
  text-align: center;
  margin-top: 16px;
  background: #fff;
  color: #303133;
}
</style>
