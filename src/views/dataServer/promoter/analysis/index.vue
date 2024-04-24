<template>
    <div class="promoter-analysis">
        <div class="prom-box">
            <div class="searchBox" v-show="roleType !== 40">
                <el-form ref="ruleForm" inline label-width="90px">
                    <template>
                        <el-form-item label="机构名称：" prop="agencyNumber">
                            <organization
                                v-model="agencyNumber"
                                :showSelect="true"
                                :selectOptions="selectOptions"
                                ref="orgSelect"
                                placeholder="请输入机构名称搜索"
                                valueKey="agencyNumber"
                                :reqData="reqData"
                                :orgType="orgType"
                                @orgTypeChange="
                                    val => {
                                        orgType = val;
                                    }
                                "
                            ></organization>
                        </el-form-item>
                    </template>
                </el-form>
                <div class="btn-box">
                    <ws-throttle>
                        <el-button
                            v-if="powerList.overview || powerList.activeReward || powerList.promoterRank || powerList.rewardAmtRank"
                            class="query-btn"
                            type="primary"
                            icon="el-icon-search"
                            @click="handelData"
                        >
                            查询
                        </el-button>
                    </ws-throttle>
                </div>
            </div>
            <div class="distribute" v-if="powerList.overview">
                <div class="distr">
                    <div class="title">推广员分布</div>
                    <div class="pie-charts-box" v-loading="distributeLoading">
                        <div id="promoterCharts" style="height: 100%"></div>
                    </div>
                </div>
                <div class="distr reward">
                    <div class="title">奖励推广员分布</div>
                    <div class="pie-charts-box" v-loading="distributeLoading">
                        <div id="rewardCharts" style="height: 100%"></div>
                    </div>
                </div>
                <div class="distr">
                    <div class="title">推荐活动奖励分布</div>
                    <div class="pie-charts-box" v-loading="distributeLoading">
                        <div id="activeCharts" style="height: 100%"></div>
                    </div>
                </div>
            </div>
            <div class="reward-active" v-if="powerList.activeReward">
                <div class="title">推荐活动奖励人员情况</div>
                <div class="charts-box" v-loading="activeRewardLoading">
                    <div id="activeLineCharts" style="height: 500px"></div>
                </div>
            </div>
            <div class="ranking" v-if="(powerList.rewardAmtRank && !isStor) || powerList.promoterRank">
                <div class="title">奖励金额排名</div>
                <div class="rank-warp">
                    <div class="box" v-if="powerList.rewardAmtRank">
                        <div class="bg">
                            <img :src="rankBg" alt="">
                            <span>机构维度Top50</span>
                        </div>
                        <el-table :data="orgTableData" border header-row-class-name="heardClass" size="small" height="442px" v-loading="orgRankingLoading">
                            <div slot="empty" style="line-height: 20px">
                                <img :src="noData" alt="" />
                                <div>暂无排名</div>
                            </div>
                            <el-table-column type="index" label="排名" min-width="100" width="100"/>
                            <el-table-column prop="orgName" label="机构" />
                            <el-table-column prop="rewardAmt" label="奖励金额(元)">
                                <template slot-scope="scope">
                                    {{ scope.row.rewardAmt | regFenToYuan }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="interval" v-if="powerList.promoterRank && powerList.rewardAmtRank"></div>
                    <div class="box" v-if="powerList.promoterRank">
                        <div class="bg">
                            <img :src="rankBg" alt="">
                            <span>推广员维度Top50</span>
                        </div>
                        <el-table :data="promoterTableData" border header-row-class-name="heardClass" size="small" height="442px" v-loading="promoterLoading">
                            <div slot="empty" style="line-height: 20px">
                                <img :src="noData" alt="" />
                                <div>暂无排名</div>
                            </div>
                            <el-table-column type="index" label="排名" min-width="100" width="100" />
                            <el-table-column prop="promoterName" label="推广员姓名" />
                            <el-table-column prop="orgName" label="上级机构" />
                            <el-table-column prop="rewardAmt" label="奖励金额(元)">
                                <template slot-scope="scope">
                                    {{ scope.row.rewardAmt | regFenToYuan }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <Trend v-if="powerList.promoterTrend" />
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { mixins } from './mixins';
import organization from '@/components/orgSelect/organization-options.vue';
import Trend from './trend.vue';

import { pieOption, lineOption } from './options';
import rankBg from '@/assets/images/img_top_title@2x.png'
import noData from '@/assets/images/img_no_data.png'

export default {
    name: 'promoterAnalysis',
    mixins: [mixins],
    components: { organization, Trend },
    data() {
        return {
            orgType: '',
            agencyNumber: '',
            op: {
                distribute: 'overview', // 分布op
                activeReward: 'activeReward',
                promoterRanking: 'promoterRank',
                orgRanking: 'rewardAmtRank'
            },
            promoterCharts: null,
            promoterData: [],
            rewardCharts: null,
            rewardData: [],
            activeCharts: null,
            activeData: [],
            distributeLoading: false,
            activeLineCharts: null,
            activeLineOption: {
                xdata: [],
                barone: [],
                bartwo: [],
            },
            activeRewardLoading: false,

            // 排名
            orgTableData: [],
            orgRankingLoading: false,
            promoterTableData: [],
            promoterLoading: false,

            // 图片
            rankBg: rankBg,
            noData: noData,

            // 查询实体店
            isStor: false
        };
    },
    computed: {},
    mounted() {
        this.roleType = (this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType) || 0;
        this.$nextTick(() => {
            const promoterDom = document.getElementById('promoterCharts');
            if (promoterDom) {
                this.promoterCharts = echarts.init(promoterDom);
                this.setPromoterOption();
            }

            const rewardDom = document.getElementById('rewardCharts');
            if (rewardDom) {
                this.rewardCharts = echarts.init(rewardDom);
                this.setRewardOption();
            }

            const activeDom = document.getElementById('activeCharts');
            if (activeDom) {
                this.activeCharts = echarts.init(activeDom);
                this.setActiveOption();
            }

            const activeLineDom = document.getElementById('activeLineCharts');
            if (activeLineDom) {
                this.activeLineCharts = echarts.init(activeLineDom);
                this.setActiveLineOption();
            }
            this.handelData();
        });
    },
    methods: {
        // 查询按钮
        handelData() {
            this.orgType = this.agencyNumber ? this.orgType : '';
            if (this.orgType - 0 === 40) {
                this.isStor = true
            } else {
                this.isStor = false
            }
            this.getPieData();
            this.getActiveReward();
            if (this.powerList.rewardAmtRank) {
                this.getOrgRanking()
            }
            if (this.powerList.promoterRank) {
                this.getRanking()
            }
        },
        // 总览饼图数据
        getPieData() {
            this.distributeLoading = true;
            const params = {
                data: {
                    orgType: this.agencyNumber ? this.orgType : '',
                    agencyNumber: this.agencyNumber,
                },
                op: this.op.distribute,
            };
            let URL = this.$getModuleUrl(this.moduleName, params.op);
            this.$axios(URL, params)
                .then(res => {
                    this.distributeLoading = false;
                    let data = JSON.parse(res.data);
                    // console.log(data)
                    const { promoter, reward, active } = data;
                    this.promoterData = [
                        { name: '平台推广员量', value: promoter.platformCnt },
                        { name: '车主推广员量', value: promoter.ownersCnt },
                    ];
                    this.setPromoterOption();
                    this.rewardData = [
                        { name: '奖励平台推广员金额', value: reward.rewardPlatformAmt },
                        { name: '奖励车主推广员金额', value: reward.rewardOwnersAmt },
                    ];
                    this.setRewardOption();
                    this.activeData = active.map(item => {
                        return { name: item.rewardName, value: item.rewardAmt };
                    });
                    this.setActiveOption();
                })
                .catch(err => {
                    this.promoterData = [];
                    this.rewardData = [];
                    this.activeData = [];
                    this.distributeLoading = false;
                });
        },
        setPromoterOption() {
            let option = this.$baseMethod.deepClone(pieOption);
            let sum = 0;
            option.series[0].data = this.promoterData.map(item => {
                sum += item.value;
                return item;
            });
            option.title.text = '累计推广员量';
            sum = this.numFormat(sum)
            option.title.subtext = sum + '{a| 名}';
            this.promoterCharts && this.promoterCharts.setOption(option);
        },
        setRewardOption() {
            let option = this.$baseMethod.deepClone(pieOption);
            let sum = 0;
            option.series[0].data = this.rewardData.map(item => {
                sum += item.value;
                return { name: item.name, value: this.$baseMethod.regFenToYuan(item.value)};
            });
            let unit = '{a| 元}'
            sum = this.$baseMethod.regFenToYuan(sum) - 0
            if (sum > 10000) {
                sum = (sum/10000).toFixed(2)
                unit = '{a| 万元}'
            }
            sum = this.numFormat(sum)
            option.title.text = '累计奖励金额';
            option.title.subtext = sum + unit;
            this.rewardCharts && this.rewardCharts.setOption(option);
        },
        setActiveOption() {
            let option = this.$baseMethod.deepClone(pieOption);
            let sum = 0;
            option.series[0].data = this.activeData.map(item => {
                sum += item.value;
                return { name: item.name, value: this.$baseMethod.regFenToYuan(item.value)};
            });
            let unit = '{a| 元}'
            sum = this.$baseMethod.regFenToYuan(sum) - 0
            if (sum > 10000) {
                sum = (sum/10000).toFixed(2)
                unit = '{a| 万元}'
            }
            sum = this.numFormat(sum)
            option.title.text = '累计奖励金额';
            option.title.subtext = sum + unit;
            this.activeCharts && this.activeCharts.setOption(option);
        },
        // 数字转千分位
        numFormat(num) {
            const n = Number(num)
            if (typeof n === 'number') {
                return n.toLocaleString()
            }
            return num
        },

        // 活动奖励情况
        getActiveReward() {
            this.activeRewardLoading = true;
            const params = {
                data: {
                    orgType: this.agencyNumber ? this.orgType : '',
                    agencyNumber: this.agencyNumber,
                },
                op: this.op.activeReward,
            };
            let URL = this.$getModuleUrl(this.moduleName, params.op);
            this.$axios(URL, params)
                .then(res => {
                    this.activeRewardLoading = false;
                    let data = JSON.parse(res.data);
                    // console.log(data)
                    let xdata = [],
                        barone = [],
                        bartwo = [];

                    data.forEach(el => {
                        xdata.push(el.rewardName);
                        barone.push(el.rewardPlatformCnt);
                        bartwo.push(el.rewardOwnersCnt);
                    });
                    this.activeLineOption = {
                        xdata,
                        barone,
                        bartwo,
                    };
                    this.setActiveLineOption();
                })
                .catch(err => {
                    this.activeLineOption = {
                        xdata: [],
                        barone: [],
                        bartwo: [],
                    };
                    this.activeRewardLoading = false;
                });
        },
        setActiveLineOption() {
            let option = this.$baseMethod.deepClone(lineOption);
            const { xdata, barone, bartwo } = this.activeLineOption;
            option.legend.data[0].name = '奖励平台推广员量';
            option.legend.data[1].name = '奖励车主推广员量';
            option.series[0].name = '奖励平台推广员量';
            option.series[1].name = '奖励车主推广员量';
            option.xAxis[0].data = xdata;
            option.series[0].data = barone;
            option.series[1].data = bartwo;
            this.activeLineCharts && this.activeLineCharts.setOption(option);
        },
        // 排名数据
        getOrgRanking() {
            this.orgRankingLoading = true;
            const params = {
                data: {
                    orgType: this.agencyNumber ? this.orgType : '',
                    agencyNumber: this.agencyNumber,
                },
                op: this.op.orgRanking,
            };
            let URL = this.$getModuleUrl(this.moduleName, params.op);
            this.$axios(URL, params)
                .then(res => {
                    this.orgRankingLoading = false;
                    let data = JSON.parse(res.data);
                    // console.log(data)
                    this.orgTableData = data
                })
                .catch(err => {
                    this.orgTableData = []
                    this.orgRankingLoading = false;
                });
        },
        getRanking() {
            this.promoterLoading = true;
            const params = {
                data: {
                    orgType: this.agencyNumber ? this.orgType : '',
                    agencyNumber: this.agencyNumber,
                },
                op: this.op.promoterRanking,
            };
            let URL = this.$getModuleUrl(this.moduleName, params.op);
            this.$axios(URL, params)
                .then(res => {
                    this.promoterLoading = false;
                    let data = JSON.parse(res.data);
                    // console.log(data)
                    this.promoterTableData = data
                })
                .catch(err => {
                    this.promoterTableData = []
                    this.promoterLoading = false;
                });
        },
        resize() {
            this.promoterCharts && this.promoterCharts.resize();
            this.rewardCharts && this.rewardCharts.resize();
            this.activeCharts && this.activeCharts.resize();
            this.activeLineCharts && this.activeLineCharts.resize();
        },
    },
};
</script>

<style lang="scss" scoped>
.promoter-analysis {
    .prom-box {
        padding: 24px 30px;
        border-radius: 8px;
        background: #fff;
        margin-bottom: 16px;
    }
    .query-btn {
        margin-bottom: 18px;
    }
    /deep/.searchBox {
        display: flex;
        justify-content: space-between;
        background: #f5f7fa;
        border-radius: 8px;
        border: 1px solid #ebeef5;
        padding: 20px 16px 0;
    }
    .title {
        margin: 25px 0 16px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
    }
    .distribute {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .distr {
            flex: 1;
            &.reward {
                margin: 0 16px;
            }
            .pie-charts-box {
                width: 100%;
                height: 391px;
                // overflow: hidden;
                background: #ffffff;
                border-radius: 8px;
                border: 1px solid #dcdfe6;
            }
        }
    }
    .ranking {
        .rank-warp {
            display: flex;
            justify-content: space-between;
            .interval {
                min-width: 20px;
                width: 20px;
            }
            .box {
                flex: 1;
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                position: relative;
                overflow: hidden;
                /deep/.heardClass {
                    th {
                        background: #F5F7FA;
                        font-weight: 600;
                        color: #303133;
                        line-height: 20px;
                    }
                }
                .bg {
                    height: 40px;
                    line-height: 40px;
                    font-weight: 600;
                    color: #303133;
                    img {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 330px;
                        height: 40px;
                        z-index: 0;

                    }
                    span {
                        position: absolute;
                        top: 0;
                        left: 37px;
                        height: 40px;
                        z-index: 1;
                    }
                }
            }
        }
    }
}
</style>
