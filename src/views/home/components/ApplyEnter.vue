<template>
    <div class="home-container">
        <header>{{ title }}</header>
        <div class="home-container-content">
            <el-row :gutter="20" class="home-container-flex-wrap">
                <el-col :xs='24' :sm='12' :md='6' :lg="4" v-for="item in imgList[0].children" :key="item.id">
                    <el-card height="74" shadow="hover" @click.native="goToPage(item.resourcesUrl)">
                        <div class="home-container-sub-content">
                            <img v-if="item.resourcesPic" width="40" :src="item.resourcesPic" />
                            <i v-if="item.imgName" width="40" :class="item.imgName ? `${item.imgName} IconClass` : 'IconClass'"></i>
                            <div v-if="!item.imgName && !item.resourcesPic" class="img-placeholder"></div>
                            <span>{{ item.resourcesName }}</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '业务申请'
        },
        imgList: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        goToPage(path) {
            let query = {};
            if (path == '/powerApply' || path == 'powerApply') {
                query = { id: '27'};
            } else if (path == '/powerApplyBranchRole' || path == 'powerApplyBranchRole') {
                query = { id: '23'};
                path = '/powerApply';
            } else if (path == '/currencyApply' || path == 'currencyApply') {
                query = { id: '24' };
            } else if (path == '/quitApply' || path == 'quitApply') {
                query = { id: '54' };
            } else if(path == '/currencyApplyBranchRole'){
                //机构通用审批
                query = { id: '29' };
                path='/currencyApply'
            }

            this.$router.push({ path, query });
        }
    }
};
</script>

<style scoped lang="scss">
.home-container {
    margin-bottom: 16px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #ffffff;
    padding: 24px 16px 0;
    backdrop-filter: blur(2px);
    &-sub-content {
        display: flex;
        align-items: center;

        span {
            font-size: 14px;
            margin-left: 12px;
            color: #303133;
        }
    }

    header {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 16px;
    }
    ::v-deep .el-card {
        border-radius: 8px;
        border: none;
        background: #F5F7FA;
        cursor: pointer;
        height: 74px;
        margin-bottom: 24px;
    }

    ::v-deep .el-card__body {
        padding: 16px 12px;
    }

    .IconClass {
        font-size: 40px;
    }
    .img-placeholder{
        width: 40px;
        height: 40px;
    }
}
</style>
