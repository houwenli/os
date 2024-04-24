<template>
    <div class="settle-payCompang-list">
        <ws-table-el ref="table" v-bind="tableConfig">
            <template>
                <ws-table-column-el prop="updateUserName" label="操作人"></ws-table-column-el>
                <ws-table-column-el prop="updateType" label=" 操作类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.updateType | updateTypeFilters}}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="updateTime" label="操作时间">
                    <!-- <template slot-scope="scope">
                        <span>{{$baseMethod.formatData(scope.row.updateTime,'yyyy-MM-dd')}}</span>
                    </template> -->
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    export default {
        name: 'recorfInformation',
        props: ['recordInfo'],
        data(){
            return{
                searchOptions:{
                    agencyNumber: '',
                    orgType: '',
                    infoType: 1,
                },
                tableConfig: {
                    pageSizeList: [5,10,20],
                    filterColumns: false,
                    layout: 'fixed',
                    autoHeight: false,
                    lazyQuery: {
                        url: 'orgWeb/operationLog/select',
                        op: {
                            selectList: 'selectAgencyNumberLogList',
                            selectCount: 'selectAgencyNumberLogCount',
                        },
						beforeQuery: this.beforeQuery,
                    }
                },
            }
        },
        computed: {
            ...mapState('personalCenter',[
                'updateTypeFilters',
            ]),
        },
        watch: {
            recordInfo:{
               handler(val) {
                    this.recordInfo = val;
                },
                immediate: true, 
            }
        },
        methods:{
            beforeQuery(){
                return {
                    ...this.searchOptions,
                    ...this.recordInfo
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .ws-table-warp {
        padding: 0 !important;
        .option-box{
            display: none;
        } 
        .el-table--fit{
            border-radius: 8px !important;
        }
    }
</style>