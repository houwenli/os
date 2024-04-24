<template>
    <div class="permissionlist">
        <div class="form-content-wrap">
            <!--  修改 -->
            <div>
                <div class="middle">
                    <div class="middleTitle">角色信息配置</div>
                </div>
                <el-row>
                    <el-form label-width="90px" :disabled="true">
                        <!-- <el-col :span="6">
                            <el-form-item label="部门类型：">
                                <el-input v-model.trim="editForm.depType" />
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="6">
                            <el-form-item label="部门名称：">
                                <el-input v-model.trim="editForm.depName" :disabled="true" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :offset="3">
                            <el-form-item label="部门职务：">
                                <el-input v-model.trim="editForm.positionName" :disabled="true" />
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
                <div class="footer">
                    <div class="middle">
                        <div class="middleTitle">角色配置</div>
                    </div>
                    <el-form label-width="90px">
                        <el-form-item label="选择角色:">
                            <!-- :class="[isShowClose, 'role-select']" -->
                            <el-select v-if="routeQuery.type == 'edit'" v-model="selectRoleIds" multiple default-first-option placeholder="请选择角色" style="width: 100%" filterable clearable>
                                <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="item.canModify == 2"></el-option>
                            </el-select>
                            <div class="selsectRole" v-if="routeQuery.type == 'authorizationDetail'">
                                <el-tag v-for="(tag,index) in roleList" class="selsectTag" :key="tag.id" effect="plain" :type="activeRoleTag === index ? 'danger' : 'info'" @click="clickTag(tag.id,index)">
                                    {{ tag.name }}
                                </el-tag>
                            </div>
                        </el-form-item>
                    </el-form>
                    <!-- tag.canModify == 2 -->
                </div>
                <div class="personTree">
                    <div class="personTreeTittle">权限明细</div>
                    <permissions-tree :roleIds="selectRoleIds" :deptType="$route.query.orgType"></permissions-tree>
                </div>
            </div>
            <div class="footer">
                <div class="middleTitle">修改记录</div>
                <div style="display: flex; justify-content: center">
                    <update-list :tableData="updateData" :tableStyle="{ width: '100%', marginRight: '16px' }"></update-list>
                    <update-list :tableData="updateData2" :tableStyle="{ width: '100%' }"></update-list>
                </div>
            </div>
            <div class="saveButon">
                <el-button class="buttons" @click="goBack()">{{ routeQuery.type === 'authorizationDetail' ? '返回' : '取消' }}</el-button>
                <el-button v-if="routeQuery.type !== 'authorizationDetail'" class="buttons" type="primary" @click="onSubmit('form')" :loading="saveLoading">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
//修改人信息组件
import updateList from '../../../components/TableList';
//角色权限树组件
import PermissionsTree from './components/permissionsTree.vue';
export default {
    name: 'addPersonnel',
    components: { updateList, PermissionsTree },
    data() {
        return {
            saveLoading: false,
            // 修改信息数据
            updateData: [
                { label: '创建人', value: '' },
                { label: '创建时间', value: '' },
            ],
            updateData2: [
                { label: '修改人', value: '' },
                { label: '修改时间', value: '' },
            ],
            // 角色
            roleOptions: [],
            moduleName: '/systemManage/authorization',
            routeQuery: this.$route.query,
            editForm: {
                depType: '',
                depName: '',
                positionName: '',
            },
            roleList: [],
            selectRoleIds: [],
            activeRoleTag: 0,
            disableRoleList:[]  //已经停用的角色
        };
    },
    created() {
        this.getAllData();
        this.getAllRole(this.routeQuery.orgType);
    },
    methods: {
        // 详情
        clickTag(id, index) {
            this.selectRoleIds = [id];
            this.activeRoleTag = index;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        //保存
        async onSubmit() {
            let params = {};
            let { positionId, deptType } = this.routeQuery;
            let data = {
                positionId,
                deptType,
                roleIdList: [...this.selectRoleIds,...this.disableRoleList],  //合并禁用的角色
                roleId: this.$route.query.roleId,
            };
            params.op = 'update';
            params.data = data;
            try {
                this.saveLoading = true;
                await this.$axios('/authority/positionAuth/save', params);
                this.$message.success('修改成功');
                this.$router.push({ name: 'authorization' });
                this.saveLoading = false;
            } catch (err) {
                this.saveLoading = false;
            }
        },
        // 点击返回
        goBack() {
            this.$router.push({ name: 'authorization' });
        },
        // 编辑 获取所有数据
        async getAllData() {
            // 获取编辑信息
            let { id } = this.routeQuery;
            let data = {
                data: { id , detailFlag: this.routeQuery.type === 'edit' ? 1 : 2},
                op: 'selectDetails',
            };
            let res = await this.$axios(this.getModuleUrl('selectDetails'), data);
            let detailData = JSON.parse(res.data);
            let { creator, createTime, updater, updateTime, deptName, roleList, positionName, deptTypeName, disableRoleList} = detailData;
            this.updateData[0].value = creator;
            this.updateData[1].value = createTime;
            this.updateData2[0].value = updater;
            this.updateData2[1].value = updateTime;
            this.editForm.positionName = positionName;
            this.editForm.depName = deptName;
            this.editForm.depType = deptTypeName;
            this.disableRoleList = disableRoleList || []
            if (this.routeQuery.type == 'authorizationDetail') {
                this.roleList = roleList;
                this.selectRoleIds = [roleList[0].id];
            } else {
                this.selectRoleIds = roleList.map(item => item.id);
            }
        },
        getAllRole(orgType = 0) {
            this.$axios('/authority/role/select', {
                op: 'getRoleByType',
                data: { orgType,personnelFlag:2 },
            }).then(res => {
                let data = JSON.parse(res.data);
                this.roleOptions = data.map(item => {return {...item,disabled:item.canModify == 2}})
            }).catch(error => {})
        },
    },
};
</script>

<style lang="scss" scoped>
.permissionlist {
    height: 100%;
    .middleTitle {
        height: 28px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 28px;
        margin-bottom: 16px;
    }
    .role-select {
		/deep/.el-tag__close {
			display: none !important;
		}
	}
    .form-content-wrap {
        width: 100%;
        background: #ffffff;
        padding: 24px 40px;
        margin-bottom: 59px;
        border-radius: 8px;
        .tab-wrap {
            .el-tabs__nav-wrap::after {
                content: none;
            }
            .el-tabs__nav {
                margin: auto;
            }
            .el-tabs__header {
                display: flex;
                justify-content: center;
                margin-bottom: 0;
                .el-tabs__nav-wrap {
                    background-color: #f0f2f5;
                    border-radius: 4px 0px 0px 4px;
                    .el-tabs__active-bar {
                        width: 0 !important;
                    }
                    ::after {
                        width: 0;
                    }
                }
                .el-tabs__item {
                    width: 124px;
                    height: 40px;
                    text-align: center;
                    color: #606266;
                    padding: 0;
                    .is-top:last-child {
                        border-radius: 0px 4px 4px 0px !important;
                    }
                }
                .is-active {
                    background-color: #f05259;
                    color: #fff;
                    opacity: 1;
                }
                &.is-top:last-child {
                    // padding-right: 20px;
                    border-radius: 0px 4px 4px 0px !important;
                }
                .el-tabs__item:last-child() {
                    border-radius: 0px 4px 4px 0px !important;
                }
            }
            .el-tabs__nav-wrap {
                display: inline-block;
                border-radius: 4px 4px 4px 4px !important;
            }
        }
        .roleSelect {
            overflow: auto;
        }
        .header {
            width: 80px;
            height: 28px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 28px;
        }
        .formAll {
            margin-top: 24px;
            .el-select__tags {
                height: 30px;
                overflow-y: auto;
            }
        }
        .middle {
            width: 100%;
            height: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 24px;
            margin-bottom: 16px;
            .addButton {
                border: 1px solid #f05259;
                border-radius: 4px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #f05259;
            }
        }
        .ws-organization {
            /deep/ .el-cascader {
                width: 100%;
            }
        }
        .footer {
            width: 100%;
            margin-top: 32px;
        }
        .el-col-7 {
            .el-form-item {
                margin-bottom: 0px !important;
            }
        }
        .personTree {
            width: 100%;
            margin-top: 32px;
            .personTreeTittle {
                height: 28px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #303133;
                line-height: 28px;
                margin-bottom: 16px;
            }
        }
        .saveButon {
            position: fixed;
            bottom: 0;
            left: 0;
            width: calc(100% + 166px);
            height: 64px;
            background: #ffffff;
            box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }
        .selsectRole {
            width: 100%;
            min-height: 38px;
            border: 1px solid #d8dce6;
            border-radius: 4px;
            padding: 0 0 0 7px;
            .selsectTag {
                margin-left: 8px;
                cursor: pointer;
                // &:hover {
                //     color: #409eff;
                //     border-color: #c6e2ff;
                //     background-color: #ecf5ff;
                // }
            }
        }
    }
    .buttons {
        width: 160px;
        height: 36px;
    }
}
</style>
