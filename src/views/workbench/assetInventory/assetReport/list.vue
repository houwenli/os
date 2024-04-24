<template>
    <div>
        <!-- <tabs moduleName="/workbench/assetInventory"></tabs> -->
        <ws-table-el align="left" ref="table" v-bind="tableConfig">
            <template #search>
                <search-group>
                    <label for>手机号：</label>
                    <el-input v-model.trim="searchOptions.phone" placeholder="请输入司机手机号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>车牌号：</label>
                    <el-input v-model.trim="searchOptions.carNumber" placeholder="请输入司机车牌号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>更新时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.startTime"
                        :endTime.sync="searchOptions.endTime"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>审核状态：</label>
                    <el-select v-model="searchOptions.auditStatus" placeholder="请选择" clearable>
                        <el-option v-for="item in auditStatusFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>归属机构：</label>
                    <ws-organization-options
                        style="display: inline-block"
                        ref="org"
                        :selectOptions="orgOptions"
                        placeholder="请输入机构名称"
                        :orgType="orgType + ''"
                        v-model="searchOptions.agencyNumber"
                        valueKey="agencyNumber"
                    ></ws-organization-options>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList.list">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <el-button v-if="powerList.export" style="margin-left: 20px" @click="derive" plain>导出</el-button>
            </template>
            <template>
                <ws-table-column-el align="center" prop="name" label="姓名"></ws-table-column-el>
                <ws-table-column-el align="center" prop="phone" label="手机号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="agencyNumberName" label="归属机构"></ws-table-column-el>
                <ws-table-column-el align="center" prop="carNumber" label="车牌号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="auditStatusName" label="审核状态"></ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="更新时间"></ws-table-column-el>
                <ws-table-column-el align="center" label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            style="color: #0088ff"
                            v-if="powerList.detail"
                            @click="goDetail(scope.row.id)"
                        >详情</el-button>
                        <el-button
                            type="text"
                            style="color: #0088ff"
                            v-if="scope.row.auditStatus == 1 && powerList.audit"
                            @click="audit(scope.row.id)"
                        >审核</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <!-- 审核弹窗 -->
        <el-dialog title="审核" @closed="closeDialog" width="700px" :visible.sync="auditDialog" center :destroy-on-close="true">
            <div style="line-height:35px;">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="审核状态:">
                        <el-radio-group v-model="form.auditStatus">
                            <el-radio :label="3">通过</el-radio>
                            <el-radio :label="4">不通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注:">
                        <el-input type="textarea" :rows="3" style="margin-top:6px" maxlength="50" resize="none" placeholder="请输入原因（50个汉字内）" v-model="form.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="auditDialog = false">取 消</el-button>
                <el-button type="primary" :loading="requestLoading" @click="sure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import tabs from '../../components/tabs.vue';
import organizationOptions from '@/components/Organization/organization-all.vue';
import { mapState } from 'vuex';
export default {
    components: {
        tabs, organizationOptions
    },
    data() {
        return {
            moduleName: '/workbench/assetInventory/assetReport/list',
            searchOptions: {
                phone: '',
                startTime: '',
                endTime: '',
                carNumber: '',
                auditStatus: '',
                agencyNumber: ''
            },
            orgType: 20,
            tableConfig: {
                emptyModel: true,
                indexColumn: true,
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/assetInventory/assetReport/list',
                    op: {
                        selectList: 'list',
                        selectCount: 'count',
                    },
                    // beforeQuery: this.beforeQuery,
                },
            },
            form: {
                auditStatus: 3,
                remark: ''
            },
            auditDialog: false,
            auditId: '',
            requestLoading: false,
            orgOptions: [
                {
                    value: '20',
                    label: '分公司',
                },
                {
                    value: '30',
                    label: '服务中心',
                },
                {
                    value: '40',
                    label: '实体店',
                },
            ]
        }
    },
    computed: {
        ...mapState('workbench', ['auditStatusFilters'])
    },
    methods: {
        search(type = 2) {
            this.$refs.table.search(type);
        },
        reset() {
            this.searchOptions = {
                phone: '',
                startTime: '',
                endTime: '',
                carNumber: '',
                auditStatus: '',
                agencyNumber: ''
            };
            this.orgType = 20;
            this.search();
        },
        goDetail(id) {
            this.$router.push({ name: 'assetReportForm', query: {id} })
        },
        audit(id) {
            this.auditDialog = true;
            this.auditId = id;
        },
        closeDialog() {
            this.form = {
                auditStatus: 3,
                remark: ''
            }
        },
        sure() {
            let opt = {
                data: JSON.stringify({ id: this.auditId, ...this.form }),
                op: 'audit'
            }
            this.requestLoading = true
            this.$axios(this.powerList.audit, opt).then(res => {
                this.$message.success('审核成功');
                this.search(1);
                this.auditDialog = false;
            }).finally(_ => {
                this.requestLoading = false;
            })
        },
        derive() {
            let param = {
                data: this.searchOptions,
                op: 'export'
            };
            let URL = this.powerList.export;
            this.$axios(URL, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
            });
        }
    }
};
</script>

<style lang="scss" scoped></style>
