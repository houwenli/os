<template>
  <div>
    <div class="permission-functionMenu-list">
        <!-- 账号组员列表 -->
        <ws-table-el ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>姓名：</label>
                    <el-input v-model.trim="searchOptions.name" :maxlength="30" placeholder="请输入组员姓名" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>手机号码：</label>
                    <el-input v-model.trim="searchOptions.phone" :maxlength="11" placeholder="请输入组员手机号码" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>所属部门：</label>
                    <el-cascader filterable v-model="searchOptions.deptIds" clearable separator="-" placeholder="请选择" :options="departmentOption" :props="deptProps"></el-cascader>
                </search-group>
                <search-group>
                    <label for>员工状态：</label>
                    <el-select v-model.trim="searchOptions.employeeStatus" placeholder="请选择" clearable>
                        <el-option label="试用" value="1"></el-option>
                        <el-option label="正式" value="2"></el-option>
                        <el-option label="待离职" value="3"></el-option>
                        <el-option label="离职" value="4"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>账号状态：</label>
                    <el-select v-model.trim="searchOptions.accountStatus" placeholder="请选择" clearable>
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="停用" value="2"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #options>
              <div class="onsearch">
                <el-button-group>
                            <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                            <ws-throttle>
                                <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                            </ws-throttle>
                        </el-button-group>
                        <ws-throttle>
                            <el-button icon="el-icon-circle-plus" class="addButton" @click="gotoAdd($route.query.id)">添加组员</el-button>
                        </ws-throttle>
              </div>
            </template>
            <template>
                <ws-table-column-el prop="name" label="姓名" width='120'></ws-table-column-el>
                <ws-table-column-el prop="phone" label="手机号码" width='120'></ws-table-column-el>
                <ws-table-column-el label="所属部门" min-width='200'>
                    <template slot-scope="scope">
                        <el-popover v-for='(item,index) in scope.row.departPosition' :key='index' trigger="click" :content='item.departNameTree' placement="top" width="240">
                            <div class='completeDuty' slot="reference">{{item.departName}}</div>
                        </el-popover>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el label="职务" min-width='200'>
                    <template slot-scope="scope">
                        <div class='positionBox' v-for="(item, index) in scope.row.departPosition" :key="index">
                            {{ item.positionName }}{{item.isMainPos==0?'(主职)':''}}
                        </div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="employeeStatusName" label="员工状态" width='100'></ws-table-column-el>
                <ws-table-column-el label="账号状态" width='100'>
                    <template slot-scope="scope">
                        <div v-if="scope.row.accountStatus == 1" class="start">启用</div>
                        <div v-if="scope.row.accountStatus == 2" class="stop">停用</div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="createUserName" label="添加人" min-width="80"></ws-table-column-el>
                <ws-table-column-el prop="createTime" label="添加时间" width="180"></ws-table-column-el>
                <ws-table-column-el label="操作" fixed="right" min-width='60'>
                    <template slot-scope="scope">
                        <el-popconfirm
                            v-if="oaPowerList.deleteUserFromGroup"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            icon="false"
                            title="确定要删除组员吗？"
                            @confirm="delPersonnel(scope.row.id)"
                        >
                            <el-button type="text" class="c0088ff" slot="reference">移除</el-button>
                        </el-popconfirm>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <!-- 底部按钮 -->
        <div class="goBack">
            <el-button class="buttons" @click="goBack">返回</el-button>
        </div>
        <!-- 弹窗 -->
        <el-dialog custom-class="dialogPersonnel" title="添加组员" :visible.sync="addPersonnel" top="10vh" width="75%" append-to-body destroy-on-close>
            <membersManage @close="addPersonnel = false" @addSuccess="(addPersonnel = false), search()" />
        </el-dialog>
    </div>
  </div>
</template>

<script>
import membersManage from './membersManage.vue';
export default {
    components: {
        membersManage
    },
    data() {
        return {
            searchOptions: {
                id: this.$route.query.id,
                name: '',
                phone: '',
                deptIds: '',
                accountStatus: '',
                employeeStatus:''
            },
            tableConfig: {
                filterColumns: false,
                labelWidth: '80px',
                // autoHeight: true,
                lazyQuery: {
                    url: '/authority/group/select',
                    op: {
                        selectList: 'selectUserSortList',
                        selectCount: 'selectUserSortCount'
                    }
                }
            },
            departmentOption: [], // 部门
            deptProps: {
                label: 'name',
                value: 'id',
                children: 'child',
                checkStrictly: true
            }, // 部门配置
            addPersonnel: false,
            addPersonnelId: '',
            moduleName: '/systemManage/accountGroup'
        };
    },
    filters: {
        time: function (time) {
            if (!time) {
                return '';
            }
            return time.substring(0, time.length - 2);
        }
    },
    computed: {},

    methods: {
        goBack() {
            this.$router.push({ name: 'accountGroup' });
        },
        // 添加组员
        gotoAdd(id) {
            this.addPersonnelId = id;
            this.addPersonnel = true;
        },
        // 移除
        delPersonnel: $vuex.$baseMethod.debounce(function (id) {
            let data = {
                op: 'deleteUserFromGroup',
                data: {
                    groupId: this.$route.query.id,
                    employId: id
                }
            };
            this.$axios(this.getModuleUrl('deleteUserFromGroup'), data).then(res => {
                this.$message.success('移除组员成功');
                this.reset();
            });
        }, 500),
        // 搜索
        search(type = 1) {
            this.$refs.table.search(type);
        },
        //重置
        reset() {
            this.$refs.table.reset();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        //获取部门select
        getSelectValue() {
            // 部门;
            this.$axios('authority/Organizational/select', {
                op: 'selectOrganizationalTreeAllDepart',
                data: JSON.stringify({ id: 0 })
            }).then(res => {
                this.departmentOption = JSON.parse(res.data);
            });
        }
    },
    created() {
        this.getSelectValue();
    }
};
</script>

<style lang="scss" scoped>
.ws-table-warp {
    padding: 24px 24px 16px 24px !important;
    // height: 100vh;
}
/deep/.pagination-warp {
    height: 30px;
    padding-bottom: 0px !important;
    padding-top: 16px;
    box-sizing: content-box;
}
.permission-functionMenu-list {
    // width: 100%;
    margin-bottom: 68px;
    .onsearch {
      text-align: right;
    }
}
.addButton {
    border: 1px solid #f05259;
    border-radius: 4px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #f05259;
    margin-left: 15px !important;
}
.btnMargin {
    margin: 0 !important;
}

.goBack {
    z-index: 999;
    position: fixed;
    bottom: 0;
    left: 32px;
    width: 100%;
    height: 64px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
    display: flex;
    justify-content: center;
    align-items: center;
    .buttons {
        width: 160px;
        height: 36px;
    }
    .el-button + .el-button {
        margin-left: 16px;
    }
}
</style>
<style>
.el-popconfirm__main{
    margin-bottom: 10px;
}
.el-popconfirm .el-button{
    height: 30px;
    padding: 0 15px;
}
</style>