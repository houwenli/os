<template>
    <div class="mask">
        <div class="permiss-wrap">
            <div style="overflow-y: auto;height: 100%;">
                <p class="editTitle">部门权限配置</p>
                <div class="permiss-form">
                    <div v-if="multiple" style="padding-bottom:14px;">
                        <p class="moduleTitle">已选部门</p>
                        <div class="chooseDeps">
                            <el-tag v-for="tag in deptsList" :key="tag.id" size="mini" type="info" closable @close="removeTag(tag.id)">
                                {{ tag.name }}
                            </el-tag>
                            <span style="color:#0088FF" @click="removeTag(-1)">清除</span>
                        </div>
                    </div>
                    <div v-else style="padding-bottom:14px;">
                        <p class="moduleTitle">基础信息</p>
                        <el-form ref="form" :model="deptInfo" label-width="100px" class="rb-person-form">
                            <el-form-item label="部门名称：">
                                <el-input v-model="deptInfo.name" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="部门负责人：">
                                <el-input :value="deptInfo.deptHead" disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <p class="moduleTitle">权限配置</p>
                    <div class="permiss-form-item">
                        <div class="form-title-box">
                            <div class="form-title">
                                <div class="title">是否允许部门成员建群</div>
                            </div>
                            <el-switch v-model="group" :active-text="group?'开启':'关闭'" active-color="#0088FF"  @change="val => group = val"></el-switch>
                        </div>
                    </div>
                    <div class="permiss-form-item">
                        <div class="form-title-box">
                            <div class="form-title">
                                <div class="title">隐藏本部门</div>
                                <div class="desc">隐藏本部门开启后，本部门及所属下级部门将不会显示在公司通讯录中</div>
                            </div>
                            <el-switch v-model="hide" :active-text="activeTextHide" active-color="#0088FF" @change="changeHide"></el-switch>
                        </div>
                        <transition>
                            <div v-show="hide">
                                <el-radio-group v-model="showType" class="permiss-radio" @change="changeRadio">
                                    <el-radio :label="1">向所有部门和人隐藏</el-radio>
                                    <el-radio :label="2" style="display:inline-block" >
                                        <span>允许指定部门可见</span>
                                        <span class="addDempartmentTop" @click.stop="hideChangeRadio">添加部门</span>
                                        <span class="depDone">(已选择{{checkList.length}}个部门)</span>
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </transition>
                    </div>
                    <div class="permiss-form-item" style="margin-bottom: 18px;">
                        <div class="form-title-box">
                            <div class="form-title">
                                <div class="title">限制本部门成员查看通讯录</div>
                                <div class="desc">限制开启后，本部门及所属下级部门只能看到限定范围内的通讯录</div>
                            </div>
                            <el-switch v-model="permiss" :active-text="activeTextPermiss" active-color="#0088FF" @change="changePermiss"></el-switch>
                        </div>
                        <transition>
                            <div v-show="permiss" style="position:relative">
                                <el-radio-group v-model="permType" class="permiss-radio" @change="changeDepartment">
                                    <el-radio :label="1">只可见本部门</el-radio>
                                    <el-radio :label="2">只可见所在部门及下级部门</el-radio>
                                    <el-radio :label="3">所在一级部门全部下属部门</el-radio>
                                    <el-radio :label="4">只能看到指定部门</el-radio>
                                </el-radio-group>
                                <div class="LevelDep" v-if="visibilityManage">
                                    <el-checkbox-group v-model="checkManage">
                                        <div>
                                            <el-checkbox label="1" style="margin-bottom: 16px;" @change="changeManageL">指定层级</el-checkbox>
                                            <el-checkbox-group class="appointLevel" v-if="visibilityLevel" v-model="checkLevel">
                                                <el-checkbox label="0">总部</el-checkbox>
                                                <el-checkbox label="4">总区</el-checkbox>
                                                <el-checkbox label="5">大区</el-checkbox>
                                                <el-checkbox label="20">分公司</el-checkbox>
                                                <el-checkbox label="30">服务中心</el-checkbox>
                                                <el-checkbox label="40">实体店</el-checkbox>
                                            </el-checkbox-group>
                                        </div>
                                        <el-checkbox label="2" @change="changeManageM">
                                            <span>指定部门</span> 
                                            <span class="depDone">(已选择{{permissCheckList.length}}个部门)</span>
                                        </el-checkbox>
                                    </el-checkbox-group>
                                    <span class="addDempartmentBottom" @click.stop="perChangeRadio">添加部门</span>
                                </div>  
                            </div>
                        </transition>
                    </div>
                    <dynamicTree v-if="dialogVisible" :selectedList="selectedList" :dialogVisible.sync="dialogVisible" @submit="confirmDialog"></dynamicTree>
                </div>
            </div>
            <div class="editFooter">
                <div class="bottomBtns">
                    <el-button @click="cancel">取消</el-button>
                    <ws-throttle>
                        <el-button type="primary" @click="confirmPass">保存</el-button>
                    </ws-throttle>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dynamicTree from '../../common/dynamicTree';
export default {
    name: 'permissSet',
    components: {
        dynamicTree,
    },
    props: {
        options: {
            type: Object,
            default: () => {},
        },
        moduleName: {
            type: String
        },
    },
    data() {
        return {
            hide: false,
            activeName: '1',
            showType: 1,
            permiss: false,
            permType: 1,
            dialogVisible: false,
            checkList: [],
            permissCheckList: [],
            multiple: false,
            deptsList: [],
            deptInfo:{},
            dialogType: '',
            selectedList: [],
            filterType: null,
            group:false,
            visibilityManage:false,
            checkManage:[],
            visibilityLevel:false,
            checkLevel:[],
            deptHead:""
        };
    },
    watch: {
        'options.data': {
            handler(val) {
                this.multiple = val instanceof Array;
                if (this.multiple) {
                    this.deptsList = val;
                } else {
                    //单条编辑
                    if (val.type === 'areaDept') return false;
                    this.deptInfo = val
                    this.fetchData(val.id,val.orgType)
                }
            },
            immediate: true,
            deep: true,
        },
        'options.filterType': {
            handler(val) {
                this.filterType = val;
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {
        activeTextHide() {
            return this.hide ? '开启' : '关闭';
        },
        activeTextPermiss() {
            return this.permiss ? '开启' : '关闭';
        },
    },
    methods: {
        removeTag(val) {
            if(val < 0) {
                this.options.data = []
            } else {
                if(this.multiple) this.options.data = this.options.data.filter(item => item.id != val)
            }
            this.deptsList = this.options.data
        },
        confirmDialog(checkData) {
            this.$nextTick(() => {
                if (this.dialogType === 'showType') {
                    this.checkList = checkData;
                } else if (this.dialogType === 'permType') {
                    this.permissCheckList = checkData;
                    if (!this.checkManage.includes('2') && this.permissCheckList.length) {
                        this.checkManage.push('2')
                    } 
                }  
            });
        },
        fetchData(id,orgType) {
            const param = {
                data: {
                    id,
                    orgType
                },
                op: 'deptDetail',
            };
            this.$axios('/authority/contacts/select', param).then(res => {
                let result = JSON.parse(res.data);  
                const {allowCreateGroup,astrictMemberLevelList,astrictMemberSet,astrictMemberWhiteList,hideDept,hideDeptWhiteList} = result
                this.deptInfo.deptHead = result.deptHead || '-'
                this.group = allowCreateGroup == 1 ? true : false
                if(hideDept) {
                    this.hide = true
                    this.showType = hideDept
                    this.checkList = hideDeptWhiteList || []

                } else {
                    this.hide = false
                }

                if (astrictMemberSet) {
                    this.permiss = true
                    this.permType = astrictMemberSet
                    if(astrictMemberSet == 4) {
                        this.visibilityManage = true
                        this.checkLevel = astrictMemberLevelList || []
                        this.permissCheckList = astrictMemberWhiteList || []
                        if(this.checkLevel.length > 0) {
                            this.checkManage.push('1')
                            this.visibilityLevel = true
                        }
                        if(this.permissCheckList.length > 0) {
                            this.checkManage.push('2')
                        } 
                    } else {
                        this.visibilityManage = false
                    }
                } else {
                    this.permiss = false
                }
            });
        },
        //提交数据的前置处理
        processData () {
            if(this.showType === 2 && this.checkList.length === 0) {
                this.$message.error('未选择允许可见的部门')
                return {
                    allow:false
                }
            }
            if(this.permType === 4 && this.permissCheckList.length === 0 && this.checkLevel.length === 0) {
                this.$message.error('未选择允许可见的层级或部门')
                return {
                    allow:false
                }
            }
            //批量编辑/编辑选中的部门
            let deptData = this.options.data;
            const deptIdList = this.multiple ? deptData.map(i => i.type == 'areaDept' ? i.parentId : i.id) : [deptData.type == 'areaDept' ? deptData.parentId : deptData.id];

            if(!deptIdList.length) {
                this.$message.error('未选择配置权限的部门')
                return {
                    allow:false
                }
            }
            //隐藏本部门-指定可见的部门
            const hideDeptWhiteList = this.checkList
                    .filter(i => Object.keys(i).includes('depType') || i.deptId != null)
                    .map(item => item.flag ? item.parentId : item.id)
            //限制本部门成员查看通讯录-只能看到指定部门-指定的部门
            const astrictMemberWhiteList = this.permissCheckList
                    .filter(i => Object.keys(i).includes('depType') || i.deptId != null)
                    .map(item => item.flag ? item.parentId : item.id);
            //限制本部门成员查看通讯录-只能看到指定部门-指定的层级
            const astrictMemberLevel = this.checkLevel.join(',') || ''
            return {
                deptIdList,
                hideDeptWhiteList,
                astrictMemberWhiteList,
                astrictMemberLevel,
                allow:true
            }
        },
        async confirmPass() {
            const alreadyData = this.processData()
            if (!alreadyData.allow) return
            const param = {
                data: {
                    allowCreateGroup: this.group ? 1 : 2,
                    deptIdList: alreadyData.deptIdList,
                    hideDept: this.hide ? this.showType : 0,
                    hideDeptWhiteList:alreadyData.hideDeptWhiteList,
                    astrictMemberSet: this.permiss ? this.permType : 0,
                    astrictMemberLevel:alreadyData.astrictMemberLevel,
                    astrictMemberWhiteList : alreadyData.astrictMemberWhiteList
                },
                op: 'dept'
            }
            try {    
                const res = await this.$axios('/authority/contacts/select', param);
                res.code == 1 && this.$message.success('设置成功') && this.$emit('close-update',2);
            } catch (error) {
                 this.$message.error(error.msg);
            }
        },
        hideChangeRadio() {
            this.dialogVisible = true;
            this.dialogType = 'showType';
            this.selectedList = this.checkList;

        },
        perChangeRadio() {
            this.dialogVisible = true;
            this.dialogType = 'permType';
            this.selectedList = this.permissCheckList;
        },
        changeRadio(val) {
            if(val == 1) {
                this.checkList = []
            }
        },
        cancel() {
            this.$emit('close-update','1');
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        changeHide(val) {
            this.hide = val
            if (!val) {
                this.checkList = []
                this.showType = 1
            }
        },
        changePermiss(val) {
            this.permiss = val
            if (!val) {
                this.checkLevel = []
                this.permissCheckList = []
                this.checkManage = []
                this.permType = 1
            }
        },
        changeDepartment(val) {
            if(val == 4) {
                this.visibilityManage = true
            } else {
                this.visibilityManage = false
                this.visibilityLevel = false
                this.checkManage = []
                this.checkLevel = []
                this.permissCheckList = []
            }
        },
        changeManageL(val) {
            if(val) {
                this.visibilityLevel = true
            } else {
                this.visibilityLevel = false
                this.checkLevel = [] 
            }
        },
        changeManageM(val) {
            if(!val) {
                this.dialogType = '';
                this.dialogVisible = false
                this.permissCheckList = []
            }
        },
    },
};
</script>

<style lang="scss" scoped>
    @import '../../common/set.scss'
</style>
