<template>
    <div>
      <ws-table-el ref="table" v-bind="tableConfig" :col="8">
          <template #search>
            <search-group>
                  <label for>业务类型：</label>
                  <el-select style="width: 100%" v-model.trim="searchOptions.category" filterable placeholder="请选择" clearable>
                      <el-option v-for="item of businessTypeOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
                  </el-select>
              </search-group>
              <search-group>
                  <label for>包含账号组：</label>
                  <el-input v-model.trim="searchOptions.accountGroup" :maxlength="11" placeholder="请输入账号组名称" clearable></el-input>
              </search-group>
              <search-group>
                  <label for>包含指定成员：</label>
                  <el-input v-model.trim="searchOptions.userName" :maxlength="11" placeholder="请输入指定成员名称" clearable></el-input>
              </search-group>
              <search-group>
                <label for>工作流名称：</label>
                <el-select v-model="searchOptions.flowName" placeholder="请选择" min-width="353px" filterable clearable>
                      <el-option v-for="item in checkTypeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                  </el-select>
            </search-group>
              <search-group>
                  <label for>状态：</label>
                  <el-select style="width: 100%" v-model.trim="searchOptions.status" filterable placeholder="请选择" clearable>
                      <el-option v-for="item of defStatesOptions" :label="item.name" :value="item.value" :key="item.value"></el-option>
                  </el-select>
              </search-group>
              <search-group>
                  <label for>最后操作时间：</label>
                  <ws-date-range :intervalTime="1000" :startTime.sync="searchOptions.createDateFrom" :endTime.sync="searchOptions.createDateTo"></ws-date-range>
              </search-group>
          </template>
          <template #options>
              <div style="float: right">
                  <el-button-group v-if="powerList.all">
                      <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                      <ws-throttle>
                          <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                      </ws-throttle>
                  </el-button-group>
              </div>
          </template>
          <template>
              <ws-table-column-el prop="name" label="工作流名称"></ws-table-column-el>
              <ws-table-column-el prop="categoryName" label="业务类型"></ws-table-column-el>
              <ws-table-column-el prop="nodeNum" label="节点数" width="85px"></ws-table-column-el>
              <ws-table-column-el prop="status" label="状态" >
                  <template slot-scope="scope" prop="status">
                      <span class="wait" v-if="scope.row.status == 2">启用</span>
                      <span class="stop" v-if="scope.row.status == 4">停用</span>
                  </template>
              </ws-table-column-el>
              <ws-table-column-el prop="lastUpateUserName" label="最后操作人"></ws-table-column-el>
              <ws-table-column-el prop="lastUpateTime" label="最后操作时间"></ws-table-column-el>
              <ws-table-column-el label="操作" width="247px" fixed="right">
                  <template slot-scope="scope">
                      <el-button v-if="powerList.detail" type="text" @click="operationJump('flowDetail', '', scope.row)" class="c0088ff">详情</el-button>
                      <el-button v-if="powerList.updateProcDef" type="text" @click="operationJump('addTaskFlow', 'edit', scope.row)" class="c0088ff">编辑</el-button>
                      <el-button v-if="scope.row.status == 2 && powerList.disableProcDef" type="text" class="c0088ff" @click="tableOperation(scope.row.id, 'disable')">停用</el-button>
                      <el-button v-if="showEnableButton(scope.row)" type="text" class="c0088ff" @click="tableOperation(scope.row.id, 'enable')">启用</el-button>
                  </template>
              </ws-table-column-el>
          </template>
      </ws-table-el>
    </div>
</template>

<script>
export default {
    name: 'taskFlow',
    data() {
        return {
            searchOptions: {
                flowName: '', //工作流名称
                accountGroup: '', // 账号组名称
                category: '', // 业务类型
                status: '', //状态类型
                createDateFrom: '', //生效起始时间
                createDateTo: '' //生效结束时间
            },
            checkTypeList:[],//审核流名称列表
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/systemManage/taskFlow',
                    op: {
                        selectList: 'all',
                        selectCount: 'allCount'
                    }
                }
            },
            moduleName: '/systemManage/taskFlow',
            //业务类型
            businessTypeOptions: [],
            //流程定义状态类型
            defStatesOptions: [
                {
                    name: '启用',
                    value: 2
                },
                {
                    name: '停用',
                    value: 4
                }
            ]
        };
    },
    watch: {
        'searchOptions.category': {
            handler(value) {
                this.getcheckList();
            },
            deep: true,
        },
    },
    mounted() {
        this.getBusinessTypeOptions();
        this.getcheckList();
    },
    methods: {
        /**
         * 显示启用按钮
         * 如果 工作流的节点数和节点里的人员 为0， 则不能启用;  isNewFlow: true 表示新的， 不能启用
         * todo
         */
        showEnableButton(row) {
          return row.status == 4 && this.powerList.enableProcDef && !row.isNewFlow
        },
        //获取流程业务类型
        async getBusinessTypeOptions() {
            try {
                let res = await this._axios({ op: 'businessType' }, '/systemManage/taskFlow');
                res.code === 1 && (this.businessTypeOptions = res.data);
            } catch (_err) {
                throw _err;
            }
        },
             //获取审核类型选项
            getcheckList() {
            let opt = {
                data: {
                    body: {
                        id: this.searchOptions.category ? this.searchOptions.category : 0,
                    },
                },
                op: 'workflowName',
            };
            this.$axios('/flowable/common/select', opt).then(res => {
                const { data } = res;
                this.checkTypeList = JSON.parse(data);
            });
        },
        //搜索
        search(type = 1) {
            this.$refs.table.search(type);
        },
        //重置
        reset() {
            this.$refs.table.reset();
        },
        /**
         * 如果是编辑， 则直接跳转到 详情页
         * id
         * category
         * flowNameId : 工作流名称
         *
         */
        operationJump(name, type, row) {
            let {procdefId,category,flowNameId, isNewFlow} = row

            if (isNewFlow) {
              type = 'add'
            }

            this.$router.push({
              name,
              query: {
                type,
                id: procdefId,
                category,
                flowNameId,
                name: row.name
              }
            });
        },

        tableOperation(id, type) {
            try {
                let operation = {
                    enable: {
                        title: '启用',
                        content: '是否确认启用工作流？',
                        op: 'enableProcDef'
                    },
                    disable: {
                        title: '停用',
                        content: '是否确认停用工作流？',
                        op: 'disableProcDef'
                    }
                };

                this.$confirm(operation[type].content, operation[type].title, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true,
                    callback: async action => {
                        if (action === 'confirm') {
                            try {
                              let res = await this._axios({
                                op: operation[type].op,
                                id
                              }, '/systemManage/taskFlow');

                              if (res.code == 1) {
                                  this.search();
                                  this.$message({
                                      type: 'success',
                                      message: `${operation[type].title}成功!`
                                  });
                              }
                            } catch (err) {
                              console.log(err)
                            }
                        }
                    }
                });
            } catch (_err) {
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.c0088ff {
    color: #0088ff;
}
::v-deep .el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
