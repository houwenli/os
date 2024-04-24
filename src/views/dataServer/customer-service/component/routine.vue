<template>
    <div class="recharge-box">
		<div class="search-box">
			<searchComponent :timeGroupItem="timeGroupItem" 
				@handleClickRefresh="query" 
				@handleCityChange = "$emit('handleCityChange', $event)"
				@exportFile="exportExcel"
				:showRefreshData="true" :showBtn="true" ref="iSearch"/>
        </div>
		<div class="data-box" v-if="powerList.faqExportDetail">
			<p class="data-title">常见问题汇总</p>
			<el-row :gutter="20">
				<el-col :span="8">
					<div class="item-box">
						<p class="item-title">问题反馈数量(个)</p>
						<p class="item-num">
							<count-to :startVal="0" :duration='2000' :endVal="Number(faqTotalData.questionCnt || 0)"></count-to>
						</p>
						<div class="item-desc">
							<span>{{$baseMethod.formatData(searchOptions.startDate, 'MM-dd')}} 至 {{$baseMethod.formatData(searchOptions.endDate, 'MM-dd')}} 环比</span>
							<i class="arrow" v-if="faqTotalData.questionRingRatio" :class="{'num-down': faqTotalData.questionRingRatio < 0}"></i>
							<span v-if="faqTotalData.questionRingRatio != null" :class="{'num-up': faqTotalData.questionRingRatio > 0, 'num-down': faqTotalData.questionRingRatio < 0}">
								<count-to :startVal="0" :decimals="2" :duration='2000' :endVal="Number(faqTotalData.questionRingRatio / 100 ||0)"></count-to>%
							</span>
							<span v-else>暂无数据</span>
						</div>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="item-box">
						<p class="item-title">反馈用户数(人)</p>
						<p class="item-num">
							<count-to :startVal="0" :duration='2000' :endVal="Number(faqTotalData.userCnt || 0)"></count-to>
						</p>
						<div class="item-desc">
							<span>{{$baseMethod.formatData(searchOptions.startDate, 'MM-dd')}} 至 {{$baseMethod.formatData(searchOptions.endDate, 'MM-dd')}} 环比</span>
							<i class="arrow" v-if="faqTotalData.userRingRatio" :class="{'num-down': faqTotalData.userRingRatio < 0}"></i>
							<span v-if="faqTotalData.userRingRatio != null" :class="{'num-up': faqTotalData.userRingRatio > 0, 'num-down': faqTotalData.userRingRatio < 0}">
								<count-to :startVal="0" :decimals="2" :duration='2000' :endVal="Number(faqTotalData.userRingRatio / 100 || 0)"></count-to>%
							</span>
							<span v-else>暂无数据</span>
						</div>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="item-box">
						<p>人均反馈数量(个)</p>
						<p class="item-num">
							<count-to :startVal="0" :duration='2000' :endVal="Number(faqTotalData.perCapitaCnt || 0)"></count-to>
						</p>
						<div class="item-desc">
							<span>{{$baseMethod.formatData(searchOptions.startDate, 'MM-dd')}} 至 {{$baseMethod.formatData(searchOptions.endDate, 'MM-dd')}} 环比</span>
							<i class="arrow" v-if="faqTotalData.pcRingRatio" :class="{'num-down': faqTotalData.pcRingRatio < 0}"></i>
							<span v-if="faqTotalData.pcRingRatio != null" :class="{'num-up': faqTotalData.pcRingRatio > 0, 'num-down': faqTotalData.pcRingRatio < 0}">
								<count-to :startVal="0" :decimals="2" :duration='2000' :endVal="Number(faqTotalData.pcRingRatio / 100 || 0)"></count-to>%
							</span>
							<span v-else>暂无数据</span>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="data-box" v-if="powerList.getSolveFbTrend">
			<p class="data-title">已解决&amp;未解决反馈趋势</p>
			<charts-component ref="feedbackChartRef" :setChartsOptions="feedbackChartOpt"></charts-component>
		</div>
		<div class="data-box" v-if="powerList.getSolveDetail">
			<div class="result-head">
				<p class="data-title">各类问题解决情况</p>
				<el-select v-model="searchOptions.questionSortColEnum" placeholder="" @change="changeFaqSort">
					<el-option
						v-for="item in resultTypeList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</div>
			<charts-component ref="resultChartRef" :setChartsOptions="resultChartOpt"></charts-component>
		</div>
		<div class="data-box" v-if="powerList.getQuesTableDetail">
			<p class="data-title">常见问题汇总表</p>
			<ws-table-el ref="table" v-bind="tableConfig" style="width:100%;padding: 0 !important;">
				<template>
					<ws-table-column-el prop="questionName" label="问题名称"></ws-table-column-el>
					<ws-table-column-el prop="questionCnt" label="问题反馈数量">
						<div class="slot-head" slot="header">
							<p>问题反馈数量</p>
							<div @click="changeSort('QUESTION_COUNT')">
								<i :class="{'actived': searchOptions.questionSortColEnum_table == 'QUESTION_COUNT_ASC'}" class="el-icon-caret-top"></i>
								<i :class="{'actived': searchOptions.questionSortColEnum_table == 'QUESTION_COUNT_DESC'}" class="el-icon-caret-bottom"></i>
							</div>
						</div>
					</ws-table-column-el>
					<ws-table-column-el prop="userCnt" label="反馈用户数">
						<div class="slot-head" slot="header">
							<p>反馈用户数</p>
							<div @click="changeSort('USER_COUNT')">
								<i :class="{'actived': searchOptions.questionSortColEnum_table == 'USER_COUNT_ASC'}" class="el-icon-caret-top"></i>
								<i :class="{'actived': searchOptions.questionSortColEnum_table == 'USER_COUNT_DESC'}" class="el-icon-caret-bottom"></i>
							</div>
						</div>
					</ws-table-column-el>
					<ws-table-column-el prop="solveCnt" label="已解决数量">
						<div class="slot-head" slot="header">
							<p>已解决数量</p>
							<div @click="changeSort('SOLVE_COUNT')">
								<i :class="{'actived': searchOptions.questionSortColEnum_table == 'SOLVE_COUNT_ASC'}" class="el-icon-caret-top"></i>
								<i :class="{'actived': searchOptions.questionSortColEnum_table == 'SOLVE_COUNT_DESC'}" class="el-icon-caret-bottom"></i>
							</div>
						</div>
					</ws-table-column-el>
					<ws-table-column-el prop="unsolveCnt" label="未解决数量">
						<div class="slot-head" slot="header">
							<p>未解决数量</p>
							<div @click="changeSort('UNSOLVE_COUNT')">
								<i :class="{'actived': searchOptions.questionSortColEnum_table == 'UNSOLVE_COUNT_ASC'}" class="el-icon-caret-top"></i>
								<i :class="{'actived': searchOptions.questionSortColEnum_table == 'UNSOLVE_COUNT_DESC'}" class="el-icon-caret-bottom"></i>
							</div>
						</div>
					</ws-table-column-el>
				</template>
			</ws-table-el>
		</div>
    </div>
</template>

<script>
import { timeButtonGroupList } from './search-options.js'
import countTo from 'vue-count-to'
import chartsComponent from './charts'
import { bar_options, bar_double_y_options } from './data-options.js'
import searchComponent from './search.vue'
export default {
	components: {
		countTo,
		chartsComponent,
		searchComponent,
	},
	name: 'routineQuestion',
	data() {
		return {
			moduleName: "/dataServer/customerService",
			timeGroupItem: timeButtonGroupList,
			searchOptions: {
				cityList: [0],
				endDate: this.$baseMethod.getBeforeDay(-1, 'yyyy-MM-dd'),
				startDate: this.$baseMethod.getBeforeDay(-7, 'yyyy-MM-dd'),
				questionSortColEnum: 'SOLVE_COUNT_DESC',
				questionSortColEnum_table: 'QUESTION_COUNT_DESC',
			},
			op: {
				getQuestionTotal: 'getQuestionTotal',
				getSolveFbTrend: 'getSolveFbTrend',
				getSolveDetail: 'getSolveDetail',
				faqExportDetail: 'faqExportDetail',
			},
			feedbackChartOpt: {},
			resultChartOpt: {},
			resultTypeList: [
				{ label: '已解决次数排序', value: 'SOLVE_COUNT_DESC' },
				{ label: '未解决次数排序', value: 'UNSOLVE_COUNT_DESC' },
			],
			tableConfig: {
                loading: true,
                filterColumns: false,
                lazyQuery: {
                    moduleName: "/dataServer/customerService",
					immediate: false,
                    op: {
                        selectList: "getQuesTableDetail",
                        selectCount: ""
                    },
					beforeQuery: this.beforeQuery
                },
				autoHeight: false,
            },
			faqTotalData: {},
			tableSortColEnum: 'QUESTION_COUNT_DESC',
		}
	},
	created() {
		this.feedbackChartOpt = _.cloneDeep(bar_double_y_options);
		this.resultChartOpt = _.cloneDeep(bar_double_y_options);
	},
	mounted() {
		this.query();
	},
	methods: {
		getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
		beforeQuery() {
			return {
				endDate: this.searchOptions.endDate,
				startDate: this.searchOptions.startDate,
				cityList: this.searchOptions.cityList,
				questionSortColEnum: this.searchOptions.questionSortColEnum_table,
			}
		},
		query(params) {
			this.searchOptions = Object.assign(this.searchOptions, params);
			this.getQuestionTotal();
			this.getResolveAndTrend();
			this.getResultData();
			this.$refs.table.search();
		},
		exportExcel(params) {
			const url = this.getModuleUrl(this.op.faqExportDetail),
				reqData = {
					data: {
						cityList: params.cityList,
						endDate: params.endDate,
						startDate: params.startDate,
					},
					op: this.op.faqExportDetail
				};
			this.$axios(url, reqData).then(res => {
				this.$message.success('导出成功');
			})
		},
		getParams() {
			return this.$refs.iSearch.getParams();
		},
		getQuestionTotal() {
			const url = this.getModuleUrl(this.op.getQuestionTotal),
				reqData = {
					data: {...this.searchOptions},
					op: this.op.getQuestionTotal
				};
			if (!url) {
				return
			}
			this.$axios(url, reqData).then(res => {
				const resData = JSON.parse(res.data);
				this.faqTotalData = resData;
			})
		},
		getResolveAndTrend() {
			const url = this.getModuleUrl(this.op.getSolveFbTrend),
				reqData = {
					data: {...this.searchOptions},
					op: this.op.getSolveFbTrend
				};
			if (!url) {
				return
			}
			this.$axios(url, reqData).then(res => {
				const resData = JSON.parse(res.data);
				this.feedbackChartOpt.color = ['#254BE9', '#FD571F', '#0BDBA8', '#F3D01D'];
				this.feedbackChartOpt.xAxis.data = resData.map(item => item.date);
				this.feedbackChartOpt.xAxis.axisLabel = {
					formatter: (val) => val.replaceAll('-', '/'),
				};
				this.feedbackChartOpt.yAxis[1].axisLabel = {
					formatter: (val) => val + '%'
				};
				this.feedbackChartOpt.series[0].name = '已解决数量';
				this.feedbackChartOpt.series[1].name = '未解决数量';
				this.feedbackChartOpt.series[0].data = resData.map(item => {
					return {
						value: item.solveCnt || 0,
						solveCntRatio: item.solveCntRatio / 100 || 0,
					}
				});
				this.feedbackChartOpt.series[1].data = resData.map(item => {
					return {
						value: item.unSolveCnt || 0,
						unSolveCntRatio: item.unSolveCntRatio / 100 || 0,
					}
				});
				this.feedbackChartOpt.legend[1] = {
					x: '220',
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
				this.feedbackChartOpt.series[2] = {
					name: '已解决占比',
					type: 'line',
					yAxisIndex: 1,
					data: resData.map(item => item.solveCntRatio / 100 || 0),
					tooltip: {
						valueFormatter: (val) => val + '%'
					}
				};
				this.feedbackChartOpt.series[3] = {
					name: '未解决占比',
					type: 'line',
					yAxisIndex: 1,
					data: resData.map(item => item.unSolveCntRatio / 100 || 0),
					tooltip: {
						valueFormatter: (val) => val + '%'
					}
				};
				this.$nextTick(() => {
					this.$refs.feedbackChartRef.updateCharts(this.feedbackChartOpt);
				});
			});
		},
		getResultData() {
			const url = this.getModuleUrl(this.op.getSolveDetail),
				reqData = {
					data: {
						...this.searchOptions,
					},
					op: this.op.getSolveDetail
				};
			if (!url) {
				return
			}
			this.$axios(url, reqData).then(res => {
				const resData = JSON.parse(res.data);
				this.resultChartOpt.xAxis.data = resData.map(item => item.name);
				this.resultChartOpt.xAxis.axisLabel = {
					rotate: -60,
					width: 120,
					overflow: 'truncate',
				};
				this.resultChartOpt.color = ['#254BE9', '#FD571F', '#0BDBA8', '#F3D01D'];
				this.resultChartOpt.yAxis[1].axisLabel = {
					formatter: (val) => val + '%'
				};
				this.resultChartOpt.series[0].name = '已解决数量';
				this.resultChartOpt.series[1].name = '未解决数量';
				this.resultChartOpt.series[0].data = resData.map(item => item.solveCnt || 0);
				this.resultChartOpt.series[1].data = resData.map(item => item.unSolveCnt || 0);
				this.resultChartOpt.legend[1] = {
					x: '220',
					icon:'rect',
					itemWidth: 10,
					itemHeight: 4,
					textStyle: {
						fontSize: 14,
						color:"#606266"
					},
					itemGap:24,
					data: ['已解决占比', '未解决占比'],
				};
				this.resultChartOpt.series[2] = {
					name: '已解决占比',
					type: 'line',
					yAxisIndex: 1,
					data: resData.map(item => item.solveCntRatio / 100 || 0),
					itemStyle: {
						normal: {
							color: "#0BDBA8"
						},
					},
					tooltip: {
						valueFormatter: (val) => val + '%'
					}
				};
				this.resultChartOpt.series[3] = {
					name: '未解决占比',
					type: 'line',
					yAxisIndex: 1,
					itemStyle: {
						normal: {
							color: "#F3D01D"
						},
					},
					tooltip: {
						valueFormatter: (val) => val + '%'
					},
					data: resData.map(item => item.unSolveCntRatio / 100 || 0),
				};
				this.$nextTick(() => {
					this.$refs.resultChartRef.updateCharts(this.resultChartOpt);
				});
			})
		},
		changeSort(typeName) {
			if (this.searchOptions.questionSortColEnum_table.indexOf('_ASC') > -1) {
				this.searchOptions.questionSortColEnum_table = typeName + "_DESC";
			} else {
				this.searchOptions.questionSortColEnum_table = typeName + "_ASC";
			}
			this.$refs.table.search();
        },
		changeFaqSort() {
			this.getResultData();
		},
	}
}
</script>

<style lang="scss" scoped>
.recharge-box {
	border-radius: 8px;
    width: 100%;
	.search-box {
		padding: 0 40px 20px;
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
		.btn-box{
			width: 226px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: -20px;
		}
	}
	.query-btn{
        width: 96px;
        margin-right: 16px;
        margin-left: 0px;
    }
	.el-form--inline .el-form-item{
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
			box-shadow: 0px 5px 16px 0px rgba(186,186,186,0.2);
			border-radius: 8px;
			border: 1px solid #EBEEF5;
			padding: 23px 15px;
			text-align: center;
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
		color: #0BDBA8;
	}
	.num-up {
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
				border-color: transparent transparent #0BDBA8 transparent ;
			}
		}
		&::before {
			content: '';
			display: inline-block;
			height: 0;
			width: 0;
			border: 7px solid #FD571F;
			border-color: transparent transparent #FD571F transparent ;
			position: absolute;
			top: -14px;
			left: -4px;
		}
	}
	.has-gutter {
		tr {
			background: #F5F7FA;
		}
	}
}
</style>