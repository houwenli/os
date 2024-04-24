<template>
  <div>
    <div class="taskFlowEdit">
        <div class="form-person-wrap">
            <div class="header">基础信息</div>
            <div class="formAll">
                <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                    <el-row type="flex" :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="业务类型:" prop="category">
                                <el-select v-model.trim="form.category" placeholder="请选择" style="width: 100%" clearable :disabled="editDisabled " @change="handleCategoryChange">
                                    <el-option v-for="item of businessTypeOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="工作流名称:" prop="flowNameId">
                                <el-select v-model.trim="form.flowNameId" placeholder="请选择" style="width: 100%" clearable :disabled="editDisabled">
                                    <el-option v-for="item of flowNamesOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="描述:" prop="descr">
                                <el-input
                                    type="textarea"
                                    :rows="1"
                                    :autosize="{ minRows: 1.3, maxRows: 4 }"
                                    placeholder="请输入工作流描述"
                                    v-model="form.descr"
                                    maxlength="50"
                                    show-word-limit
                                    ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div style="overflow: hidden">
                <div class="middle tag-line">
                    <div class="middleTitle " :class='showHighSettingPanel && activeSetting === 1 ? "active-setting": ""' @click='onChangeSetPanel(1)'>流程设置</div>
                    <div v-if='showHighSettingPanel' class='middleTitle' :class='activeSetting === 2 ? "active-setting": ""' style="margin-left: 16px" @click="onChangeSetPanel(2)">高级设置</div>
                </div>
                <div :style="{ height: taskFlowHeight }" class="taskFlow" v-show='activeSetting === 1'>
                    <FlowChart
                        :nodeList="nodeList"
                        :propObj="propObj"
                        @editFlowNode="handleEditFlowNode"
                        @addFlowNode="handleAddFlowNode"
                        @delFlowNode="handleDelFlowNode"
                        @changeFlowNodeName="handleChangeFlowNodeName"
                    >
                    </FlowChart>
                </div>
                <!-- 高级设置 -->
                <div style="background: #fff; min-height: 500px"  v-if='activeSetting === 2 && hasDetailData'>
                  <highSettings  :config="form.flowConfig" @update='updateHighSettingsConfig' :disabled="false"></highSettings>
                </div>
            </div>

        </div>


        <!-- 节点编辑 由侧抽屉 -->
        <el-drawer title="" :visible.sync="eidtFlowNodeVisible" class="editDrawer" :size="'800px'" :wrapperClosable="false">
            <div style="" class="drawerDiv">
                <div style="" class="titleDiv">
                    <span style="">{{ editDialogTitle }}</span>
                </div>
                <el-form ref="dig_addFlowNode" :model="nodeForm" label-width="130px" :rules="nodeRules">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="节点名称:" prop="nodeName">
                                <el-input v-model.trim="nodeForm.nodeName" :maxlength="10" placeholder="请输入节点名称" style="width: 280px"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="节点类型:" prop="nodeType">
                                <el-select clearable v-model.trim="nodeForm.nodeType" placeholder="请选择" @change="handelNodeTypeChange" style="width: 280px">
                                    <el-option v-for="item in nodeTypes" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <div style="display: flex; width: 100%">
                                <el-form-item label="设置成员:" prop="personType">
                                    <el-select :disabled="isPersonDisabled" clearable v-model.trim="nodeForm.personType" placeholder="请选择" style="width: 280px" @change="handelPersonTypeChange">
                                        <el-option v-for="item in personTypes" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="" label-width="10px" v-show="nodeForm.personType == 1 || nodeForm.personType == 5 || nodeForm.personType == 7">
                                    <el-button size="mini" type="primary" class="addMember" :icon="!nodeForm.tagItems.length ? 'el-icon-circle-plus' : ''" @click="handleSetPerson">
                                        {{ nodeForm.tagItems.length ? '修改成员' : '指定成员' }}
                                    </el-button>
                                </el-form-item>

                                <el-form-item label="" label-width="10px" v-show="nodeForm.personType == 2">
                                    <el-button
                                        size="mini"
                                        type="primary"
                                        class="addMember"
                                        :icon="!(nodeForm.personGroup && nodeForm.personGroup.name) ? 'el-icon-circle-plus' : ''"
                                        @click="handleSetPersonGroup"
                                    >
                                        {{ !(nodeForm.personGroup && nodeForm.personGroup.name) ? '指定账号组' : '修改账号组' }}
                                    </el-button>
                                </el-form-item>

                                <div v-show="nodeForm.personType == 1">
                                    <span class="personCount">不能超过</span>
                                    <span class="personCount">{{ treeSelectMaxCount }}</span>
                                    <span class="personCount">人</span>
                                </div>
                            </div>
                        </el-col>

                        <!-- 8直属上级才显示 几级主管 -->
                        <el-col :span="24" v-if="nodeForm.personType == 8">
                            <el-form-item label="发起人的:" prop="managerLevel">
                                <el-select clearable v-model.trim="nodeForm.managerLevel" placeholder="请选择" style="width: 280px">
                                    <el-option v-for="item in managerLevelList" :label="'第'+item+'级主管'" :value="item" :key="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24" v-if="nodeForm.tagItems.length && (nodeForm.personType == 1||nodeForm.personType == 5||nodeForm.personType == 7)">
                            <div style="display: flex; width: 100%; margin-left: -5px">
                                <el-form-item label="" prop="tagItems" style="flex: 1">
                                    <el-tag
                                        v-for="(item) in nodeForm.tagItems"
                                        :key="item.id"
                                        :type="'info'"
                                        closable
                                        @close="handleCloseTag(item)"
                                        effect="plain"
                                        style="margin-left: 5px; background: #f0f2f5"
                                    >
                                        {{ item.label }}
                                    </el-tag>
                                    <el-button size="mini" type="text" class="clearBtns" style="" @click="removeAllTag()">清空</el-button>
                                </el-form-item>
                            </div>
                        </el-col>

                        <el-col :span="24" v-if="nodeForm.personGroup && nodeForm.personGroup.name && nodeForm.personType == 2">
                            <div style="display: flex; width: 100%">
                                <el-form-item label="" prop="nodeId" style="flex: 1">
                                    <div class="groupDiv">
                                        <el-image :src="require('@/assets/images/team.png')" fit="fill"></el-image>
                                        <div class="contentDiv">
                                            <div style="color: #909399">{{ nodeForm.personGroup.name }}</div>
                                            <div style="color: #c0c4cc">{{ nodeForm.personGroup.userNum + ' 人' }}</div>
                                        </div>
                                        <div style="display: flex">
                                            <img src="../../../assets/images/icon_close.png" class="closeGroup" @click="handleGroupclose" alt="" />
                                        </div>
                                    </div>
                                </el-form-item>
                            </div>
                        </el-col>

                        <!-- 选择直属机构才显示 -->
                        <el-col :span="24" v-if="nodeForm.personType == 12">
                            <div style="display: flex; width: 100%">
                                <el-form-item label="机构类型:" prop="orgType">
                                    <el-select clearable v-model.trim="nodeForm.orgType" placeholder="请选择" style="width: 280px" @change="changePosition">
                                        <el-option v-for="item in orgType" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="" label-width="10px" v-if="nodeForm.orgType">
                                    <el-button size="mini" type="primary" class="addMember" icon='el-icon-circle-plus' @click="handleSetPosition">
                                        添加审批职务
                                    </el-button>
                                </el-form-item>
                            </div>
                        </el-col>

                        <el-col :span="24" v-if="nodeForm.positionList.length">
                            <div style="display: flex; width: 100%; margin-left: -5px">
                                <el-form-item label="" prop="tagItems" style="flex: 1">
                                    <el-tag
                                        v-for="item in nodeForm.positionList"
                                        :key="item.id"
                                        :type="'info'"
                                        closable
                                        @close="handleClosePosition(item)"
                                        effect="plain"
                                        style="margin-left: 5px; background: #f0f2f5"
                                    >
                                        {{ item.name }}
                                    </el-tag>
                                    <el-button size="mini" type="text" class="clearBtns" style="" @click="removeAllPosition">清空</el-button>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item
                                label="多人审批方式:"
                                prop="nodeSpType"
                                v-if="personsApproval"
                            >
                                <el-radio-group v-model.trim="nodeForm.nodeSpType">
                                    <el-radio :label="item.id" v-for="(item) in nodeSpTypes" :key="item.id">{{ item.name }}{{ item.describe }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item prop="backupUserId" v-if="nodeForm.personType == 12 || nodeForm.personType == 8">
                                <span slot='label'>
                                    审批人为空时
                                    <el-popover trigger="click" placement="top" width="350">
                                        <div style="font-weight:600">什么情况下会出现审批人为空？</div>
                                        <div>1、设置了“直属上级”审批，但申请人在组织架构中的直属上级没有任何成员。</div>
                                        <div>2、审核节点的人员均已离职。</div>
                                        <img slot="reference" class='showDetail' src="@/assets/images/icon_doubt.png" alt="">
                                    </el-popover>
                                    :
                                </span>
                                <el-radio-group v-model.trim="nodeForm.approvalNUll">
                                    <el-radio :label="0">自动通过</el-radio>
                                    <el-radio :label="1">
                                        指定人员审批

                                        <el-button class="addMember" v-if='nodeForm.approvalNUll===1' size="mini" :icon="!nodeForm.selectTopPersons.length ? 'el-icon-circle-plus' : ''" type="primary" @click="handleSetTopPerson">
                                            {{ nodeForm.selectTopPersons.length ? '修改成员' : '指定成员' }}
                                        </el-button>
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24" v-if="nodeForm.selectTopPersons.length && nodeForm.approvalNUll === 1">
                            <div style="display: flex; width: 100%; margin-left: -5px">
                                <el-form-item label="" prop="tagItems" style="flex: 1">
                                    <el-tag v-for="item in nodeForm.selectTopPersons" :key="item.id" :type="'info'" effect="plain" style="margin-left: 5px; background: #f0f2f5">
                                        {{ item.label }}
                                    </el-tag>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="btns">
                    <el-button @click="handleEidtNodeCancle()">返回</el-button>
                    <el-button type="primary" @click="CommitEidtNode()" :loading="saveLoading">确认</el-button>
                </div>
            </div>
        </el-drawer>
        <el-dialog class="dialogEnter" title="提示" :visible.sync="centerDialogVisible" width="30%" append-to-body center>
            <span>当前工作流已存在数据，无法新增，你可以前往列表直接编辑</span>
            <span slot="footer">
                <el-button type="primary" @click="centerDialogVisible=false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- /systemManage/role -->
        <TreeSelect
            v-if="treeSelectVisable"
            :dialogVisible.sync="treeSelectVisable"
            :title="treeSelectTitle"
            :expandOnClickNode="false"
            :moduleName="'/systemManage/taskFlow'"
            :listModuleName="'/systemManage/taskFlow'"
            :funcDefaultNode="funcDefaultNode"
            :maxCount.sync="treeSelectMaxCount"
            :opObj="{ selectTree: 'selectOrganizationalTreeByidNew', selectList: 'listByFuzzyNameNew' }"
            :funcRoleProps="{
                label: 'name',
                value: 'id',
                children: 'children',
                isLeaf: 'leaf',
                disabled: setTreeDisabled
            }"
            @visibleChanged="
                val => {
                    treeSelectVisable = val;
                }
            "
            @checkedNodeChange="getCheckedNodeList"
        ></TreeSelect>

        <GroupSelect
            :dialogVisible.sync="groupSelectVisable"
            :title="groupSelectTitle"
            @visibleChanged="
                val => {
                    groupSelectVisable = val;
                }
            "
            @selectGroup="handleSelectGroup"
        ></GroupSelect>

        <PositionList
            v-if="positionVisible"
            :dialogVisible.sync="positionVisible"
            :pList="pList"
            :positionList="nodeForm.positionList"
            :title="positionTitle"
            @commit="commitPosition"
        />
        <ws-footer>
          <el-button @click="goBack">返回</el-button>
          <el-button type="primary" @click="onSubmit" :loading="saveLoading">确认</el-button>
        </ws-footer>
    </div>
  </div>
</template>

<script>
import FlowChart from '@/components/FlowChart/flowChart.vue';
import TreeSelect from '@/components/treeSelect/treeSelect.vue';
import GroupSelect from './components/groupSelect.vue';
import PositionList from './components/positionList.vue'
import { createId } from '@/utils';
import {groups, getManagerLevelList} from "./config"
import highSettings from './components/highSettings.vue'
// 全部审批流字典
import {opsEnums} from '@/views/home/auditFlow/allApprovalRecord/data.js'
import {cloneDeep} from 'lodash-es'

//设置流程图中节点内容
const setContent = (nodeFrom, objKey) => {
    let content = '';
    // 直属上级不需要显示名字
    if (nodeFrom.personType!=8 && nodeFrom[objKey.personType] && ((nodeFrom[objKey.personGroup] && nodeFrom[objKey.personGroup].name) || nodeFrom[objKey.person])) {
        content = nodeFrom[objKey.personType] == 2 ? nodeFrom[objKey.personGroup].name + ' ' + nodeFrom[objKey.personGroup].userNum + '人' : nodeFrom[objKey.person];
    } else if (nodeFrom.personType!=8 && nodeFrom[objKey.person]) {
        content = nodeFrom[objKey.person];
    }
    return content;
};

export default {
    name: 'taskFlowAdd',
    components: { FlowChart, TreeSelect, GroupSelect, highSettings, PositionList },
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === 0 || !value || value === '') {
                let errorString = '';
                if (rule.field == 'category') {
                    errorString = '请选择业务类型';
                } else if (rule.field == 'flowNameId') {
                    errorString = '请选择工作流名称';
                }
                callback(new Error(errorString));
            } else {
                callback();
            }
        };
        var validateDuplicate = (rule, value, callback) => {
            if (!this.editDisabled && this.form.category && this.form.flowNameId) {
                let queryData = {
                    category: this.form.category,
                    flowNameId: this.form.flowNameId
                };
                this.$axios(this.$getModuleUrl('/systemManage/taskFlow', 'checkDuplicate'), {
                    op: 'checkDuplicate',
                    data: queryData
                }).then(res => {
                    const result = JSON.parse(res.data);
                    if (result.msg == true) {
                        this.typeDuplicate = true;
                        this.centerDialogVisible = true;
                    }else{
                        this.typeDuplicate = false;
                    }
                    callback()
                });
            } else {
                callback();
            }
        };
        return {
            //任务流表单验证规则
            rules: {
                category: [
                    { required: true, message: '请选择业务类型', trigger: 'change' },
                    { validator: validatePass, trigger: 'change' },
                    { validator: validateDuplicate, trigger: 'change' }
                ],
                flowNameId: [
                    { required: true, message: '请选择工作流名称', trigger: 'change' },
                    { validator: validatePass, trigger: 'change' },
                    { validator: validateDuplicate, trigger: 'change' }
                ],
                descr: [{ required: true, message: '请输入描述信息', trigger: 'blur' }]
            },
            //节点表单验证规则
            nodeRules: {
                nodeType: [{ required: true, message: '请选择节点类型', trigger: 'change' }],
                personType: [{ required: true, message: '请选择节点成员', trigger: 'change' }],
                nodeSpType: [{ required: true, message: '请选择审批方式', trigger: 'change' }],
                nodeName: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
                orgType: [{ required: true, message: '请选择机构类型', trigger: 'change'}],
                managerLevel:[{ required: true, message: '请选择主管层级', trigger: 'change'}]
            },
            /**
             * 详情接口数据
             */
            form: {
                category: '', //业务类型
                flowNameId: '', //工作流名称
                descr: '', //描述

                flowConfig: {
                  addSign: 0,
                  addTrans: 0,
                  addCcTask: 0,
                  addComment:0
                }
            },
            //记录前一个选择的工作流类型
            prevForm:{
                category: '',
                flowNameId: '',
            },


            nodeList: [],

            propObj: {
                nodeName: 'label', //节点名称
                nodeType: 'nodeType', //节点类型 sp:审批  cs:抄送
                personType: 'personType', //成员类型
                personTypeName: 'personTypeName', //人员类型名称
                nodeSpType: 'nodeSpType', //审批方式
                nodeSpTypeName: 'nodeSpTypeName', //审批方式名称
                personGroup: 'personGroup', // 账号组
                setContent: setContent, //设置节点展示内容
                person: 'person', // 成员名list
                managerLevel:'managerLevel',
                approvalNUll: 'approvalNUll', //审批人为空
                selectTopPersons: 'selectTopPersons', //上级主管选定人员
                backupUserId:'backupUserId',//返回的审批人不为空的指定人员
                backupUserName:'backupUserName',//返回的审批人不为空的指定人员名称

                // orgType: 'orgType',
                // positionList: 'positionList'
            },
            editNode: null,
            currentAddIndex: -1,
            currentEditIndex: -1,
            saveLoading: false,
            routeQuery: this.$route.query,
            //业务类型
            businessTypeOptions: [],
            // 工作流名称选项
            flowNamesOptions: [],
            eidtFlowNodeVisible: false,
            editDialogTitle: '',
            nodeForm: {
                nodeType: '', //节点类型
                personType: '', //设置成员类型
                nodeSpType: '', //审批方式
                nodeName: '', //节点名称
                personTypeName: '', //成员类型名称
                personGroup: { name: '' }, //账号组
                tagItems: [],
                selectTopPersons: [], //选择直属上级指定人员
                approvalNUll: 0 ,//审批人为空，
                backupUserId:null,
                backupUserName:null,
                managerLevel:'1',//发起人的

                orgType:'',
                positionList:[]
            },

            nodeTypes: [
                { name: '审核人', id: '1' },
                { name: '抄送人', id: '2' }
            ],
              managerLevelList: getManagerLevelList(),
            nodeSpTypes: [
                { name: '依次审批', describe: '（按顺序依次审批）', id: 1 },
                { name: '会签', describe: '（须所有成员同意）', id: 2 },
                { name: '或签', describe: '（一名成员同意即可）', id: 3 }
            ],
            personTypesAll: [
                { name: '指定成员', id: 1 },
                { name: '指定账号组', id: 2 },
                { name: '发起人自选1人', id: 3 },
                { name: '发起人自选多人', id: 4 },
                { name: '指定成员', id: 5 },
                { name: '发起人自选', id: 6 },
                { name: '指定成员+自选', id: 7 },
                { name: '直属上级', id: 8 },
                { name: '独立法人公司', id: 9 },
                { name: '直属机构', id: 12 },
                { name: '认领', id: 13 }
            ],
            personTypes: [],
            nowGroup:"",//当前选中的工作流所在组(控制设置成员选项)
            typeDuplicate: false,//工作类型重复

            isPersonDisabled: true, //人员类型是否禁用
            funcDefaultNode: [], //1247
            treeSelectVisable: false,
            treeSelectTitle: '指定成员',
            treeSelectMaxCount: 50, //树选控件最多允许选择的人数
            MaxCount: 50,
            checkedPersonList: [],
            groupSelectVisable: false,
            groupSelectTitle: '指定账号组',
            procdefInfoId: '', //工作流ID
            centerDialogVisible:false,
            editDisabled: true,
            // 流程设置-1; 高级设置-2
            activeSetting: 1,

            hasDetailData: false,
            positionVisible: false,

            orgType:[
                {name:'实体店', id: 40},
                {name:'服务中心', id: 30},
                {name:'分公司', id: 20},
                {name:'大区', id: 5},
            ],
            pList:[],
            positionTitle:'',
        };
    },
    computed: {
        titleStr({ routeQuery }) {
            return { add: '添加流程', edit: '编辑流程' }[routeQuery.type];
        },
        taskFlowHeight() {
            return 'calc(100vh - 375px)';
        },

        showHighSettingPanel() {
          return this.$getModuleUrl('/systemManage/taskFlow', 'highSettings')
        },
        /**
         * 是否显示多人审批方式
         * 1、设置成员为： 指定成员 personType=1 且选择的人数大于0， 显示
         * 2、指定账号组， 且选择了一个帐号组 personType=2， 显示
         * 3、发起人自选多人 personType=4， 显示
         * 4、直属上级 personType=8
         * 5、直属机构 personType = 12
         */
        personsApproval() {
          let personType = this.nodeForm.personType
          let nodeType = this.nodeForm.nodeType

          // 发起人自选多人-4; 直属上级-8 ; 直属机构 - 12
          if ([4,8, 12].includes(personType)) return true

          if (nodeType == '1') {
            if (personType === 1 && this.nodeForm.tagItems.length > 0) return true

            if (personType === 2 && this.nodeForm.personGroup && this.nodeForm.personGroup.name) return true

            return false
          } else {
              return false
          }
        }
    },
    created() {
        const {type, flowNameId, category} = this.$route.query

        this.form.category = Number(category)
        this.form.flowNameId = Number(flowNameId)

        this.setBusinessTypeOptions()

        //获取人员选择框中最大人数限制值
        this.getMaxCount();

        //编辑，详情调用接口，新增不调用
        if (type == 'edit') {
            this.getFlowData();
        } else if (type == 'add') {
          this.hasDetailData = true
          this.nodeList = [
              { id: 'start_userTask', label: '发起人', nodeType: 'start', person: '系统预设' },
              { id: 'endNode1', label: '', nodeType: 'end', person: '流程结束' }
          ];
        }
    },
    watch: {
        eidtFlowNodeVisible: {
            handler(val, oldVal) {
                if (!val && this.$refs['dig_addFlowNode']) {
                    this.$refs['dig_addFlowNode'].resetFields();
                    this.$nextTick(() => {
                        this.$refs['dig_addFlowNode'].clearValidate();
                    });
                }
            },
            immediate: true
        },
        'nodeForm.nodeType': {
            handler(val, oldVal) {
                if (!val) {
                    this.isPersonDisabled = true;
                } else {
                    this.isPersonDisabled = false;
                }
            },
            immediate: true
        },
        'nodeForm.personType': {
            handler(val, oldVal) {
                if (val == 2 || val == 8) {
                    this.nodeSpTypes = [
                        { name: '会签', describe: '（须所有成员同意）', id: 2 },
                        { name: '或签', describe: '（一名成员同意即可）', id: 3 }
                    ];
                    this.nodeForm.nodeSpType = 3;
                } else {
                    this.nodeSpTypes = [
                        { name: '依次审批', describe: '（按顺序依次审批）', id: 1 },
                        { name: '会签', describe: '（须所有成员同意）', id: 2 },
                        { name: '或签', describe: '（一名成员同意即可）', id: 3 }
                    ];
                    this.nodeForm.nodeSpType = 1;
                }
                if (val !== 2) {
                    this.nodeForm.personGroup = { name: '' };
                }
                if(val !==8 && val !== 12){
                    this.nodeForm.approvalNUll = 0
                }
                // 切换时清空
                // this.checkedPersonList=[]
            },
            immediate: true
        },
        'nodeForm.approvalNUll':{
            handler(val){
                if(val==0){
                    //清空指定上级
                    this.nodeForm.selectTopPersons=[]
                    // this.nodeForm.checkedPersonList=[]
                    //  this.checkedPersonList=[]
                }
            },
            immediate:true
        },

        'nowGroup':{
            handler(val){
                if(val){
                    //根据所在组设置 设置成员 的选项列表
                   this.setPersonTypeOptions(val)
                }

            },
            immediate:true
        }
    },
    methods: {
        /**
         * 切换流程设置和高级设置
         */
        onChangeSetPanel(type) {
            if (type === this.activeSetting) return

            this.activeSetting = type
        },

        /**
         * 更新高级设置
         */
        updateHighSettingsConfig(config) {
            Object.assign(this.form.flowConfig, config)
        },
        computedClearFlowConfig(){
          // 这里很关键-新增的类型需要去修改 ./config.js 里面的groups
            this.nowGroup=this.queryGroup(this.form)

            if(!this.form.category||!this.form.flowNameId||!this.prevForm.category||!this.prevForm.flowNameId){
                return false
            }
            let prevGroup=this.queryGroup(this.prevForm)

            if(this.nowGroup != prevGroup){
                //不在一组 清空工作流节点
                this.nodeList = [
                    { id: 'start_userTask', label: '发起人', nodeType: 'start', person: '系统预设' },
                    { id: 'endNode1', label: '', nodeType: 'end', person: '流程结束' }
                 ];
            }
        },
        queryGroup({category,flowNameId}){
          /**
           * groups 来源 /config.js里面
           */
            for (const [key, keyGroup] of Object.entries(groups)) {
                const isExit=keyGroup.some((i)=>{
                    return i.category==category && i.flowNameId==flowNameId
                })
                if(isExit){ return key }
            }
        },
        //设置审核选项
        setPersonTypeOptions(val){
            switch(val){
                case 'A':
                  //设置成员的下拉选项为：指定成员、指定账号组
                     this.personTypes = this.personTypesAll.filter(item => {
                        return item.id == 1 || item.id == 2 ;
                    });
                    break;
                case 'B'://设置成员的下拉选项为：直属上级、指定成员、指定账号组、发起人自选（1人）、发起人自选（多人）
                     this.personTypes = this.personTypesAll.filter(item => {
                        return item.id == 1 || item.id == 2 ||item.id == 3 || item.id == 4 || item.id == 8;
                    });
                    break;
                case 'C'://直属上级、独立法人公司、指定成员、指定账号组、发起人自选（1人）、发起人自选（多人）、直属机构
                     this.personTypes = this.personTypesAll.filter(item => {
                        return item.id == 1 || item.id == 2 || item.id == 3 || item.id == 4 || item.id == 8 || item.id == 9 || item.id ==12;
                    });
                    break;
                case 'D'://指定成员、指定账号组、发起人自选（1人）、发起人自选（多人）
                     this.personTypes = this.personTypesAll.filter(item => {
                        return item.id == 1 || item.id == 2 ||item.id == 3 || item.id == 4;
                    });
                    break;
                case 'E'://认领
                     this.personTypes = this.personTypesAll.filter(item => {
                        return item.id == 13;
                    });
                    break;
            }
            this.pushPositionSetting()
        },

        //设置树的禁用状态
        setTreeDisabled(node, data) {
            return !data.isLeaf;
        },

        setBusinessTypeOptions() {
          this.businessTypeOptions = cloneDeep(opsEnums)
          const item = cloneDeep(opsEnums).find(item => item.id === this.form.category)

          if(item) {
            this.flowNamesOptions = item.list
          }

          this.computedClearFlowConfig()
        },
        //获取流程业务类型
        getBusinessTypeOptions() {
          this.businessTypeOptions = cloneDeep(opsEnums)
        },
        //获取人员选择人数限制
        getMaxCount() {
            this.$axios(this.$getModuleUrl('/systemManage/taskFlow', 'getMaxNumberOfPeople'), {
                op: 'getMaxNumberOfPeople',
                data: '{}'
            }).then(res => {
                if (res.code == 1) {
                    this.MaxCount = Number(res.data ? JSON.parse(res.data) : Number.MAX_SAFE_INTEGER);
                }
            });
        },
        //选择业务分类时
        handleCategoryChange() {
            //业务分类切换时清空工作流名称
            this.form.flowNameId=""

        },

        //流程图中添加节点
        handleAddFlowNode({ item, i } = data) {
            if (this.typeDuplicate) {
                this.$message.error("请重新选择工作流名称")
                return;
            }
            if(!this.form.category||!this.form.flowNameId){
                this.$message.error("请先选择工作流名称")
                return
            }
            this.editDialogTitle = '新增节点';
            this.currentAddIndex = i;
            this.eidtFlowNodeVisible = true;
            // this.nodeForm.tagItems = [];
            this.checkedPersonList = [];
            this.funcDefaultNode = [];
            // this.nodeForm.selectTopPersons=[]
            // 重置参数
            this.nodeForm={
                nodeType: '', //节点类型
                personType: '', //设置成员类型
                nodeSpType: '', //审批方式
                nodeName: '', //节点名称
                personTypeName: '', //成员类型名称
                personGroup: { name: '' }, //账号组
                tagItems: [],
                selectTopPersons: [], //选择直属上级指定人员
                approvalNUll: 0, //审批人为空
                backupUserId:null,
                backupUserName:null,
                managerLevel:'1',

                orgType:'',
                positionList:[]
            }
        },
        //流程图中编辑节点
        handleEditFlowNode({ item, i } = data) {
            this.editDialogTitle = '编辑节点';
            this.currentEditIndex = i;
            this.editNode = item;

            let nodeNameKey = this.propObj['nodeName'];
            let nodeTypeKey = this.propObj['nodeType'];
            let personType = this.propObj['personType'];
            let nodeSpType = this.propObj['nodeSpType'];
            let personTypeNameKey = this.propObj['personTypeName'];
            let personGroupKey = this.propObj['personGroup'];
            let backupUserIdKey=this.propObj['backupUserId'];
            let backupUserNameKey=this.propObj['backupUserName'];
            let approvalNUllKey=this.propObj['approvalNUll'];
            let managerLevel = this.propObj['managerLevel']

            this.nodeForm.nodeName = this.editNode[nodeNameKey];
            this.nodeForm.nodeType = this.editNode[nodeTypeKey] == 'sp' ? '1' : '2';
            this.nodeForm.personType = this.editNode[personType];
            this.nodeForm.personTypeName = this.editNode[personTypeNameKey];
            this.nodeForm.personGroup = this.editNode[personGroupKey];
            this.nodeForm.backupUserId=this.editNode[backupUserIdKey];
            this.nodeForm.backupUserName=this.editNode[backupUserNameKey];
            this.nodeForm.orgType = this.editNode.orgType
            this.nodeForm.managerLevel=this.editNode[managerLevel]
            this.nodeForm.positionList = this.editNode.positionList || []

            this.getPersonPostOption(this.nodeForm.orgType)
            if(this.editNode[backupUserIdKey]){
                this.nodeForm.approvalNUll = 1
            }else{
                this.nodeForm.approvalNUll=this.editNode[approvalNUllKey] || 0;
            }
            //重新选取positionList的标题
            if(this.editNode.orgType) {
                let arr = this.orgType.filter(item => item.id == this.editNode.orgType)
                this.positionTitle = '指定' +  arr[0].name + '审批职务'
            }

            //重新设置人员类型选择面板
            if (this.nodeForm.nodeType == '1') {
                this.treeSelectMaxCount = this.MaxCount;
                  //重新设置成员类型
                let key = this.nowGroup
                const {name, category} = this.$route.query

                // 设置为A  司机合伙人申请这种类型只显示2种 设置成员: 的下拉
                if(name === '司机合伙人申请' && category === '1' ) {
                  key = 'A'
                }
                this.setPersonTypeOptions(key)
            } else if (this.nodeForm.nodeType == '2') {
                this.treeSelectMaxCount = Number.MAX_SAFE_INTEGER;
                this.personTypes = this.personTypesAll.filter(item => {
                    return item.id == 0 || item.id == 5 || item.id == 6 || item.id == 7;
                });
            }

            this.checkedPersonList = this.editNode.checkedPersonList;

            this.nodeForm.tagItems = this.editNode.checkedPersonList?.map(item => {
                let newItem = {};
                newItem.id = item.id;
                newItem.label = item.name;
                return newItem;
            });

            this.nodeForm.selectTopPersons=this.editNode.selectTopPersons?this.editNode.selectTopPersons.map(item=>{
                return{
                   ...item,
                   name:item.label
                }
            }):[]
            if(this.editNode[backupUserIdKey] && (this.editNode[personType] == 8) || this.editNode[backupUserIdKey] && (this.editNode[personType] == 12)){
                this.nodeForm.selectTopPersons=this.nodeForm.tagItems?this.nodeForm.tagItems.map((item)=>{
                   return{
                   ...item,
                   name:item.label
                }
                }):[]
            }
            this.$nextTick(() => {
                this.nodeForm.nodeSpType = this.editNode[nodeSpType];
            });
            this.eidtFlowNodeVisible = true;
        },
        handleDelFlowNode({ item, i } = data) {
            //  this.nodeList.splice(i, 1);
        },
        handleChangeFlowNodeName({ item, i } = data) {},
        goBack() {
            this.$router.push({ name: 'taskFlow' });
        },
        checkForm() {
          let isOk = true
          this.$refs['form'].validate(valid => {
               isOk = valid
          })

          return isOk
        },
        // 提交整个流程
        onSubmit() {
          if (!this.checkForm()) return

          if(this.nodeList.filter( i=> i.nodeType !='end' && i.nodeType != 'start').length < 1){
              this.$message.warning('至少需要配置一个流程节点');
              return;
          }
          let flowData = this.transformFromDataToFlowData();

          // 城市合伙人需求-废弃了新增逻辑
          if (this.routeQuery.type == 'add') {
              this.$axios(this.$getModuleUrl('/systemManage/taskFlow', 'createProcDef'), {
                  op: 'createProcDef',
                  data: flowData
              }).then(res => {
                  if (res.code == 1) {
                      this.$message.success('新增成功');
                      this.$router.push({ name: 'taskFlow' });
                  }
              });
          } else if (this.routeQuery.type == 'edit') {
              flowData.procdefInfoId = this.procdefInfoId;
              this.$axios(this.$getModuleUrl('/systemManage/taskFlow', 'updateProcDef'), {
                  op: 'updateProcDef',
                  data: flowData
              }).then(res => {
                  if (res.code == 1) {
                      //重新查询工作流
                      this.$message.success('修改成功');
                      this.$router.push({ name: 'taskFlow' });
                  }
              });
          }
        },
        //将前端流程数据格式转换成后端需要的格式
        transformFromDataToFlowData() {
            let resultData = {};
            resultData = this.form;
            resultData.name = this.form.flowNameId;
            resultData.nodeList = '';
            let nodeList = [];
            this.nodeList.map((item, index) => {
                let newItem = {};
                newItem.name = item.label;
                newItem.nodeId = item.id;
                newItem.type = item.nodeType;
                newItem.person = item.person;
                if (item.nodeType !== 'start_userTask' && item.nodeType !== 'endNode1') {
                    newItem.index = index;
                    if (item.nodeType == 'cs') {
                        newItem.belong = this.getBelongId(index);
                    }
                    if (item.nodeType == 'sp') {
                        newItem.prevId = this.getPrevId(index);
                        newItem.nextId = this.getNextId(index);
                    }
                    newItem.props = {};
                    newItem.props.personTypeName = item.personTypeName;
                    newItem.props.managerLevel=item.managerLevel;
                    newItem.props.personType = item.personType;
                    newItem.props.person = item.person;
                    newItem.props.nodeSpType = item.nodeSpType;
                    newItem.props.nodeSpTypeName = item.nodeSpTypeName;
                    newItem.props.checkedPersonList = item.checkedPersonList;
                    newItem.props.backupUserId = item.backupUserId;
                    newItem.props.backupUserName = item.backupUserName;
                    newItem.props.orgType = item.orgType || ''
                    newItem.props.positionList = item.positionList ? item.positionList.map(item => {
                        return {
                            positionId: item.id,
                            positionName: item.name
                        }
                    }) : []

                    if (item.personType == 1 || (item.personType == 5) | (item.personType == 7)) {
                        newItem.props.userIds = item.checkedPersonList.map(item => {
                            return item.id;
                        });
                        newItem.props.checkedPersonList = item.checkedPersonList;
                    } else if (item.personType == 2) {
                        newItem.props.userIds = item.personGroup.persons.map(item => {
                            return item.id;
                        });
                        newItem.props.groupId = item.personGroup.id;
                        newItem.props.personGroup = item.personGroup;
                    }
                    //
                    if (item.approvalNUll === 1) {
                        //直属上级指定人员
                        newItem.props.backupUserId = item.selectTopPersons[0].id;
                        newItem.props.backupUserName = item.selectTopPersons[0].label;
                    }else if(item.approvalNUll === 0){
                        newItem.props.backupUserId = "";
                    }
                }

                nodeList.push(newItem);
            });
            resultData.nodeList = JSON.stringify(nodeList);
            return resultData;
        },
        //获取抄送节点的上一不为抄送节点的节点ID
        getBelongId(index) {
            let structArray = this.nodeList.slice(0, index);
            let resultItem = structArray.reverse().find(item => {
                return item.nodeType != 'cs';
            });
            return resultItem.id;
        },
        //获取审批节点上一个不为抄送节点的节点ID
        getPrevId(index) {
            let structArray = this.nodeList.slice(0, index);
            let resultItem = structArray.reverse().find(item => {
                return item.nodeType != 'cs';
            });
            return resultItem.id;
        },
        //获取审批节点下一个不为抄送节点的节点ID
        getNextId(index) {
            let structArray = this.nodeList.slice(index + 1);
            let resultItem = structArray.find(item => {
                return item.nodeType != 'cs';
            });
            return resultItem.id;
        },
        //抽屉的取消事件
        handleEidtNodeCancle() {
            this.editNode = null;
            this.eidtFlowNodeVisible = false;
            this.$refs['form'].resetFields();
        },
        //抽屉的提交事件
        CommitEidtNode() {
            this.$refs['dig_addFlowNode'].validate(valid => {
                if (valid) {
                    if(((this.nodeForm.personType == 1 || this.nodeForm.personType == 5 || this.nodeForm.personType == 7) && !this.checkedPersonList.length)){
                        this.$message.warning('请选择人员');
                        return
                    }else if((this.nodeForm.personType == 2 && (!this.nodeForm.personGroup.name || this.nodeForm.personGroup.userNum <= 0))){
                        this.$message.warning('当前账号组没有成员，请重新选择');
                        return
                    }else if((this.nodeForm.personType == 8 &&this.nodeForm.approvalNUll==1&& !this.nodeForm.selectTopPersons.length)){
                        this.$message.warning('请选择“审核人为空时”的审批指定人员');
                        return
                    }else if (this.nodeForm.personType == 12 && !this.nodeForm.positionList.length) {
                        this.$message.warning('请选择审批职务')
                        return
                    }

                    if (this.editDialogTitle == '新增节点') {
                        let newNode = {};
                        this.setDrawerFormToNode(newNode, this.nodeForm);
                        this.nodeList.splice(this.currentAddIndex + 1, 0, newNode);
                    } else {
                        this.setDrawerFormToNode(this.editNode, this.nodeForm);
                        this.nodeList.map((item, i) => {
                            if (i === this.currentEditIndex) {
                                item = this.editNode;
                            }
                        });
                        // this.nodeList.splice(this.currentAddIndex + 1, 0, newNode);
                    }
                    this.editNode = null;
                    this.eidtFlowNodeVisible = false;
                }
            });
        },
        //将抽屉的表单中解析数据到流程图的节点中
        setDrawerFormToNode(node, nodeForm) {
            let nodeNameKey = this.propObj['nodeName'];
            let nodeTypeKey = this.propObj['nodeType'];
            let personType = this.propObj['personType'];
            let nodeSpType = this.propObj['nodeSpType'];
            let personTypeNameKey = this.propObj['personTypeName'];
            let nodeSpTypeName = this.propObj['nodeSpTypeName'];
            let personGroupKey = this.propObj['personGroup'];
            let personKey = this.propObj['person'];

            let approvalNUll = this.propObj['approvalNUll'];
            let selectTopPersons = this.propObj['selectTopPersons'];
            node.id = createId();
            node[nodeNameKey] = nodeForm.nodeName;
            // 区分是审批节点还是抄送节点
            node[nodeTypeKey] = nodeForm.nodeType == '1' ? 'sp' : 'cs';
            node[personType] = nodeForm.personType;
            node[nodeSpType] = nodeForm.nodeSpType;
            node[personTypeNameKey] = this.setPersonTypeName();

            // 只有直属上级才有几级主管
            if (this.nodeForm.personType === 8) {
              node.managerLevel = this.nodeForm.managerLevel
            } else{
              node.managerLevel = null
            }

            node[nodeSpTypeName] = this.setSpTypeName();
            node[personGroupKey] = nodeForm.personGroup;
            node[personKey] = this.getpersonFormPersonList();

            node[approvalNUll] = nodeForm.approvalNUll;
            node[selectTopPersons] = nodeForm.selectTopPersons;

            node.checkedPersonList = this.checkedPersonList;
            // node.checkedPersonList = nodeForm.tagItems||nodeForm.selectTopPersons
            node.orgType = nodeForm.orgType
            node.positionList = nodeForm.positionList
            return node;
        },
        setPersonTypeName() {
            //  let personGroup = this.nodeForm.personGroup + '账号组';
            let personTypeName = this.personTypes.find(item => {
                return item.id == this.nodeForm.personType;
            }).name;
            /* let nodeSpTypeName = this.nodeSpTypes.find(item => {
                return item.id == this.nodeForm.nodeSpType;
            }).name;*/
            return personTypeName; /*+ ' (' + nodeSpTypeName + ')';*/
        },

        setSpTypeName() {
            let nodeSpTypeName = '';
            if (this.nodeForm.nodeType == '1') {
                nodeSpTypeName = this.nodeSpTypes.find(item => {
                    return item.id == this.nodeForm.nodeSpType;
                }).name;
            }
            return nodeSpTypeName;
        },
        //截取人员列表中的人员信息
        getpersonFormPersonList() {
            let result = '';
            let persons = this.checkedPersonList.map(item => {
                return item.name;
            });
            if (persons.length > 2) {
                result = persons[0] + '、' + persons[1] + '等' + persons.length + '人';
            } else {
                result = persons.join('、');
            }
            return result;
        },
        //抽屉中删除人员
        handleCloseTag(tag) {
            this.nodeForm.tagItems.splice(this.nodeForm.tagItems.indexOf(tag), 1);
            this.checkedPersonList = this.checkedPersonList.filter(item => {
                return item.id !== tag.id;
            });
        },
        //抽屉中打开人员选择面板
        handleSetPerson() {
            this.treeSelectVisable = true;
            if (this.nodeForm.tagItems.length) {
                this.treeSelectTitle = '修改成员';
            } else {
                this.treeSelectTitle = '指定成员';
            }
            this.funcDefaultNode = JSON.parse(JSON.stringify(this.checkedPersonList));
        },
        handleSetTopPerson() {
            this.treeSelectVisable = true;
            if (this.nodeForm.tagItems.length) {
                this.treeSelectTitle = '修改成员';
            } else {
                this.treeSelectTitle = '指定成员';
            }

            if (this.nodeForm.personType === 8 || this.nodeForm.personType === 12) {
                this.treeSelectMaxCount = 1;
            }

            this.funcDefaultNode = JSON.parse(JSON.stringify(this.nodeForm.selectTopPersons));
        },
        //抽屉中打开账号组选择面板
        handleSetPersonGroup() {
            this.groupSelectVisable = true;
        },
        //账号组选择框中，选择账号组
        handleSelectGroup({ groupData, personList } = data) {
            groupData.persons = personList;
            this.nodeForm.personGroup = groupData;
            // this.nodeForm.personGroupCount = data.name
        },
        //抽屉面板中删除账号组标签
        handleGroupclose() {
            this.nodeForm.personGroup = { name: '' };
        },
        //抽屉中选择节点类型
        handelNodeTypeChange(val) {
            //设置人员类型选项禁用状态
            if (val !== '') {
                this.isPersonDisabled = false;
            } else {
                this.isPersonDisabled = true;
                if (
                    this.nodeTypes.find(item => {
                        return item.name == this.nodeForm.nodeName;
                    })
                ) {
                    this.nodeForm.nodeName = '';
                }
            }

            //设置人员类型选项
            if (val === '1') {
                let key = this.nowGroup
                const {name, category} = this.$route.query

                // 设置为A  司机合伙人申请这种类型只显示2种 设置成员: 的下拉
                if(name === '司机合伙人申请' && category === '1' ) {
                  key = 'A'
                }

                if (key === undefined) {
                  console.warning('检查 config.js中 是否增加对应的审核类型')
                }

                this.setPersonTypeOptions(key)
            } else if (val === '2') {
                this.personTypes = this.personTypesAll.filter(item => {
                    return item.id == 0 || item.id == 5 || item.id == 6 || item.id == 7;
                });
            }
            this.nodeForm.personType = this.personTypes[0].id;
            this.nodeForm.personType == 1 ? (this.treeSelectMaxCount = this.MaxCount) : (this.treeSelectMaxCount = Number.MAX_SAFE_INTEGER);
            this.nodeForm.tagItems = [];
            this.checkedPersonList = [];
        },
        //抽屉中选择人员类型
        handelPersonTypeChange(val) {
            /*if(val){
            }*/
            this.nodeForm.tagItems = [];
            this.checkedPersonList = [];
            // 清空直属上级选择人员
            this.nodeForm.selectTopPersons = [];
            if (val == 1) {
                this.treeSelectMaxCount = this.MaxCount;
            } else {
                this.treeSelectMaxCount = Number.MAX_SAFE_INTEGER;
            }
            //清空职务列表
            this.nodeForm.positionList = []
            this.nodeForm.orgType = ''
        },
        //获取人员选择树中的人员列表
        getCheckedNodeList(val) {
            this.checkedPersonList = val;
            let checkedPersonList = this.checkedPersonList.map(item => {
                let newItem = {};
                newItem.id = item.id;
                newItem.label = item.name;
                return newItem;
            });

            if (this.nodeForm.personType == 8 || this.nodeForm.personType == 12) {
                // 直属上级时
                this.nodeForm.selectTopPersons = checkedPersonList;
            } else {
                this.nodeForm.tagItems = checkedPersonList;
            }
        },
        //清除抽屉中选中的人员
        removeAllTag() {
            this.nodeForm.tagItems = [];
            this.checkedPersonList = [];
        },

        //查询工作流
        async getFlowData() {
          const id = this.$route.query.id
          if (!id) return

          try {
            const res = await this.$axios(this.$getModuleUrl('/systemManage/taskFlow', 'flowDefInfo'), {
                op: 'flowDefInfo',
                data: { procdefId: this.$route.query.id }
            })

            if (res.code == 1) {
              let flowData = res.data ? JSON.parse(res.data) : {};
              this.TransformFlowDataToFrom(flowData);
            }
          } catch (error) {
          }
        },
        // 将后台返回的FlowData 转成 前端需要的form 和 nodeList
        TransformFlowDataToFrom(flowData) {
            this.form.flowConfig = flowData.flowConfig

            this.procdefInfoId = flowData.id; //拿到当前编辑的工作流id
            this.form.category = Number(flowData.category);
            this.form.flowNameId = Number(flowData.flowNameId);
            this.form.descr = flowData.descr;
            this.nodeList = [];
            let nodeList = JSON.parse(flowData.nodeList);
            nodeList.map((item, index) => {
                let newItem = {};
                newItem.label = item.name;
                newItem.id = item.nodeId;
                newItem.nodeType = item.type;
                newItem.person = item.person;
                if (item.managerLevel) {
                     newItem.managerLevel = item.managerLevel;
                }
                if (item.type !== 'start_userTask' && item.type !== 'endNode1') {
                    newItem.personTypeName = item.props.personTypeName;
                    newItem.personType = item.props.personType;
                    newItem.person = item.props.person;
                    newItem.nodeSpType = item.props.nodeSpType;
                    newItem.nodeSpTypeName = item.props.nodeSpTypeName;
                    newItem.checkedPersonList = item.props.checkedPersonList;
                    newItem.personGroup = item.props.personGroup;
                    newItem.backupUserId=item.props.backupUserId;
                    newItem.backupUserName=item.props.backupUserName;
                    newItem.managerLevel = item.props.managerLevel;
                    if (item.props.managerLevel==undefined&&  newItem.personType==8) {
                          newItem.managerLevel='1'
                    }

                    if(newItem.personType == 12) {
                        newItem.orgType = item.props.orgType
                        newItem.positionList = item.props.positionList.map(item => {
                            return {
                                name: item.positionName,
                                id: item.positionId
                            }
                        })
                    }
                }
                this.nodeList.push(newItem);
            });

            this.hasDetailData = true
        },
        //机构类型变更
        changePosition(val) {
            const arr = this.orgType.filter(item => item.id === val)
            this.positionTitle = '指定' +  arr[0].name + '审批职务'
            //clear
            this.nodeForm.nodeSpType = 1
            this.nodeForm.approvalNUll = 0
            this.nodeForm.selectTopPersons = []
            this.nodeForm.positionList = []
            this.getPersonPostOption(val)
        },
        // 获取负责人职务选项
        async getPersonPostOption(orgType) {
            let params = {
                data: {
                    orgType,
                },
                op: 'selectOrgPositionList'
            }
            try {
                let res = await this.$axios('/authority/positionAuth/select', params)
                this.pList = JSON.parse(res.data)
            } catch (error) {

            }
        },
        //设置审批职务
        handleSetPosition() {
            this.positionVisible = true
        },

        commitPosition(val) {
            this.positionVisible = false
            this.nodeForm.positionList = val
        },
        handleClosePosition(val) {
            this.nodeForm.positionList = this.nodeForm.positionList.filter(item => item.id != val.id)
        },
        removeAllPosition() {
            this.nodeForm.positionList = []
        },
        pushPositionSetting() {
            let {flowNameId,category} = this.$route.query
            const position = category + '_' + flowNameId
            const positionArr = ['1_1','1_2','1_3','1_4','1_5','1_6','1_7','1_8','1_10','1_14','1_15','5_23','12_82']
            if (positionArr.includes(position)) this.personTypes.push({name:'直属机构',id:12})
        }
    }
};
</script>

<style lang="scss" scoped>
::v-deep.el-textarea .el-input__count {
    background: transparent;
    bottom: 0px;
}
::v-deep label {
    font-weight: 500 !important;
}
::v-deep.dialogEnter .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center !important;
}
.el-popover{
    div{
        margin: 5px 0;
    }
}
.showDetail{
    position:relative;
    top:5px;
    cursor: pointer;
}
.taskFlowEdit {
    // width: 100%;
    // height: 100%;
    margin-bottom: 84px;
    .form-person-wrap {
        width: 100%;
        min-height: calc(100% - 87px);
        background: #ffffff;
        padding: 32px 40px;
        border-radius: 8px;
        .header {
            width: 80px;
            height: 28px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 28px;
        }
        .taskFlow {
            overflow-x: hidden;
            overflow-y: auto;
            background: #fbfcfd;
            border-radius: 8px;
            border: 1px solid #dcdfe6;
            padding: 40px 0;
        }
        .formAll {
            margin-top: 24px;

            .el-select__tags {
                height: 30px;
                overflow-y: auto;
            }
        }

    }
    .addMember {
        background: #ffffff;
        color: #f05259;
        height: 35px;
        margin-right: 3px;
        font-size: 14px;
        margin-left: 5px;
    }

    .editDrawer {
        // width: 576px;
        height: 100vh;
        ::v-deep .el-drawer__header {
            margin-bottom: 0;
            padding: 10px;
            border-bottom: 1px rgba($color: #000000, $alpha: 0.1) solid;
        }
        ::v-deep .el-drawer__body {
            height: 100%;
            overflow-y: scroll;
            .drawerDiv {
                width: 100%;
                padding: 12px;
                .titleDiv {
                    padding: 24px 24px 24px 12px;
                    span {
                        font-size: 18px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: bold;
                        color: #303133;
                        line-height: 18px;
                    }
                }
                .groupDiv {
                    height: 47px;
                    width: fit-content;
                    display: flex;
                    background: #f0f2f5;
                    border-radius: 4px;
                    border: 1px solid #dcdfe6;
                    align-items: center;
                    padding: 5px;
                    .el-image {
                        margin-left: 3px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        ::v-deep.el-image__inner {
                            height: 30px !important;
                            width: 30px !important;
                        }
                    }
                    .closeGroup {
                        width: 16px;
                        height: 16px;
                        margin-left: 5px;
                        cursor: pointer;
                    }
                    .contentDiv {
                        margin-left: 3px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        div {
                            font-size: 10px;
                            line-height: 22px;
                        }
                    }
                    .el-icon-circle-close {
                        cursor: pointer;
                        margin-left: 0 3px;
                        &:hover {
                            color: blue;
                        }
                    }
                }
                .clearBtns {
                    height: 28px;
                    width: 60px;
                    margin-left: 5px;
                    color: #0088ff;
                    cursor: pointer;
                }
                .personCount {
                    line-height: 36px;
                    text-align: center;
                    font-size: small;
                    margin-left: 2px;
                    color: #909399;
                }
                .btns {
                    width: 100%;
                    height: 50px;
                    text-align: center;
                    position: absolute;
                    bottom: 0;
                    .el-button {
                        width: 160px;
                        height: 40px;
                    }
                }
            }
        }
        ::v-deep.el-radio-button__inner,
        .el-radio-group {
            display: flex;
            flex-direction: column;
        }
        ::v-deep.el-radio__inner {
            width: 18px;
            height: 18px;
            background: #fff;
            &:after {
                width: 10px;
                height: 10px;
                background-color: #f05259;
            }
        }
        ::v-deep.el-radio__input.is-checked + .el-radio__label {
            color: #606266;
        }
        ::v-deep.el-radio {
            line-height: 36px;
        }
        .el-tag--plain.el-tag--info {
            i {
                color: red;
                &:hover {
                    color: red;
                    background: #f0f2f5;
                }
            }
        }
        ::v-deep.el-form-item{
            margin-bottom:22px;
        }
    }
}
 .middle {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .middleTitle {
          height: 28px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #303133;
          line-height: 28px;
          cursor: pointer;
      }
    .active-setting {
      color: #F05259;
      position: relative;

    }
    .active-setting::after {
      position: absolute;
      content: ' ';
      left: 0;
      bottom: -2px;
      width: 100%;
      border-bottom: 2px solid #F05259;
    }
}
.tag-line {
  border-bottom: 2px solid #E4E7ED;
}

</style>
