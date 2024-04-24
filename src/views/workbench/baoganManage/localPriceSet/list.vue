<template>
    <div class="bg-page" :class="isFolder?'addWidth':''">
        <div class="sidebar"> 
            <tabs @changeWidth="changeWidth"></tabs>
        </div>
        <ws-table-el align="left" ref="table" v-bind="tableConfig" @selection-change="selectionChange" :col="6">
            <template #search>
                <search-group>
                    <label for>地区：</label>
                    <ws-city v-model="searchOptions.registerCityCode" level="2"></ws-city>
                </search-group>
                <search-group>
                    <label for>生效时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.effectiveTime"
                        :endTime.sync="searchOptions.effectiveEndTime"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>功能状态：</label>
                    <el-select v-model="searchOptions.status" placeholder="请选择" clearable>
                        <el-option v-for="item in statusRuleFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>创建时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.startTime"
                        :endTime.sync="searchOptions.endTime"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
                </search-group>
                <search-group>
                    <label for>修改时间：</label>
                    <ws-date-range
                        :startTime.sync="searchOptions.updateStartTime"
                        :endTime.sync="searchOptions.updateEndTime"
                        :pickerOptions="{ disabledDate: null }"
                    ></ws-date-range>
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
                <el-button v-if="powerList.expDriverVipPriceExport" style="margin-left: 20px" @click="derive" plain>导出</el-button>
                <el-button v-if="powerList.add" plain @click="batch('add')">
                    <i class="el-icon-circle-plus" style="margin-right: 4px"></i>
                    新增
                </el-button>
            </template>
            <template #options>
                <el-dropdown
                    v-if="powerList.uploadingVipPriceRule || powerList.batchStatus"
                    @command="batchOperate"
                    trigger="click"
                >
                    <el-button type="primary">
                        批量操作
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" class="dropdownItem">
                        <el-dropdown-item command="batchImport" v-if="powerList.uploadingVipPriceRule">批量导入</el-dropdown-item>
                        <el-dropdown-item command="batchPutawayxia" v-if="powerList.batchStatus">批量上架</el-dropdown-item>
                        <el-dropdown-item command="batchsoldout" v-if="powerList.batchStatus">批量下架</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown v-if="powerList.allUpDown" @command="onekeyCommand" trigger="click" style="margin-left: 20px">
                    <el-button plain>
                        一键操作
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" class="dropdownItem">
                        <el-dropdown-item command="putawayxia">一键上架</el-dropdown-item>
                        <el-dropdown-item command="soldout">一键下架</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-tooltip
                    class="item"
                    effect="dark"
                    :content="`当前包干价格获取配置：${titleRadioo == 10 ? '按照车主归属机构城市获取' : '按照车牌所在城市获取'}`"
                    placement="top-start"
                >
                    <el-button style="margin-left: 20px" @click="acquire" v-if="powerList['recognize/update']" plain>包干价格获取配置</el-button>
                </el-tooltip>
            </template>
            <template>
                <ws-table-column-el align="center" prop="city" label="省份-城市"></ws-table-column-el>
                <ws-table-column-el align="center" prop="effectiveTime" label="开始时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="effectiveEndTime" label="结束时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="status" label="功能状态">
                    <template slot-scope="scope">{{ scope.row.status | statusRuleFilters }}</template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="createUserName" label="创建人"></ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="创建时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="updateTime" label="修改时间"></ws-table-column-el>
                <ws-table-column-el align="center" label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            style="color: #0088ff"
                            v-if="powerList.detail"
                            @click="batch('detail', scope.row.id)"
                        >详情</el-button>
                        <el-button
                            type="text"
                            style="color: #0088ff"
                            v-if="(scope.row.status == 0 || scope.row.status == 2) && powerList.update"
                            @click="batch('edit', scope.row.id)"
                        >修改</el-button>
                        <el-button
                            type="text"
                            style="color: #0088ff"
                            v-if="(scope.row.status == 0 || scope.row.status == 2) && powerList.status"
                            @click="putaway(scope.row, true)"
                        >上架</el-button>
                        <el-button
                            type="text"
                            style="color: #0088ff"
                            v-if="(scope.row.status == 1 || scope.row.status == 3) && powerList.status"
                            @click="putaway(scope.row, false)"
                        >下架</el-button>
                        <!-- <el-button
                            type="text"
                            style="color: #f05259"
                            v-if="(scope.row.status == 2 || scope.row.status == 0) && powerList.delete"
                            @click="cickDelete(scope.row)"
                        >删除</el-button>-->
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <el-dialog title="平台费包干价格获取配置" :visible.sync="dialogVisible" width="35%">
            <el-radio v-model="radio" :label="10">按照车主归属机构城市获取</el-radio>
            <el-radio v-model="radio" :label="20">按照车牌所在城市获取</el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">返 回</el-button>
                <el-button type="primary" @click="clickTransf()">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import tabs from '../components/tabs.vue';
export default {
    components: { tabs },
    name: 'priceSet',
    data() {
        return {
            isFolder:false,
            searchOptions: {
                cityCode: '',
                registerCityCode: [],
                status: '',
                effectiveTime: '',
                effectiveEndTime: '',
                startTime: '',
                endTime: '',
                updateStartTime: '',
                updateEndTime: '',
            },
            batchList: [], // 批量选中数据
            dialogVisible: false,
            radio: 0,
            titleRadioo: 0,
            tableConfig: {
                filterColumns: false,
                emptyModel: true,
                indexColumn: true,
                // layout: 'flow',
                multi: true,
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/baoganManage/localPriceSet/list',
                    op: {
                        selectList: 'list',
                        selectCount: 'count',
                    },
                    beforeQuery: this.beforeQuery,
                    immediate: false,
                },
            },
            moduleName: '/workbench/baoganManage/localPriceSet/list',
        };
    },
    computed: {
        ...mapState({
            statusRuleFilters: state => state.baogan.statusRuleFilters,
        }),
    },
    activated() {
        this.search();
    },
    mounted() {
        this.search();
    },
    methods: {
        getRecongize() {
            const data = {
                op: 'recognize/select',
            };
            this._axios(data,this.moduleName).then(res => {
                this.titleRadioo = res.data.data;
                this.radio = this.titleRadioo;
            });
        },
        clickTransf() {
            if (this.radio !== this.titleRadioo) {
                const data = {
                    data: {
                        vipRecognizeType: this.radio,
                    },
                    op: 'recognize/update',
                };
                const URL = this.powerList[data.op];
                this.$axios(URL, data).then(res => {
                    this.$message.success('修改成功');
                    this.dialogVisible = false;
                });
            } else {
                this.dialogVisible = false;
            }
        },
        selectionChange(selection) {
            this.batchList = selection;
        },
        batchOperate(name) {
            if (name === 'batchImport') {
                this.$router.push({ name: 'localPriceSetBatchImport' });
                return;
            }

            if (name == 'batchPutawayxia' || name == 'batchsoldout') {
                const ids = this.batchList.map(value => value.id);
                const putawayxiaSome = this.batchList.filter(item => [0, 2].includes(item.status));
                const soldoutSome = this.batchList.filter(item => [1, 3].includes(item.status));
                if (this.batchList.length == 0) {
                    this.$message.error('请选择数据');
                    return false;
                } else if (name == 'batchPutawayxia' && !putawayxiaSome.length) {
                    this.$message.error('请选择待上架或已下架状态的数据');
                    return false;
                } else if (name == 'batchsoldout' && !soldoutSome.length) {
                    this.$message.error('请选择已上架状态的数据');
                    return false;
                }
                this.$confirm(
                    `是否确认${name == 'batchPutawayxia' ? '上架' : '下架'}？确定后实现当前选中条件下，${name == 'batchPutawayxia' ? '待上架或已下架' : '已上架'}数据全部${
                        name == 'batchPutawayxia' ? '上架' : '下架'
                    }`,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true,
                    }
                ).then(() => {
                    const param = {
                        data: {
                            status: name == 'batchPutawayxia' ? 1 : 2,
                            ids,
                        },
                        op: 'batchStatus',
                    };
                    const URL = this.powerList.batchStatus;
                    this.$axios(URL, param).then(res => {
                        this.$message.success(`批量${name == 'batchPutawayxia' ? '上架' : '下架'}成功`);
                        this.search();
                    });
                });
                return;
            }
        },
        onekeyCommand(name) {
            if (name === 'putawayxia' || name === 'soldout') {
                this.$confirm(
                    `是否确认${name == 'putawayxia' ? '上架' : '下架'}？确定后实现当前搜索条件下，${name == 'putawayxia' ? '待上架或已下架' : '已上架'}数据全部${
                        name == 'putawayxia' ? '上架' : '下架'
                    }`,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true,
                    }
                ).then(() => {
                    this.searchOptions.upDown = name == 'putawayxia' ? 1 : 2;
                    const param = {
                        data: this.searchOptions,
                        op: 'allUpDown',
                    };
                    const URL = this.powerList.allUpDown;
                    this.$axios(URL, param).then(res => {
                        this.$message.success(`一键${name == 'putawayxia' ? '上架' : '下架'}成功`);
                        this.search();
                    });
                });
                return;
            }
        },
        acquire() {
            this.getRecongize();
            this.dialogVisible = true;
        },
        putaway(data, type) {
            // 上架下架
            this.$confirm(`是否确认${type ? '上架' : '下架'}？确定后${type ? '上架' : '下架'}数据`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                const param = {
                    data: {
                        cityCode: data.cityCode,
                        status: type ? 1 : 2,
                        id: data.id,
                    },
                    op: 'status',
                };
                const URL = this.powerList.status;
                this.$axios(URL, param).then(res => {
                    this.$message.success(`${type ? '上架' : '下架'}成功`);
                    this.search();
                });
            });
        },
        cickDelete(data) {
            // 删除
            this.$confirm(`是否确认删除？确定后删除数据`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                const param = {
                    data: {
                        id: data.id,
                    },
                    op: 'delete',
                };
                const URL = this.powerList.delete;
                this.$axios(URL, param).then(res => {
                    this.$message.success(`删除成功`);
                    this.search();
                });
            });
        },
        batch(type, id) {
            this.$router.push({ name: 'localPriceSetForm', query: { type, id } });
        },
        beforeQuery() {
            this.getRecongize();
            const CityCode = this.searchOptions.registerCityCode;
            this.searchOptions.cityCode = CityCode && CityCode.length ? CityCode[CityCode.length - 1] : null;
            return this.searchOptions;
        },
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.searchOptions = {
                cityCode: '',
                registerCityCode: [],
                status: '',
                effectiveTime: '',
                effectiveEndTime: '',
                startTime: '',
                endTime: '',
                updateStartTime: '',
                updateEndTime: '',
            };
            this.search();
        },
        derive() {
            // 导出
            const CityCode = this.searchOptions.registerCityCode;
            this.searchOptions.cityCode = CityCode && CityCode.length ? CityCode[CityCode.length - 1] : null;
            console.log(this.searchOptions,'________');
            const param = {
                data: this.searchOptions,
                op: 'expDriverVipPriceExport',
            };
            const URL = this.powerList.expDriverVipPriceExport;
            this.$axios(URL, param).then(res => {
                this.$message.success('导出中，请稍后到文件中心下载！');
            });
        },
        changeWidth(isFolder){
            this.isFolder = isFolder
        }
    },
};
</script>

<style lang="scss" scoped>
.bg-page{
    display:flex;
    transition: 0.5s;
    .sidebar{
        flex:1;
        margin-right:14px;
    }
}
.bg-page /deep/ .ws-table-warp {
    border-radius: 0 0 8px 8px;
    padding: 24px !important;
    width:89%;
}
.addWidth /deep/ .ws-table-warp {
    width:92%;
}
/deep/ .table-column-header-button {
    padding: 10px 12px;
}
/deep/ .el-dialog__footer {
    text-align: center;
}
/deep/ .el-dialog__body {
    text-align: center;
}
/deep/ .el-dialog__header {
    text-align: center;
}
</style>
