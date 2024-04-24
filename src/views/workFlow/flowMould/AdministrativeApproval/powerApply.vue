<template>
    <div class="detail-form-container">
        <!-- 发起信息 -->
        <div>
            <div class="ws-first-level-title">
                <div class="prefix"></div>
                审批发起信息
            </div>
            <el-row>
                <el-form label-width="160px">
                    <div class="ws-wrapper-panel">
                        <div class="ws-content-panel">
                            <el-col :span="12">
                                <el-form-item label="审批编号：">
                                    {{ dataObject.procdefNo }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="审批类型：">
                                    {{ dataObject.name }}
                                </el-form-item>
                            </el-col>

                            <el-col :span="12">
                                <el-form-item label="发起时间：">
                                    {{ dataObject.startTime }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="发起人：">
                                    {{ dataObject.startUserName }}
                                </el-form-item>
                            </el-col>

                            <el-col :span="24">
                                <el-form-item label="所属部门：">
                                    {{ dataObject.startDeptName }}
                                </el-form-item>
                            </el-col>
                        </div>
                    </div>
                </el-form>
            </el-row>
        </div>

        <!-- 权限时效 -->
        <div>
            <div class="ws-first-level-title">
                <div class="prefix"></div>
                权限信息
            </div>

            <el-row>
                <el-form label-width="160px">
                    <div class="ws-wrapper-panel">
                        <div class="ws-content-panel">
                            <!-- roleType=1总部权限; 2是分支机构的 -->
                            <template v-if="roleData.roleType === 1">
                                <el-col :span="12">
                                    <el-form-item label="申请类型：">
                                        {{ roleData.applyPermissionTypeText }}
                                    </el-form-item>
                                </el-col>

                                <el-col :span="12" v-if="roleData.applyPermissionType === 2">
                                    <el-form-item label="使用部门：">
                                        {{ roleData.deptName }}
                                    </el-form-item>
                                </el-col>
                            </template>
                            <el-col :span="12">
                                <el-form-item label="权限类型：">
                                    {{ dataObject.nodeFormJson.powerType == '永久权限' ? '永久权限' : '临时权限' }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="dataObject.nodeFormJson.powerType != '永久权限'">
                                <el-form-item prop="time" label="有效期至：">
                                    {{ $vuex.$baseMethod.formatData(dataObject.nodeFormJson.time) }}
                                </el-form-item>
                            </el-col>
                        </div>
                    </div>
                </el-form>
            </el-row>
        </div>

        <!-- 按照部门职务授权，才有角色信息positions字段 -->
        <div v-if="roleData.applyPermissionType === 2 || roleData.applyPermissionType === 3">
            <div class="ws-first-level-title">
                <div class="prefix"></div>

                {{roleData.applyPermissionType === 2 ? "角色信息" : "授权部门"}}
            </div>
            <el-tag class="pointer" v-for="(tag, index) in roleInfoList" :key="index" :closable="false" type='info'>
                {{ tag.name }}
            </el-tag>
        </div>

         <div>
            <div class="ws-first-level-title">
                <div class="prefix"></div>
                申请原因
            </div>
            <div class="ws-wrapper-panel">
                <div class="ws-content-panel">
                    <el-form label-width="160px">
                        <el-form-item label="申请原因：">
                            <div class="apply-reason">{{ dataObject.nodeFormJson.textarea }}</div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 权限展示 -->
        <div class="role">
            <div>
                <div class="ws-first-level-title">
                    <div class="feature-header">
                        <div class="left">
                            <div class="prefix"></div>
                            功能权限
                        </div>
                        <div class="right-export" v-if='oaPowerList.export'>
                            <el-button plain size="mini" style="width: 110px" @click="onExport">导出</el-button>
                        </div>
                    </div>
                </div>
                <el-row :gutter='12'>
                    <el-col :span="8">
                        <div class="tips">
                            <span></span>
                            <p>OA系统</p>
                        </div>
                        <div class="funcRoleDetails">
                            <ws-tree
                                v-if="showTree"
                                ref="tree"
                                :defaultProps="defaultProps"
                                node-key="id"
                                v-loading="oaTreeDataLoading"
                                :set-node-expand="setNodeExpand"
                                @load="(node, resolve) => loadNodeMech(node, resolve, 'oa')"
                                lazy
                            ></ws-tree>
                        </div>
                    </el-col>
                    <!-- oaTree -->
                    <el-col :span="8">
                        <div class="tips">
                            <span></span>
                            <p>云办公App</p>
                        </div>
                        <div class="funcRoleDetails">
                            <ws-tree
                                v-if="showTree"
                                ref="tree"
                                :defaultProps="defaultProps"
                                node-key="id"
                                v-loading="wsfTreeDataLoading"
                                :set-node-expand="setNodeExpand"
                                @load="(node, resolve) => loadNodeMech(node, resolve, 'wsf')"
                                lazy
                            ></ws-tree>
                        </div>
                    </el-col>
                    <!-- 总部权限申请 才会展示DataBI小程序 权限 -->
                    <el-col v-if='dataObject.nameId === 27'  :span="8">
                        <div class="tips">
                            <span></span>
                            <p>DataBI小程序</p>
                        </div>
                        <div class="funcRoleDetails">
                          <!--      v-loading="wsfTreeDataLoading" -->
                            <ws-tree
                                v-if="showTree"
                                ref="tree"
                                :defaultProps="defaultProps"
                                node-key="id"
                                :set-node-expand="setNodeExpand"
                                @load="(node, resolve) => loadNodeMech(node, resolve, 'databi')"
                                lazy
                            ></ws-tree>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!-- 总部权限申请 - 才会展示 数据Tree -->
            <div v-if="showDataPermission">
                <div class="ws-first-level-title">
                    <div class="prefix"></div>
                    数据权限
                </div>
                <el-row :gutter='12'>
                    <el-col :span="8">
                        <div class="tips">
                            <span></span>
                            <p>机构权限</p>
                        </div>
                        <div class="county-btn" v-if='showCountyForOrg'>全国</div>
                        <div class="funcRoleDetails" v-else>
                            <ws-tree
                                v-if="showTree"
                                ref="tree"
                                :defaultProps="defaultProps"
                                node-key="id"
                                v-loading="orgTreeDataLoading"
                                :set-node-expand="setNodeExpand"
                                @load="this.getOrgTreeData"
                                lazy
                            ></ws-tree>
                        </div>
                    </el-col>
                    <!-- cityTree -->
                    <!-- :style="{ paddingLeft: '12px' }" -->
                    <el-col  :span="8">
                        <div class="tips">
                            <span></span>
                            <p>城市权限</p>
                        </div>
                        <div class="county-btn" v-if='showCountyForCity'>全国</div>
                        <div class="funcRoleDetails" v-else>
                            <ws-tree
                                v-if="showTree"
                                ref="tree"
                                @load="this.getCityTreeData"
                                lazy
                                v-loading="cityTreeDataLoading"
                                :defaultProps="defaultProps"
                                node-key="id"
                                :set-node-expand="setNodeExpand"
                            ></ws-tree>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import wsTree from '@/components/Tree';

const applyPermissionTypeMap = {
  // 个人权限
  1: '个人申请',
  // 部门职务权限
  2: '按职务授权',
  // 部门权限 - oa6.9新增分类
  3: '按部门申请'
}

export default {
  name: 'powerApply',

  components: {
    wsTree
  },

  props: {
    dataObject: {
      type: Object,
      default: () => {
        return {
          nodeFormJson: {
            clientType: "",
            roleId: "",
            textarea: "",
            time: "",
            roleType: "",
            type: null,
            powerType: "",
            funcType: "",
            nameId: ''
          }
        }
      },
    },
  },
  data () {
    return {
      // 权限统计
      roleData: {
        validTime: '',
        type: '',
        menuTree: [],
        applyPermissionType: '',
        deptName: '',
        positionNames: []
      },
      // 权限时效信息-废弃-无引用
      roleFrom: {
        textarea: '',
        orgType: '',
        time: '',
      },


      // 机构数据
      defaultProps: {
        id: 'id',
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf'
      },

      orgTreeDataLoading: false,
      cityTreeDataLoading: false,
      oaTreeDataLoading: false,
      wsfTreeDataLoading: false,

      selectPositionId: null,

      moduleName: '/index/todo',

      // 机构权限展示全国
      showCountyForOrg: false,

      // 城市权限展示全国按钮
      showCountyForCity: false,

      roleInfoList: []
    }
  },

  computed: {
    /**
     * 当2个树的请求入参都有，才展示，然后触发loadNodeMech 方法
     */
    showTree () {
      return this.dataObject.nodeFormJson.roleId && this.selectPositionId
    },

    /**
     * 总部权限申请-才展示数据权限，总区，大区没有
     */
    showDataPermission() {
      return this.dataObject.nameId === 27 &&  this.roleData.orgType === 0
    }
  },

  mounted () {
    this.getRoleData()
  },

  methods: {
    /**
     * 查询角色信息详情
     */
    async getRoleData () {
      try {
        let param = {
          op: 'personDetail',
          data: {
            id: this.dataObject.nodeFormJson.roleId,
          },
        };

        let roleRes = await this.$axios('/authority/permissionApply/select', param);
        let data = JSON.parse(roleRes.data);

        // 申请类型
        data.applyPermissionTypeText = applyPermissionTypeMap[data.applyPermissionType] || ''

        // 首页-总部权限申请-按照职务授权申请的才有值
        data.positions = data.positions || []

        // 按照部门权限申请
        if (data.applyPermissionType === 3) {
          // 按照部门授权-申请的才有值
          data.deptNames = data.deptNames || []
          this.roleInfoList = data.deptNames.map(p => {
            return {name: p}
          })
        }

        if (data.applyPermissionType === 2) {
          this.roleInfoList = data.positions
        }

        this.roleData = data

        // roleType=1总部，且applyPermissionType=2才有positions字段
        if (data.roleType === 1 && data.positions.length) {
          // 当存在角色时，设置默认角色高亮
          this.selectPositionId = data.positions[0].id
        } else {
          // 只是为了让树能触发懒加载
          this.selectPositionId = true
        }

      } catch (error) {
        console.log(error);
      }
    },

    setNodeExpand () { },

    //根据角色查询机构权限树懒加载
    async loadNodeMech (node, resolve, type) {
      let roleId = this.dataObject.nodeFormJson.roleId
      let positionId = this.selectPositionId

      let id = [null, undefined].includes(node.data.id) ? null: node.data.id ;
      let data = {}

      // 总部权限申请
      if (this.roleData.applyPermissionType === 2) {
        data = {
          city: {
            op: 'selectPermissionCityTreeLazy',
            data: { roleId, id, positionId },
          },
          org: {
            op: 'selectPermissionOrgTreeLazy',
            data: { roleId, id, positionId },
          },
          oa: {
            op: 'selectPermissionMenuTreeLazy',
            data: { roleId, id, clientType: 1, positionId },
          },
          wsf: {
            op: 'selectPermissionMenuTreeLazy',
            data: { roleId, id, clientType: 2, positionId },
          },
          databi: {
            op: 'selectPermissionMenuTreeLazy',
            data: { roleId, id, clientType: 3, positionId }
          }
        }[type];
      } else {
        // 分支机构的权限申请
        data = {
          city: {
            op: 'selectPermissionCityTreeLazy',
            data: { roleId, id },
          },
          org: {
            op: 'selectPermissionOrgTreeLazy',
            data: { roleId, id },
          },
          oa: {
            op: 'selectPermissionMenuTreeLazy',
            data: { roleId, id, clientType: 1 },
          },
          wsf: {
            op: 'selectPermissionMenuTreeLazy',
            data: { roleId, id, clientType: 2 },
          },
          databi: {
            op: 'selectPermissionMenuTreeLazy',
            data: { roleId, id, clientType: 3 },
          }
        }[type];
      }

      try {
        if (node.level == 0) {
          this[`${type}TreeDataLoading`] = true;
          let arr = await this.getTree(data);
          resolve(arr || []);
          return arr
        } else {
          let arr = await this.getLoadTree(data);
          resolve(arr || [])
          return arr
        }

      } catch (error) {
        console.log(error, '报错')
      } finally {
        this[`${type}TreeDataLoading`] = false;
      }

    },
    //获取第一级树
    async getTree (data) {
      let res = await this.$axios('/authority/permissionApply/select', data);
      if (res.code == 1) {
        let data = JSON.parse(res.data);
        return data;
      }
    },
    //懒加载下一级接口
    async getLoadTree (data) {
      let res = await this.$axios('/authority/permissionApply/select', data);
      if (res.code == 1) {
        let data = JSON.parse(res.data);
        return data;
      }
    },

    /**
     * 导出-到工作台-下载记录-文件下载查看
     */
    async onExport () {
      if (!this.dataObject.nodeFormJson.roleId) return

      try {
        const url = this.$getModuleUrl('/index/todo', 'export')

        await this.$axios(url, {
          op: 'export',
          data: {
            id: this.dataObject.nodeFormJson.roleId
          }
        })

        this.$message.success('导出成功')
      } catch (error) {
      }
    },

    async getOrgTreeData(node, resolve) {
      const list = await this.loadNodeMech(node, resolve, 'org') || []
      if (list.length && list[0].id === -99) {
        this.showCountyForOrg = true
      }
    },

    async getCityTreeData(node, resolve) {
      const list = await this.loadNodeMech(node, resolve, 'city') || []
      if (list.length && list[0].id === -99) {
        this.showCountyForCity = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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

.detail-form-container {
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 16px;
}
.ws-wrapper-panel {
    overflow: hidden;
}
// 一级标题
.ws-first-level-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #303133;
    margin-top: 32px;
    margin-bottom: 16px;

    .prefix {
        width: 4px;
        height: 16px;
        background: #f05259;
        border-radius: 0px 84px 84px 0px;
        margin-right: 8px;
    }
}

.ws-content-panel {
    width: 100%;
    background: #f5f7fa;
    border-radius: 8px;

    padding: 20px 0;
    box-sizing: border-box;

    // 清除栅格化布局的浮动，导致高度丢失问题
    &::after {
        display: block;
        content: '';
        clear: both;
    }

    /deep/.el-form-item {
        margin-bottom: 0;
    }
}


.feature-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
  }
}

.pointer {
    margin-right: 20px;
}

.role {
    .text {
        padding: 20px 102px 2px 82px;
        background: #f5f7fa;
        border-radius: 8px;
        min-height: 50px;
    }
    .tips {
        height: 16px;
        span {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #c0c4cc;
            border-radius: 50%;
            margin-right: 8px;
        }
        i {
            font-style: normal;
            color: #f05259;
        }
        font-size: 12px;
        font-weight: 400;
        color: #303133;
        p {
            display: inline-block;
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            margin-right: 8px;
        }
    }
    .tipsCity {
        margin-top: 20px;
    }
    .funcRoleDetails,
    .orgRoleDetails,
    .cityRoleDetails {
        overflow: auto;
        height: 410px;
        width: 100%;
        margin-top: 16px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        padding: 20px 16px;
    }
    .orgRoleDetails,
    .cityRoleDetails {
        height: auto;
    }
}

.apply-reason {
    word-wrap: break-word;
}
.box {
    margin-bottom: 60px;
}
/deep/.el-form-item__label {
    font-weight: 400;
}

/deep/.ws-table-warp .option-box {
    margin-top: 0;
    margin-bottom: 0;
}
.ws-table-warp .search-wrap .search-item {
    margin-top: 16px;
    padding-left: 0;
}

/deep/.ws-table-warp .paginationClass {
    height: 40px;
    padding: 5px 0;
    background: #f5f7fa;
    .el-pagination__editor.el-input {
        .el-input__inner {
            background: #f5f7fa;
        }
    }
    .btn-next,
    .btn-prev,
    .el-pager li {
        background: #f5f7fa;
    }
    .el-pagination .el-select .el-input .el-input__inner {
        background: #f5f7fa;
    }
}

/deep/ .node-content-level1 {
    font-size: 14px !important;
}
/deep/.el-loading-mask {
    z-index: 998 !important;
}
</style>
