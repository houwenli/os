<!--
 * @Author: DaiYu
 * @Date: 2023-02-17 15:15:46
 * @LastEditors: DaiYu
 * @LastEditTime: 2023-03-02 18:04:10
 * @FilePath: \main\src\views\dataServer\vipAnalysis\index.vue
 * @Description: file content
-->
<template>
    <div class="vip-box">
        <div class="fix-header">
            <div class="block"></div>
            <div class="card-header">
                <el-tabs class="tabs" v-model="payMode">
                    <el-tab-pane v-for="(item, index) in options" :label="item.label" :name="item.value" :key="index"></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div style="height: 46px"></div>
        <component :is="type"></component>
    </div>
</template>

<script>
import All from './all.vue'

export default {
    components: {All},
    data () {
        return {
            type: 'All',
            moduleName: '/dataServer/vipAnalysis',
            options: [
                {
                    value: '0',
                    label: '全部支付',
                    desc: '即司机现金支付和乘客余额支付汇总'
                },
                {
                    value: '1',
                    label: '司机现金支付',
                    desc: '支付类型为自付的包干'
                },
                {
                    value: '2',
                    label: '乘客余额支付',
                    desc: '支付类型为亲友代付的包干'
                }
            ],
            payMode: '1'
        }
    },
    provide () {
        return {
            payType: () => this.payMode
        }
    },
    computed: {
        isAll () {
            const {overview, amountAnalysis, cntAnalysis, saleRank, export: ex} = this.powerList
            return overview || amountAnalysis || cntAnalysis || saleRank || ex
        }
    }
}
</script>

<style lang="scss" scoped>
.vip-box {
    &.height-abs {
        padding-top: 0 !important;
    }

    .fix-header {
        position: absolute;
        left: 0;
        right: 0;
        top: 56px;
        z-index: 999;
        background: #fff;
        border-bottom: 1px solid #EBEEF5;

        .topTab {
            text-align: center;
            margin-bottom: 5px;
            padding: 5px;
            border-bottom: 1px solid #f2f2f2;
        }

        .block {
            position: relative;
            width: 100%;
            height: 8px;
            background: linear-gradient(180deg, #F0F2F5 0%, rgba(255, 255, 255, 0) 100%);
        }
    }

    .card-header {
        padding: 0 32px 0 24px;
        height: 36px;

        /deep/ {
            .tabs {
                .el-tabs__item {
                    height: 36px;
                    line-height: 36px;
                    padding: 0 24px 0 0;
                }

                .el-tabs__header {
                    margin: 0;
                }

                .is-active {
                    font-weight: 600;
                }
            }

            .el-tabs__nav-wrap::after {
                height: 0 !important;
            }

            .paySelect {
                .el-radio {
                    padding: 5px 16px;
                    margin-right: 8px;
                    border-radius: 4px;

                    &:last-of-type {
                        margin-right: 0px;
                    }
                }

                .el-radio__label {
                    padding: 0;
                }

                .el-radio__input {
                    display: none;
                }
            }
        }
    }

    .block2 {
        height: 56px;
    }
}
</style>
