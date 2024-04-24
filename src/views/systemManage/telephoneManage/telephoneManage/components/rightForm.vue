<template>
    <div class="mask">
        <div class="permiss-wrap">
            <div style="overflow-y: auto;height: 100%;">
                <p class="editTitle">设置</p>
                <div class="permiss-form">
                    <div style="padding-bottom:14px;">
                        <p class="moduleTitle">基础信息</p>
                        <el-form ref="form" :model="deptInfo" label-width="100px">
                            <el-form-item label="姓名：">
                                <el-input v-model="deptInfo.name || deptInfo.empName" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="所属部门：">
                                <el-input v-model="deptInfo.deptName" disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <p class="moduleTitle">权限配置</p>
                    <div class="permiss-form-item">
                        <div class="form-title-box">
                            <div class="form-title">
                                <div class="title">是否允许个人建群</div>
                            </div>
                            <el-switch v-model="group" :active-text="group?'开启':'关闭'" active-color="#0088FF"  @change="val => group = val"></el-switch>
                        </div>
                    </div>
                    <div class="permiss-form-item">
                        <div class="form-title-box">
                            <div class="form-title">
                                <div class="title">
                                    隐藏模式
                                    <el-tooltip class="item" effect="dark" content="开启后，只有指定部门的人可联系" placement="right-end">
                                        <img src="@/assets/images/icon_doubt.png" />
                                    </el-tooltip>
                                </div>
                                <div class="desc">隐藏个人开启后，将不会显示在公司通讯录中</div>
                            </div>
                            <el-switch v-model="hide" :active-text="activeTextHide" active-color="#0088FF" @change="handleHideval"></el-switch>
                        </div>
                        <transition>
                            <div v-show="hide">
                                <el-radio-group v-model="showType" class="permiss-radio">
                                    <el-radio :label="1">向所有部门和人隐藏</el-radio>
                                    <el-radio :label="2">
                                        <span>允许指定部门可见</span>
                                        <span class="addDempartmentTop" @click.stop="hideChangeRadio">添加部门</span>
                                        <span class="depDone">(已选择{{checkList.length}}个部门)</span>
                                    </el-radio>
                                </el-radio-group>
                                <el-checkbox-group v-if="showFun" class="permiss-checkout" v-model="checkFun">
                                    <el-checkbox label="1">屏蔽打电话</el-checkbox>
                                    <el-checkbox label="2">屏蔽会话</el-checkbox>
                                    <el-checkbox label="3">屏蔽加好友</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </transition>
                    </div>
                    <div class="permiss-form-item">
                        <div class="form-title-box">
                            <div class="form-title">
                                <div class="title">限制个人查看通讯录</div>
                                <div class="desc">限制开启后，个人只能看到限定范围内的通讯录</div>
                            </div>
                            <el-switch v-model="permiss" :active-text="activeTextPermiss" active-color="#0088FF" @change="handlePermiss"></el-switch>
                        </div>
                        <transition>    
                            <div v-show="permiss" style="position:relative">
                                <el-radio-group v-model="permType" class="permiss-radio" @change="changeDepartment">
                                    <el-radio :label="1">只可见本部门</el-radio>
                                    <el-radio :label="2">只能看到指定部门</el-radio>
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
                                    <div class="addDempartmentBottom" @click.stop="perChangeRadio">添加部门</div> 
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
    name: 'rightForm',
    components: { dynamicTree },
    props: {
        options: { type: Object, default: () => {} },
    },

    watch: {
        options: {
            handler(val) {
                this.deptInfo = val
                val && this.fetchData(val);
            },
            immediate: true,
            deep: true,
        },
        showType: {
            handler(val) {
                if (val == 1) {
                    this.checkFun = []
                    this.checkList = []
                    this.showFun = false
                } else {
                    this.showFun = true
                }
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
    data() {
        return {
            moduleName: '/telephoneManage',
            dialogVisible: false,
            selectedList: [],
            treeDeptType: {
                deptType: 0,
            },
            topWhiteList: [],

            deptInfo:{},
            group:false,
            hide:false,
            permiss:false,
            visibilityManage:false,
            visibilityLevel:false,
            showType: 1,
            permType: 1,
            permissCheckList: [],
            checkList:[],
            checkFun:[],
            checkManage:[],
            checkLevel:[],
            showFun:false
        };
    },
    provide() {
        return {
            treeDeptType: this.treeDeptType,
        };
    },
    methods: {
        async fetchData(val) {
            const param = {
                data: { id: val.id },
                op: 'personDetail',
            };
            try {
                const res = await this.$axios('/authority/contacts/select', param);
                let result = JSON.parse(res.data);  
                console.log(result);
                const { allowCreateGroup,visibleLevelList,astrictPerson,astrictPersonWhiteList,hideDept,hideModelList,hideModelWhiteList } = result
                this.group = allowCreateGroup == 1 ? true : false
                if(hideDept) {
                    this.hide = true
                    this.showType = hideDept
                    this.checkList = hideModelWhiteList || []
                    this.checkFun = hideModelList || []
                } else {
                    this.hide = false
                }
                if (astrictPerson) {
                    this.permiss = true
                    this.permType = astrictPerson
                    if(astrictPerson == 2) {
                        this.visibilityManage = true
                        this.checkLevel = visibleLevelList || []
                        this.permissCheckList = astrictPersonWhiteList || []
                        if(this.permissCheckList.length > 0) {
                            this.checkManage.push('2')
                        } 
                        if(this.checkLevel.length > 0) {
                            this.checkManage.push('1')
                            this.visibilityLevel = true
                        }
                    } else {
                        this.visibilityManage = false
                    }
                } else {
                    this.permiss = false
                }
            } catch (error) {

            }
        },
        confirmDialog(checkData) {
            this.$nextTick(() => {
                if (this.dialogType === 'showType') {
                    this.checkList = checkData;
                } else if (this.dialogType === 'permType') {
                    this.permissCheckList = checkData
                    if (!this.checkManage.includes('2') && this.permissCheckList.length) {
                        this.checkManage.push('2')
                    } 
                }
            });
        },
        processData() {
            if(this.showType === 2 && this.checkList.length === 0 && this.hide) {
                this.$message.error('未选择允许可见的部门')
                return {
                    allow:false
                }
            }
            if(this.permType === 2 && this.permissCheckList.length === 0 && this.checkLevel.length === 0) {
                this.$message.error('未选择允许可见的层级或部门')
                return {
                    allow:false
                }
            }

            const hideModelWhiteList = this.checkList
                    .filter(i => Object.keys(i).includes('depType') || i.deptId != null)
                    .map(item => item.flag ? item.parentId : item.id)
            //限制本部门成员查看通讯录-只能看到指定部门-指定的部门
            const astrictPersonWhiteList = this.permissCheckList
                    .filter(i => Object.keys(i).includes('depType') || i.deptId != null)
                    .map(item => item.flag ? item.parentId : item.id);
            const visibleLevel = this.checkLevel.join(',')
            const hideModel = this.checkFun.join(',')
            return {
                allow:true,
                hideModel,
                hideModelWhiteList,
                visibleLevel,
                astrictPersonWhiteList
            }
        },
        async confirmPass() {
            const alreadyData = this.processData()
            if (!alreadyData.allow) return
            const param = {
                data: { 
                    allowCreateGroup: this.group ? 1 : 2,
                    hideModel:alreadyData.hideModel,
                    hideDept: this.hide ? this.showType : 0,
                    hideModelWhiteList:alreadyData.hideModelWhiteList,
                    astrictPerson: this.permiss ? this.permType : 0,
                    visibleLevel: alreadyData.visibleLevel,
                    astrictPersonWhiteList: alreadyData.astrictPersonWhiteList,
                    userId: this.options.id,
                },
                op: 'person',
            };
            try {
                const res = await this.$axios('/authority/contacts/save', param);
                res.code == 1 && this.$message.success('编辑成功') && this.$emit('backToTable');
            } catch (error) {
                this.$message.error(res.msg)
            }
            
        },
        hideChangeRadio() {
            if (this.showType === 2) {
                this.dialogVisible = true;
                this.dialogType = 'showType';
                this.selectedList = this.checkList;
            } else {
                return
            }
        },
        perChangeRadio() {
                this.dialogVisible = true;
                this.dialogType = 'permType';
                this.selectedList = this.permissCheckList;
        },
        changeDepartment(val) {
            if(val == 2) {
                this.visibilityManage = true
            } else {
                this.visibilityManage = false
                this.visibilityLevel = false
                this.checkManage = []
                this.checkLevel = []
                this.permissCheckList = []
            }
        },
        handleClickDialog() {
            this.dialogVisible = true;
            this.selectedList = this.topWhiteList;
        },
        cancel() {
            this.$emit('backToTable');
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
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
        handlePermiss(val) {
            this.permiss = val
            if (!val) {
                this.checkLevel = []
                this.permissCheckList = []
                this.checkManage = [] 
                this.permType = 1
            }
        },
        handleHideval(val) {
            this.hide = val
            if (!val) {
                this.checkList = []
                this.checkFun = []
                this.showType = 1
            }
        },
    },
};
</script>
<style lang="scss" scoped>
    @import '../../common/set.scss'
</style>
