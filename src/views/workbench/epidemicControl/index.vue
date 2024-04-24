<template>
    <div class="epidemicControl">
        <div class="roleRadio">
            <el-radio-group v-model="roleRadio">
                <el-radio-button label="1">司机防控</el-radio-button>
                <el-radio-button label="2" v-if="powerList.selectList && powerList.selectCount">深圳防疫监控</el-radio-button>
                <el-radio-button label="3" v-if="flag">惠州防疫监控</el-radio-button>
            </el-radio-group>
        </div>
        <ws-table-el v-if="roleRadio == 1" ref="table" v-bind="tableConfig" :col="8">
            <template #search>
                <search-group>
                    <label for>防控城市：</label>
                    <ws-city ref="mcity" v-model="searchOptions.cityCode" :data="cityData" :defaultProps="{ checkStrictly: true }" :show-all-levels="false" level="3" placeholder="请选择城市"></ws-city>
                </search-group>
                <search-group>
                    <label for>管控措施：</label>
                    <el-select v-model="searchOptions.step" placeholder="请选择管控措施" clearable>
                        <el-option v-for="item in stepFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group v-if="powerList[op.selectList]">
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" @click="search()">查 询</el-button>
                    </ws-enter-event>
                    <ws-throttle>
                        <el-button type="primary" class="resetBtn" @click="reset()" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
                <ws-throttle>
                    <el-button v-if="powerList[op.add]" plain @click="toEdit('add')" icon="el-icon-circle-plus" style="margin-left: 20px">新增配置</el-button>
                </ws-throttle>
            </template>
            <template>
                <ws-table-column-el prop="cityName" label="防控城市">
                    <template slot-scope="scope">
                        <span>{{ scope.row.cityName }}</span>
                        <span>{{ scope.row.fenceName }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="step" label="管控措施" :formatter="formatterStep" min-width="250"></ws-table-column-el>
                <ws-table-column-el prop="createTime" label="修改日期"></ws-table-column-el>
                <ws-table-column-el label="操作" width="320">
                    <template slot-scope="scope">
                        <el-button v-if="powerList[op.detail]" type="text" style="color: #0088ff" @click="toEdit('detail', scope.row)">详情</el-button>
                        <el-button v-if="powerList[op.edit]" type="text" style="color: #0088ff" @click="toEdit('edit', scope.row)">修改</el-button>
                        <el-button type="text" v-if="powerList[op.enable]" @click="enable(scope.row)" :loading="enableLoading === scope.row.id">
                            <span v-if="scope.row.ruleStatus === 1">停用</span>
                            <span v-else style="color: #0088ff">启用</span>
                        </el-button>
                        <el-button type="text" v-if="powerControl(['count', 'page'], 'every', '/workbench/whiteList')" style="color: #0088ff" @click="jumpWhiteList(scope.row)">白名单</el-button>
                        <el-button type="text" v-if="powerList[op.del] && scope.row.ruleStatus !== 1" @click="handelDelte(scope.row)" :loading="delLoading === scope.row.id">删除</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
        <Monitor v-else-if="roleRadio == 2" />
        <HuiZhou v-else-if="roleRadio == 3" />
    </div>
</template>

<script>
import Monitor from './monitor';
import HuiZhou from './huizhou/index.vue';
export default {
    name: 'epidemicControl',
    components: {
        Monitor,
        HuiZhou
    },
    data() {
        return {
            roleRadio: 1,
            searchOptions: {
                cityCode: '', // 防控城市
                step: '', // 管控措施
            },
            cityData: [],
            tableConfig: {
                emptyModel: true,
                indexColumn: true,
                filterColumns: false,
                // layout: 'flow',
                // pageId: 'id',
                // multi: true,
                loading: true,
                pageSizeList: [20, 30, 50],
                lazyQuery: {
                    moduleName: '/workbench/BRepidemicControl',
                    op: {
                        selectList: 'page',
                        selectCount: 'count',
                    },
                    // beforeQuery: this.beforeQuery,
                    // immediate: false,
                },
            },
            op: {
                selectList: 'page',
                selectCount: 'count',
                add: 'add',
                detail: 'detail',
                edit: 'update',
                enable: 'enable',
                del: 'delete',
            },
            moduleName: '/workbench/BRepidemicControl',
            moduleNameHuiZhou: '/workbench/huizhou',
            stepFilters: [
                // 疫情防控措施
                { id: 1, value: '上传健康证明' },
                { id: 2, value: '防疫拍照 ' },
                { id: 3, value: '防疫提醒' },
            ],
            enableLoading: null,
            delLoading: null,
            flag: false
        };
    },
    activated() {
        this.search();
    },
    mounted() {
        if (this.$route.meta.isNestRoute) {
            this.citySelect();
        }
        this.getCityData()
        this.flag = !!this.$getModuleUrl(this.moduleNameHuiZhou, 'list')
    },
    methods: {
        async getCityData() {
            try {
                let res = await this._axios({ op: 'getProvincesTree' }, '', '/trafficTrip/local/select');
                if (res.code === 1 && res.data instanceof Array) {
                    this.diffCityData(res.data);
                    this.cityData = res.data
                        .map(item => {
                            return {
                                ...item,
                                disabled: true,
                            };
                        })
                        .filter(data => data.code !== 0);
                }
            } catch (err) {
              console.log(err)
            }
        },
        diffCityData(data) {
            for (let item of data) {
                if (item.children && item.children.length > 0) {
                    this.diffCityData(item.children);
                } else {
                    delete item.children
                }
            }
        },
        jumpWhiteList(row) {
            let { id, cityName } = row;
            this.$router.push({ name: 'whiteList', query: { id, cityName } });
        },
        citySelect() {
          // 跳进子路由，容错判断
          if(!this.$route.meta.isNestRoute) return

            if (this.$refs.mcity._data.regionList instanceof Array) {
                this.$refs.mcity._data.regionList = this.$refs.mcity._data.regionList.map(item => {
                    return {
                        ...item,
                        disabled: true,
                    };
                });
            }
        },
        search() {
            this.$refs.table.search();
        },
        reset() {
            this.searchOptions = {
                cityCode: null, // 防控城市
                step: null, // 管控措施
            };
            this.search();
        },
        // 跳转新增，编辑，详情
        toEdit(type, row) {
            let query = { type };
            if (row) {
                query.id = row.id;
            }
            this.$router.push({ name: 'epidemicControlEdit', query });
        },
        // 启/停用
        enable(row) {
            const { id, ruleStatus } = row;
            let msg = ruleStatus ? '停用' : '启用';
            this.$confirm(msg + '此配置, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.enableLoading = id;
                    let params = {
                        data: JSON.stringify({
                            id,
                            ruleStatus: ruleStatus ? 0 : 1,
                        }),
                        op: this.op.enable,
                    };
                    let URL = this.getModuleUrl(params.op);
                    this.$axios(URL, params)
                        .then(res => {
                            if (res.code === 1) {
                                this.$message.success(msg + '操作成功！');
                                this.search();
                            }
                            this.enableLoading = null;
                        })
                        .catch(err => {
                            this.enableLoading = null;
                        });
                })
                .catch(() => {
                    this.enableLoading = null;
                });
        },
        // 删除
        handelDelte(row) {
            this.$confirm('此操作将删除配置, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    // console.log(row)
                    const { id } = row;
                    this.delLoading = id;
                    let params = {
                        data: JSON.stringify({
                            id,
                        }),
                        op: this.op.del,
                    };
                    let URL = this.getModuleUrl(params.op);
                    this.$axios(URL, params)
                        .then(res => {
                            if (res.code === 1) {
                                this.$message.success('删除成功！');
                                this.search();
                            }
                            this.delLoading = null;
                        })
                        .catch(err => {
                            this.delLoading = null;
                        });
                })
                .catch(() => {});
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        formatterStep(row, column, cellValue, index) {
            const val = cellValue || '';
            if (!val) {
                return '';
            }
            const arr = val.split(',');
            let str = '';
            arr.forEach(el => {
                str = str + this.stepFilters[el - 1].value + ' ';
            });
            return str;
        },
    },
};
</script>

<style lang="scss" scoped>
.search-wrap label {
    width: 80px !important;
    flex: 0 0 80px !important;
}
.roleRadio {
    padding: 20px 24px;
    background: #fff;
    // border-bottom: 1px solid #f5f7fa;
    border-radius: 8px 8px 0px 0px;
    .el-radio-button__orig-radio:disabled + .el-radio-button__inner {
        background: #f5f7fa;
        color: #606266;
    }
}
.epidemicControl {
    .ws-table-warp {
        border-radius: 0px 0px 8px 8px;
        padding: 0px 24px 24px !important;
        min-height: calc(100vh - 176px) !important;
        /deep/ .search-wrap {
            margin-bottom: 20px !important;
        }
        /deep/ .option-box {
            margin-bottom: 20px !important;
        }
    }
}
</style>
