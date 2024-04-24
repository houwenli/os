<template>
    <div class="tableList">
        <ws-table-el :col="8" ref="table" v-bind="tableConfig" :header-cell-style="{ 'background-color': '#F5F7FA' }">
            <template #search>
                <search-group>
                    <label for>创建人：</label>
                    <el-input v-model.trim="searchOptions.createAdmin" :maxlength="20" placeholder="请输入创建人" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>文件类型：</label>
                    <el-select v-model="searchOptions.type" filterable placeholder="请选择文件类型" clearable>
                        <el-option v-for="item of fileType" :label="item.value" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>操作时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.startTime" :endTime.sync="searchOptions.endTime"></ws-date-range>
                </search-group>
            </template>
            <template #options>
                <el-button-group v-if="powerList.selectAndPage" style="float: right">
                    <el-button type="primary" icon="el-icon-search" @click="hanldeSearch(2)">查询</el-button>
                    <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                </el-button-group>
            </template>

            <template>
                <ws-table-column-el prop="type" label="文件类型" width="250" :formatter="sysTypeFormat"></ws-table-column-el>
                <ws-table-column-el prop="filename" label="文件名称" width="350" show-overflow-tooltip></ws-table-column-el>
                <ws-table-column-el prop="createTime" label="创建时间" width="300"></ws-table-column-el>
                <ws-table-column-el prop="createAdmin" label="创建人" width="150"></ws-table-column-el>
                <ws-table-column-el prop="count" label="下载次数"></ws-table-column-el>
                <ws-table-column-el label="状态" width="150">
                    <template slot-scope="scope">{{ scope.row.status == 0 ? '待处理' : scope.row.status == 1 ? '处理中' : scope.row.status == 2 ? '成功' : '失败' }}</template>
                </ws-table-column-el>
                <ws-table-column-el label="操作" fixed="right" width="150">
                    <template slot-scope="{row}">
                        <el-button-group>
                            <ws-throttle v-if="powerList.download && row.status == 2">
                                <el-button class="download" type="text" :disabled="row.disabled" @click="downloadFile(row)">下载</el-button>
                            </ws-throttle>
                        </el-button-group>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchOptions: {
                createAdmin: '',
                type: '',
                startTime: '',
                endTime: ''
            },
            tableConfig: {
                labelWidth: '74px',
                filterColumns: false,
                pageId: 'id',
                pageCreateTime: 'pageCreateTime',
                // layout: 'flow',
                pageSizeList: [20, 50, 100],
                lazyQuery: {
                    moduleName: '/workbench/DLdownLoad',
                    op: {
                        selectList: 'selectAndPage',
                        selectCount: 'selectByCount'
                    },
                    beforeQuery: this.beforeSearch,
                    afterQuery: this.afterQuery
                }
            },
            moduleName: '/workbench/DLdownLoad',
        };
    },
    computed: {
        fileType() {
            let methodList = this.$baseMethod.getStore('os-methodList') || {};
            let fileType = methodList[this.moduleName] || {};
            const deleteKey = ['selectAndPage', 'download', 'selectByCount'];
            const filterArr = [];
            for (const key in fileType) {
                if (!deleteKey.includes(key)) {
                    filterArr.push({
                        id: key,
                        value: fileType[key]['resourcesName']
                    });
                }
            }
            return filterArr;
        }
    },
    methods: {
        beforeSearch() {
            if (!this.searchOptions.type) {
                // this.$message.error('请选择文件类型');
                this.$refs.table.tableData = [];
                return;
            } else {
                let fileType = JSON.parse(JSON.stringify(this.searchOptions.type));
                return { ...this.searchOptions, fileType };
            }
        },
        afterQuery(data) {
            data.body = data.body || []
            data.body.forEach(p => {
                p.disabled = false
            })
            return data
        },
        hanldeSearch(type = 1) {
            this.$refs.table.search();
        },
        reset() {
            this.searchOptions = {
                createAdmin: '',
                type: '',
                startTime: '',
                endTime: ''
            };
            this.$refs.table.search();
        },
        sysTypeFormat(row) {
            const sysTypeObj = this.fileType.find(item => item.id == row.type);
            return sysTypeObj ? sysTypeObj.value : '客情信息文件导出';
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        async downloadFile(rowData) {
            rowData.disabled = true
            this.$forceUpdate()
            const data = {
                op: 'download',
                data: JSON.stringify({
                    id: rowData.id,
                    filename: rowData.filename,
                    type: rowData.type
                })
            };
            try {
                await this.$downFile(this.getModuleUrl('download'), data, {timeout:0})
            } catch(err) {
                
            } finally {
                rowData.disabled = false
            }
        
        }
    }
};
</script>

<style lang="scss" scoped>
.download {
    margin: 0 15px !important;
    color: #0088ff;
}
.flex-box {
    margin-top: 20px;
    display: flex;
    display: -ms-flexbox;
    display: -webkit-flex;
    justify-content: flex-start;
    align-items: center;
}
/deep/ .el-pagination {
    float: right;
}

.ws-table-warp {
    /deep/ .option-box {
        padding: 0;
    }
}
</style>
