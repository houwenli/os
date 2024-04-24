<template>
    <el-dialog class="staff_select" :title="title" :visible="dialogVisible" width="1141px" :lock-scroll="false" :top="'10vh'" :close-on-click-modal="false" @close="cancel" append-to-body>
        <div class="staff_box">
            <!-- 人员列表 -->
            <div>
                <div class="chooseTitle">
                    <div style="display: flex;align-items:center;">
                        <div class="circular"></div>
                        <div>请选择部门</div>
                    </div>
                </div>
                <div class="box_list staff_list">
                    <searchBox @change="dimQuery" @click="checkEvent" :optionList="[[...deptsList], []]"></searchBox>
                    <breadcrumb :breadcrumbList="breadcrumbList" @click="clickEvent" @goUp="goUp" />
                    <el-checkbox ref="wsCheckbox" v-model="isAllChecked" class="all_check" @change="allSelect" style="padding: 8px;">全选</el-checkbox>
                    <selectTree
                        v-loading="treeLoading"
                        :checkList="checkList"
                        :treeList="treeList"
                        :isShowCheck="isShowCheck"
                        :isAllChecked="isAllChecked"
                        @click="clickQuery"
                        @checkEl="checkEvent"
                        @allSelect="allSelect"
                    >
                        <!-- 使用插槽 自定义tree展示内容 -->
                        <template v-slot:default="data">
                            <!--  部门-->
                            <p class="dep_text">{{ `${data.row.name}` }}</p>
                        </template>
                    </selectTree>
                </div>
            </div>
            

            <!-- 选中列表 -->
            <div>
                <div class="chooseTitle">
                    <div style="display: flex;align-items:center;">
                        <div class="circular"></div>
                        <div>已选<span>({{checkList.length}}个部门)</span></div>
                    </div>
                    <span style="color: #0088FF;" @click="allClear">清空</span>
                </div>
                <ul class="box_list check_list">
                    <li v-for="(item, index) in checkList" :key="index">
                        <p>{{ item.name }}</p>
                        <i class="el-input__icon el-icon-circle-close" @click="checkEvent(item)"></i>
                    </li>
                </ul>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确认</el-button>
        </span>
    </el-dialog>
</template>

<script>
import searchBox from './searchBox.vue';
import breadcrumb from './breadcrumb.vue';
import selectTree from './selectTree.vue';
import { removeDuplicate } from '@/utils/commMethods';
import { areaDeptChildList } from '../config';
export default {
    name: 'treeSelect',
    components: { searchBox, breadcrumb, selectTree },
    props: {
        dialogVisible: { type: Boolean, default: false },
        selectedList: { type: Array, default: () => [] },
        title: { type: String, default: '添加部门' }
    },
    inject: ['treeDeptType'],
    data() {
        return {
            searchVal: '',
            selectOpts: [],
            breadcrumbList: [],
            treeList: null,
            isShowCheck: false,
            checkList: [],
            treeLoading: false,
            employVoChildren: [],
            searchList: [],
            empsList: [],
            deptsList: [],

            deptVoChildren: [],
            deptType: null,
            areaDeptChildList,
            filterType: null,
            isAllChecked:false
        };
    },
    created() {
        this.getTreeData({ id: 0 });
    },
    mounted() {
        this.checkList = this.$baseMethod.deepClone(this.selectedList);
    },
    watch: {
        treeDeptType: {
            handler(val) {
                if (val.deptType === 0) {
                    //高管模式
                    this.deptType = val.deptType;
                }
            },
            immediate: true
        }
    },
    methods: {
        // 全选
        allSelect(val) {
            // 全选
            if (val) {
                this.checkList = removeDuplicate([...this.checkList, ...this.treeList])
            } else {
                if(this.checkList.length == this.treeList) {
                    this.checkList = [];
                } else {
                    this.treeList.forEach((_item,index) => {
                        this.checkList = this.checkList.filter(item => {
                            return item.id != _item.id
                        })
                    })
                }
            }
        },

        // 选中人员
        checkEvent(item) {
            let index = this.checkList.map(i => i.id).indexOf(item.id);
            // 没有push
            index < 0 && this.checkList.push(item);
            // 有 剔除
            index >= 0 && this.checkList.splice(index, 1);
            this.checkStatus()
        },
        checkStatus() {
            let list = this.checkList.map(item => item.id)
            let flag = true
            for(var i =0;i<this.treeList.length;i++) {
                if(!list.includes(this.treeList[i].id)) {
                    flag = false
                    break;
                }
            }
            this.isAllChecked = flag
        },
        // 面包屑后退
        goUp() {
            this.breadcrumbList.pop();
            let item = this.breadcrumbList[this.breadcrumbList.length - 1];
            this.getTreeData(item);
        },

        // 面包屑层级点击
        clickEvent(item, index) {
            let _len = this.breadcrumbList.length;
            let start = index + 1;
            // 不允许点击当前层级
            if (_len === start) return;
            this.breadcrumbList.splice(start, _len);
            this.getTreeData(item);
        },

        // tree 查询子节点
        clickQuery({ item, filterType }) {
            this.filterType = filterType;
            this.getTreeData(item, filterType);
        },

        // 模糊查询
        async dimQuery(employName) {
            try {
                if (!employName || employName === 'null') return (this.searchList = []);
                const param = {
                    data: { name: employName },
                    op: 'selectFuzzyDeptList'
                };
                let res = await this.$axios('/authority/contacts/select', param);
                if (res.code === 1) {
                    const result = JSON.parse(res.data);
                    //转化人员和部门列表
                    this.transformChildren(result);
                }
            } catch (_err) {
                throw _err;
            }
        },
        transformChildren(rawData) {
            const { departmentChildren } = rawData;
            this.deptsList = departmentChildren.map(i => {
                return {
                    ...i,
                    name: i.deptName,
                    id: i.deptId
                };
            });
        },
        async getDeptList(item) {
            //查询部门
            let treeId = item.flag ? item.parentId : item.id;
            let orgType = item.orgType;
            let deptType = item.flag ? 2 : item.depType;
            let queryParams = {
                id: treeId || 0,
                // orgType, //点击部门时-查询部门类型条件 10省区 20分公司 30 服务中心 40服务站
                // filterType: treeId == 0 ? null : this.filterType, //1 代表组织机构 2,部门
                // deptType: this.deptType === 0 ? null : deptType //全部 总部 分支机构  this.deptType===0为高管模式
            };
            const param = {
                data: queryParams,
                op: 'selectOrgTree'
            };
            const res = await this.$axios('/authority/contacts/select', param);
            const result = JSON.parse(res.data);
            //第一级数据
            let topLevelDept = queryParams.id == 0 ? [{ ...result }] : [];

            let { childList, name } = result;
            this.deptVoChildren = [...topLevelDept, ...(childList || [])].map(i => {
                return {
                    ...i,
                    isLeaf: !i.depLevel || i.childFlag == 0 || i.id == 0 ? true : false //非叶子节点
                };
            });
            // 添加面包屑数据
            if (item.id !== undefined) {
                let addBreadcrumb = this.breadcrumbList.filter(i => i.id === item.id).length > 0;
                !addBreadcrumb && this.breadcrumbList.push({ name, id: item.id });
            }
            return this.deptVoChildren;
        },
        // 获取组织架构数据
        async getTreeData(item, filterType) {
            try {
                const deptVoChildren = await this.getDeptList(item, filterType);
                // const employVoChildren = await this.getEmpList(item);
                this.treeList = [...deptVoChildren];
                this.isShowCheck = true;
                this.treeLoading = false;
                this.checkStatus()
            } catch (err) {
                this.treeLoading = false;
                throw err;
            }
        },
        handleConfirm() {
            if(this.checkList.length === 0){
                this.$message.warning("请选择部门")
                return
            }
            this.$emit('submit', this.checkList);
            this.$emit('update:dialogVisible', false);
            // this.isDialogVisible=false;
        },
        cancel() {
            this.$emit('submit', this.selectedList);
            this.$emit('update:dialogVisible', false);
            // this.isDialogVisible=false;
        },
        allClear() {
            this.checkList = []
        }
    }
};
</script>
<style lang="scss" scoped>

.chooseTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .circular {
        width: 12px;
        height: 12px;
        background-color: #C0C4CC;
        border-radius: 50%;
    }
    div:nth-of-type(2) {
        color: #303133;
        font-weight: 600;
        margin-left: 6px;
    }
    
}
.staff_select {
    /deep/ .el-dialog__header {
        padding: 28px 24px 26px;
    }

    /deep/ .el-dialog__body {
        padding: 10px 24px 40px;
    }

    /deep/ .el-dialog__footer {
        padding: 0 24px 40px 0;

        button {
            width: 96px;
        }
    }
    /deep/ .el-dialog {
        max-height: none !important;
    }

    .staff_box {
        display: flex;
        width: 100%;
        justify-content: space-between;

        .box_list {
            width: 540px;
            height: 458px;
        }

        .staff_list {
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            padding: 16px;
            display: flex;
            flex-direction: column;
            .dep_text {
                padding-left: 10px;
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                color: #303133 !important;
                /deep/ .el-tooltip {
                    font-size: 12px;
                    color: #909399;
                }
            }
        }
    }

    .check_list {
        background: #f5f7fa;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        padding: 16px;
        overflow-y: auto;

        li {
            padding: 10px 18px 10px 16px;
            font-size: 14px;
            color: #303133;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: default;

            .el-icon-circle-close {
                color: #caced5;
                font-size: 18px;
                line-height: 0;
                cursor: pointer;
            }
        }

        li:hover {
            background: #f0f2f5;
        }
    }
}
</style>
