<template>
    <div class="permission-functionMenu-list">
        <ws-table-el ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>人员姓名：</label>
                    <el-input v-model.trim="searchOptions.employName" :maxlength="30" placeholder="请输入人员姓名" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>手机号码：</label>
                    <el-input v-model.trim="searchOptions.employPhone" :maxlength="11" placeholder="请输入人员手机号码" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>所属部门：</label>
                    <el-cascader
                        :props="optionProps"
                        clearable
                        filterable
                        collapse-tags
                        @change="handleChange()"
                        v-model="searchOptions.departIds"
                        :options="departmentOption"
                        placeholder="请选择部门名称"
                        separator="-"
                    ></el-cascader>
                </search-group>
                <search-group>
                    <label for>职务名称：</label>
                    <el-select v-model.trim="searchOptions.positionId" filterable placeholder="请选择职务名称" clearable :disabled="searchOptions.departIds.length == 0">
                        <el-option v-for="item of positionOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </search-group>
                <!-- <search-group>
                    <label for>主职机构：</label>
                    <el-select v-model="searchOptions.orgType" clearable placeholder="请选择主职机构">
                        <el-option v-for="item in organizationOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group> -->
                <search-group>
                    <label for>账号状态：</label>
                    <el-select v-model="searchOptions.accountStatus">
                        <el-option v-for="item in accountStatusOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <!-- <search-group>
                    <label for>员工标签：</label>
                    <el-select v-model="searchOptions.tag" clearable>
                        <el-option label="无" :value="1"></el-option>
                        <el-option label="停薪留职" :value="2"></el-option>
                        <el-option label="休长假" :value="3"></el-option>
                        <el-option label="试用" :value="4"></el-option>
                    </el-select>
                </search-group> -->
            </template>
            <template #options>
                <el-button type="primary" v-if="oaPowerList.saveEmploy" @click="gotoAdd('add')">新增账号</el-button>
            </template>
            <template #searchBtns>
                <div v-if="oaPowerList.selectList" style="float: right">
                    <el-button-group v-if="oaPowerList.selectList">
                        <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                        <ws-throttle>
                            <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                        </ws-throttle>
                    </el-button-group>
                    <!-- <ws-throttle>
                        <el-button v-if="oaPowerList.employInfoExport" style="margin-left: 10px" plain @click="fileImport()">导出</el-button>
                    </ws-throttle> -->
                </div>
            </template>
            <template>
                <ws-table-column-el prop="id" label="人员ID"></ws-table-column-el>
                <ws-table-column-el prop="name" label="人员姓名"></ws-table-column-el>
                <ws-table-column-el prop="phone" label="手机号码"></ws-table-column-el>
                <ws-table-column-el prop="departIds" label="所属部门">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.departNameList" :key="index">
                            {{ item }}
                            <br />
                        </span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="positionName" label="职务" width="150">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.positionName" :key="index">
                            {{ item }}
                            <br />
                        </span>
                    </template>
                </ws-table-column-el>

                <ws-table-column-el prop="entryDate" label="创建日期">
                    <template slot-scope="scope">
                        {{ scope.row.entryDate | time }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="accountStatusName" label="账号状态"></ws-table-column-el>
                <ws-table-column-el label="操作"  fixed="right">
                    <template slot-scope="{row}">
                        <el-button type="text" v-if="oaPowerList.updateEmploy" class="c0088ff" @click="gotoAdd('edit', row.id)">编辑</el-button>
                        <el-button type="text" v-if="oaPowerList.selectEmployDetail" class="c0088ff" @click="gotoAdd('detail', row.id)">详情</el-button>
                        <el-button type="text" v-if="oaPowerList.updateAccountStatus" class="c0088ff" @click="onChangeAccountStatus(row)">
                          {{row.accountStatus === 1 ? '停用' : '启用'}}
                        </el-button>
                        <el-button type="text" v-if="oaPowerList.resetPassword" @click="resetPassword(row.id)">重置密码</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>

        <el-dialog title="重置密码" :visible.sync="centerDialogVisible" width="30%" :center="true" append-to-body>
            <span class="dialogCon">重置后密码为手机号码，是否确认重置？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <ws-throttle>
                    <el-button type="primary" @click="enterPas()">确 定</el-button>
                </ws-throttle>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            centerDialogVisible: false,
            pasID: '',
            searchOptions: {
                employName: '',
                employPhone: '', // 员工姓名
                departIds: '', // 部门
                positionId: '', // 职务
                orgType: '', //主职机构
                accountStatus: '',
            },
            tableConfig: {
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/systemManage/personnel',
                    op: {
                        selectList: 'selectList',
                        selectCount: 'selectCount',
                    },
                },
            },
            moduleName: '/systemManage/personnel',
            //部门下拉框
            departmentOption: [],
            positionOptions: [],
            organizationOption: [
                {
                    id: 1,
                    name: '总部',
                },
                // {
                //     id: 2,
                //     name: '分支机构',
                // },
            ],
            accountStatusOption: [
                {
                    id: '',
                    name: '全部',
                },
                {
                    id: 1,
                    name: '启用',
                },
                {
                    id: 2,
                    name: '停用',
                },
            ],
            optionProps: {
                lazy: true,
                value: 'id',
                label: 'name',
                children: 'child',
                checkStrictly: true,
                lazyLoad: this.depLazy,
                leaf: 'isLeaf',
            },
        };
    },
    filters: {
        time: function (time) {
            if (!time) {
                return '';
            }
            return time.split(' ')[0];
        },
        orgTypeFilter(item) {
            switch (item) {
                case 1:
                    return '总部';
                case 2:
                    return '分支机构';
                default:
                    return '';
            }
        },
    },
    mounted(){
        console.log(this.powerList)
    },
    methods: {
        async depLazy(node, resolve) {
            let data = {
                op: 'getDeptChildList',
                data: { id: node.level == 0 ? 0 : node.data.id },
            };
            let res = await this.$axios('authority/Organizational/select', data);
            resolve(JSON.parse(res.data));
        },
        // 点击新增跳转至新增页面
        gotoAdd(type, id) {
            this.$router.push({ name: 'personnelAdd', query: { type, id } });
        },
        //重置密码
        resetPassword(id) {
            this.centerDialogVisible = true;
            this.pasID = id;
        },
        //dialog确认，重置密码
        enterPas() {
            let data = {
                op: 'resetPassword',
                data: JSON.stringify({ id: this.pasID }),
            };
            this.$axios(this.getModuleUrl('resetPassword'), data).then(res => {
                this.centerDialogVisible = false;
                this.$message.success('重置成功');
            });
        },
        //搜索
        search(type = 1) {
            this.$refs.table.search(type);
        },
        //重置
        reset() {
            (this.searchOptions = {
                employName: '',
                employPhone: '', // 员工姓名
                departIds: '', // 部门
                positionId: '', // 职务
                accountStatus: '',
            }),
                this.search();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        //导出
        fileImport() {
            let data = {
                op: 'employInfoExport',
                data: JSON.stringify({ ...this.searchOptions }),
            };
            this.$axios(this.getModuleUrl('employInfoExport'), data).then(res => {
                this.$message.success('文件正在生成，请稍后到文件下载界面进行下载');
            });
        },
        //根据部门查询职务
        handleChange(val) {
            this.searchOptions.positionId = '';
            let id = this.searchOptions.departIds[this.searchOptions.departIds.length - 1];
            if (id) {
                this.$axios('/authority/Organizational/select', {
                    op: 'selectDepartmentpositionList',
                    data: JSON.stringify({ id }),
                }).then(res => {
                    this.positionOptions = JSON.parse(res.data);
                });
            }
        },

        /**
         * 停用/启用
        */
        onChangeAccountStatus(row) {
          let msg = row.accountStatus === 1 ? '停用' : '启用'

          this.$confirm(`是否${msg}账号`, '提示',{
            center: true
          })
          .then(async () => {
             try {
              await this.$axios(`/authority/employ/update`, {
                op: 'updateAccountStatus',
                data: {
                  id: row.id,
                  accountStatus: row.accountStatus === 1 ? 2: 1
                }
              })

              this.$message.success(`账号已${msg}`)
              this.search()
            } catch (error) {
            }
          }).catch(() => {})
        }
    }
};
</script>

<style lang="scss" scoped>
.ws-table-warp {
    padding: 24px 24px 16px 24px !important;
}
/deep/.pagination-warp {
    height: 30px;
    padding-bottom: 0px !important;
    padding-top: 16px;
    box-sizing: content-box;
}
/deep/.el-pagination {
    padding: 0px !important;
}
.permission-functionMenu-list {
    width: 100%;
}
.c0088ff {
    color: #0088ff;
}
/deep/ .el-dialog .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
}

/deep/ .el-button--default.is-plain {
    width: 95px !important;
}
</style>
