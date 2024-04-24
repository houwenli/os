<template>
    <div class="bigbox">
        <div class="title">{{ dataInfo.name }}</div>
        <div class="header">
            <div class="headerTitle">基础信息</div>
            <el-form ref="form" :model="form" label-width="90px" :rules="rules" :disabled="disabledStatus">
                <el-row type="flex" justify="space-between">
                    <el-col :span="10">
                        <el-form-item label="部门名称:" prop="name">
                            <el-input v-model.trim="form.name" :disabled="dataInfo.name=='各大区'|| dataInfo.name=='公海大区'" :placeholder="placeholder.name" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="部门描述:" prop="depDesc">
                            <el-input v-model.trim="form.depDesc" maxlength="10" :placeholder="placeholder.depDesc" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- <el-row type="flex" justify="space-between">
                    <el-col :span="10">
                        <el-form-item label="部门类型:" prop="deptype">
                            <el-input :value="dataInfo.orgType == 0 ? '总部' :dataInfo.orgType == 4?'总区':'大区'" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="部门负责人职务:" prop="positionName">
                            <el-select v-model="form.positionName" clearable placeholder="请选择部门负责人职务" @change="change" :disabled='dataInfo.orgType!=0'>
                                <el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row> -->

                <el-row type="flex" justify="space-between">
                    <el-col :span="10" v-if="dataInfo.depLevel>=3 &&dataInfo.orgType!=5">
                        <el-form-item label="上级部门:">
                            <!-- :disabled='disabledStatus' -->
                            <el-select v-model="form.parentId" placeholder="请选择上级部门" :disabled='true'>
                                <el-option v-for="item in lastOrg" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" v-if="dataInfo.depLevel>=2 &&dataInfo.orgType==5">
                        <el-form-item label="归属总区:">
                            <el-select v-model="form.parentId" placeholder="请选择归属总区" :disabled="disabledStatus || dataInfo.name=='公海大区'">
                                <el-option v-for="item in lastOrg" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div class="middle">
            <div class="middleTitle">
                <div class="text">职务配置</div>
                <el-button v-if="!disabledStatus && dataInfo.orgType!=5 && dataInfo.orgType!=4" @keyup.space.native.prevent icon="el-icon-circle-plus" class="addButton" @click="addDepartment()">新增职务</el-button>
            </div>
            <div class="tableContent">
                <el-table :data="tableData" style="width: 100%" :border="true" :header-cell-style="{
                        background: '#F5F7FA',
                        'font-family': 'PingFangSC-Medium, PingFang SC',
                        'font-weight': '600',
                        color: '#606266'
                    }">
                    <el-table-column type="index" label="序号" width="162" />

                    <el-table-column label="职务">
                        <template slot-scope="scope">
                            <el-input v-if="!disabledStatus && dataInfo.orgType!=5 && dataInfo.orgType!=4" v-model.trim="scope.row.name" maxlength="50" placeholder="请输入" style="width: 70%" @focus="inputFocus(scope.row.name)" @blur="inputBlur(scope.row.name)" />
                            <span v-else>{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column v-if="!disabledStatus && dataInfo.orgType!=5 && dataInfo.orgType!=4" label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="oaPowerList.delDeptPosition" type="text" style="color: #F05259" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="footer">
            <div class="footerTittle">修改记录</div>
            <div style="display: flex; justify-content: center">
                <update-list :table-data="updateData" :table-style="{ width: '100%', marginRight: '16px' }" />
                <update-list :table-data="updateData2" :table-style="{ width: '100%' }" />
            </div>
        </div>

        <div v-if="disabledStatus" class="saveButon">
            <el-button class="buttons" type="primary" @click="editContent()">修改</el-button>
        </div>
        <div v-if="!disabledStatus" class="saveButon">
            <el-button class="buttons" type="primary" :loading="saveLoading" @click="saveContent()">保存</el-button>
            <el-button class="buttons" @click="cancelContent()">取消</el-button>
        </div>
    </div>
</template>

<script>
import updateList from '../../../components/TableList';
import { throttle } from 'lodash-es';
import { DEP_TYPE } from '@/utils/enum';
export default {
    components: { updateList },
    props: {
        departmentName: {
            // 部门名称
            type: String,
            default: '',
        },
        dataInfo: {
            // 部门类型
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            DEP_TYPE,
            // 验证表单
            rules: {
                depDesc: [
                    {
                        min: 0,
                        max: 10,
                        message: '不能超过10个字符',
                        trigger: 'blur',
                    },
                ],
                positionName: [
                    {
                        message: '部门负责人职务为必填内容！',
                        required: true,
                        trigger: 'blur',
                    },
                ],
            },
            disabledStatus: true, // 是否禁用编辑
            // form表单数据
            form: {
                depDesc: '',
                name: '',
                depType: '',
                positionName: '', //部门负责人职位
                parentId: '', //上级部门
            },
            // table数据
            tableData: [],
            // 修改信息数据
            updateData: [
                { label: '创建人', value: '' },
                { label: '创建时间', value: '' },
            ],
            updateData2: [
                { label: '修改人', value: '' },
                { label: '修改时间', value: '' },
            ],
            moduleName: '/systemManage/organization',
            saveLoading: false,
            post: [],
            positionId: '',
            istrue: false,
            tableIndex: '',
            lastOrg: [], //上级部门下拉框
            allOrg: [], //归属总区下拉框
            id: '',
        };
    },
    computed: {
        placeholder() {
            let list;
            this.disabledStatus && (list = {});
            !this.disabledStatus && (list = { name: '请输入部门名称', depDesc: '不超过10个字' });
            return list;
        },
    },
    watch: {
        dataInfo(val) {
            this.getdepartmentDetail();
            this.disabledStatus = true;
            if (this.dataInfo.depLevel >= 3 && this.dataInfo.orgType != 5) {
                this.getLastorgSelect(0);
            }
            if (this.dataInfo.depLevel >= 2 && this.dataInfo.orgType == 5) {
                this.getLastorgSelect(4);
            }
        },
    },
    methods: {
        inputFocus(name) {
            if (name === this.form.positionName) {
                this.istrue = true;
            }
        },
        inputBlur(name) {
            if (this.istrue) {
                this.form.positionName = name;
                this.istrue = false;
            }
        },
        // 获取详情
        getdepartmentDetail: throttle(async function() {
            const { id } = this.dataInfo;
            if (!id) {
                id = this.id;
            }
            const data = {
                op: 'selectDeptDetailInfo',
                data: JSON.stringify({ id }),
            };
            const res = await this.$axios(this.getModuleUrl(data.op), data);
            this.saveLoading = false;
            if (res.code == 1) {
                const { name, depDesc, depType, createTime, updateTime, positionList, createUser, updateUser, positionName, parentId } = res.data ? JSON.parse(res.data) : {};
                this.updateData[0].value = (createUser || {}).name;
                this.updateData[1].value = createTime;
                this.updateData2[0].value = (updateUser || {}).name;
                this.updateData2[1].value = updateTime;
                this.tableData = (positionList || []).map(item => {
                    return { name: item.name, id: item.id };
                });
                this.positionName = JSON.parse(res.data).positionName;
                this.form = { name, depDesc, depType, positionName, parentId };
            }
        },1500),
        // 新增职务
        addDepartment() {
            const list = { name: '' };
            this.tableData.push(list);
        },
        // 删除职务
        deleteRow(arrindex, arr) {
            let index = 0;
            this.tableData.forEach(item => {
                if (item.name === arr.name) ++index;
            });
            if (index < 2) {
                if (arr.name === this.form.positionName) return this.$message.error('该职务为部门负责人职务，不能删除！');
            }
            const vm = this;
            if (!arr.id) return vm.tableData.splice(arrindex, 1);
            if (!arr.id) {
                vm.tableData.splice(arrindex, 1);
                //没有提交修改时删除部门负责人职务下拉框数据
                let postIndex = this.post.findIndex(item => {
                    return item.value === arr.name;
                });
                this.post.splice(postIndex, 1);
                return;
            }
            const param = {
                op: 'delDeptPosition',
                data: { id: arr.id },
            };
            this.$axios(this.getModuleUrl(param.op), param).then(res => {
                vm.tableData.splice(arrindex, 1);

                //提交修改了以后删除部门负责人职务下拉框数据
                let postIndex = this.post.findIndex(item => {
                    return item.value === arr.name;
                });
                this.post.splice(postIndex, 1);
            });
        },
        // 点击修改
        editContent() {
            this.dataInfo.positionName = this.form.positionName;
            // 数据备份  防止修改数据时影响到tree中显示的数据
            this.form = this.$baseMethod.deepClone(this.dataInfo);
            console.log(this.dataInfo);
            this.tableDataCopy = this.$baseMethod.deepClone(this.tableData);
            this.disabledStatus = false;
        },
        //改变下拉框
        change(value) {
            console.log(this.tableData, value);
            let obj = this.tableData.find(item => {
                return item.name == value;
            });
            this.positionId = obj.id;
        },
        // 点击保存
        async saveContent() {
            try {
                await this.submitForm();
                let tableSet = [...new Set(this.tableData.map(item => item.name))];
                if (tableSet.length < this.tableData.length) return this.$message.error('职务名称不能重复！');
                this.saveLoading = true;
                const departObj = {
                    name: this.form.name,
                    parentId: this.form.parentId,
                    depDesc: this.form.depDesc,
                    depType: this.form.depType,
                    positionList: this.tableData,
                    id: this.dataInfo.id,
                    positionId: this.positionId,
                    positionName: this.form.positionName,
                    orgType: this.dataInfo.orgType,
                };
                this.id = this.dataInfo.id;
                const data = {
                    op: 'updateOrganizational',
                    data: JSON.stringify(departObj),
                };
                const res = await this.$axios(this.getModuleUrl(data.op), data);
                this.saveLoading = false;
                this.disabledStatus = true;
                if (res.code == 1) {
                    this.$message.success('修改成功');
                    //如果修改了上级部门或大区，则刷新树，如若没有则不刷新
                    if (this.form.parentId == this.dataInfo.parentId) {
                        this.$emit('treeNodeHandle', JSON.parse(res.data), 'edit');
                    } else {
                        this.$emit('treeNodeHandle', JSON.parse(res.data), 'refresh');
                    }
                }
            } catch (err) {
                this.saveLoading = false;
            }
        },
        //表单校验
        submitForm() {
            return new Promise((resolve, reject) => {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        resolve();
                    } else {
                        return reject('false');
                    }
                });
            });
        },
        //查询归属总区，上级大区下拉框接口
        getLastorgSelect(orgType) {
            let data = {
                op: 'selectDeptList',
                data: { orgType },
            };
            this.$axios(this.getModuleUrl(data.op), data).then(res => {
                let data = JSON.parse(res.data);
                this.lastOrg = data;
            });
        },
        // 点击取消
        cancelContent() {
            this.$refs['form'].clearValidate(); //清除校验
            this.form = this.dataInfo;
            this.tableData = this.tableDataCopy;
            this.disabledStatus = true;
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
        // height: 28px;
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
        .departmentBox {
            /deep/ .el-form-item__content {
                margin-left: 0px !important;
            }
        }
    }
    .footer {
        width: 100%;
        margin-top: 32px;
        .footerTittle {
            margin-bottom: 16px;
            height: 25px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 25px;
            margin-top: 20px;
        }
    }
    .saveButon {
        // width: 100%;
        // height: 50px;
        // text-align: center;
        // // margin-top: 45px;
        // position: fixed;
        // background: red;
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
