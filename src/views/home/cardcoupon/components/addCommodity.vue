<template>
    <el-dialog class="adddialog" title="选择商品" :visible.sync="showCommodityList" top="4vh" append-to-body width="60%" :before-close="handleClose" @open="open()">
        <ws-table-el v-bind="tableConfig" ref="tableList" @selection-change="selectdatalist" :filterColumns="false" :multi="true">
            <template #search>
                <search-group>
                    <el-col :span="24">
                        <label for>SPU编号：</label>
                        <el-input v-model="searchOptions.spuId" maxlength="30" placeholder="请输入SPU编号"></el-input>
                    </el-col>
                </search-group>
                <search-group>
                    <el-col :span="24">
                        <label for>SPU标题：</label>
                        <el-input v-model="searchOptions.name" maxlength="30" placeholder="请输入SPU标题"></el-input>
                    </el-col>
                </search-group>
                <search-group>
                    <el-col :span="24">
                        <label for>商品分类：</label>
                        <el-cascader v-model="searchOptions.classify" placeholder="全部" :props="classifyList" clearable></el-cascader>
                    </el-col>
                </search-group>
            </template>
            <template #searchBtns>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                    <ws-throttle>
                        <el-button class="resetBtn" type="primary" @click="reset" icon="el-icon-refresh-left"></el-button>
                    </ws-throttle>
                </el-button-group>
            </template>
            <template>
                <ws-table-column-el prop="spuId" label="SPU编号" width="200"></ws-table-column-el>
                <ws-table-column-el label="SPU图片" width="80">
                    <template slot-scope="scope">
                        <img :src="scope.row.url" width="50" height="50" />
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="name" label="SPU标题"></ws-table-column-el>
                <ws-table-column-el prop="price" label="SPU价格">
                    <template slot-scope="scope">
                        {{ regFenToYuan(scope.row.price) }}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="firstCateName" label="一级分类"></ws-table-column-el>
                <ws-table-column-el prop="secondCateName" label="二级分类"></ws-table-column-el>
                <ws-table-column-el prop="thirdCateName" label="三级分类"></ws-table-column-el>
                <ws-table-column-el prop="brandName" label="品牌"></ws-table-column-el>
                <ws-table-column-el prop="stock" label="库存"></ws-table-column-el>
            </template>
        </ws-table-el>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCommodityList = false">取 消</el-button>
            <el-button type="primary" @click="saveList">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    props: {
        couponRelationSpuList: {
            type: Array,
            default: []
        },
        inListData: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            tableConfig: {
                loading: true,
                lazyQuery: {
                    moduleName: '/cardcoupon/applyOnlineRetailersCoupon/pageSpuList',
                    op: {
                        selectList: 'pageSpuList',
                        selectcount: 'pageSpuCount'
                    },
                    beforeQuery: this.beforeQueryMain,
                    afterQuery: this.afterQuery
                }
            },
            showCommodityList: false,
            showcommoditybtn: true,
            ecommerceradio: '2',
            selectList: [],
            searchOptions: {
                spuId: '',
                name: '',
                couponsType: '',
                faceValue: '',
                classify: '',
                firstCateId: '',
                secondCateId: '',
                thirdCateId: ''
            },
            datalist: [],
            commodityoptions: [],
            brandoptions: [],
            classifyList: {
                lazy: true,
                lazyLoad: this.lazyLoad
            }
        }
    },
    mounted() {},
    methods: {
        beforeQueryMain() {
            return {
                ...this.searchOptions,
                id:this.searchOptions.spuId,
                name:this.searchOptions.name,
                firstCateId: this.searchOptions.classify[0],
                secondCateId: this.searchOptions.classify[1],
                thirdCateId: this.searchOptions.classify[2],
                couponsType: this.inListData.couponsType * 1 || '',
                faceValue: this.$baseMethod.regYuanToFen(this.inListData.faceValue) * 1
            }
        },
        afterQuery(data) {
            this.open()
            return data
        },
        lazyLoad(node, resolve) {
            const { level } = node
            console.log(node, '32322xxxx')
            if (node.pathLabels) {
                console.log('节点为3')
            }
            let data = {
                op: 'queryCategoryInfo',
                data: {
                    parentId: node.data ? node.data.value : level
                }
            }
            try {
                this.$axios('/cardcoupon/applyOnlineRetailersCoupon/queryCategoryInfo', data).then(res => {
                    //列表
                    if (res.code === 1) {
                        let nodes = JSON.parse(res.data).map(v => ({
                            leaf: level >= 2,
                            value: v.id,
                            label: v.name
                        }))
                        console.log(nodes, '====')
                        resolve(nodes)
                    }
                })
            } catch (error) {
                console.log(error)
            }
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
        },
        regFenToYuan(m) {
            return this.thousandSeparator(this.$baseMethod.regFenToYuan(m))
        },
        // 添加千位符
        thousandSeparator(num) {
            var res = num.toString().replace(/\d+/, function (n) {
                // 先提取整数部分
                return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                    return $1 + ','
                })
            })
            return res
        },
        //接口废弃品牌列表
        // getbrandList() {
        //     let data = {
        //         op: 'queryBrandInfo'
        //     }
        //     try {
        //         this.$axios('/cardcoupon/applyOnlineRetailersCoupon/queryBrandInfo', data).then(res => {
        //             //列表
        //             if (res.code === 1) {
        //                 console.log(res)
        //                 let currentList = []
        //                 currentList = res.data
        //                 currentList = JSON.parse(currentList)
        //                 currentList.forEach((item, index) => {
        //                     this.brandoptions[index] = { value: item.id, label: item.name }
        //                 })
        //             }
        //         })
        //     } catch (error) {
        //         console.log(error)
        //     }
        // },
        open() {
            setTimeout(() => {
                let arr = this.couponRelationSpuList.map(item => {
                    return item.spuId
                })
                this.$refs.tableList.tableData.forEach(item => {
                    if (arr.includes(item.spuId)) {
                        this.$refs.tableList.toggleRowSelection(item, true)
                    } else {
                        this.$refs.tableList.toggleRowSelection(item, false)
                    }
                })
            }, 0)
        },
        selectdatalist(row) {
            this.selectList = row
        },
        saveList() {
            this.showCommodityList = false
            this.$emit('selectList', this.selectList, 'add')
        },
        reset() {
            this.searchOptions = {
                spuId: '',
                name: '',
                couponsType: '',
                faceValue: '',
                classify: '',
                firstCateId: '',
                secondCateId: '',
                thirdCateId: ''
            }
            this.$refs.tableList.reset()
        },
        search() {
            this.$refs.tableList.search()
        },
        addcommoditybtn() {
            this.showCommodityList = true
            // this.getbrandList()    废弃获取品牌列表
            this.$nextTick(() => {
                this.search()
                let arr = this.couponRelationSpuList.map(item => {
                    return item.spuId
                })
                this.$refs.tableList.tableData.forEach(item => {
                    if (arr.includes(item.spuId)) {
                        this.$refs.tableList.toggleRowSelection(item, true)
                    }
                })
            })
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done()
                })
                .catch(_ => {})
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
    padding: 0 24px;
}
/deep/ .el-dialog__footer {
    padding-top: 0;
}
</style>
