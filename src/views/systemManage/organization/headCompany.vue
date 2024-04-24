<template>
    <div v-loading="loading" class="bigBox">
        <h2 class="header">{{ titleName }}</h2>
        <div class="allorg">
            <div class="org" v-for="(item,index) in orgContent" :key="index">
                <div class="index"></div>
                <div class="orgPerson">
                    <el-tooltip :class="item.name.length>=10?'orgName':''" effect="light" :content="item.name" placement="top-start">
                        <span>{{item.name}}</span>
                    </el-tooltip>
                    <div>({{item.value}})</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { _axios } from '@/utils/commMethods';
export default {
    data() {
        return {
            chartRound: null,
            titleName: '',
            loading: false,
            moduleName: '/systemManage/organization',
            orgContent: '',
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.drawRoundChart();
        });
    },
    methods: {
        async drawRoundChart() {
            this.loading = true;
            let param = {
                depType: 1,
                op: 'selectOrgPieChart',
            };
            const res = await _axios(param, this.moduleName);
            this.loading = false;
            if (res.code == 1 && Object.keys(res.data).length > 0) {
                let { deptPieList, name } = res.data || {};
                this.titleName = name || '';
                let mapData = deptPieList.map(item => {
                    return {
                        value: item.count,
                        name: item.name,
                    };
                });
                this.orgContent = mapData;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.bigBox {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    .header {
        height: px;
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #303133;
        margin-left: 25px;
        padding-top: 24px;
        padding-bottom: 20px;
        margin-bottom: 16px;
        border-bottom: 1px solid #dcdfe6;
        width: calc(100% - 48px);
    }
    .allorg {
        min-width: 400px;
        width: 95%;
        margin-top: 20px;
        margin-left: 24px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        height: 80%;
        // display: flex;
        // flex-wrap: wrap;
        // flex-direction: column;
        overflow-y: auto;
        .org {
            display: flex;
            justify-content: left;
            align-items: center;
            margin-top: 5px;
            .index {
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background: #f05259;
                margin: 8px;
            }
            .orgPerson {
                display: flex;
                justify-content: left;
                align-items: center;
                width: 180px;
                .orgName {
                    width: 153px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>
