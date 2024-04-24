<template>
    <div>
        <!-- 审核流程 -->
        <process-list :list="list" :checkType="checkType" @handleReviewerAdd="handleReviewerAdd" @handleCancel="handleCancel" @showAllMember="showAllMember"></process-list>

        <!-- 当前已选数据弹框 -->
        <all-user-selected
            v-if="showMember"
            :showMember.sync="showMember"
            :index="index"
            :currAllUserInfos="currAllUserInfos"
            @handleReviewerAdd="handleReviewerAdd"
            @handleCancel="handleCancel"
        ></all-user-selected>

        <!-- 选择人员 -->
        <tree-select
            :dialogVisible.sync="dialogVisible"
            title="添加成员"
            :expandOnClickNode="false"
            :moduleName="'/systemManage/taskFlow'"
            :listModuleName="'/systemManage/taskFlow'"
            :funcDefaultNode="[]"
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
        ></tree-select>
    </div>
</template>

<script>
import AllUserSelected from './allUserSelected';
import TreeSelect from '../treeSelect/treeSelect';
import ProcessList from './processList';
export default {
    name: 'AuditProcess',

    components: { TreeSelect, ProcessList, AllUserSelected },

    props: {
        //指向模块
        actions: {
            type: Object,
            default: () => {}
        },

        //请求参数
        query: {
            type: Object,
            default: () => {
                return { nameCode: '' };
            }
        },

        //外层数据展示限制
        overflowLimit: {
            type: Number,
            default: 7
        },

        title: {
            type: String,
            default: '添加人员'
        },
        afterQuery: {   //上传成功回调函数，返回响应值,
            type: Function, default: () => {
            }
        },

        customClass: {
            type: String,
            default: ''
        },

        //判断是否加载完成
        isLoaded: {
            type: Boolean,
            default: false
        }
    },

    provide() {
        return {
            overflowLimit: this.overflowLimit,
            title: this.title,
            treeSelectMaxCount: this.treeSelectMaxCount,
            customClass: this.customClass
        };
    },

    data() {
        return {
            treeSelectMaxCount: 50,
            dialogVisible: false,
            index: 0, //节点标识
            showMember: false,
            list: [], // 流程渲染数据
            allUserInfos: [], //当前节点人员的数据
            checkType:0 // 是否已启用自动去重 0 否 1 是
        };
    },

    created() {
        this.getFlowable();
    },

    // watch: {
    //     query: {
    //         handler: function (o, v) {
    //             this.getFlowable();
    //         },
    //         immediate: true,
    //         deep: true
    //     }
    // },

    computed: {
        //当前节点最终处理的数据
        currAllUserInfos() {
            let list = JSON.parse(JSON.stringify(this.list));
            list[this.index].userInfos = this.allUserInfos[this.index];
            return [list[this.index]];
        },

        //最终处理的数据
        allList() {
            let list = JSON.parse(JSON.stringify(this.list));
            return list.map((item, i) => {
                return Object.assign(item, {
                    userInfos: this.allUserInfos[i]
                });
            });
        }
    },

    methods: {
        getFlowable() {
            let opt = {
                data: this.query,
                op: this.actions.op
            };
            this.$axios(this.getModuleUrl(opt.op), opt).then(res => {
                if (res.code == 1) {
                    const { flowDetailVoList, procdefId , checkType} = JSON.parse(res.data);
                    if (flowDetailVoList.length > 0) {
                        this.$emit('update:load', false);
                        this.list = flowDetailVoList;
                        this.procdefId = procdefId;
                        this.checkType = checkType;
                        this.afterQuery(flowDetailVoList,procdefId)
                        for (let i = 0; i < flowDetailVoList.length; i++) {
                            this.allUserInfos[i] = flowDetailVoList[i].userInfos;
                            this.list[i].userInfos = flowDetailVoList[i].userInfos.slice(0,this.overflowLimit);
                        }
                    } else {
                        this.$emit('update:load', true);
                    }
                } else {
                    this.$emit('update:load', true);
                }
            });
        },

        setTreeDisabled(node, data) {
            return !data.isLeaf;
        },

        getModuleUrl(op) {
            return this.$getModuleUrl(this.actions.moduleName, op);
        },

        //合并数据
        getCheckedNodeList(result) {
            let currAllUserInfos = this.handleData(result); //特殊处理 审批人发起人自选1人 防止多选
            this.list[this.index].userInfos = currAllUserInfos.slice(0,this.overflowLimit); //外层展示数据
            this.list[this.index].memberCount = currAllUserInfos.length; //更新人员数据
            this.allUserInfos[this.index] = currAllUserInfos;
        },

        //数组去重 去掉result和指定人员数据
        handleData(result) {
            let ids = [];
            this.allUserInfos[this.index].forEach(item => {
                ids.push(item.id);
            });

            let res = result.filter(item => !ids.includes(item.id));
            return [...this.allUserInfos[this.index], ...res];
        },

        //新增数据
        handleReviewerAdd(index, memberType) {
            this.index = index;
            this.treeSelectMaxCount = memberType == 3 ? 1 : memberType == 7 || memberType == 6 || memberType == 5 ? 10000000 : 50 - this.list[this.index].memberCount; //审批人发起人自选1人 限制选择人数   指定成员+自选不限
            this.memberType = memberType;
            this.dialogVisible = true;
        },

        showAllMember(index) {
            this.index = index;
            this.showMember = true;
        },

        //删除数据
        handleCancel(itemIndex, currItem, indexs) {
            this.list[indexs].userInfos.splice(itemIndex, 1); //删除显示数据
            this.allUserInfos[indexs] = this.allUserInfos[indexs].filter(item => {
                return item.id != currItem.id;
            }); //删除总数据
            this.list[indexs].userInfos = this.allUserInfos[indexs].slice(0,this.overflowLimit); //外层展示数据
            this.list[indexs].memberCount = this.allUserInfos[indexs].length; //更新人员数据
        },

        resetFields() {
            this.allUserInfos = [];
            this.list = [];
            this.index = 0;
            this.treeSelectMaxCount = 50;
            this.dialogVisible = false;
            this.showMember = false;
        }
    }
};
</script>
