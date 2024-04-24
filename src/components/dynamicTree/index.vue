<template>
    <el-dialog class="staff_select" title="指定成员" :visible.sync="isDialogVisible" width="1141px" :lock-scroll="false" :top="'10vh'" :close-on-click-modal="false" append-to-body>
        <div class="staff_box">
            <!-- 人员列表 -->
            <div class="box_list staff_list">
                <searchBox @change="dimQuery" @click="checkEvent" :optionList="searchList"></searchBox>
                <breadcrumb v-show="breadcrumbList.length > 1" :breadcrumbList="breadcrumbList" @click="clickEvent" @goUp="goUp" />
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
                        <p class="dep_text" v-if="!data.row.isLeaf">{{ `${data.row.name}  (${data.row.depCount || 0})人` }}</p>
                        <!-- 人员 -->
                        <div class="dep_text" v-else>
                            {{ data.row.name }}
                            <el-tooltip v-if="data.row.partimeString && data.row.partimeString != null" class="item" effect="dark" placement="top-start">
                                <span>{{ `(${data.row.partimeString.length > 15 ? `${data.row.partimeString.substring(0, 15)}...` : data.row.partimeString})` }}</span>
                                <span slot="content">
                                    {{ data.row.partimeString }}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </selectTree>
            </div>

            <!-- 选中列表 -->
            <ul class="box_list check_list">
                <li v-for="(item, index) in checkList" :key="index">
                    <p>{{ item.name }}</p>
                    <i class="el-input__icon el-icon-circle-close" @click="checkEvent(item)"></i>
                </li>
            </ul>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button>取消</el-button>
            <el-button type="primary">确认</el-button>
        </span>
    </el-dialog>
</template>

<script>
import searchBox from './searchBox.vue';
import breadcrumb from './breadcrumb.vue';
import selectTree from './selectTree.vue';
import { removeDuplicate } from '@/utils/commMethods';
export default {
    name: 'treeSelect',
    components: { searchBox, breadcrumb, selectTree },
    data() {
        return {
            isDialogVisible: true,
            searchVal: '',
            selectOpts: [],
            breadcrumbList: [],
            treeList: null,
            isShowCheck: false,
            checkList: [],
            treeLoading: false,
            employVoChildren: [],
            searchList: []
        };
    },
    created() {
        this.getTreeData('0');
    },

    computed: {
        isAllChecked() {
            // 当前部门下所有人员
            let employIdChildren = this.employVoChildren.map(item => item.id);
            // 所有选中人员
            let selectEmployId = this.checkList.map(item => item.id);
            // 交集人员
            let intersection = employIdChildren.filter(i => selectEmployId.indexOf(i) > -1);
            return intersection.length === employIdChildren.length;
        }
    },

    methods: {
        // 全选
        allSelect(val) {
            // 全选
            if (val) return (this.checkList = removeDuplicate([...this.checkList, ...this.employVoChildren]));
            // 取消全选
            let employIdChildren = this.employVoChildren.map(item => item.id);
            let selectEmployId = this.checkList.map(item => item.id);
            // 找到当前部门下所有人员 与 选中人员 的所有差集
            let differIds = employIdChildren.filter(item => selectEmployId.indexOf(item) === -1).concat(selectEmployId.filter(item => employIdChildren.indexOf(item) === -1));
            this.checkList = this.checkList.filter(item => differIds.includes(item.id));
        },

        // 选中人员
        checkEvent(item) {
            let index = this.checkList.map(i => i.id).indexOf(item.id);
            // 没有push
            index < 0 && this.checkList.push(item);
            // 有 剔除
            index >= 0 && this.checkList.splice(index, 1);
        },

        // 面包屑后退
        goUp() {
            this.breadcrumbList.pop();
            let item = this.breadcrumbList[this.breadcrumbList.length - 1];
            this.getTreeData(item.id);
        },

        // 面包屑层级点击
        clickEvent(item, index) {
            let _len = this.breadcrumbList.length;
            let start = index + 1;
            // 不允许点击当前层级
            if (_len === start) return;
            this.breadcrumbList.splice(start, _len);
            this.getTreeData(item.id);
        },

        // tree 查询子节点
        clickQuery(item) {
            let { id } = item;
            this.getTreeData(id);
        },

        // 模糊查询
        async dimQuery(employName) {
            try {
                if (!employName || employName === 'null') return (this.searchList = []);
                const param = {
                    employName,
                    op: 'listByFuzzyName'
                };
                let res = await this._axios(param, '/systemManage/taskFlow');
                if (res.code === 1) {
                    this.searchList = [];
                    this.searchList = res.data || [];
                }
            } catch (_err) {
                throw _err;
            }
        },

        // 获取组织架构数据
        async getTreeData(id) {
            try {
                const param = {
                    organizationalid: id,
                    op: 'selectOrganizationalTreeByidNew'
                };
                // 清空tree数据
                this.treeList = null;
                this.treeLoading = true;
                let res = await this._axios(param, '/systemManage/taskFlow');
                this.treeLoading = false;
                if (res.code == 1) {
                    let { name, id, departmentChildren, userVoChildren } = res.data;

                    // 保存人员数据，方便计算是否全选
                    this.employVoChildren = userVoChildren || [];

                    // 添加面包屑数据
                    let addBreadcrumb = this.breadcrumbList.filter(item => item.id === id).length > 0;
                    !addBreadcrumb && this.breadcrumbList.push({ name, id });

                    // 有人员【employVoChildren】，显示全选按钮
                    this.isShowCheck = (userVoChildren || []).length > 0 ? true : false;

                    // 处理数据是否为叶子节点【人员为最后节点，不可点击展开，人员没有部门级别属性（depLevel）】
                    this.treeList = [...(departmentChildren || []), ...(userVoChildren || [])].map(item => {
                        return { ...item, isLeaf: !item.depLevel ? true : false };
                    });
                }
            } catch (err) {
                this.treeLoading = false;
                throw err;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.staff_select {
    /deep/ .el-dialog__header {
        padding: 28px 24px 26px;
    }

    /deep/ .el-dialog__body {
        padding: 10px 64px 40px;
    }

    /deep/ .el-dialog__footer {
        padding: 0 24px 40px 0;

        button {
            width: 96px;
        }
    }

    .staff_box {
        display: flex;
        width: 100%;
        justify-content: space-between;

        .box_list {
            width: 500px;
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
