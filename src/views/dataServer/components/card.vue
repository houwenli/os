<!--
 * @Author: DaiYu
 * @Date: 2023-02-17 15:15:46
 * @LastEditors: DaiYu
 * @LastEditTime: 2023-02-28 17:08:04
 * @FilePath: \main\src\views\dataServer\vipAnalysis\components\card.vue
 * @Description: file content
-->
<template>
    <div class="card">
        <div class="content" v-if="dataCard">
            <div class="left">
                <div>
                    <span>{{titles[0]}}</span>
                    <span><label><count-to :startVal="0" :decimals="2" :duration='1000' :endVal="+$baseMethod.regFenToYuan(dataCard.todayAmt,false)||0"></count-to></label> 元</span>
                </div>
                <div class="mt">
                    <span>{{titles[1]}}</span>
                    <span><label><count-to :startVal="0" :decimals="2" :duration='1000' :endVal="+$baseMethod.regFenToYuan(dataCard.monthAmt,false)||0"></count-to></label> 元</span>
                </div>
            </div>
            <div class="right">
                <div>
                    <span>{{titles[2]}}</span>
                    <span><label><count-to :startVal="0" :decimals="0" :duration='1000' :endVal="dataCard.todayCnt"></count-to></label> 人</span>
                </div>
                <div class="mt">
                    <span>{{titles[3]}}</span>
                    <span><label><count-to :startVal="0" :decimals="0" :duration='1000' :endVal="dataCard.monthCnt"></count-to></label> 人</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import countTo from 'vue-count-to'

export default {
    components:{
        countTo
    },
    props: {
        dataSet: {
            type: Object
        },
        titles: {
            type: Array,
            default: () => ['今日包干金额', '本月包干金额', '今日包干司机数',  '本月包干司机数']
        }
    },
    data() {
        return {
            titleMap: {
                stat: '全部',
                proven: '认证司机',
                local: '本地司机',
                dj: '代驾司机'
            },
            fieldMap: {
                stat: 'all',
                proven: 'certifiedDriver',
                local: 'localDriver',
                dj: 'djDriver'
            },
        }
    },
    computed: {
        dataCard() {
            return this.dataSet
        }
    },
}
</script>

<style lang="scss" scoped>
    .card {
        padding: 32px 40px;
        background: linear-gradient(180deg, #DAE9FF 0%, #FFFFFF 100%);
        border-radius: 8px;
        .content {
            font-size: 16px;
            display: flex;
            .left,.right {
                flex: 1;
            }
            .left {
                border-right: 1px solid #FFFFFF;
            }
            .right {
                margin-left: 40px;
            }
            .mt {
                margin-top: 24px;
            }
            color: #606266;
            label {
                margin-left: 32px;
                font-weight: bold;
                color: #303133;
            }
        }
    }
</style>
