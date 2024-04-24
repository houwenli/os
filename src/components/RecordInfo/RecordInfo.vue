<template>
    <div class="settle-payCompang-list">
        <ws-table-el ref="table" v-bind="tableConfig">
            <template>
                <ws-table-column-el prop="updateUserName" label="操作人"></ws-table-column-el>
                <ws-table-column-el prop="updateType" label=" 操作类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.updateType == 1 ? '新增' : scope.row.updateType == 2 ? '修改' : '状态标记' }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="updateTime" label="操作时间"></ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
// import { mapState } from "vuex";
export default {
    name: 'recorfInformation',
    props: ['recordInfo'],
    data() {
        return {
            searchOptions: {
                recordId: '',
                orgType: '',
                infoType: 1
            },
            tableConfig: {
                pageSizeList: [5, 10, 20],
                filterColumns: false,
                autoHeight: false,
                layout: 'fixed',
                lazyQuery: {
                    url: '/authority/attach/common/select',
                    op: {
                        selectList: 'selectLogList',
                        selectCount: 'selectLogCount'
                    },
                    beforeQuery: this.beforeQuery
                }
            }
        };
    },
    // computed: {
    //     ...mapState([
    //         'updateTypeFilters',
    //     ]),
    // },
    watch: {
        recordInfo: {
            handler(val) {
                this.recordInfo = val;
            },
            immediate: true
        }
    },
    methods: {
        beforeQuery() {
            return {
                ...this.searchOptions,
                ...this.recordInfo
            };
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/ .ws-table-warp {
    padding: 0 !important;
    min-height: 0;
}
/deep/ .option-box {
    display: none !important;
}
</style>
