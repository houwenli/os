<template>
    <div class="bigbox">
        <div class="title">{{dataInfo.orgType==4?'新增大区':'新增'+departmentLabel+'级部门'}}</div>
        <div class="header">
            <div class="headerTitle">基础信息</div>
            <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                <el-row type="flex" justify="space-between">
                    <el-col :span="10">
                        <el-form-item label="部门名称:" :prop="departmentLabel === '一'|| dataInfo.orgType==4 ? 'name' : ''">
                            <el-input v-if="departmentLabel === '一' || dataInfo.orgType==4" v-model.trim="form.name" placeholder="请输入部门名称"></el-input>
                            <span v-else>{{ departmentName }}</span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="10">
                        <el-form-item label="部门描述:" prop="depDesc">
                            <el-input v-model.trim="form.depDesc" maxlength="10" placeholder="不超过10个字"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row type="flex" justify="space-between">
                    <!-- <el-col :span="10" v-if="departmentLabel == '一' || dataInfo.orgType==4">
                        <el-form-item label="部门类型:" prop="orgType">
                            <el-select v-model="form.orgType" placeholder="请选择部门类型" :disabled="dataInfo.orgType==4">
                                <el-option label="总部" :value='0' />
                                <el-option label="总区" :value='4' />
                                <el-option v-if='dataInfo.orgType==4' label="大区" :value='5' />
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="10" v-if="departmentLabel != '一' && dataInfo.orgType!=4 ">
                        <el-form-item :label="departmentNamelable" prop="name">
                            <el-input v-model.trim="form.name" placeholder="请输入部门名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="10">
                        <el-form-item label="部门负责人职务:" prop="positionName">
                            <el-select v-model="form.positionName" clearable placeholder="请选择部门负责人职务" :disabled="form.orgType==4 || dataInfo.orgType==4">
                                <el-option v-for="item in post" :key="item.id" :label="form.orgType==4||dataInfo.orgType==4?item.name:item.value" :value="form.orgType==4||dataInfo.orgType==4?item.id:item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                </el-row>
            </el-form>
        </div>

        <div class="middle">
            <div class="middleTitle">
                <div class="text">职务配置</div>
                <el-button v-if='form.orgType==0' icon="el-icon-circle-plus" @keyup.space.native.prevent class="addButton" @click="addDepartment()">新增职务</el-button>
            </div>
            <div class="tableContent">
                <el-table :data="positionList" style="width: 100%" :border="true" :header-cell-style="{
                        background: '#F5F7FA',
                        'font-family': 'PingFangSC-Medium, PingFang SC',
                        'font-weight': '600',
                        color: '#606266'
                    }">
                    <el-table-column type="index" label="序号" width="162"></el-table-column>

                    <el-table-column label="职务">
                        <template slot-scope="scope">
                            <el-input v-if='form.orgType==0' maxlength="50" v-model.trim="scope.row.name" placeholder="请输入" style="width: 70%" @focus="inputFocus(scope.row.name)" @blur="inputBlur(scope)"></el-input>
                            <span v-else>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" v-if='form.orgType==0'>
                        <template slot-scope="scope">
                            <el-button @click="deleteRow(scope.$index, positionList, scope.row.name)" type="text" style="color: #0088ff">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="saveButon">
            <el-button class="buttons" type="primary" :loading="saveLoading" @click="saveContent()">保存</el-button>
            <el-button class="buttons" @click="cancelContent()">取消</el-button>
        </div>
    </div>
</template>

<script>
import { DEP_TYPE } from '@/utils/enum';
export default {
    components: {},
    props: {
        departmentLabel: {
            // 部门等级
            type: String,
            default: '',
        },
        departmentType: {
            // 部门类型
            type: String,
            default: '',
        },
        departmentName: {
            // 部门名称
            type: String,
            default: '',
        },
        dataInfo: {
            type: Object,
            default: () => {},
        },
    },
    watch: {
        'form.orgType'(val) {
            this.getTotalarea(val);
        },
    },
    data() {
        return {
            DEP_TYPE,
            departmentNamelable: '',
            //form表单数据
            form: {
                name: '', //部门名称
                depDesc: '', //部门描述
                positionName: '', //部门负责人职位
                orgType: 0,
            },
            istrue: false,
            //table数据
            positionList: [],
            moduleName: '/systemManage/organization',

            rules: {
                name: [
                    {
                        message: '请输入部门名称',
                        trigger: 'blur',
                        required: true,
                    },
                ],
                depDesc: [
                    {
                        min: 0,
                        max: 10,
                        message: '请输入描述不超过10个字',
                        trigger: 'blur',
                        // required: true,
                    },
                ],
                positionName: [
                    {
                        message: '部门负责人职务为必填内容！',
                        required: true,
                        trigger: ['blur', 'change'],
                    },
                ],
            },
            saveLoading: false,
            post: [],
        };
    },
    created() {
        let vm = this;
        // table表格数据备份，取消时恢复
        vm.positionListCopy = vm.$baseMethod.deepClone(vm.positionList);
        vm.departmentNamelable = vm.departmentLabel + '级部门名称:';
        if (this.dataInfo.orgType == 4) {
            this.getPersonOrg();
            this.form.orgType = 5;
        }
    },
    methods: {
        //新增职务
        addDepartment() {
            this.positionList.push({ name: '' });
        },
        inputFocus(name) {
            if (name === this.form.positionName) {
                this.istrue = true;
            }
        },
        inputBlur(scope) {
            if (this.istrue) {
                this.form.positionName = scope.row.name;
                this.istrue = false;
            }
            let postIndex = this.post.findIndex(item => {
                return item.value === scope.row.name;
            });
            //职务为空时不添加到部门负责人下拉框
            if (postIndex === -1 && scope.row.name) {
                if (this.post.length - 1 >= scope.$index) {
                    this.post.forEach((item, index) => {
                        if (index == scope.$index) {
                            item.value = scope.row.name;
                            item.label = scope.row.name;
                        }
                        return item;
                    });
                } else {
                    this.post.push({ value: scope.row.name, label: scope.row.name });
                }
            }
        },
        add(scope) {},
        //删除职务
        deleteRow(arrindex, arr, name) {
            let vm = this;
            if (name === this.form.positionName) return this.$message.error('该职务为部门负责人职务，不能删除！');
            vm.positionList.splice(arrindex, 1);
            let postIndex = this.post.findIndex(item => {
                return item.value === name;
            });
            this.post.splice(postIndex, 1);
            return;
        },
        //点击保存
        saveContent() {
            let vm = this;
            let positionSet = [...new Set(this.positionList.map(item => item.name))];
            if (positionSet.length < this.positionList.length) return this.$message.error('职务名称不能重复！');
            this.$refs.form.validate(async valid => {
                if (valid) {
                    try {
                        vm.saveLoading = true;
                        let { parentId, depLevel, id, level } = vm.dataInfo;
                        let param = {
                            positionList: vm.positionList,
                            ...vm.form,
                            parentId: level < 2 ? parentId : id, // level < 2,取父级节点id刷新tree树 ： 往当前点击节点添加二级节点
                            depLevel: ++depLevel,
                            op: 'saveOrganizational',
                        };
                        let res = await vm._axios(param, vm.moduleName);
                        vm.saveLoading = false;
                        if (res.code == 1 && Object.keys(res.data).length > 0) {
                            vm.$emit('treeNodeHandle', res.data, 'add');
                            vm.$message.success('新增成功');
                            vm.disabledFlag = true;
                        }
                    } catch (err) {
                        vm.saveLoading = false;
                    }
                }
            }); 
        },
        //获取总区职务
        getTotalarea(orgType) {
            if (orgType == 4) {
                this.getPersonOrg(orgType);
            } else {
                this.positionList = [];
                this.post = [];
                this.form.positionName = '';
            }
        },
        //获取大区个人职务
        getPersonOrg(orgType) {
            let data = {
                data: { orgType: orgType ? orgType : 5 },
                op: 'selectPositionList',
            };
            this.$axios(this.getModuleUrl('selectPositionList'), data).then(res => {
                let data = JSON.parse(res.data);
                this.positionList = data;
                this.post = data.filter(item => {
                    return item.deptHead == 1;
                });
                this.form.positionName = this.post[0].id;
            });
        },
        //点击取消
        cancelContent() {
            this.$refs.form.resetFields();
            this.positionList = this.positionListCopy;
            if (this.$parent.depLevel == 1) {
                this.$parent.blockName = 'headCompany'
            } else {
                this.$parent.blockName = 'DepartmentDetail';
            }
            this.$parent.dataInfo = {};
            setTimeout(() => {
                this.$parent.dataInfo = this.dataInfo;
            }, 1);
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style lang="scss" scoped>
.bigbox {
    padding: 25px;
    width: 100%;
    height: 100%;
    overflow: auto;
    .title {
        height: 28px;
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 28px;
    }
    .header {
        .headerTitle {
            margin-bottom: 15px;
            height: 25px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 25px;
            margin-top: 20px;
        }
    }
    .middle {
        margin-top: 12px;
        .middleTitle {
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            .text {
                height: 25px;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 600;
                color: #303133;
                line-height: 25px;
            }
            .addButton {
                border: 1px solid #f05259;
                border-radius: 4px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #f05259;
            }
        }
    }
    .saveButon {
        z-index: 999;
        position: fixed;
        bottom: 0;
        left: 80px;
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
            display: block;
        }
    }

    /deep/ .el-form-item__label {
        width: 135px !important;
    }

    /deep/ .el-form-item__content {
        margin-left: 135px !important;
    }
    /deep/ .el-select {
        width: 100%;
    }
}
</style>
