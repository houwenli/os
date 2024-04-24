<template>
    <div>
        <div class="white-list">
            <h3>{{ cityName }}</h3>
            <ws-table-el ref="table" v-bind="tableConfig" :col="8" @selection-change="selectionChange" @currentChange="handleCurrentChange">
                <template #search>
                    <search-group>
                        <label for>姓名：</label>
                        <el-input v-model.trim="searchOptions.name" placeholder="请输入姓名" :maxlength="20" clearable></el-input>
                    </search-group>
                    <search-group>
                        <label for>手机号：</label>
                        <el-input v-model.trim="searchOptions.phone" placeholder="请输入手机号" :maxlength="11" clearable></el-input>
                    </search-group>
                </template>

                <template #options>
                    <el-button type="primary" class="batchCopyBtn" v-if="powerControl(['importWhiteList'])" @click="onMultiImport">批量导入</el-button>
                    <el-button class="saveBtn" v-if="powerControl(['delete'])" plain @click="whiteDel()">批量删除</el-button>
                    <div class="optonsBtn fr">
                        <el-button-group>
                            <ws-enter-event>
                                <el-button class="queryBtn" type="primary" icon="el-icon-search" @click="search(2)">查询</el-button>
                            </ws-enter-event>
                            <ws-enter-event>
                                <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                            </ws-enter-event>
                        </el-button-group>
                        <el-button class="exportBtn" v-if="powerControl(['add'])" icon="el-icon-circle-plus" plain @click="nameAdd">添加</el-button>
                    </div>
                </template>

                <template>
                    <ws-table-column-el prop="driverId" label="司机ID"></ws-table-column-el>
                    <ws-table-column-el prop="name" label="姓名"></ws-table-column-el>
                    <ws-table-column-el prop="phone" label="手机号"></ws-table-column-el>
                    <ws-table-column-el prop="orgName" label="所属机构"></ws-table-column-el>
                    <ws-table-column-el prop="createTime" label="添加时间"></ws-table-column-el>
                    <ws-table-column-el label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button v-if="powerControl(['delete'])" type="text" @click="whiteDel(scope.row)">删除</el-button>
                        </template>
                    </ws-table-column-el>
                </template>
            </ws-table-el>
        </div>

        <el-dialog class="white-pop" title="添加白名单" :visible.sync="dialogVisible" width="604px" :append-to-body="true">
            <div class="search-box">
                <p>手机号码：</p>
                <el-input v-model="checkPhone" maxlength="11" placeholder="请输入手机号"></el-input>

                <ws-enter-event>
                    <el-button type="primary" @click="queryDriver">校 验</el-button>
                </ws-enter-event>
            </div>
            <div v-show="Object.keys(driverInfo).length > 0" class="result-box">
                <h3>基础信息</h3>
                <ul>
                    <li v-for="item in resultConfig" :key="item.index">
                        <p>{{ item.label }}：</p>
                        <span>{{ driverInfo[item.key] }}</span>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <ws-enter-event>
                    <el-button type="primary" @click="checkNameAdd">添 加</el-button>
                </ws-enter-event>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'whiteList',
    data() {
        return {
            searchOptions: {
                ruleId: this.$route.query.id,
                name: '',
                phone: '',
            },
            moduleName: '/workbench/whiteList',
            tableConfig: {
                multi: true,
                pageSizeList: [20, 50, 100],
                filterColumns: false,
                lazyQuery: {
                    moduleName: '/workbench/whiteList',
                    op: {
                        selectList: 'page',
                        selectCount: 'count',
                    },
                },
            },
            selectRow: [],
            dialogVisible: false,
            checkPhone: '',
            resultConfig: [
                {
                    key: 'name',
                    label: '姓名',
                },
                {
                    key: 'driverId',
                    label: '司机ID',
                },
                {
                    key: 'idNumber',
                    label: '身份证号',
                },
                {
                    key: 'phone',
                    label: '手机号码',
                },
                {
                    key: 'carNum',
                    label: '车牌号码',
                },
                {
                    key: 'orgName',
                    label: '所属机构',
                },
            ],
            driverInfo: {},
            ruleId: '',
            cityName: ''
        };
    },
    created() {
      let ruleId = this.$route.query.id

      if (ruleId) {
        this.ruleId = ruleId
      }
      this.cityName = this.$route.query.cityName || ''
    },
    methods: {
        // 查询司机信息
        async queryDriver() {
            try {
                let reg = /^[1][0-9]{10}/g
                if (!this.checkPhone) return this.$message.error('请输入手机号！');

                if (!reg.test(this.checkPhone)) {
                  this.$message.error("请输入正确的电话号码!")
                  return
                }

                let res = await this._axios({ phone: this.checkPhone, op: 'queryDriver' }, this.moduleName);
                res.code === 1 && (this.driverInfo = res.data);
            } catch (err) {
                console.error(err);
            }
        },

        async checkNameAdd() {
            try {
                if (Object.keys(this.driverInfo).length === 0) return this.$message.error('请先检验司机信息!');
                let param = {
                    ruleId: this.$route.query.id,
                    driverIdList: [this.driverInfo.driverId],
                    op: 'add',
                };
                let res = await this._axios(param, this.moduleName);
                if(res.code === 1) {
                  this.search()
                  this.dialogVisible = false

                  this.$message.success('添加成功')
                }


            } catch (err) {
                console.error(err);
            }
        },

        nameAdd() {
            this.checkPhone = '';
            this.driverInfo = {};
            this.dialogVisible = true;
        },

        whiteDel(data = {}) {
            try {
                if (Object.keys(data).length === 0 && this.selectRow.length === 0) return this.$message.error('当前未选中司机');

                let text = '此操作将删除名单, 是否继续?'
                if(Object.keys(data).length === 0) {
                  text = `确认删除选中的${this.selectRow.length}个司机白名单？`
                }

                this.$confirm(text, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    let ids = Object.keys(data).length > 0 ? [data] : this.selectRow;
                    let param = {
                        ruleId: this.$route.query.id,
                        driverIdList: ids.map(item => item.driverId),
                        op: 'delete',
                    };
                    let res = await this._axios(param, this.moduleName);

                    if(res.code === 1) {
                      this.search(2)
                      this.$message.success('删除成功')
                    }
                });
            } catch (err) {
                console.error(err);
            }
        },
        selectionChange(val) {
            this.selectRow = val;
        },
        handleCurrentChange(val) {
            this.selectRow = val;
        },
        search(type = 1) {
            this.$refs.table.search(type);
        },
        reset() {
            this.$refs.table.reset();
        },

        /**
         * 批量导入
         */
        onMultiImport() {
          this.$router.push({
            name: 'batchFileUp',
            query: {
              ruleId: this.ruleId,
              cityName: this.cityName
            }
          })
        }
    },
};
</script>

<style lang="scss" scoped>
.white-list {
    background: #fff;
    border-radius: 8px;

    h3 {
        font-size: 16px;
        font-weight: bold;
        padding: 24px 24px 0;
    }
    .batchCopyBtn {
        width: 95px;
    }
    .optonsBtn {
        .exportBtn,
        .queryBtn,
        .saveBtn,
        .c0088ff {
            width: 95px;
            margin-left: 10px;
            padding: 10px 25px;
        }
        .reserBtn {
            width: 40px;
            padding: 0;
        }
    }
}

.white-pop {
    /deep/.el-button {
        width: 96px;
    }

    /deep/.el-dialog__body {
        padding: 24px 24px 0;
        .search-box {
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: space-around;

            p {
                position: relative;
                width: 75px;
                text-align: right;
            }

            p:after {
                content: '*';
                position: absolute;
                top: 0;
                left: -2px;
                color: red;
            }
        }

        .result-box {
            border-top: 1px solid #ebeef5;
            margin-top: 20px;

            h3 {
                font-size: 14px;
                color: #303133;
                line-height: 20px;
                padding: 19px 0 13px;
            }

            ul {
                padding: 16px 20px 0;
                background: #f5f7fa;
                border-radius: 8px;

                li {
                    display: flex;
                    flex-direction: row;
                    padding-bottom: 16px;
                    p {
                        width: 70px;
                        font-size: 14px;
                        color: #606266;
                        line-height: 20px;
                        text-align: right;
                    }

                    span {
                        flex: 1;
                        word-wrap: break-word;
                        word-break: normal;
                        word-break: break-all;
                    }
                }
            }
        }

        .el-input {
            width: 374px;
            margin-right: 8px;
        }
    }

    /deep/.el-dialog__footer {
        padding: 40px 24px 24px;
    }
}
</style>
