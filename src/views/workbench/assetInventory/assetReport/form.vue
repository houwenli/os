<template>
    <div class="flex-column">
        <div class="form-wrap flex-1">
            <ws-descriptions title="基础信息">
                <ws-descriptions-item label="姓名" :showTip="false">{{ getObj.name }}</ws-descriptions-item>
                <ws-descriptions-item label="手机号码" :showTip="false">{{ getObj.phone }}</ws-descriptions-item>
                <ws-descriptions-item label="归属机构" :showTip="true">{{ getObj.agencyNumberName }}</ws-descriptions-item>
                <ws-descriptions-item label="车牌号" :showTip="false">{{ getObj.carNumber }}</ws-descriptions-item>
                <ws-descriptions-item label="车辆所有人" :showTip="false">{{ getObj.typeName }}</ws-descriptions-item>
            </ws-descriptions>
            <ws-descriptions title="资产信息" type="container">
                <ul class="asset-info">
                    <li v-for="item in getObj.attachList" :key="item.urlType">
                        <el-image style="width: 160px; height: 160px" :preview-src-list="[item.url]" :src="item.url">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <p>{{imgTypeMap[item.urlType]}}</p>
                    </li>
                    <li v-for="item in 7" class="placeholder" :key="'ph'+item"></li>
                </ul>
            </ws-descriptions>
            <ws-descriptions title="操作信息" type="container">
                <ws-table-el ref="table" class="table" v-bind="tableConfig">
                    <template>
                        <ws-table-column-el align="center" prop="createTime" label="操作时间"></ws-table-column-el>
                        <ws-table-column-el align="center" prop="auditStatusName" label="状态"></ws-table-column-el>
                        <ws-table-column-el align="center" prop="operatorIdName" label="操作人"></ws-table-column-el>
                        <ws-table-column-el align="center" prop="remark" label="备注"></ws-table-column-el>
                    </template>
                </ws-table-el>
            </ws-descriptions>
        </div>
        <div class="footer_btn">
            <el-button plain @click="back()">返回</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            getObj: {},
            moduleName: '/workbench/assetInventory/assetReport/list',
            tableConfig: {
                data: [],
                total: 0
            },
            imgTypeMap: Object.freeze({
                1: '车辆行驶证正副本',
                2: '营业执照副本',
                3: '身份证人像面',
                4: '身份证国徽面',
                5: '车辆登记证1',
                16: '车辆登记证2',
                15: '网络预约出租汽车驾驶员证',
                6: '车辆运输证',
                7: '车辆购置发票',
                8: '车身正面照',
                9: '车身侧面照',
                10: '车身后面照',
                11: '车内仪表盘',
                12: '车架照',
                13: '今年交强险',
                14: '今年商业险',
            })
        }
    },
    filters: {
        owner(val) {
            const dict = ['个人户', '租赁公司'];
            return dict[val - 1];
        },
    },
    created() {
        this.getData();
    },
    methods: {
        back() {
            this.$router.push(this.moduleName);
        },
        getData() {
            let data = {
                data: {
                    id: this.$route.query.id
                },
                op: 'detail'
            };
            this.$axios(this.powerList.detail, data).then(res => {
                this.getObj = JSON.parse(res.data);
                this.$set(this.tableConfig, 'data', this.getObj.logList);
                this.$set(this.tableConfig, 'total', this.getObj.logList.length);
            })
        }
    }
};
</script>

<style lang="scss" scoped>
    .form-wrap {
        padding: 32px 40px;
        background: #fff;
        border-radius: 8px;
        .title {
            display: inline-block;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
        }
        /deep/ .inpt_.el-input.is-disabled .el-input__inner {
            background-color: #fff !important;
        }
        /deep/ .ws-descriptions__title {
            font-size: 16px;
        }
        .ws-table-warp {
            min-height: auto;
        }
        .table {
            padding: 0 !important;
            min-height: auto !important;
            /deep/ .option-box {
                margin: 0 !important;
            }
        }
    }
    .asset-info {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        column-gap: 40px;
        li {
            margin-bottom: 10px;
            &.placeholder {
                visibility: hidden !important;
                width: 160px;
                height: 0 !important;
                border: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            p {
                text-align: center;
            }
        }
    }
    /deep/.image-slot {
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: #f5f7fa;
        color: #909399;
    }
</style>
