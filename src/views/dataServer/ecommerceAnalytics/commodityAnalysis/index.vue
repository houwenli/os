<template>
    <div class="app-container content-box">
        <ws-table-el ref="table" v-bind="tableConfig" @sort-change="changeSort" :header-cell-style="{ background: '#F5F7FA' }">
            <template #search>
                <search-group>
                    <label for>分析类型：</label>
                    <el-select v-model.trim="searchOptions.spuAnalysisType" placeholder="请选择" @change="onChangeSpuAnalysisType">
                        <el-option v-for="item in analysisOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>SPU编号：</label>
                    <el-input v-model.trim="searchOptions.spuId" maxlength="15" placeholder="请输入SPU编号" clearable @input="numberInput"></el-input>
                </search-group>
                <search-group>
                    <label for>SPU标题：</label>
                    <el-input v-model.trim="searchOptions.name" maxlength="50" placeholder="请输入SPU标题" clearable></el-input>
                </search-group>
            </template>
            <template #options>
                <div style="text-align: right">
                    <el-button-group v-if="powerList.pageSpuAnalysis">
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                        <ws-throttle>
                            <el-button class="resetBtn" type="primary" icon="el-icon-refresh-left" @click="handleReset"></el-button>
                        </ws-throttle>
                    </el-button-group>
                    <ws-throttle><el-button v-if="powerList.exportSpuAnalysis" style="margin-left: 16px" plain @click="exportExcel">导出</el-button></ws-throttle>
                </div>
            </template>
            <template>
                <el-table-column key="index" label="排名" type="index" width="75" :index="indexFormat"></el-table-column>
                <ws-table-column-el prop="spuId" label="SPU编号"></ws-table-column-el>
                <ws-table-column-el prop="url" label="SPU图片">
                    <template slot-scope="{ row }">
                        <img :src="row.url" alt="" style="width: 50px" />
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="name" label="SPU标题" show-overflow-tooltip width="200"></ws-table-column-el>
                <ws-table-column-el prop="price" label="SPU价格" v-if="showPriceColumn"></ws-table-column-el>
                <ws-table-column-el v-if="columnShow" prop="storeName" label="所属商家"></ws-table-column-el>
                <ws-table-column-el prop="firstCateName" label="一级分类"></ws-table-column-el>
                <ws-table-column-el prop="secondCateName" label="二级分类"></ws-table-column-el>
                <ws-table-column-el prop="thirdCateName" label="三级分类"></ws-table-column-el>
                <ws-table-column-el prop="brandName" label="品牌"></ws-table-column-el>
                <ws-table-column-el v-for="item in columnFilters" :key="item.prop" width="160" :prop="item.prop" :label="item.label" sortable="custom">
                    <template v-if="item.content" slot="header">
                        {{ item.label }}
                        <el-tooltip :content="item.content" placement="top-start" class="info-tooltip">
                            <i class="el-icon-question" style="color: #333; vertical-align: middle"></i>
                        </el-tooltip>
                    </template>
                    <template v-if="item.format" slot-scope="{ row }">
                        {{ item.format(row) }}
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
import { columnOptions, portOptions, analysisOption, timeOptions, topRankOptions, sortMap } from '../constants'
export default {
    name: 'commodityAnalysis',
    data() {
        return {
            moduleName: '/dataServer/commodityAnalysis',
            op: {
                queryCategoryInfo: 'queryCategoryByParentId',
                export: 'exportSpuAnalysis'
            },
            tableConfig: {
                loading: true,
                filterColumns: false,
                emptyModel: true,
                indexColumn: false,
                autoHeight: false,
                lazyQuery: {
                    moduleName: '/dataServer/commodityAnalysis',
                    op: {
                        selectList: 'pageSpuAnalysis'
                    },
                    afterQuery: this.afterQuery,
                },
                pageSizeList: [20, 50, 100]
            },
            searchOptions: {
                spuAnalysisType: 1,
                timeType: 4,//后端要求传4
                // topRanking: 2,
                source: '',
                spuId: '',
                name: '',
                firstCateId: '', // 一级分类id
                secondCateId: '',
                thirdCateId: '',
                sort: 102 // 排序
            },
            // cateSelectedOptions: [],
            props: {
                lazy: true,
                checkStrictly: true,
                lazyLoad: this.lazyLoad
            },
            // portOptions,
            topRankOptions,
            // timeOptions,
            analysisOption,
            columnFilters: [], // 类型列表
            columnShow: false,
            tempSpuAnalysisType: 1, // 临时存分析类型
            showPriceColumn: true,//列表显示spu价格字段
        }
    },
    created() {
        this.changeColumn()
    },
    methods: {
      onChangeSpuAnalysisType(val) {
        console.log(val,'v')
        let c = {
          1: 102,
          3: 302,
          4: 402,
          9: 802
        }

        this.searchOptions.sort = c[val]
      },
        // 根据分析类型动态显示table列
        changeColumn() {
            this.columnFilters = columnOptions[this.searchOptions.spuAnalysisType]
        },

        indexFormat(index) {
            return index + (this.$refs.table.currentPage - 1) * this.$refs.table.pageSize + 1
        },

        numberInput(value) {
            this.searchOptions.spuId = value.replace(/[^\d]/g, '')
        },

        handleSearch() {
            const { spuAnalysisType } = this.searchOptions

            /**
             * table是否显示所属商家列
             * 只有分析类型为分析类型商品退款分析时候显示
             */
            if (spuAnalysisType === 5) {
                this.columnShow = true
            } else {
                this.columnShow = false
            }

            if (this.tempSpuAnalysisType != spuAnalysisType) {
                this.tempSpuAnalysisType = spuAnalysisType
                // 调用table init方法，重新获取table列
                this.changeColumn()
                this.$nextTick(() => {
                    this.$refs.table.init()
                })
            }

            this.$refs.table.search()
        },

        handleReset() {
            this.searchOptions = this.$options.data().searchOptions
            // this.cateSelectedOptions = []
            this.handleSearch()
        },

        lazyLoad(node, resolve) {
            const { level } = node
            let URL = this.$getModuleUrl(this.moduleName, this.op.queryCategoryInfo)
            let data = {
                op: this.op.queryCategoryInfo,
                data: {
                    parentId: node.data ? node.data.value : level
                }
            }

            this.$axios(URL, data).then(res => {
                if (res.code === 1) {
                    let nodes = JSON.parse(res.data).map(val => ({
                        leaf: level >= 2,
                        value: val.id,
                        label: val.name
                    }))
                    resolve(nodes)
                }
            })
        },

        // changeCategory(val) {
        //     ;[this.searchOptions.firstCateId = '', this.searchOptions.secondCateId = '', this.searchOptions.thirdCateId = ''] = val || []
        // },

        changeSort({ column, prop, order }) {
            this.searchOptions.sort = sortMap[prop]?.[order] || ''
            this.handleSearch()
        },

        // 导出
        exportExcel() {
            const reqData = {
                data: this.searchOptions,
                op: this.op.export
            }
            let URL = this.$getModuleUrl(this.moduleName, reqData.op)
            this.$axios(URL, reqData).then(res => {
                this.$message.success('文件正在导出，请到文件下载界面进行下载')
            })
        },
        afterQuery(data){
            this.showPriceColumn = this.searchOptions.spuAnalysisType !== 9
            return data
        },
    }
}
</script>

<style lang="scss" scoped>
/deep/.el-table .sort-caret.ascending {
    border-bottom-color: #dcdfe6;
}
/deep/.el-table .sort-caret.descending {
    border-top-color: #dcdfe6;
}
/deep/.el-table .descending .sort-caret.descending {
    border-top-color: #909399;
}
/deep/.el-table .ascending .sort-caret.ascending {
    border-bottom-color: #909399;
}
</style>
