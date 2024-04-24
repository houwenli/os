<template>
  <div>
        <div class="recharge_search_box">
            <el-form :model="dataOptions" ref="ruleForm" inline label-width="90px">
                <template>
                    <el-form-item label="充值类型：" prop="rechargeType">
                        <el-select v-model="dataOptions.rechargeType" placeholder="请选择" class="datePicker">
                            <el-option
                            v-for="item in rechargeType"
                            :label="item.label"
                            :value="item.value"
                            :key="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="充值时间：" prop="time">
                        <el-date-picker class="datePicker"
                            v-model="dataOptions.time"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :clearable="false"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择城市：" prop="city">
                        <ws-city
                                    class="datePicker"
                            v-model="cityCodes"
                            :data="cityData"
                            :defaultProps="{ checkStrictly: true }"
                            ref="ws-city"
                            level="2"
                            @change="getCheckedNodes"
                        ></ws-city>
                    </el-form-item>
                </template>
            </el-form>
            <div class="btn-box">
                <ws-throttle><el-button v-if="powerList.queryPassengerRechargeCount || powerList.selectStatPage || powerList.queryPassengerRechargeTrend" class="query-btn" type="primary" @click="query(true)" >查询</el-button></ws-throttle>
                <ws-throttle><el-button v-if="(powerList.queryPassengerRechargeCount || powerList.selectStatPage || powerList.queryPassengerRechargeTrend) && powerList.exportUserRechargeData" class="query-btn query-btn-r" @click="exportExcel">导出</el-button></ws-throttle>
            </div>
        </div>
        <div class="echart_box" >
            <div class="title">充值用户分析</div>
            <div class="view_box" v-if="powerList.queryPassengerRechargeCount">
                <div class="view_cont marginR20">
                    <div class="view_tit">充值人次</div>
                    <div class="view_sum">{{passengerRechargeCount.rechargePassengerCnt||0}}</div>
                </div>
                <div class="view_cont">
                    <div class="view_tit">用户充值笔数（笔）</div>
                    <div class="view_sum">{{passengerRechargeCount.rechargeBillCnt||0}}</div>
                </div>
            </div>
            <div class="chart_cont" v-if="powerList.queryPassengerRechargeTrend">
                <charts ref="rechargeSum" :setChartsOptions="rechargeActivity"></charts>   
            </div>
        </div>
        <div class="echart_box">
            <div class="title">充值金额分析</div>
            <div class="view_box" v-if="powerList.queryPassengerRechargeCount">
                <div class="view_cont marginR20">
                    <div class="view_tit">总入账金额（元）</div>
                    <div class="view_sum">{{regFenToYuan(passengerRechargeCount.enteredAmt||0)}}</div>
                </div>
                <div class="view_cont marginR20">
                    <div class="view_tit">充值金额（元）</div>
                    <div class="view_sum">{{regFenToYuan(passengerRechargeCount.realAmt||0)}}</div>
                </div>
                <div class="view_cont">
                    <div class="view_tit">赠送金额（元）</div>
                    <div class="view_sum">{{regFenToYuan(passengerRechargeCount.discountAmt||0)}}</div>
                </div>
            </div>
            <div class="chart_cont" v-if="powerList.queryPassengerRechargeTrend">
                <charts ref="rechargeCount" :setChartsOptions="rechargeActivityMoney"></charts>   
            </div>
        </div>
        <div class="echart_box" v-if="powerList.selectStatPage">
            <div class="title">活动明细数据</div>
            <ws-table-el @sort-change="changeSort" ref="table" v-bind="tableConfig" style="margin-top:16px;padding:0px !important;"  :header-cell-style="{ background: '#F5F7FA' }">
                <!-- <ws-table-column-el label="日期" prop='rechargeTime'>
                    <template slot-scope="scope">
                        {{$baseMethod.formatData(scope.row.rechargeTime,"yyyy-MM-dd")}}
                    </template>
                </ws-table-column-el > -->
                <ws-table-column-el label="省区" prop='provinceName'></ws-table-column-el >
                <ws-table-column-el label="城市" prop='cityName'></ws-table-column-el >
                <ws-table-column-el label="总入账金额" prop='sumRealMoney'>
                    <template slot-scope="scope">
                        {{regFenToYuan(scope.row.sumRealMoney)}}
                    </template>
                </ws-table-column-el >
                <ws-table-column-el sortable  label="充值总金额" prop='sumRechargeMoney' min-width="145px">
                    <template slot-scope="scope">
                        {{regFenToYuan(scope.row.sumRechargeMoney)}}
                    </template>
                </ws-table-column-el >
                <ws-table-column-el label="赠送总金额" prop='sumRewardMoney'>
                    <template slot-scope="scope">
                        {{regFenToYuan(scope.row.sumRewardMoney)}}
                    </template>
                </ws-table-column-el >
                <ws-table-column-el sortable  label="充值人次" prop='sumRechargeUserNumber' min-width="120px"></ws-table-column-el>
                <ws-table-column-el label="用户充值总笔数" prop='sumRechargeOrderNumber'></ws-table-column-el>
            </ws-table-el>
        </div>
    </div>
</template>

<script>
import charts from './charts.vue'
import {rechargeActivity,rechargeActivityMoney} from './charts'
export default {
    components:{charts},
    name:"rechargeActivity",
  data() {
    return {
        dataOptions: {
            rechargeType:0,
            cityCodeList:[],
            time:''
        },
        cityCodes:[],
        sortBy:null,
        sortField:null,
        pickerMinDate:'',//获取开始选择时间
        pickerMaxDate:'',//获取结束选择时间
        pickerOptions: { //时间范围选择控制
            onPick: ({ maxDate, minDate }) => {
                if(minDate){
                    this.pickerMinDate = minDate.getTime()
                }                        
                if (maxDate) {
                    this.pickerMinDate = ''
                    this.pickerMaxDate =  maxDate.getTime()
                }
            },
            disabledDate: (time) => {
                const day30 = 30  * 24 * 3600 * 1000
                const minDay = new Date('2022-07-01 00:00:00').getTime()
                if (this.pickerMinDate !== '') {
                    let maxTime = this.pickerMinDate + day30
                    if (maxTime > new Date()) {
                        maxTime = new Date()
                    }
                    return time.getTime()<minDay||time.getTime() > maxTime || time.getTime() > Date.now()
                }
                if (this.pickerMaxDate !== '' && !this.pickerMinDate) {
                    let minTime = this.pickerMaxDate - day30
                    return time.getTime()<minDay||time.getTime() < minTime || time.getTime() > Date.now()
                }
                return time.getTime()<minDay||time.getTime() > Date.now()
            }
      },
      moduleName: "/dataServer/rechargeActivity",
        tableConfig:{
            filterColumns: false,
            autoHeight:false,
            lazyQuery: {
                moduleName: '/dataServer/rechargeActivity',
                op: {
                    selectList: 'selectStatPage',
                    selectCount: 'pageStatCount'
                },
                beforeQuery: this.tableBeforeQuery
            }
        },
      rechargeType:[
          {
            label: '全部',
            value: 0,
        },
        {
            label: '机构邀请',
            value: 1,
        },
        {
            label: '自主充值',
            value: 2,
        },
        {
            label: '乘客邀请',
            value: 3,
        },
      ],
      cityData:[],
      rechargeActivity:{},
      rechargeActivityMoney:{},
      passengerRechargeCount:{}
    };
  },
  filters:{
      
  },
  created() {
      let nowTime = new Date().getTime()
      let minDay = new Date('2022-07-01 00:00:00').getTime()
      let day30 = 30  * 24 * 3600 * 1000
      if (nowTime-day30>minDay) {
          this.dataOptions.time =[this.$baseMethod.formatData(nowTime-day30,"yyyy-MM-dd"), this.$baseMethod.formatData(nowTime,"yyyy-MM-dd")]
      }else{
          this.dataOptions.time =['2022-07-01', this.$baseMethod.formatData(nowTime,"yyyy-MM-dd")]
      }
      this.rechargeActivity = this.$baseMethod.deepClone(rechargeActivity)
      this.rechargeActivityMoney = this.$baseMethod.deepClone(rechargeActivityMoney)
  },
  mounted() {
    this.getProvinceCityList()
    this.query(false)
  },
  methods: {
    regFenToYuan(m) {
        return  this.thousandSeparator(this.$baseMethod.regFenToYuan(m))
    },
    // 添加千位符
    thousandSeparator(num){
       var res = num.toString().replace(/\d+/, function (n) { // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                return $1 + ",";
            });
        })
        return res;
    },
    tableBeforeQuery(){
        let param = this.getParam()
        param.sortBy=this.sortBy,
        param.sortField=this.sortField
        return param
    },
    getCheckedNodes(val){
        this.dataOptions.cityCodeList =[]
        if(val.length>1){
            this.dataOptions.cityCodeList = [val[1]]
        }else{
            this.cityData.forEach(item=>{
                if (item.code==val[0]) {
                    let childList = item.children
                    childList.forEach(child=>{
                        this.dataOptions.cityCodeList.push(child.code)
                    })
                }
            })
        }
    },
    getProvinceCityList() {
        const URL = '/local/selectBusinessCityListTree';
        let opt = {
            data: JSON.stringify({}),
            op: 'select',
        }
        this.$axios(URL,opt).then(res=>{
            let dataList = JSON.parse(res.data) || []
            //获取省市
            dataList.map((item,index) => {
                if(item.code!=0){
                    if (item.children&&item.children.length) {
                        item.children.map(cityItem => {
                            delete cityItem.children
                        })
                    }
                    // 接口会返回一个其他城市code为0，和全国有冲突，这里手动去掉其他城市
                }else{
                    delete dataList[index]
                }
                
            })
            dataList.unshift({
                code: 0,
                name: '全部'
            });
            this.cityData = dataList
            if (dataList.length) {
                let city = dataList[0]
                this.cityCodes = [city.code]
            }
        })
    },
    // 查询充值送活动汇总信息
    getPassengerRechargeCount() {
        const op = 'queryPassengerRechargeCount'
        let param = {
            data: this.getParam(),
            op,
        };
        let URL = this.$getModuleUrl(this.moduleName, op);
        this.$axios(URL, param).then((res) => {
            if (res.code == 1) {
                let resData = JSON.parse(res.data)
                this.passengerRechargeCount = resData||{}
            }
        });
    },
    // 查询充值送活动统计图分析
    getPassengerRechargeTrend() {
        const op = 'queryPassengerRechargeTrend'
        let data = {
            data: this.getParam(),
            op,
        };
        let URL = this.$getModuleUrl(this.moduleName, op);
        this.$axios(URL, data).then((res) => { 
            if (res.code == 1) {
                let resData = JSON.parse(res.data)||[]
                let realAmt=[],enteredAmt=[],discountAmt=[],payNotifyTime=[]
                let rechargeBillCnt=[],rechargePassengerCnt=[]
                for(let i=0;i<resData.length;i++){
                    realAmt.push(this.$baseMethod.regFenToYuan(resData[i].realAmt))
                    enteredAmt.push(this.$baseMethod.regFenToYuan(resData[i].enteredAmt))//总金额
                    discountAmt.push(this.$baseMethod.regFenToYuan(resData[i].discountAmt))//赠送金额
                    payNotifyTime.push(this.$baseMethod.formatData(resData[i].day,"MM/dd"))
                    rechargeBillCnt.push(resData[i].rechargeBillCnt)
                    rechargePassengerCnt.push(resData[i].rechargePassengerCnt)
                }
                this.rechargeActivity.xAxis.data = payNotifyTime//日期
                this.rechargeActivity.series[0].data = rechargePassengerCnt//乘客充值总人数
                this.rechargeActivity.series[1].data = rechargeBillCnt//乘客充值笔数
                this.$refs.rechargeSum.updateCharts(this.rechargeActivity)
                this.rechargeActivityMoney.xAxis.data = payNotifyTime
                this.rechargeActivityMoney.series[0].data = enteredAmt//总金额
                this.rechargeActivityMoney.series[1].data = realAmt//充值金额
                this.rechargeActivityMoney.series[2].data=discountAmt
                this.$refs.rechargeCount.updateCharts(this.rechargeActivityMoney)
            }
        });
    },
    getParam(){
        let param= {
            rechargeType:this.dataOptions.rechargeType,
            cityCodeList:this.dataOptions.cityCodeList,
            source:1
        }
        if (this.dataOptions.time.length) {
            let [startDate, endDate] = this.dataOptions.time;
            param.startDay =`${startDate.substring(0, 10)} 00:00:00`
            param.endDay =`${endDate.substring(0, 10)} 23:59:59`
        }
        return param
    },
    query(init){
        init&&this.$refs.table.search();
        this.getPassengerRechargeCount()
        this.getPassengerRechargeTrend()
    },
    changeSort(val){
        let {order,prop} = val
         switch (order) {
            case 'ascending':
            this.sortBy = 2
            break;
            case 'descending':
            this.sortBy = 1
            break;
            default:
            this.sortBy =null
            break;
         }
         switch (prop) {
            case 'sumRechargeUserNumber':
            this.sortField = 2
            break;
            case 'sumRechargeMoney':
            this.sortField = 1
            break;
            default:
            this.sortField =null
            break;
         }
        this.$refs.table.search();
    },
    // 导出
    exportExcel() {
        const reqData = {
            data: this.getParam(),
            op: 'exportUserRechargeData'
        };
        let URL = this.$getModuleUrl(this.moduleName, reqData.op);
        this.$axios(URL, reqData).then(res => {
            this.$message.success('文件正在导出，请到文件下载界面进行下载');
        });
    },
  }
};
</script>
<style lang="scss" scoped>
.recharge_box{
    .recharge_search_box{
        border: 1px solid #EBEEF5;
        border-radius: 8px;
        background: #f5f7fa !important;
        padding: 20px 0px 2px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn-box{
            width: 226px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: -20px;
        }
        .el-form--inline .el-form-item{
            margin-bottom: 20px;
        }
    }
    .echart_box{
        margin-top: 32px;
        .title{
            height: 22px;
            font-size: 16px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #303133;
            line-height: 22px;
        }
        .view_box{
            display: flex;
            justify-content: space-between;
            .view_cont{
                background: #FFFFFF;
                box-shadow: 0px 5px 16px 0px rgba(186, 186, 186, 0.2);
                border-radius: 8px;
                border: 1px solid #EBEEF5;
                width: 100%;
                text-align:center;
                margin-top: 16px;
                .view_tit{
                    height: 22px;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #303133;
                    line-height: 22px;
                    margin-top: 24px;
                    // width: 50%;
                }
                .view_sum{
                    height: 56px;
                    font-size: 48px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #303133;
                    line-height: 56px;
                    margin: 24px 0px 28px 0px;
                }
            }
        }
        .chart_cont{
            margin-top: 32px;
        }
    }
    .marginR20{
        margin-right: 20px;
    }
    .query-btn{
        width: 96px;
        margin-right: 16px;
        margin-left: 0px;
    }
    .query-btn-r{
        border: 1px solid #F05259;
        color: #F05259;
    }
    /deep/.el-table .sort-caret.ascending{
        border-bottom-color:#DCDFE6;
    }
    /deep/.el-table .sort-caret.descending{
        border-top-color:#DCDFE6;
    }
    /deep/.el-table .descending .sort-caret.descending{
        border-top-color:#909399
    }
    /deep/.el-table .ascending .sort-caret.ascending{
        border-bottom-color:#909399
    }
    /deep/.el-form-item__label{
        font-size: 14px;
        font-weight: 400;
        color: #606266;
        padding: 0px;
    }
    .datePicker{
        width: 240px;
        /deep/.el-cascader--medium{
            width: 240px !important;
        }
    }
}
</style>
