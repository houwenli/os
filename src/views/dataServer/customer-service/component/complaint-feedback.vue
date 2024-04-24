<template>
<div class="recharge-box" @click="rechargeClick($event)">
    <div class="search-box">
        <searchComponent :timeGroupItem="timeGroupItem" @handleClickRefresh="query" @handleCityChange="$emit('handleCityChange', $event)" @exportFile="exportExcel" :showRefreshData="true" :showBtn="true" ref="iSearch" />
    </div>
    <div class="data-box" v-if="powerList.getFeedbackTotal">
        <p class="data-title">客诉处理汇总</p>
        <div class="total-box">
            <div class="total-left">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <div class="total-item">
                            <p class="total-item-label top-item">
								截至{{$baseMethod.formatData(searchOptions.endDate, 'MM-dd')}}客诉总数量
								<el-tooltip class="item" effect="dark" content="历史截至时间筛选的「结束时间」" placement="top-start">
									<span class="el-icon-question"></span>
								</el-tooltip>
							</p>
                            <p class="total-item-value top-item">
                                <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.currentFeedbackCnt || 0)"></count-to>
                            </p>
                        </div>
                        <div class="total-item">
                            <p class="total-item-label"><i></i>已处理数量</p>
                            <p class="total-item-value">
                                <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.currentProcessedCnt ||0)"></count-to>
                            </p>
                        </div>
                        <div class="total-item">
                            <p class="total-item-label"><i style="background:#0BDBA8"></i>处理中数量</p>
                            <p class="total-item-value">
                                <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.currentProcessingCnt ||0)"></count-to>
                            </p>
                        </div>
                        <div class="total-item">
                            <p class="total-item-label"><i style="background:#F3D01D"></i>待处理数量</p>
                            <p class="total-item-value">
                                <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.currentWaitProcessCnt ||0)"></count-to>
                            </p>
                        </div>
                        <div class="total-item">
                            <p class="total-item-label"><i style="background:#FF9B00"></i>已撤销数量</p>
                            <p class="total-item-value">
                                <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.currentWaitCancelCnt ||0)"></count-to>
                            </p>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <charts ref="resultPieRef" :setChartsOptions="resultPieOpt" style="height: 348px"></charts>
                    </el-col>
                </el-row>
            </div>
            <div class="total-right">
                <el-row :gutter="20" type="flex">
                    <el-col :span="8">
                        <div class="item-box">
                            <p class="item-title">
								客诉数量(个)
								<el-tooltip class="item" effect="dark" content="统计周期内客诉的订单数量" placement="top-start">
									<i class="el-icon-question"></i>
								</el-tooltip>
							</p>
                            <p class="item-num">
                                <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.feedbackCnt ||0)"></count-to>
                            </p>
                            <div class="item-desc">
                                <span>{{$baseMethod.formatData(searchOptions.startDate, 'MM-dd')}} 至 {{$baseMethod.formatData(searchOptions.endDate, 'MM-dd')}} 环比</span>
                                <span v-if="feedbackResData.feedbackRingRatio" :class="{'num-up': feedbackResData.feedbackRingRatio > 0, 'num-down': feedbackResData.feedbackRingRatio < 0}">
                                    <i class="arrow" v-if="feedbackResData.feedbackRingRatio" :class="{'num-down': feedbackResData.feedbackRingRatio < 0}"></i>
									<count-to :startVal="0" :decimals="2" :duration='2000' :endVal="Number(feedbackResData.feedbackRingRatio / 100 ||0)"></count-to>%
                                </span>
								<span v-else>暂无数据</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="item-box">
                            <p class="item-title">
								已处理数量(个)
								<el-tooltip class="item" effect="dark" content="统计周期内客诉的已处理数量" placement="top-start">
									<i class="el-icon-question"></i>
								</el-tooltip>
							</p>
                            <p class="item-num">
                                <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.processedCnt ||0)"></count-to>
                            </p>
                            <div class="item-desc">
                                <span>{{$baseMethod.formatData(searchOptions.startDate, 'MM-dd')}} 至 {{$baseMethod.formatData(searchOptions.endDate, 'MM-dd')}} 环比</span>
                                <i class="arrow" v-if="feedbackResData.processedRingRatio" :class="{'num-down': feedbackResData.processedRingRatio < 0}"></i>
                                <span v-if="feedbackResData.processedRingRatio != null" :class="{'num-up': feedbackResData.processedRingRatio > 0, 'num-down': feedbackResData.processedRingRatio < 0}">
                                    <count-to :startVal="0" :decimals="2" :duration='2000' :endVal="Number(feedbackResData.processedRingRatio / 100 ||0)"></count-to>%
                                </span>
                                <span v-else>暂无数据</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="item-box">
                            <p class="item-title">
								处理中数量(个)
								<el-tooltip class="item" effect="dark" content="统计周期内客诉的处理中数量" placement="top-start">
									<i class="el-icon-question"></i>
								</el-tooltip>
							</p>
                            <p class="item-num">
                                <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.processingCnt ||0)"></count-to>
                            </p>
                            <div class="item-desc">
                                <span>{{$baseMethod.formatData(searchOptions.startDate, 'MM-dd')}} 至 {{$baseMethod.formatData(searchOptions.endDate, 'MM-dd')}} 环比</span>
                                <i class="arrow" v-if="feedbackResData.processingRingRatio" :class="{'num-down': feedbackResData.processingRingRatio < 0}"></i>
                                <span v-if="feedbackResData.processingRingRatio != null" :class="{'num-up': feedbackResData.processingRingRatio > 0, 'num-down': feedbackResData.processingRingRatio < 0}">
                                    <count-to :startVal="0" :decimals="2" :duration='2000' :endVal="Number(feedbackResData.processingRingRatio / 100 ||0)"></count-to>%
                                </span>
                                <span v-else>暂无数据</span>
                            </div>
                        </div>
                    </el-col>
				</el-row>
				<el-row :gutter="20" type="flex">
                    <el-col :span="8">
                        <div class="item-box" style="margin-bottom: 0">
                            <p class="item-title">
								待处理数量(个)
								<el-tooltip class="item" effect="dark" content="统计周期内客诉的待处理数量" placement="top-start">
									<i class="el-icon-question"></i>
								</el-tooltip>
							</p>
                            <p class="item-num">
                                <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.waitProcessCnt ||0)"></count-to>
                            </p>
                            <div class="item-desc">
                                <span>{{$baseMethod.formatData(searchOptions.startDate, 'MM-dd')}} 至 {{$baseMethod.formatData(searchOptions.endDate, 'MM-dd')}} 环比</span>
                                <i class="arrow" v-if="feedbackResData.waitProcessRingRatio" :class="{'num-down': feedbackResData.waitProcessRingRatio < 0}"></i>
                                <span v-if="feedbackResData.waitProcessRingRatio != null" :class="{'num-up': feedbackResData.waitProcessRingRatio > 0, 'num-down': feedbackResData.waitProcessRingRatio < 0}">
                                    <count-to :startVal="0" :decimals="2" :duration='2000' :endVal="Number(feedbackResData.waitProcessRingRatio / 100 ||0)"></count-to>%
                                </span>
                                <span v-else>暂无数据</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="item-box" style="margin-bottom: 0">
                            <p class="item-title">
								已撤销数量(个)
								<el-tooltip class="item" effect="dark" content="统计周期内客诉的已撤销数量" placement="top-start">
									<i class="el-icon-question"></i>
								</el-tooltip>
							</p>
                            <p class="item-num">
                                <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.revokedCnt ||0)"></count-to>
                            </p>
                            <div class="item-desc">
                                <span>{{$baseMethod.formatData(searchOptions.startDate, 'MM-dd')}} 至 {{$baseMethod.formatData(searchOptions.endDate, 'MM-dd')}} 环比</span>
                                <i class="arrow" v-if="feedbackResData.revokedRingRatio" :class="{'num-down': feedbackResData.revokedRingRatio < 0}"></i>
                                <span v-if="feedbackResData.revokedRingRatio != null" :class="{'num-up': feedbackResData.revokedRingRatio > 0, 'num-down': feedbackResData.revokedRingRatio < 0}">
                                    <count-to :startVal="0" :decimals="2" :duration='2000' :endVal="Number(feedbackResData.revokedRingRatio / 100 ||0)"></count-to>%
                                </span>
                                <span v-else>暂无数据</span>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
    <div class="data-box daily-trend">
        <p class="data-title">每日客诉趋势图</p>
        <el-row :gutter="20" style="margin-bottom: 24px">
            <el-col :span="6">
                <div class="item-box">
                    <p class="item-title">
                        客诉数量(个)
                        <el-tooltip class="item" effect="dark" content="用户提交反馈的数量" placement="top-start">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <p class="item-num">
                        <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.feedbackCnt ||0)"></count-to>
                    </p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="item-box">
                    <p class="item-title">
                        客诉订单数(个)
                        <el-tooltip class="item" effect="dark" content="用户提交反馈对应的订单数" placement="top-start">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <p class="item-num">
                        <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.orderCnt ||0)"></count-to>
                    </p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="item-box">
                    <p class="item-title">
                        客诉用户数(个)
                        <el-tooltip class="item" effect="dark" content="用户提交反馈对应的用户数（去重）" placement="top-start">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <p class="item-num">
                        <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.userCnt ||0)"></count-to>
                    </p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="item-box">
                    <p class="item-title">
                        人均客诉数量(个)
                        <el-tooltip class="item" effect="dark" content="人均客诉数量=客诉数量/客诉用户数" placement="top-start">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <p class="item-num">
                        <count-to :startVal="0" :duration='2000' :endVal="Number(feedbackResData.perCapitaCnt ||0)"></count-to>
                    </p>
                </div>
            </el-col>
        </el-row>
        <charts v-if="powerList.getFeedbackTrend" ref="dailyTrendChartRef" :setChartsOptions="dailyTrendBarOpt"></charts>
    </div>
    <div class="data-box daily-trend" v-if="powerList.getProcessResultDetail">
        <div class="result-head">
            <p class="data-title">客诉处理结果情况</p>
            <el-radio-group v-model="searchOptions.radio1" @change="changeResolveRadio">
                <el-radio-button label="已处理客诉">已处理客诉</el-radio-button>
                <el-radio-button label="工单类客诉">工单类客诉</el-radio-button>
            </el-radio-group>
        </div>
        <div class="five-box" v-if="searchOptions.radio1 == '已处理客诉'">
            <div class="item-box">
                <p class="item-title">
                    已处理数量(个)
                    <el-tooltip class="item" effect="dark" content="已处理的用户客诉数量" placement="top-start">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </p>
                <p class="item-num">
                    <count-to :startVal="0" :duration='2000' :endVal="Number(processResData.solveCnt ||0)"></count-to>
                </p>
            </div>
            <div class="item-box">
                <p class="item-title">
                    非工单类数量(个)
                    <el-tooltip class="item" effect="dark" content="已处理的「非工单类」用户客诉数量，类型由客服处理时进行分类" placement="top-start">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </p>
                <p class="item-num">
                    <count-to :startVal="0" :duration='2000' :endVal="Number(processResData.nonOrderCnt ||0)"></count-to>
                </p>
            </div>
            <div class="item-box">
                <p class="item-title">
                    工单类数量(个)
                    <el-tooltip class="item" effect="dark" content="已处理的「工单类」用户客诉数量，类型由客服处理时进行分类" placement="top-start">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </p>
                <p class="item-num">
                    <count-to :startVal="0" :duration='2000' :endVal="Number(processResData.workOrderCnt ||0)"></count-to>
                </p>
            </div>
            <div class="item-box">
                <p class="item-title">
                    无效客诉数量(个)
                    <el-tooltip class="item" effect="dark" content="已处理的「无效客诉」用户客诉数量，类型由客服处理时进行分类" placement="top-start">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </p>
                <p class="item-num">
                    <count-to :startVal="0" :duration='2000' :endVal="Number(processResData.invalidCnt ||0)"></count-to>
                </p>
            </div>
            <div class="item-box">
                <p class="item-title">
                    平均处理时长(小时)
                    <el-tooltip class="item" effect="dark" content="平均处理时间=客诉处理时间-用户反馈时间" placement="top-start">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </p>
                <p class="item-num">
                    <count-to :startVal="0" :duration='2000' :decimals="2" :endVal="Number(processResData.processAvgTime / 60 / 60 || 0)"></count-to>
                </p>
            </div>
        </div>
        <el-row :gutter="20" style="margin: 22px 0" v-if="searchOptions.radio1 == '工单类客诉'">
            <el-col :span="6">
                <div class="item-box">
                    <p class="item-title">
                        工单类数量(个)
                        <el-tooltip class="item" effect="dark" content="已处理的「工单类」用户客诉数量" placement="top-start">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <p class="item-num">
                        <count-to :startVal="0" :duration='2000' :endVal="Number(processResData.workOrderCnt ||0)"></count-to>
                    </p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="item-box">
                    <p class="item-title">
                        创建工单数量(个)
                        <el-tooltip class="item" effect="dark" content="已处理「工单类」客诉中的处理次数" placement="top-start">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <p class="item-num">
                        <count-to :startVal="0" :duration='2000' :endVal="Number(processResData.createWOCnt ||0)"></count-to>
                    </p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="item-box">
                    <p class="item-title">
                        申诉成功数量(个)
                        <el-tooltip class="item" effect="dark" content="已处理「工单类」客诉中的处理结果为「申诉成功」的数量" placement="top-start">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <p class="item-num">
                        <count-to :startVal="0" :duration='2000' :endVal="Number(processResData.successWOCnt ||0)"></count-to>
                    </p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="item-box">
                    <p class="item-title">
                        无效客诉数量(个)
                        <el-tooltip class="item" effect="dark" content="已处理「工单类」客诉中的处理结果为「无效客诉」的数量" placement="top-start">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <p class="item-num">
                        <count-to :startVal="0" :duration='2000' :endVal="Number(processResData.invalidWOCnt ||0)"></count-to>
                    </p>
                </div>
            </el-col>
        </el-row>
        <charts v-show="searchOptions.radio1 == '已处理客诉'" ref="complaintChartRef" :setChartsOptions="complaintBarOpt"></charts>
        <charts style="width: 100%" v-if="searchOptions.radio1 == '工单类客诉'" ref="workOrderChartRef" :setChartsOptions="workOrderBarOpt"></charts>
    </div>
    <div class="data-box" v-if="powerList.getCityFbDetail">
        <div class="result-head">
            <p class="data-title">Top20 城市客诉反馈情况</p>
            <el-select style="width: 270px" v-model="searchOptions.feedbackSortColEnum" @change="changeTop20" placeholder="请选择">
                <el-option v-for="item in [
						{label: '按投诉数降序', value: 'FB_COUNT_DESC'},
						{label: '按投诉订单数降序', value: 'FB_ORDER_COUNT_DESC'},
						{label: '按投诉用户数降序', value: 'FB_USER_COUNT_DESC'},
					]" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <charts ref="top20ChartRef" :setChartsOptions="top20Options"></charts>
    </div>
    <div class="data-box daily-trend spectial-box" v-if="powerList.getFbSolveDetail || powerList.getSubtitleDetail">
        <div class="result-head">
            <p class="data-title">各类客诉解决情况</p>
        </div>
        <div class="all-kinds-box">
            <div class="kinds-item">
                <div class="item-box">
                    <p class="item-title">客诉反馈数量(个)</p>
                    <p class="item-num">
                        <count-to :startVal="0" :duration='2000' :endVal="Number(allKindsData.feedbackCnt ||0)"></count-to>
                    </p>
                </div>
            </div>
            <div class="kinds-item">
                <div class="item-box">
                    <p class="item-title">已解决数量(个)</p>
                    <p class="item-num">
                        <count-to :startVal="0" :duration='2000' :endVal="Number(allKindsData.solveCnt ||0)"></count-to>
                    </p>
                </div>
            </div>
            <div class="kinds-item">
                <div class="item-box">
                    <p class="item-title">已解决数量占比(%)</p>
                    <p class="item-num">
                        <span v-if="allKindsData.solveRatio != null">
                            <count-to :startVal="0" :duration='2000' :decimals="2" :endVal="Number(allKindsData.solveRatio / 100 ||0)"></count-to> %
                        </span>
                        <span v-else>暂无数据</span>
                    </p>
                </div>
            </div>
            <div class="kinds-item">
                <div class="item-box">
                    <p class="item-title">未解决数量(个)</p>
                    <p class="item-num">
                        <count-to :startVal="0" :duration='2000' :endVal="Number(allKindsData.unSolveCnt ||0)"></count-to>
                    </p>
                </div>
            </div>
            <div class="kinds-item">
                <div class="item-box">
                    <p class="item-title">未解决数量占比(%)</p>
                    <p class="item-num">
                        <span v-if="allKindsData.unSolveRatio != null">
                            <count-to :startVal="0" :duration='2000' :decimals="2" :endVal="Number(allKindsData.unSolveRatio / 100 ||0)"></count-to>%
                        </span>
                        <span v-else>暂无数据</span>
                    </p>
                </div>
            </div>
        </div>
        <div style="position: relative">
            <div class="clearfix">
                <el-select style="float:right" @change="allKindsChange($event)" v-model="searchOptions.questionSortColEnum" placeholder="请选择">
                    <el-option v-for="item in [
							{label: '客诉反馈总量降序', value: 'QUESTION_COUNT_DESC'},
							{label: '已解决次数降序', value: 'SOLVE_COUNT_DESC'},
							{label: '未解决次数降序', value: 'UNSOLVE_COUNT_DESC'},
						]" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <charts ref="allKindsChartRef" v-if="powerList.getFbSolveDetail" :setChartsOptions="allKindsBarOptions"></charts>
            <div class="result-head" style="margin-top: 25px">
                <p class="data-title">子分类名称：{{chooseParentName}}</p>
            </div>
            <charts ref="kindsRightChartRef" v-if="powerList.getSubtitleDetail" :setChartsOptions="kindsRightBarOptions"></charts>
        </div>
    </div>
    <div class="data-box" v-if="powerList.getFbTableDetail">
        <div class="result-head">
            <p class="data-title">客诉问题汇总表</p>
        </div>
        <ws-table-el ref="table" v-bind="tableConfig" style="width:100%;padding: 0 !important;min-height: 350px">
            <template #search>
				<div>
					<label class="seach-label" for>选择类别：</label>
					<el-select style="width: 270px" v-model="searchOptions.tableParentCode" placeholder="请选择">
						<el-option v-for="item in feedbackTypeList" :key="item.id + item.name" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</div>
				<el-button-group>
                    <ws-enter-event>
                        <el-button type="primary" icon="el-icon-search" v-if="powerList.getFbTableDetail" @click="$refs.table.search()">查询</el-button>
                    </ws-enter-event>
                </el-button-group>
            </template>
            <template #searchBtns>
            </template>
            <template>
                <ws-table-column-el prop="parentName" label="客诉类型"></ws-table-column-el>
                <ws-table-column-el prop="subName" label="子分类名称"></ws-table-column-el>
                <ws-table-column-el prop="feedbackCnt" label="客诉总数量">
                    <div class="slot-head" slot="header">
                        <p>问题反馈数量</p>
                        <div @click="changeSort('FB_COUNT')">
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'FB_COUNT_ASC'}" class="el-icon-caret-top"></i>
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'FB_COUNT_DESC'}" type="text" class="el-icon-caret-bottom"></i>
                        </div>
                    </div>
                </ws-table-column-el>
                <ws-table-column-el prop="orderCnt" label="客诉订单数">
                    <div class="slot-head" slot="header">
                        <p>客诉订单数</p>
                        <div @click="changeSort('FB_ORDER_COUNT')">
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'FB_ORDER_COUNT_ASC'}" class="el-icon-caret-top"></i>
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'FB_ORDER_COUNT_DESC'}" class="el-icon-caret-bottom"></i>
                        </div>
                    </div>
                </ws-table-column-el>
                <ws-table-column-el prop="userCnt" label="客诉用户数">
                    <div class="slot-head" slot="header">
                        <p>客诉用户数</p>
                        <div @click="changeSort('FB_USER_COUNT')">
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'FB_USER_COUNT_ASC'}" @click="sortTableList('FB_USER_COUNT_ASC')" class="el-icon-caret-top"></i>
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'FB_USER_COUNT_DESC'}" type="text" @click="sortTableList('FB_USER_COUNT_DESC')" class="el-icon-caret-bottom"></i>
                        </div>
                    </div>
                </ws-table-column-el>
                <ws-table-column-el prop="solveCnt" label="已处理数量">
                    <div class="slot-head" slot="header">
                        <p>已处理数量</p>
                        <div @click="changeSort('PROCESSED_COUNT')">
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'PROCESSED_COUNT_ASC'}" @click="sortTableList('PROCESSED_COUNT_ASC')" class="el-icon-caret-top"></i>
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'PROCESSED_COUNT_DESC'}" type="text" @click="sortTableList('PROCESSED_COUNT_DESC')" class="el-icon-caret-bottom"></i>
                        </div>
                    </div>
                </ws-table-column-el>
                <ws-table-column-el prop="nonOrderCnt" label="非工单类数量">
                    <div class="slot-head" slot="header">
                        <p>非工单类数量</p>
                        <div @click="changeSort('NON_WO_COUNT')">
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'NON_WO_COUNT_ASC'}" @click="sortTableList('NON_WO_COUNT_ASC')" class="el-icon-caret-top"></i>
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'NON_WO_COUNT_DESC'}" type="text" @click="sortTableList('NON_WO_COUNT_DESC')" class="el-icon-caret-bottom"></i>
                        </div>
                    </div>
                </ws-table-column-el>
                <ws-table-column-el prop="workOrderCnt" label="工单类数量">
                    <div class="slot-head" slot="header">
                        <p>工单类数量</p>
                        <div @click="changeSort('WO_COUNT')">
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'WO_COUNT_ASC'}" @click="sortTableList('WO_COUNT_ASC')" class="el-icon-caret-top"></i>
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'WO_COUNT_DESC'}" type="text" @click="sortTableList('WO_COUNT_DESC')" class="el-icon-caret-bottom"></i>
                        </div>
                    </div>
                </ws-table-column-el>
                <ws-table-column-el prop="invalidCnt" label="无效客诉数量">
                    <div class="slot-head" slot="header">
                        <p>无效客诉数量</p>
                        <div @click="changeSort('INVALID_COUNT')">
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'INVALID_COUNT_ASC'}" @click="sortTableList('INVALID_COUNT_ASC')" class="el-icon-caret-top"></i>
                            <i :class="{'actived': searchOptions.feedbackSortColEnum == 'INVALID_COUNT_DESC'}" type="text" @click="sortTableList('INVALID_COUNT_DESC')" class="el-icon-caret-bottom"></i>
                        </div>
                    </div>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</div>
</template>

<script>
import {
    timeButtonGroupList
} from './search-options.js'
import searchComponent from './search.vue'
import countTo from 'vue-count-to'
import {
    pie_options,
    bar_options,
    bar_double_y_options,
    line_options
} from './data-options.js'
import charts from './charts'
export default {
    components: {
        searchComponent,
        countTo,
        charts,
    },
    name: 'complaintFeedback',
    data() {
        return {
            moduleName: "/dataServer/customerService",
            timeGroupItem: timeButtonGroupList,
            searchOptions: {
                cityList: [0],
                endDate: this.$baseMethod.getBeforeDay(-1, 'yyyy-MM-dd'),
                startDate: this.$baseMethod.getBeforeDay(-7, 'yyyy-MM-dd'),
                timeGap: '1',
                radio1: '已处理客诉',
                feedbackSortColEnum: 'FB_COUNT_DESC',
                questionSortColEnum: 'QUESTION_COUNT_DESC',
                tableParentCode: -10086,
            },
            op: {
                getFeedbackTotal: 'getFeedbackTotal',
                getFeedbackTrend: 'getFeedbackTrend',
                getProcessResultDetail: 'getProcessResultDetail',
                getCityFbDetail: 'getCityFbDetail',
                getFbSolveDetail: 'getFbSolveDetail',
                getFeedbackTypeDetail: 'getFeedbackTypeDetail',
                getSubtitleDetail: 'getSubtitleDetail',
                exportDetail: 'exportDetail',
            },
            resultPieOpt: {},
            dailyTrendBarOpt: {},
            workOrderBarOpt: {},
            complaintBarOpt: {},
            top20Options: {},
            allKindsBarOptions: {},
            kindsRightBarOptions: {},
            tableConfig: {
                loading: true,
                filterColumns: false,
                lazyQuery: {
                    moduleName: "/dataServer/customerService",
                    immediate: false,
                    op: {
                        selectList: "getFbTableDetail",
                        selectCount: ""
                    },
                    beforeQuery: this.beforeQuery
                },
				autoHeight: false,
            },
            feedbackResData: {},
            processResData: {},
            allKindsData: {},
            feedbackTypeList: [],
            chooseParentId: -1,
            chooseParentName: '全部客诉',
        }
    },
    created() {
        this.resultPieOpt = _.cloneDeep(pie_options);
        this.dailyTrendBarOpt = _.cloneDeep(bar_double_y_options);
        this.workOrderBarOpt = _.cloneDeep(bar_options);
        this.complaintBarOpt = _.cloneDeep(bar_double_y_options);
        this.top20Options = _.cloneDeep(line_options);
        this.allKindsBarOptions = _.cloneDeep(bar_double_y_options);
        this.kindsRightBarOptions = _.cloneDeep(bar_options);
        this.getFeedbackTypeList();
    },
    mounted() {
        this.$refs.allKindsChartRef.charts.getZr().on('click', (param) => {
            param.event.stopPropagation();
            const pointInPixel = [param.offsetX, param.offsetY]
            if (this.$refs.allKindsChartRef.charts.containPixel('grid', pointInPixel)) {
                // 获取到点击的 x轴 下标  转换为逻辑坐标
                const xIndex = this.$refs.allKindsChartRef.charts.convertFromPixel({
                    seriesIndex: 0
                }, pointInPixel)[0]
                const opt = this.$refs.allKindsChartRef.charts.getOption();
                const id = opt.series[0]['data'][xIndex]['parentId'];
                this.chooseParentId = id;
                this.chooseParentName = opt.series[0]['data'][xIndex]['parentName'];
                this.getChildData(this.chooseParentId)
            }
        })
        this.$refs.iSearch.initTime();
        this.query();
    },
    methods: {
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        beforeQuery() {
            return {
                ...this.searchOptions,
                parentCode: this.searchOptions.tableParentCode,
            }
        },
        rechargeClick(e) {
            if (e.target.className.indexOf('special-box') < 0) {}
        },
        query(params) {
            this.searchOptions = Object.assign(this.searchOptions, params);
            this.getFeedbackTotal();
            this.getFeedbackTrend();
            this.getProcessResultDetail();
            this.getTop20();
            this.getFbSolveDetail();
            this.$refs.table.search();
        },
        getFeedbackTotal() {
            const url = this.getModuleUrl(this.op.getFeedbackTotal),
                reqData = {
                    data: {
                        ...this.searchOptions
                    },
                    op: this.op.getFeedbackTotal,
                };
			if (!url) {
				return
			}
            this.$axios(url, reqData).then(res => {
                const resData = JSON.parse(res.data);
                this.feedbackResData = resData;
                this.resultPieOpt.series[0].data = [{
                        value: this.feedbackResData.currentProcessedCnt / this.feedbackResData.currentFeedbackCnt * 100 || 0,
                        name: '已处理'
                    },
                    {
                        value: this.feedbackResData.currentProcessingCnt / this.feedbackResData.currentFeedbackCnt * 100 || 0,
                        name: '处理中'
                    },
                    {
                        value: this.feedbackResData.currentWaitProcessCnt / this.feedbackResData.currentFeedbackCnt * 100 || 0,
                        name: '待处理'
                    },
                    {
                        value: this.feedbackResData.currentWaitCancelCnt / this.feedbackResData.currentFeedbackCnt * 100 || 0,
                        name: '已撤销'
                    },
                ];
                this.resultPieOpt.title.text = `截至${this.$baseMethod.formatData(this.searchOptions.endDate, 'MM-dd')}`;
                this.resultPieOpt.title.subtext = '客诉总数量';
                this.resultPieOpt.tooltip.valueFormatter = (val) => val.toFixed(2) + '%';
                this.$refs.resultPieRef.updateCharts(this.resultPieOpt);
            })
        },
        getFeedbackTrend() {
            const url = this.getModuleUrl(this.op.getFeedbackTrend),
                reqData = {
                    data: {
                        ...this.searchOptions
                    },
                    op: this.op.getFeedbackTrend,
                };
			if (!url) {
				return
			}
            this.$axios(url, reqData).then(res => {
                const resData = JSON.parse(res.data);
                this.dailyTrendBarOpt.xAxis.data = resData.map(item => item.date);
                this.dailyTrendBarOpt.xAxis.axisLabel = {
                    formatter: (val) => val.replaceAll('-', '/'),
                };
				this.dailyTrendBarOpt.legend = [
					{
						x: 'left',
						y: 0,
						icon:'rect',
						itemWidth: 10,
						itemHeight: 8,
						textStyle: {
							fontSize: 14,
							color:"#606266"
						},
						itemGap:24,
						data: ['投诉总数', '投诉订单数'],
					},
					{
						x: '210',
						y: 0,
						icon:'rect',
						itemWidth: 10,
						itemHeight: 4,
						textStyle: {
							fontSize: 14,
							color:"#606266"
						},
						itemGap:24,
						data: ['投诉用户数'],
					},
				];
                this.dailyTrendBarOpt.color = ['#254BE9', '#0BDBA8', '#F3D01D'];
                this.dailyTrendBarOpt.series[0].name = '投诉总数';
                this.dailyTrendBarOpt.series[0].data = resData.map(item => item.totalCnt);
                this.dailyTrendBarOpt.series[1].name = '投诉订单数';
                this.dailyTrendBarOpt.series[1].stack = '投诉订单数';
                this.dailyTrendBarOpt.series[1].data = resData.map(item => item.orderCnt);
                this.dailyTrendBarOpt.series[2] = {
                    name: '投诉用户数',
                    type: 'line',
                    yAxisIndex: 1,
                    data: resData.map(item => item.userCnt || 0),
                }
				this.$nextTick(() => {
					this.$refs.dailyTrendChartRef.updateCharts(this.dailyTrendBarOpt);
				});
            })
        },
        getProcessResultDetail() {
            const url = this.getModuleUrl(this.op.getProcessResultDetail),
                reqData = {
                    data: {
                        ...this.searchOptions
                    },
                    op: this.op.getProcessResultDetail,
                };
			if (!url) {
				return
			}
            this.$axios(url, reqData).then(res => {
                const resData = JSON.parse(res.data);
                this.processResData = resData;
				this.complaintBarOpt.legend = [
					{
						x: 'left',
						y: 0,
						icon:'rect',
						itemWidth: 10,
						itemHeight: 8,
						textStyle: {
							fontSize: 14,
							color:"#606266"
						},
						itemGap:24,
						data: ['非工单类数量', '工单类数量', '无效客诉数量'],
					},
					{
						x: '350',
						y: 0,
						icon:'rect',
						itemWidth: 10,
						itemHeight: 4,
						textStyle: {
							fontSize: 14,
							color:"#606266"
						},
						itemGap:24,
						data: ['平均处理时长'],
					},
				]
                this.complaintBarOpt.xAxis.data = resData.solveDailyList.map(item => item.date);
                this.complaintBarOpt.xAxis.axisLabel = {
                    formatter: (val) => val.replaceAll('-', '/'),
                };
                this.complaintBarOpt.color = ['#F3D01D', '#0BDBA8', '#254BE9', '#FF9B00'];
                this.complaintBarOpt.yAxis[1].axisLabel.formatter = (val) => val + 'h';
                this.complaintBarOpt.series[0].name = '非工单类数量';
                this.complaintBarOpt.series[0].data = resData.solveDailyList.map(item => item.nonOrderCnt || 0);
                this.complaintBarOpt.series[1].name = '工单类数量';
                this.complaintBarOpt.series[1].data = resData.solveDailyList.map(item => item.orderCnt || 0);
                this.complaintBarOpt.series[2] = {
                    barWidth: 18,
                    emphasis: {
                        focus: 'series'
                    },
                    name: '无效客诉数量',
                    stack: 'Search Engine',
                    type: 'bar',
                    data: resData.solveDailyList.map(item => item.invalidCnt || 0),
                };
                this.complaintBarOpt.series[3] = {
                    name: '平均处理时长',
                    type: 'line',
                    yAxisIndex: 1,
                    data: resData.solveDailyList.map(item => (item.processAvgTime / 60 / 60).toFixed(2) || 0),
                };
                this.$nextTick(() => {
                    this.$refs.complaintChartRef.updateCharts(this.complaintBarOpt);
                });

				this.workOrderBarOpt.legend = [
					{
						x: 'left',
						y: 0,
						icon:'rect',
						itemWidth: 10,
						itemHeight: 8,
						textStyle: {
							fontSize: 14,
							color:"#606266"
						},
						itemGap:24,
						data: ['创建工单数量', '申诉成功', '无效客诉'],
					},
				];
                this.workOrderBarOpt.color = ['#F3D01D', '#0BDBA8', '#254BE9'];
                this.workOrderBarOpt.xAxis.data = resData.workOrderDailyList.map(item => item.date);
				this.workOrderBarOpt.xAxis.axisLabel = {
					formatter: (val) => val.replaceAll('-', '/'),
				};
                this.workOrderBarOpt.series[0].name = '创建工单数量';
                this.workOrderBarOpt.series[0].data = resData.workOrderDailyList.map(item => item.createWOCnt || 0);
                this.workOrderBarOpt.series[1].name = '申诉成功';
                this.workOrderBarOpt.series[1].data = resData.workOrderDailyList.map(item => item.successWOCnt || 0);
                this.workOrderBarOpt.series[2] = {
                    name: '无效客诉',
                    type: 'bar',
                    stack: 'Search Engine',
                    data: resData.workOrderDailyList.map(item => item.invalidWOCnt || 0),
                };
                this.$nextTick(() => {
                    if (this.searchOptions.radio1 == '工单类客诉') {
                        this.$refs.workOrderChartRef.updateCharts(this.workOrderBarOpt);
                    }
                })
            })
        },

        changeResolveRadio(val) {
            if (val == '已处理客诉') {
                this.$nextTick(() => {
                    this.$refs.complaintChartRef.updateCharts(this.complaintBarOpt);
                });
            } else if (val == '工单类客诉') {
                this.$nextTick(() => {
                    this.$refs.workOrderChartRef.updateCharts(this.workOrderBarOpt);
                });
            }
        },

        getTop20() {
            const url = this.getModuleUrl(this.op.getCityFbDetail),
                reqData = {
                    data: {
                        ...this.searchOptions
                    },
                    op: this.op.getCityFbDetail
                };
			if (!url) {
				return
			}
            this.$axios(url, reqData).then(res => {
                const resData = JSON.parse(res.data);
				this.top20Options.grid.right = 20;
                this.top20Options.xAxis.data = resData.map(item => item.cityName);
				this.top20Options.xAxis.boundaryGap = true;
				this.top20Options.xAxis.axisLabel = {
					width: 120,
					overflow: 'truncate',
				};
                this.top20Options.series[0].data = resData.map(item => item.feedbackCnt || 0);
                this.top20Options.series[1].data = resData.map(item => item.orderCnt || 0);
                this.top20Options.series[2].data = resData.map(item => item.userCnt || 0);
				this.$nextTick(() => {
					this.$refs.top20ChartRef.updateCharts(this.top20Options);
				});
            });
        },

        changeTop20() {
            this.getTop20();
        },

        allKindsChange() {
            this.getFbSolveDetail();
        },

        getFbSolveDetail() {
            const url = this.getModuleUrl(this.op.getFbSolveDetail),
                reqData = {
                    data: {
                        ...this.searchOptions,
                    },
                    op: this.op.getFbSolveDetail
                };
			if (!url) {
				return
			}
            this.$axios(url, reqData).then(res => {
                const resData = JSON.parse(res.data);
                this.allKindsData = resData;
				this.allKindsBarOptions.color = ['#254BE9', '#FD571F', '#0BDBA8', '#F3D01D'];
				this.allKindsBarOptions.legend = [
					{
						x: 'left',
						y: 0,
						icon:'rect',
						itemWidth: 10,
						itemHeight: 8,
						textStyle: {
							fontSize: 14,
							color:"#606266"
						},
						itemGap:24,
						data: ['已解决数量', '未解决数量'],
					},
					{
						x: '220',
						y: 0,
						icon:'rect',
						itemWidth: 10,
						itemHeight: 4,
						textStyle: {
							fontSize: 14,
							color:"#606266"
						},
						itemGap:24,
						data: ['已解决占比', '未解决占比'],
					}
				];
                this.allKindsBarOptions.xAxis.data = resData.solveTitleList.map(item => item.parentName);
				this.allKindsBarOptions.xAxis.axisLabel = {
					rotate: -60,
					width: 120,
					overflow: 'truncate',
				};
                this.allKindsBarOptions.yAxis[1].axisLabel.formatter = (val) => val + "%";
                this.allKindsBarOptions.yAxis[1].name = '单位:%'
                this.allKindsBarOptions.yAxis[1].max = 100;
                this.allKindsBarOptions.series[0].name = '已解决数量';
                this.allKindsBarOptions.series[0].data = resData.solveTitleList.map(item => {
                    return {
                        value: item.solveCnt,
                        parentId: item.parentId,
                        parentName: item.parentName,
                    }
                });
                this.allKindsBarOptions.series[1].name = '未解决数量';
                this.allKindsBarOptions.series[1].data = resData.solveTitleList.map(item => item.unSolveCnt);
                this.allKindsBarOptions.series[2] = {
                    name: '已解决占比',
                    type: 'line',
                    yAxisIndex: 1,
                    emphasis: {
                        focus: 'series'
                    },
                    tooltip: {
                        valueFormatter: (val) => val + '%'
                    },
                    data: resData.solveTitleList.map(item => item.solveRatio / 100)
                };
                this.allKindsBarOptions.series[3] = {
                    name: '未解决占比',
                    type: 'line',
                    yAxisIndex: 1,
                    emphasis: {
                        focus: 'series'
                    },
                    tooltip: {
                        valueFormatter: (val) => val + '%'
                    },
                    data: resData.solveTitleList.map(item => item.unSolveRatio / 100)
                };
				this.$nextTick(() => {
					this.$refs.allKindsChartRef.updateCharts(this.allKindsBarOptions);
				});
                this.getChildData(-1);
            });
        },
        getFeedbackTypeList() {
            const url = this.getModuleUrl(this.op.getFeedbackTypeDetail),
                reqData = {
                    data: {},
                    op: this.op.getFeedbackTypeDetail
                };
            this.$axios(url, reqData).then(res => {
                const resData = JSON.parse(res.data);
                this.feedbackTypeList = resData;
            })
        },
        getChildData(id) {
            const url = this.getModuleUrl(this.op.getSubtitleDetail),
                reqData = {
                    data: {
                        ...this.searchOptions,
                        parentCode: id,
                    },
                    op: this.op.getSubtitleDetail
                };
			if (!url) {
				return
			}
            this.$axios(url, reqData).then(res => {
                const resData = JSON.parse(res.data);
                this.kindsRightBarOptions.series[0].data = resData.map(item => item.solveCnt);
				this.kindsRightBarOptions.series[0].stack = '已解决';
				this.kindsRightBarOptions.series[0].barWidth = 'auto';
                this.kindsRightBarOptions.xAxis.data = resData.map(item => item.questionName);
				if (resData && resData.length > 10) {
					this.kindsRightBarOptions.xAxis.axisLabel = {
						rotate: -60,
						width: 120,
						overflow: 'truncate',
					};	
				} else {
					this.kindsRightBarOptions.xAxis.axisLabel = {
						rotate: 0,
					};	
				}
                this.kindsRightBarOptions.series[1].data = resData.map(item => item.unSolveCnt);
				this.kindsRightBarOptions.series[1].stack = '未解决';
				this.kindsRightBarOptions.series[1].barWidth = 'auto';
				this.$nextTick(() => {
					this.$refs.kindsRightChartRef.updateCharts(this.kindsRightBarOptions);
				});
            })
        },
        exportExcel(params) {
            const url = this.getModuleUrl(this.op.exportDetail),
                reqData = {
                    data: {
                        cityList: params.cityList,
                        endDate: params.endDate,
                        startDate: params.startDate,
                    },
                    op: this.op.exportDetail
                };
            this.$axios(url, reqData).then(res => {
                this.$message.success('导出成功');
            })
        },
        changeSort(typeName) {
			if (this.searchOptions.feedbackSortColEnum.indexOf('_ASC') > -1) {
				this.searchOptions.feedbackSortColEnum = typeName + "_DESC";
			} else {
				this.searchOptions.feedbackSortColEnum = typeName + "_ASC";
			}
			this.$refs.table.search();
        },
    }
}
</script>

<style lang="scss" scoped>
.recharge-box {
    border-radius: 8px;
    width: 100%;

    .search-box {
        padding: 0 20px 40px;
        background-color: #fff;
        border-radius: 0 0 8px 8px;

        .search-form {
            background: #F5F7FA;
            border-radius: 8px;
            border: 1px solid #EBEEF5;
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
        }

        .btn-box {
            width: 226px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: -20px;
        }
    }

    .query-btn {
        width: 96px;
        margin-right: 16px;
        margin-left: 0px;
    }

    .el-form--inline .el-form-item {
        margin-bottom: 20px;
    }

    .data-box {
        padding: 32px 40px;
        background: #fff;
        border-radius: 8px;
        margin: 16px 0;

        .result-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .item-box {
            box-shadow: 0px 5px 16px 0px rgba(186, 186, 186, 0.2);
            border-radius: 8px;
            border: 1px solid #EBEEF5;
            padding: 23px 15px;
            text-align: center;
            margin-bottom: 24px;
        }

        .data-title {
            font-weight: 600;
            color: #303133;
            line-height: 22px;
            font-size: 16px;
            margin-bottom: 16px;
        }

        .item-title {
            color: #303133;
            line-height: 24px;
            font-size: 16px;
        }

        .item-num {
            font-weight: bold;
            color: #303133;
            line-height: 56px;
            font-size: 48px;
            margin-bottom: 8px;
            word-break: break-all;
        }

        .item-desc {
            font-size: 14px;
            color: #909399;
        }

        .total-box {
            display: flex;

            .total-left {
                flex: 1 1 45%;
                border-radius: 8px;
                border: 1px solid #DCDFE6;
                padding: 16px 16px 4px;
            }

            .total-right {
                flex: 1 1 55%;
                padding-left: 20px;

                .item-box {
                    padding: 35px 15px;
                }
            }
        }

        .total-item {
            background: #F5F7FA;
            border-radius: 8px;
            padding: 0 24px;
            height: 60px;
            display: flex;
            align-items: center;
            margin-bottom: 12px;

            .total-item-label {
                position: relative;
                padding-left: 15px;
                flex: 1 1 65%;
                color: #606266;
                line-height: 20px;
                font-size: 14px;

                &.top-item {
                    font-weight: 600;
                    color: #606266;
                    padding-left: 0;
                }

                i {
                    display: inline-block;
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #254BE9;
                    left: 0;
                    top: 5px;
                }
            }

            .total-item-value {
                flex: 1 1 35%;
                font-weight: 600;
                color: #303133;
                line-height: 22px;
                font-size: 16px;

                &.top-item {
                    font-weight: bold;
                    color: #303133;
                    font-size: 24px;
                }
            }
        }

        .all-kinds-box {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -10px;

            .kinds-item {
                flex: 1 1 20%;
                padding: 0 10px;
            }
        }
    }

    .daily-trend {
        .item-title {
            margin-bottom: 24px;
        }
    }

    .chart-opt {
        border-radius: 8px;
        overflow: hidden;
        width: 100px;
        text-align: center;
        position: absolute;
        display: none;

        li {
            padding: 6px 10px;
            background: #ccc;
            border-bottom: 1px solid #eee;
            cursor: pointer;

            &:hover {
                background: #eee;
            }
        }
    }

    .slot-head {
        display: flex;
        align-items: center;

        i {
            display: block;
            cursor: pointer;
            margin-left: 6px;
            line-height: 8px;
            color: #ccc;
            &.actived {
                color: #666;
            }
        }
    }

    .num-down {
		display: inline-block;
        color: #0BDBA8;
    }

    .num-up {
		display: inline-block;
        color: #FD571F;
    }

    .arrow {
        display: inline-block;
        width: 6px;
        height: 7px;
        position: relative;
        background: #FD571F;
        margin: 0 5px 0 10px;

        &.num-down {
            background: #0BDBA8;
            transform: rotate(180deg);
            top: -5px;

            &::before {
                border-color: transparent transparent #0BDBA8 transparent;
            }
        }

        &::before {
            content: '';
            display: inline-block;
            height: 0;
            width: 0;
            border: 7px solid #FD571F;
            border-color: transparent transparent #FD571F transparent;
            position: absolute;
            top: -14px;
            left: -4px;
        }
    }

    .five-box {
        display: flex;
        margin: 22px 0;

        .item-box {
            width: 20%;
            margin: 0 10px;
        }
    }

	/deep/.has-gutter {
		tr th {
			background: #F5F7FA;
		}
	}
	/deep/.ws-table-warp {
		.search-wrap {
			margin-bottom: 16px;
			justify-content: space-between;
			align-items: center;
			padding: 20px 24px;
		}
	}
}
</style>
