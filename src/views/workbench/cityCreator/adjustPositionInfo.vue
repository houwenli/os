<template>
    <div>
        <div class="form-wrap">
            <div class="fee-info">
                <!-- 表单 -->
                <div class="title">城市合伙人调岗审批</div>
                <el-form :model="ruleForm" label-position="top" :rules="rules" ref="ruleForm">
                    <el-row>
                        <el-col :span="6">
                            <!-- <el-form-item v-if="!this.$route.query.id" label="员工姓名:" prop="name" class="title-info">
                        <el-input
                            @focus="selectMember()"
                            v-model="ruleForm.name"
                            :suffix-icon="ruleForm.name ? '' : 'el-icon-user'"
                            placeholder="请选择"
                            class="chooseMan"
                            @clear="handleClear"
                            clearable
                        ></el-input>
                    </el-form-item> -->
                            <el-form-item label="姓名：" prop="name" class="title-info form-input-item">
                                <el-input
                                    @focus="selectMember()"
                                    v-model="ruleForm.name"
                                    :suffix-icon="ruleForm.name ? '' : 'el-icon-user'"
                                    placeholder="请选择"
                                    class="chooseMan"
                                    @clear="handleClear"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :offset="3">
                            <el-form-item label="工号：" class="title-info form-input-item">
                                <el-input v-model.trim="ruleForm.jobNumber" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="任职信息" class="title-info form-table-item">
                        <div class="btnBox" v-if="ruleForm.name">
                            <el-button @click="reset()" type="text" style="color: #0088ff">重置</el-button>
                            <el-button @click="showDialog(3)" type="primary" icon="el-icon-plus" class="addBtn">新增职位</el-button>
                        </div>
                        <el-table
                            style="margin-bottom: 0px"
                            :loading="tableLoading"
                            :data="ruleForm.positionList"
                            border
                            :header-cell-style="{ background: '#F5F7FA', fontWeight: 600, color: '#606266' }"
                        >
                            <el-table-column label="任职机构" prop="deptName">
                                <template slot-scope="scope">
                                    <!-- 总部职务不可修改/删除/调整 -->
                                    <span>{{ scope.row.deptName }}</span>
                                    <!-- <el-cascader
                                        v-else
                                        ref="selectDept"
                                        :props="optionProps"
                                        clearable
                                        filterable
                                        collapse-tags
                                        @change="handleChangeDept()"
                                        v-model="scope.row.departmentId"
                                        :options="departmentOption"
                                        placeholder="请选择"
                                        separator="-"
                                    ></el-cascader> -->
                                </template>
                            </el-table-column>
                            <!-- <el-table-column label="部门" prop="departmentName" show-overflow-tooltip></el-table-column> -->
                            <el-table-column label="任职职务(身兼多职可添加职务)" prop="positionName">
                                <template slot-scope="scope">
                                    <!-- 总部职务（以及独立法人 非自己分支机构的职务）不可修改/删除/调整-->
                                    <span v-if="(scope.row.departmentType == 1) || scope.row.positionName == '独立法人'||(scope.row.departmentType == 2 && scope.row.childFlag == false)">{{ scope.row.positionName }}</span>
                                    <el-select v-else v-model.trim="scope.row.positionId" filterable placeholder="请选择" @change="handleChangePosition()" clearable>
                                        <el-option v-for="item of scope.row.positionListByDeptId" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="职位类型" width="200">
                                <template slot-scope="scope">
                                    <span class="mainPosition" v-if="scope.row.positionTypeName == '主职'">{{ scope.row.positionTypeName }}</span>
                                    <span v-else>{{ scope.row.positionTypeName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="200">
                                <template slot-scope="scope">
                                    <el-button @click="showDialog(1, scope.$index, scope.row)" style="color: #0088ff" v-if="scope.row.positionType == 1" type="text">设为主职</el-button>
                                   <!-- 总部职务不允许删除 非分支机构其下属机构职务不可删除 （是当前机构）主职不可删除 独立法人不可删除-->
                                    <!-- v-if="scope.row.departmentType !== 1 && scope.row.positionType == 1 && scope.row.delFlag == true" -->
                                   <el-button
                                        @click="showDialog(2, scope.$index, scope.row)"
                                        v-if="scope.row.positionName !== '独立法人'&&scope.row.departmentType !== 1 && scope.row.positionType == 1 && scope.row.delFlag == true"
                                        type="text"
                                    > 
                                        删除职务
                                    </el-button>
                                    <!-- <el-button @click="showDialog(2, scope.$index, scope.row)" v-if="canDel(scope.row)" type="text">删除职务</el-button> -->
                                    <div v-if="scope.row.positionType == 2">-</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>

                    <el-form-item label="调岗类型:" prop="jobTransferType" class="title-info">
                        <el-select v-model="ruleForm.jobTransferType" placeholder="请选择调岗类型" filterable>
                            <el-option v-for="item in jobTransferFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>

                        <!-- <el-select v-model="value" placeholder="请选择">
                          <el-option-group
                            v-for="group in options"
                            :key="group.label"
                            :label="group.label">
                            <el-option
                              v-for="item in group.options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-option-group>
                        </el-select> -->
                    </el-form-item>

                    <el-form-item label="调岗原因:" class="title-info">
                        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" v-model="ruleForm.reason" placeholder="请输入" maxlength="500" show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item label="附件资料:" class="title-info">
                        <uploadFile
                            ref="uploadFile"
                            uploadDesc="(不超过20M，支持word,excle,pdf,jpg,png格式)"
                            :picSize="20480000"
                            :isShowRename="false"
                            :isShowDownload="false"
                            :limitCount="3"
                            :moduleName="moduleName"
                        ></uploadFile>
                    </el-form-item>
                </el-form>

                <div class="pb-12" v-if="!isMainPostion && !isSuperAdmin  && idNumber">
                    <div class="pb-title">审核流程</div>
                    <!-- 审核流程 -->
                    <div>
                        <audit-process
                            :load.sync="isLoaded"
                            title=""
                            ref="auditProcess"
                            :actions="actions"
                            :afterQuery="afterQuery"
                            url="/new/flowable/todoTask/select"
                            :query="{ nameCode: 37,idNumber }"
                            :overflowLimit="10"
                            custom-class="custom-class"
                            style="width: 100%"
                        ></audit-process>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部按钮 -->
        <div class="footer foot_btn">
            <el-button @click="back()" class="backtrack add-buttom">返回</el-button>
            <el-button @click="submitForm('ruleForm')" type="primary" v-if="powerList.jobTransfer" :loading="isLoading" class="add-buttom">确认</el-button>
        </div>

        <!-- 删除弹框 -->
        <el-dialog v-if="showDelete" append-to-body :lock-scroll="false" title="删除" :visible.sync="showDelete" width="30%" center>
            <span>是否确认删除该条职位？</span>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 98px" @click="showDelete = false">关 闭</el-button>
                <el-button style="width: 98px" type="primary" @click="deleteRow()">确 认</el-button>
            </span>
        </el-dialog>

        <!-- 切换主职弹框 -->
        <el-dialog append-to-body :lock-scroll="false" title="设为主职" :visible.sync="showPosition" width="30%" center>
            <span>是否确认将该条职务设为主职？</span>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 98px" @click="showPosition = false">关 闭</el-button>
                <el-button style="width: 98px" type="primary" @click="changeRow(changeIndex)">确 认</el-button>
            </span>
        </el-dialog>

        <!-- 新增职位弹框 -->
        <el-dialog v-if="showAddPosition" append-to-body :close-on-click-modal="false" :lock-scroll="false" title="新增职位" :visible.sync="showAddPosition" width="30%" center>
            <el-form label-position="right" :model="ruleFormDept" :rules="rulesDept" ref="ruleFormDept" label-width="115px">
                <el-form-item label="部门:" prop="departmentId">
                    <el-cascader
                        ref="selectDept"
                        :props="optionProps"
                        clearable
                        filterable
                        collapse-tags
                        @change="handleChangeDept()"
                        v-model="ruleFormDept.departmentId"
                        :options="departmentOption"
                        placeholder="请选择"
                        separator="-"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="职位:" prop="positionId">
                    <el-select v-model.trim="ruleFormDept.positionId" filterable placeholder="请选择" @change="handleChangePosition()" clearable :disabled="ruleFormDept.departmentId.length == 0">
                        <el-option v-for="item of positionOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 98px" @click="showAddPosition = false">取 消</el-button>
                <el-button style="width: 98px" type="primary" @click="addPosition()">确 认</el-button>
            </span>
        </el-dialog>

        <!-- 选择人员 -->
        <tree-select
            :dialogVisible.sync="dialogVisible"
            title="选择人员"
            :expandOnClickNode="false"
            :moduleName="'/workbench/BRcityCreator'"
            :listModuleName="'/workbench/BRcityCreator'"
            :funcDefaultNode="funcDefaultNode"
            :maxCount.sync="treeSelectMaxCount"
            :opObj="{ selectTree: 'selectOrgTree', selectList: 'listByFuzzyNameNew' }"
            :funcRoleProps="{
                label: 'name',
                value: 'id',
                children: 'children',
                isLeaf: 'leaf',
                disabled: setTreeDisabled,
            }"
            @visibleChanged="
                val => {
                    treeSelectVisable = val;
                }
            "
            @checkedNodeChange="getCheckedNodeList"
        ></tree-select>

        <!-- 操作失败 -->
        <el-dialog class="deleteDialog" append-to-body :lock-scroll="false" :show-close="false" :close-on-click-modal="false" title="提交失败" :visible.sync="showErr" width="30%" center>
            <span>{{ errMsg }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 98px" type="primary" @click="resetList()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import AuditProcess from '@/components/AuditProcess';
import TreeSelect from './components/treeSelect/treeSelect.vue';
import uploadFile from '@/components/uploadFile/index.vue';
export default {
    name: 'startTransferManage',
    components: { TreeSelect, AuditProcess,uploadFile },
    data() {
        return {
            moduleName: '/workbench/BRcityCreator',
            treeSelectMaxCount: 1,
            dialogVisible: false,
            ruleForm: {
                name: '',
                employeeId: '',
                jobTransferDate: '',
                jobTransferType: '',
                reason: '',
                positionList: [],
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请选择需要调岗的员工',
                        trigger: 'change',
                    },
                ],
                jobTransferType: [
                    {
                        required: true,
                        message: '请选择调岗类型',
                        trigger: 'change',
                    },
                ],
            },
            rulesDept: {
                departmentId: [
                    {
                        required: true,
                        message: '请选择部门',
                        trigger: 'blur',
                    },
                ],
                positionId: [
                    {
                        required: true,
                        message: '请选择职位',
                        trigger: 'blur',
                    },
                ],
            },
            op: {
                regularizeInfo: 'regularizeInfo',
                submitCheck: 'submitCheck',
                update: 'regularizationApproval',
                deptPositions: 'deptPositions',
                getIdNumber: 'getIdNumber',
            },

            actions: {
                moduleName: '/workbench/BRcityCreator',
                op: 'flowNode',
            },
            changeIndex: '',
            showDelete: false,
            showPosition: false,
            showAddPosition: false,
            isLoaded: false,
            isLoading: false,
            //部门下拉框
            departmentOption: [],
            positionOptions: [],
            optionProps: {
                value: 'id',
                label: 'departmentName',
                children: 'childList',
                checkStrictly: true,
            },
            ruleFormDept: {
                departmentId: '',
                departmentName: '',
                positionId: '',
                positionName: '',
            },
            entryDate: '',
            showErr: false,
            errMsg: '',
            batchNo: '',
            funcDefaultNode: [],
            roleOption: {},
            tableLoading: false,
            batchNo: '',
            userOrgType:"",//登录用户的机构type 0是总部 其他为分支机构
            employeeId:"",//所选员工id
            isSuperAdmin:false,
            idNumber:"",
            auditProcessList: [],
        };
    },
    computed: {
        isMainPostion(){
           return [0, 4, 5, 10].includes(this.userOrgType)
        },
        ...mapState('workbench', [
            'jobTransferFilters',
        ]),
    },
    created() {
         //判断是否超管账号
        let { username } = this.$baseMethod.getStore('_ccmUser')
        this.isSuperAdmin = (username == 'wsecar')
        this.roleOption = this.$baseMethod.getStore('roleOption') || {};
        this.getIdNumber()
        this.userOrgType=this.roleOption.orgType
        this.getSelectValue();
    },
    methods: {
        // 获取idNumber
        getIdNumber(){
           let { orgType } =  this.roleOption;
           //总部账号不请求此接口（后端暂时不删）
           //后端要求超管使用wsecar判断
          if ([0, 4, 5, 10].includes(orgType) || this.isSuperAdmin){
              return false
           }
           console.log(this.roleOption)
          let data = {
            data: JSON.stringify({ 
              departmentId: this.roleOption.currentDepId,
            }),
            op: this.op.getIdNumber
          }
          this.$axios(this.getModuleUrl(this.op.getIdNumber), data).then((res) => {
            this.idNumber = JSON.parse(res.data)
          })
        },
        //员工岗位查询
        searchPositon(id) {
            let data = {
                data: JSON.stringify({
                    id: id,
                }),
                op: 'selectEmployeePosition',
            };
            this.employeeId = id
            let { orgType } = this.$baseMethod.getStore('roleOption');
            this.tableLoading = true;
            this.$axios('/personnel/urbanCoFunder/select', data).then(res => {
                // positionInfo
                let result = JSON.parse(res.data) || [];
                this.ruleForm.positionList = result;
                this.batchNo = result[0].batchNo;
                // 缓存请求
                let positionDataMap=new Map()
                this.ruleForm.positionList.forEach((item, index) => {
                    //根据每一项的部门获取对应的职务列表
                    //总部职务 独立法人和不在分支自己分支机构的可以不用获取接口
                    if (!positionDataMap.has(item.departmentId)) {
                        if (item.positionName !== '独立法人' && item.departmentType !== 1 && (item.departmentType == 2 && item.childFlag != false)) {
                            this.fetchPositions(item.departmentId, item.orgType).then(res => {
                                let positionOptions = res.filter(i => i.name != '独立法人');
                                this.$set(this.ruleForm.positionList[index], 'positionListByDeptId', positionOptions);
                                positionDataMap.set(item.departmentId, positionOptions)
                                this.tableLoading = false;
                            });
                        }else{
                            this.tableLoading = false;
                        }
                        
                    }else{
                        let positionOptions=positionDataMap.get(item.departmentId)
                        this.$set(this.ruleForm.positionList[index], 'positionListByDeptId', positionOptions);
                    }
                    
                    //获取是否能删除职务(是总部 或者是主职 不用请求接口 )
                    // if (item.departmentType !== 1) {
                    //     this.$axios('/personnel/urbanCoFunder/select', {
                    //         op: 'checkUrBanDelEp',
                    //         data: JSON.stringify({ departmentId: item.departmentId,positionId:item.positionId }),
                    //     }).then(res => {
                    //         this.$set(this.ruleForm.positionList[index], 'isSubOrg', res.data);
                    //         this.tableLoading = false;
                    //     });
                    // }
                });
            });
        },
        setTreeDisabled(node, data) {
            return !data.isLeaf;
        },
        //选择人员
        getCheckedNodeList(val) {
            if (val.length) {
                this.funcDefaultNode = val;
                let checkedPerson = val[0];
                this.ruleForm.jobNumber = checkedPerson.code;
                this.ruleForm.employeeId = checkedPerson.employeeId;
                this.ruleForm.name = checkedPerson.name;
                this.searchPositon(checkedPerson.employeeId);
            } else {
                this.handleClear();
            }
        },
        //清除人员
        handleClear() {
            this.funcDefaultNode = [];
            this.ruleForm.jobNumber = '';
            this.ruleForm.name = '';
            this.ruleForm.employeeId = '';
            this.entryDate = '';
            this.ruleForm.positionList = [];
        },
        //选择人员弹框
        selectMember() {
            this.dialogVisible = true;
        },
        //弹框
        showDialog(type, index, row) {
            this.changeIndex = index;
            // 1 切换主职 2 删除 3 新增职位
            switch (type) {
                case 1:
                    let { orgType } = this.$baseMethod.getStore('roleOption');
                    //有总部职务为主职的时候 不能随意调整
                    let hasMain=this.ruleForm.positionList.find(i => i.positionType == 2 && i.departmentType == 1 && i.noSubmit != true)
                    //总部登录
                    let mainLogin=[0, 4, 5, 10].includes(orgType)
                    //分支机构的主职必须为登录用户的下属机构
                    let mainChild=this.ruleForm.positionList.find(i => i.positionType == 2).childFlag
                    if ((mainLogin&&hasMain)) {
                        //是否为总部登录调整总部职务
                        this.$message.error('当前人员主职为总部职务，需由总部人事调整');
                        return false;
                    } else if ((!mainLogin && hasMain) || (!mainLogin && !mainChild) || !row.childFlag) {
                        //分支机构
                        this.$message.error('当前人员主职为其他机构，您无法调整职务类型');
                        return false;
                    }else{
                         this.showPosition = true;
                    }
                    //设为主职未提交
                    row.noSubmit = true
                    // this.canMain(row).then(res => {
                    //     if (res === 'false') {
                    //         this.$message.error('当前人员主职为其他机构，您无法调整职务类型');
                    //         return false;
                    //     } else if (res === 'true') {
                    //         this.showPosition = true;
                    //     }
                    // });
                    break;
                case 2:
                    this.showDelete = true;
                    break;
                case 3:
                    this.ruleFormDept = { departmentId: '', departmentName: '', positionId: '', positionName: '' };
                    this.showAddPosition = true;
                default:
                    break;
            }
        },
        canMain(row) {
            let { orgType } = this.$baseMethod.getStore('roleOption');
            //需要判断是否能设为主职
            return new Promise((resolve, reject) => {
                //是否为总部登录调整总部职务
                if ([0, 4, 5, 10].includes(orgType) && row.departmentType == 1 ) {
                    this.$message.error('当前人员主职为总部职务，需由总部人事调整');
                    return false;
                }
                this.$axios('/personnel/urbanCoFunder/select', {
                    op: 'getOaCurrentDeparts',
                    data: JSON.stringify({
                         departmentId: row.departmentId,
                         positionId: row.positionId,
                         employeeId: this.employeeId,
                         departmentType: row.departmentType 
                         }),
                }).then(res => {
                    resolve(res.data);
                });
            });
        },
        // 确认删除
        deleteRow() {
            this.ruleForm.positionList.splice(this.changeIndex, 1);
            this.showDelete = false;
        },
        // 确认切换主职
        changeRow() {
            this.ruleForm.positionList.forEach(item => {
                item.positionType = 1;
                item.positionTypeName = '兼任';
                //是下属分支机构的依然可以删除 ，但不是的
                if(item.childFlag){
                    item.delFlag=true
                }
                // 
            });
            this.ruleForm.positionList[this.changeIndex].positionType = 2;
            this.ruleForm.positionList[this.changeIndex].positionTypeName = '主职';
            this.showPosition = false;
        },
        //重置
        reset() {
            this.searchPositon(this.ruleForm.employeeId);
        },
        //获取部门select
        getSelectValue(type) {
            // 部门;
            this.$axios('/personnel/urbanCoFunder/select', {
                op: 'getOaCurrentDepartTree',
                data: JSON.stringify({}), //type 0-全部，1-总部，2-分支机构
            }).then(res => {
                let data = JSON.parse(res.data);
                this.departmentOption = this.setDisabled(data);
            });
        },
        setDisabled(treeData) {
            treeData.forEach((data) => {
                if ([0, 4, 5, 10].includes(data.orgType)) {
                    data.disabled = true
                }
                if (data.childList) {
                    this.setDisabled(data.childList)
                }
            })
            return treeData
        },
        fetchPositions(id, orgType) {
            return new Promise((resolve, reject) => {
                this.$axios('/personnel/urbanCoFunder/select', {
                    op: 'deptPositions',
                    data: JSON.stringify({ orgType: orgType || this.roleOption.orgType, departmentId: id }),
                })
                    .then(res => {
                        let result = JSON.parse(res.data);
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        //根据部门查询职务
        handleChangeDept() {
            this.$nextTick(()=>{
                let checkNodes = this.$refs.selectDept.getCheckedNodes()[0];
                this.ruleFormDept.positionId = '';
                let id = this.ruleFormDept.departmentId[this.ruleFormDept.departmentId.length - 1];
                let orgType = checkNodes.data.orgType;
                console.log(checkNodes);
                if (id) {
                    // this.ruleFormDept.departmentName = deptNode.label;
                    this.fetchPositions(id, orgType).then(res => {
                        this.positionOptions = res.filter(i => i.name != '独立法人');
                    });
                }
            })
            
        },
        //职务显示字段
        handleChangePosition() {
            let info = this.positionOptions.filter(i => {
                return i.id == this.ruleFormDept.positionId;
            })[0];
            if (info) {
                this.ruleFormDept.positionName = info.name;
            }
        },
        //部门显示字段
        addDept(val, list) {
            list.unshift(val.label);
            if (val.parent) {
                this.addDept(val.parent, list);
            }
            return list.join('-');
        },
        //新增职位
        addPosition() {
            this.$refs['ruleFormDept'].validate(valid => {
                if (valid) {
                    let checkNodes = this.$refs.selectDept.getCheckedNodes()[0];
                    console.log(checkNodes);
                    let add = true;
                    let arr = {
                        departmentTypeName: '分支机构',
                        departmentType: 2,
                        positionTypeName: '兼任',
                        positionType: 1,
                        ...this.ruleFormDept,
                        departmentId: this.ruleFormDept.departmentId[this.ruleFormDept.departmentId.length - 1],
                        deptName: checkNodes.pathLabels.join('-'),
                        orgType: checkNodes.data.orgType,
                    };
                    this.ruleForm.positionList.forEach(item => {
                        if (item.departmentId == arr.departmentId && item.positionId == arr.positionId) {
                            add = false;
                            this.$message.error('职位已存在，不允许重复新增');
                        }
                    });
                    // 后端要求不加
                    // if (this.ruleForm.positionList.length >= 49) {
                    //     this.$message.error('职务最多允许添加50个')
                    //     return false
                    // }
                    //携带选项以及是否可删除职务
                    this.fetchPositions(arr.departmentId, arr.orgType).then(res => {
                        let positionOptions = res.filter(i => i.name != '独立法人');
                        this.$set(arr, 'positionListByDeptId', positionOptions);
                        this.$set(arr, 'delFlag', true);
                        this.$set(arr, 'childFlag', true);
                        if (add) {
                            this.ruleForm.positionList.push(arr);
                            this.showAddPosition = false;
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        afterQuery(list,id){
            this.auditProcessList = _.cloneDeep(list)
        },
        //处理数据
        createdApprovalInfo() {
            let result = [],
            allList = this.$refs.auditProcess.allList;
            this.procdefId = this.$refs.auditProcess.procdefId
            for (let i = 0; i < allList.length; i++) {
                const e = allList[i];
                let userIds = [];
                //memberType = 9 传所有ID，memberType != 9 有新增传新增，无新增传[]
                if(e.memberType !=9){
                  let origin = this.auditProcessList.filter(item=>item.nodeKey == e.nodeKey)[0]
                  if(origin.userInfos.length != e.userInfos.length){
                      e.userInfos.filter(item=>{return origin.userInfos.indexOf(item) == -1}).map(o=>{
                        userIds.push(o.id)
                      })
                  }else{
                    userIds= []
                  }
                }else{
                  for (let j = 0; j < e.userInfos.length; j++) {
                      userIds.push(e.userInfos[j].id);
                  }
                }
                let obj = {
                    nodeKey: e.nodeKey,
                    userIds
                };
                result.push(obj);
            }
            return result;
        },
        checkSamePosition(){
            let hash={}
            let returnValue=true
            this.ruleForm.positionList.reduce((prev,cur)=>{
                let key=''+cur.departmentId+cur.positionId
                if(hash[key]){
                    returnValue=false
                    return false
                }
                hash[key]=true
            },[])
            return returnValue
        },
        //提交申请
        submitForm(formName) {
            // let op = this.$route.query.id ? 'jaoTransferAgain' : 'jaoTransfer';
            console.log(this.$refs.uploadFile.pageFileList,'aa')
            let files = this.$refs.uploadFile.pageFileList.map(item=>{
                return{
                    // id:item.fileId,
                    name:item.fileName,
                    fileUrl:item.fileUrl,
                    fileType:item.fileType
                }
            })
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //check是不是有相同的分支机构和职务
                    if(!this.checkSamePosition()){
                        this.$message.error("任职信息存在重复职务！")
                        return false
                    }
                    if (this.checkedApprovaForm()) {
                        let ruleFormPositionList=this.$baseMethod.deepClone(this.ruleForm.positionList)
                        let positionList = ruleFormPositionList.map(i => { if (i.positionListByDeptId) { delete i.positionListByDeptId } return i })
                           let data = {
                                employeeId: this.ruleForm.employeeId,
                                jobTransferType: this.ruleForm.jobTransferType,
                                reason: this.ruleForm.reason,
                                positionList: positionList,
                                procDefId: this.isMainPostion ? null : this.$refs.auditProcess.procdefId,
                                flag: true,
                                approvalInfo: this.isMainPostion ? null : this.createdApprovalInfo(),
                                batchNo: this.batchNo,
                                files
                            };
                        //非超管 非主职
                        if (!this.isSuperAdmin && !this.isMainPostion && !data.procDefId) {
                            this.$message.error('当前审批未配置工作流，审批发起失败，请联系管理员处理');
                            return;
                        }
                        let opt = {
                            op: 'jobTransfer',
                            data: data,
                        };
                        this.isLoading = true;
                        this.$axios(this.getModuleUrl(opt.op), opt)
                            .then(res => {
                                //有新的工作流
                                this.isLoading = false;
                                if (res.code == 1) {
                                    if (res.msg == '001') {
                                        this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提交失败', {
                                            confirmButtonText: '确定',
                                            showCancelButton: false,
                                            closeOnClickModal: false,
                                            showClose: false,
                                            center: true,
                                        }).then(() => {
                                            this.$refs.auditProcess.getFlowable();
                                        });
                                    } else if (res.msg == '员工最新的任职岗位有变动，提交失败，确认将重置岗位信息') {
                                        this.$confirm('员工最新的任职岗位有变动，提交失败，确认将重置岗位信息', '提交失败', {
                                            confirmButtonText: '确定',
                                            showCancelButton: false,
                                            closeOnClickModal: false,
                                            showClose: false,
                                            center: true,
                                        }).then(() => {
                                            this.reset();
                                        });
                                    } else if (res.msg == '岗位列表内存在部门或职位已被管理员删除，提交失败，确认将重置岗位信息') {
                                        this.$confirm('岗位列表内存在部门或职位已被管理员删除，提交失败，确认将重置岗位信息', '提交失败', {
                                            confirmButtonText: '确定',
                                            showCancelButton: false,
                                            closeOnClickModal: false,
                                            showClose: false,
                                            center: true,
                                        }).then(() => {
                                            this.reset();
                                            this.getSelectValue(1);
                                        });
                                    } else {
                                        this.$message.success('提交成功！');
                                        this.$router.replace({ path: '/workbench/BRcityCreator', query: { isUpdate: 2 } });
                                    }
                                }
                            })
                            .catch(err => {
                                this.isLoading = false;
                            });
                    } else if (!this.isMainPostion && !this.isSuperAdmin) {
                        this.$message.error('还有审批人没选择，请补充完整');
                    }
                } else {
                    return false;
                }
            });
        },
        checkedApprovaForm() {
            if (this.isMainPostion || this.isSuperAdmin) {
                return true;
            }
            let allList = this.$refs.auditProcess.allList;
            const arr = allList.filter(item => {
                return item.memberType == 3 || item.memberType == 4;
            });
            return arr.every(item => {
                return item.userInfos.length > 0;
            });
        },
        //员工岗位查询
        getDetials(id) {
            let opt = {
                data: {
                    id: id,
                },
                op: 'selectDetails',
            };
            this.$axios('/personnel/transfer/select', opt).then(res => {
                let ruleForm = JSON.parse(res.data);
                this.searchPositon(ruleForm.employeeId);
                this.ruleForm.jobTransferType = ruleForm.jobTransferType;
                this.ruleForm.jobTransferDate = ruleForm.jobTransferDate + ' 00:00:00';
                this.ruleForm.reason = ruleForm.reason;
                this.ruleForm.name = this.$route.query.employeeName;
                this.ruleForm.jobNumber = this.$route.query.jobNumber;
                this.ruleForm.employeeId = this.$route.query.employeeId * 1;
            });
        },
        resetList() {
            if (this.$route.query.id) {
                this.getDetials(this.$route.query.id);
            } else {
                this.searchPositon(this.ruleForm.employeeId);
            }
            this.showErr = false;
        },
        handleSelectVisible() {
            this.dialogVisible = true;
        },
        back() {
            this.$router.push({
                path: '/workbench/BRcityCreator',
                query: {},
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
    },
};
</script>

<style lang="scss" scoped>
.form-wrap {
    // margin-bottom: 64px;
    padding: 0 !important;
    border-radius: 8px;
    background: #fff;
    height: 100%;
    .fee-info {
        background-color: #fff;
        padding: 32px 40px 32px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 32px;
        margin-top: -3px;
    }
    .pb-12 {
        // padding: 32px 40px 12px;
        .pb-title {
            font-size: 16px;
            font-weight: bold;
            margin: 32px 0 20px 0;
        }
    }
    .title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #303133;
        text-align: center;
    }
    .title-info {
        margin-top: -5px;
        margin-bottom: -14px;
    }
    .el-form {
        margin-top: 32px;
        margin-bottom:50px;
    }
    /deep/.el-form-item__error {
        padding-top: 0px;
    }
    /deep/.el-table {
        margin-bottom: 8px;
        .cell {
            // height: 20px;
        }
        .el-button--medium {
            height: 20px;
            padding: 0;
        }
    }
    /deep/ .el-form-item {
        margin-bottom: 14px !important;
    }
    /deep/.el-form-item__label {
        padding: 0 0 3px 0;
    }
    /deep/ .el-form-item__content {
        margin-bottom: 6px;
    }
    .form-input-item {
        /deep/ .el-form-item__label {
            width: 60px !important;
            text-align: left;
            vertical-align: middle;
            float: left;
        }
        /deep/ .el-form-item__content {
            margin-left: 60px !important;
        }
    }
    .form-table-item {
        position: relative;
        /deep/ .el-form-item__label {
            font-size: 16px;
            font-weight: bold;
            padding: 0 0 7px 0;
            position: absolute;
        }
        /deep/ .el-form-item__content {
            // margin-top:50px;
        }
        &::before {
            clear: both;
        }
    }
}
/deep/.el-date-editor,
/deep/.el-select,
/deep/.el-cascader {
    width: 100%;
}
/deep/.el-dialog--center .el-dialog__body {
    text-align: center;
}
.btnBox {
    text-align: right;
    .addBtn {
        background: #ffffff;
        color: #f05259;
        margin-left: 16px;
        margin-bottom: 8px;
    }
}
/deep/ .currency-apply-audit {
    padding: 0;
}
/deep/ .has-gutter .el-table__cell {
    padding: 2px 0;
}
/deep/ .el-table th {
    padding: 2px 0;
}
</style>
