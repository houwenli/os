<template>
    <div>
        <div class="right">
            <div class="box-card" v-show="isShow">
                <el-alert  title="3个月内未更新的草稿将被自动删除！" type="warning" @close="closeAlert" class="el-icon-warning"></el-alert>
            </div>
            <ws-table-el ref="table" v-bind="tableConfig" highlight-current-row :header-cell-style="{ background: '#F5F7FA' }">
                <!-- 数据表格部分 -->
                <template>
                    <ws-table-column-el prop="name" label="申请标题"></ws-table-column-el>
                    <ws-table-column-el prop="createBy" label="申请人" width="150px"></ws-table-column-el>
                    <ws-table-column-el prop="department" label="申请部门">
                        <template slot-scope="scope">
                            <p v-for="(item, index) in scope.row.department.split(',')" :key="index">{{ item }}</p>
                        </template>
                    </ws-table-column-el>
                    <ws-table-column-el prop="createDate" label="创建时间"></ws-table-column-el>
                    <ws-table-column-el prop="updateDate" label="修改时间"></ws-table-column-el>
                    <ws-table-column-el fixed="right" width="160" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                style="color: #0088ff"
                                @click="edit(scope.row.id, 'edit', scope.row.demandType == '2' ? 'jishu' : scope.row.demandType == '3' ? 'driver' : 'yewu')"
                                v-if="getModulePower('/workbench/BRrequirement').draftDetail"
                            >
                                编辑
                            </el-button>
                            <el-button type="text" style="color: #f05259" @click="remove(scope.row.id, 'remove')" v-if="getModulePower('/workbench/BRrequirement').delete">删除</el-button>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
        </div>

        <ws-footer>
            <el-button size="medium " @click="out">返回</el-button>
        </ws-footer>

        <el-dialog title="删除提示" :visible.sync="dialogVisible" width="30%">
            <span>删除将无法找回数据，确认是否删除？</span>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sure" v-if="getModulePower('/workbench/BRrequirement').delete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name: "BRrequirementDraft",
  data () {
    return {
      moduleName: '/workbench/BRrequirement',
      id: '',
      isShow: true,
      dialogVisible: false,
      tableConfig: {
        filterColumns: false,
        indexColumn: false,
        lazyQuery: {
          moduleName: '/workbench/BRrequirement',
          op: {
            selectList: 'draftList',
            selectCount: 'draftCount'
          }
        }
      }
    };
  },
  mounted () {
    this.isShow = this.$route.query.type
  },
  methods: {
    closeAlert () {
      this.isShow = false
    },
    sure () {
      this.dialogVisible = false;
      let params = {
        data: { id: this.id },
        op: 'delete'
      };
      this.$axios(this.getModuleUrl(params.op), params).then(res => {
        this.$refs.table.reset();
      });
    },
    getModuleUrl (op) {
      return this.$getModuleUrl(this.moduleName, op);
    },
    out () {
      this.$router.push({ path: this.moduleName, query: { type: 'back' } });
    },
    remove (id, type) {
      this.id = id;
      this.dialogVisible = true;
    },
    edit (id, name, type) {
      this.$router.push({ name: 'BRrequirement', query: { id, name, type } });
    }
  }
};
</script>
<style lang="scss" scoped>
.right {
    margin-bottom: 68px;
    background: #fff;
    border-radius: 8px;

    .box-card {
        width: 300px;
        padding-top: 24px;
        margin-left: 24px;
    }
}
</style>
