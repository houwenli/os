<template>
    <div>
        <div class="ws-table-warp content-style">
            <el-tabs class="tab-wrap" v-model="activeTab" @tab-click="handleClick">
                <el-tab-pane v-for="item in menuOptions" :label="item.resourcesName" :name="item.resourcesUrl" :key="item.name"></el-tab-pane>
            </el-tabs>
            <component :is="activeTab" :levelDeptData="deptData" />
        </div>
    </div>
</template>

<script>
import telephoneManage from './telephoneManage/index.vue';
import deptPermiss from './deptPermiss/index.vue';
import friendManage from './friendManage/index.vue';
export default {
    name: 'telephone',
    components: {
        telephoneManage,
        deptPermiss,
        friendManage
    },
    created() {
        this.fetchTopDeptData();
        if(this.$route.params.from) {
            this.activeTab = this.$route.params.from
        }
    },
    watch: {
        defaultMenuOptions: {
            deep: true,
            immediate: true,
            handler: function (newV) {
                // 筛选出通讯录和部门选项
                this.menuOptions = ((newV || {}).menuList || []).map(item => {
                    console.log(item, 'item');
                    let name = item.resourcesUrl.indexOf('/') > -1 ? item.resourcesUrl.split('/')[1] : item.resourcesUrl;
                    return { ...item, resourcesUrl: name };
                });
            }
        }
    },
    data() {
        return {
            activeTab: 'telephoneManage',
            moduleName: '/telephoneManage',
            deptData: null,
            menuOptions:[]
        };
    },

    methods: {
        handleClick() {
            this.fetchTopDeptData();
        },
        fetchTopDeptData() {
            //获取部门树-最上级传入两边的tab
            const queryData = {
                data: {
                    id: 0
                },
                op: 'selectOrgTree'
            };
            this.$axios(this.getModuleUrl(queryData.op), queryData).then(res => {
                // this.$axios('/authority/contacts/select', queryData).then(res => {
                let result = JSON.parse(res.data);

                result.childList.forEach(i => {
                    i.leaf = i.childFlag == 0;
                });
                this.deptData = result;
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    }
};
</script>

<style lang="scss" scoped>
.content-style {
    // height: auto;
    padding: 24px 40px !important;
    background-color: #fff;
    border-radius: 8px;
    min-height: 84vh;
    .tab-wrap {
        ::v-deep > .el-tabs__header {
            display: flex;
            justify-content: center;
            margin-bottom: 0;
            .el-tabs__nav-wrap {
                background-color: #f5f7fa;
                border-radius: 4px 0px 0px 4px;
                .el-tabs__active-bar {
                    width: 0 !important;
                }
                &::after {
                    width: 0;
                }
            }
            .el-tabs__item {
                width: 124px;
                height: 40px;
                text-align: center;
                color: #606266;
                padding: 0;
                &.is-active {
                    background-color: #f05259;
                    color: #fff;
                    opacity: 1;
                }
                &.is-top:last-child {
                    border-radius: 0px 4px 4px 0px !important;
                }
            }
        }
        ::v-deep .el-tabs__nav-wrap {
            display: inline-block;
            border-radius: 4px 4px 4px 4px !important;
        }
    }
}
</style>
