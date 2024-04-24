<template>
    <div class="complaint-list">
        <!-- 投诉管理 -->
        <ws-table-el
            :col="8"
            ref="table"
            v-bind="tableConfig"
            :header-cell-style="{
                background: '#F5F7FA'
            }"
        >
            <template #search>
                <search-group>
                    <label for>投诉人姓名：</label>
                    <el-input v-model.trim="searchOptions.name" :maxlength="10" placeholder="请输入投诉人姓名" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>投诉人手机号：</label>
                    <el-input v-model.trim="searchOptions.phone" :maxlength="11" placeholder="请输入投诉人手机号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>投诉状态：</label>
                    <el-select v-model.trim="searchOptions.state" filterable placeholder="请选择投诉状态" clearable>
                        <el-option label="未查看" value="1"></el-option>
                        <el-option label="已查看" value="2"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>组织机构：</label>
                    <el-cascader
                        :props="departmentProps"
                        clearable
                        filterable
                        collapse-tags
                        v-model="searchOptions.deptIds"
                        :options="departmentOption"
                        placeholder="请选择组织机构"
                        separator="-"
                    ></el-cascader>
                </search-group>
            </template>
            <template #options>
                <div class="onsearch">
                    <div class="right">
                        <el-button-group v-if="oaPowerList.feedbackCtrl">
                            <el-button type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                            <ws-throttle>
                                <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                            </ws-throttle>
                        </el-button-group>
                    </div>
                </div>
            </template>
            <template>
                <ws-table-column-el align="left" prop="userDetail.name" label="投诉人姓名"></ws-table-column-el>
                <ws-table-column-el align="left" prop="userDetail.phone" label="投诉人手机号"></ws-table-column-el>
                <ws-table-column-el align="left" label="投诉人所属组织/机构">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.userDetail.departNameList" :key="index">
                            {{ item ? item + '；' : item }}
                            <br />
                        </span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="left" label="职务">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.userDetail.positionName" :key="index">
                            {{ item ? item + '；' : item }}
                            <br />
                        </span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="left" label="投诉标题">
                    <template slot-scope="scope">
                        {{ scope.row.title | filtrateTitle }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="left" label="投诉内容">
                    <template slot-scope="scope">
                        {{ scope.row.content | filtrateContent }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="left" prop="createTime" label="投诉时间"></ws-table-column-el>
                <ws-table-column-el align="left" label="状态" fixed="right" width="100px">
                    <template slot-scope="scope">
                        <div :class="scope.row.state == 1 ? 'start' : 'stop'">
                            {{ scope.row.state == 1 ? '未查看' : '已查看' }}
                        </div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="left" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="oaPowerList.feedbackDetailCtrl	" type="text" class="c0088ff" @click="gotoAdd(scope.row.id)">查看详情</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
export default {
    components: {},
    name: 'complaint',
    data() {
        return {
            searchOptions: {
                name: '',
                phone: '',
                deptIds: '',
                state: ''
            },
            tableConfig: {
                filterColumns: false,
                labelWidth: '98px',
                pageId: 'id',
                pageCreateTime: 'updateTime',
                lazyQuery: {
                    moduleName: '/systemManage/complaint', // /systemManage/complaint
                    op: {
                        selectList: 'feedbackCtrl',
                        selectCount: 'feedbackCtrlCount'
                    }
                }
            },
            moduleName: '/systemManage/complaint', // /systemManage/complaint
            departmentOption: [], // 部门
            departmentProps: {
                lazy: true,
                value: 'id',
                label: 'name',
                children: 'child',
                checkStrictly: true,
                lazyLoad: this.depLazy,
                leaf: 'isLeaf',
            }
        };
    },
    filters: {
        filtrateTitle(value) {
            if (!value) return '';
            if (value.length > 20) {
                return value.slice(0, 20) + '...';
            }
            return value;
        },
        filtrateContent(value) {
            if (!value) return '';
            if (value.length > 60) {
                return value.slice(0, 60) + '...';
            }
            return value;
        }
    },
    created() {
        // let vm = this;
        // vm.getDepartmentList();
    },

    methods: {
        async depLazy(node, resolve) {
            // if (node.level == 0) {
            //     let data = {
            //         op: 'getDeptChildList',
            //         data: { id: 0 },
            //     };
            // } else {
            //     let data = {
            //         op: 'getDeptChildList',
            //         data: { id: node.data.id },
            //     };
            // }
            let data = {
                op: 'getDeptChildList',
                data: { id: node.level == 0 ? 0 : node.data.id },
            };
            let res = await this.$axios('authority/Organizational/select', data);
            resolve(JSON.parse(res.data));
        },
        // 获取部门列表
        // async getDepartmentList() {
        //     let vm = this;
        //     try {
        //         let param = {
        //             data: {
        //                 id: 0
        //             },
        //             op: 'selectOrganizationalTreeAllDepart'
        //         };
        //         let res = await this.$axios('authority/Organizational/select', param);
        //         if (res.code == 1) {
        //             this.departmentOption = JSON.parse(res.data);
        //         }
        //     } catch (e) {
        //         throw e;
        //     }
        // },
        //搜索
        search(type = 1) {
            this.$refs.table.search(type);
        },
        //重置
        reset() {
            this.$refs.table.reset();
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        gotoAdd(id) {
            this.$router.push({
                name: 'complaintDetails',
                query: { id }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.ws-table-warp {
    padding: 24px 24px 16px 24px !important;
}

.complaint-list {
    width: 100%;
    .onsearch {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
}
.c0088ff {
    color: #0088ff;
}
</style>
