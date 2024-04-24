<script>
import echarts from '../../../utils/echarts';
import { CONVERSION_BAR_OPTS } from '../../../utils/charts-options';
import { cloneDeep } from 'lodash-es';
export default {
    name: 'chart',
    props: {
        id: {
            type: String,
            required: true,
        },
        chartData: {
            type: Object,
            required: true,
        },
        customClass: {
            type: String,
            default: '',
        },
        customStyle: {
            type: String,
            default: '',
        },
        changeType: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            myChart: null,
        };
    },

    mounted() {
        this.$nextTick(() => {
            this.initChart();
        });
    },

    watch: {
        chartData: {
            deep: true,
            handler(val) {
                this.setOptions(val);
            },
        },
    },

    methods: {
        initChart() {
            this.myChart = echarts.init(document.getElementById(this.id));
            this.setOptions(this.chartData);
        },

        setOptions(data) {
            if ('xData' in data) {
                let lineOption = cloneDeep(CONVERSION_BAR_OPTS);
                console.log(lineOption);
                console.log(this.changeType);
                if (this.changeType==false) {
                    lineOption.tooltip.formatter = function (params) {
                        let result = `<div style="margin-bottom: 3px;">${params[0].name}-${(params[0].dataIndex + 1 < 10 ? '0' + (params[0].dataIndex + 1) : params[0].dataIndex + 1) + ':00'}</div>`;
                        // let result = `<div style="margin-bottom: 3px;">${params[0].name}</div>`;
                        params.forEach(function (item) {
                            const arr = ['应答率', '完成率', '取消率'];
                            let unit = arr.includes(item.seriesName) ? '%' : '单'; 
                            let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:8px;background:${item.color};vertical-align: 2px"></span>`;
                            result += dotHtml + item.seriesName + '：' + item.data + '' + unit + '</br>';
                        });
                        result = `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color: #fff">${result}</div>`;
                        return result;
                    };
                }else{
                    lineOption.tooltip.formatter = function (params) {
                        // let result = `<div style="margin-bottom: 3px;">${params[0].name}-${(params[0].dataIndex + 1 < 10 ? '0' + (params[0].dataIndex + 1) : params[0].dataIndex + 1) + ':00'}</div>`;
                        let result = `<div style="margin-bottom: 3px;">${params[0].name}</div>`;
                        params.forEach(function (item) {
                            const arr = ['应答率', '完成率', '取消率'];
                            let unit = arr.includes(item.seriesName) ? '%' : '单';
                            let dotHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:8px;background:${item.color};vertical-align: 2px"></span>`;
                            result += dotHtml + item.seriesName + '：' + item.data + '' + unit + '</br>';
                        });
                        result = `<div style="font-size: 12px;line-height:17px;padding:2px 5px;color: #fff">${result}</div>`;
                        return result;
                    };
                }
                let arr = ['应答率', '完成率', '取消率'];
                this.myChart.showLoading();
                lineOption.xAxis.data = data.xData;
                //日期间隔超过15 rotate
                lineOption.xAxis[0].data = data.xData;
                lineOption.legend.data = data.lendList;
                lineOption.legend.orient = 'horizontal';
                if (this.id === 'chart-cancel') {
                    lineOption.color[1] = '#FD571F';
                }
                lineOption.series = data.dataInfoList.map(item => {
                    return {
                        name: item.Lend,
                        type: arr.includes(item.Lend) ? 'line' : 'bar',
                        yAxisIndex: arr.includes(item.Lend) ? 1 : 0,
                        data: item.data,
                        smooth: false,
                    };
                });
                this.myChart.setOption(lineOption);
                this.myChart.hideLoading();
            }
        },
    },

    render(h) {
        const { customClass, id, customStyle } = this;
        return <div id={id} class={customClass} style={customStyle} ref="chart"></div>;
    },
};
</script>
