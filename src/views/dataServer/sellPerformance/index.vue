<template>
    <div class="sellPerformance">
      <div class="sellPerformance-content">
        <search-column @search="search" :showExport="true" @exportFile="exportFile">
        <template #custom>
          <div class="channel-type">
            <span>业务类型：</span>
            <el-select v-model="businessType" placeholder="请选择" @change="businessTypeChange">
              <el-option v-for="item in serviceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </template>
      </search-column>
        <div class="allType">
        <orderPie v-if="businessType == -1" :pieData="salesMoneySumData"></orderPie>
        <orderLine ref="salesMoneyTrend" :chartData="salesMoneyTrendData" title="销售业绩分析" type="amt" v-if="businessType != -1 && JSON.stringify(salesMoneyTrendData) != '{}'">
          <template #grid>
            <div class="flex-row">
                <div class="grid-content">
                    <p>{{currentTypeName}}订单金额（元）</p>
                    <p class="num">{{ thousandSeparator($baseMethod.regFenToYuan(salesMoneyTrendData.overData.orderMoneyAmt)) }}</p>
                </div>
                <div class="grid-content">
                    <p>{{currentTypeName}}支付金额（元）</p>
                    <p class="num">{{ thousandSeparator($baseMethod.regFenToYuan(salesMoneyTrendData.overData.paidMoneyAmt)) }}</p>
                </div>
            </div>
          </template>
        </orderLine>
      </div>
      <orderLine v-if="JSON.stringify(salesNumTrendData) != '{}'" :chartData="salesNumTrendData" ref="salesNumTrend" title="销售数量分析" type="cnt">
        <template #grid>
            <div class="flex-row">
                <div class="grid-content" v-for="(item,index) in gridList" :key="index">
                    <p>{{ item.name }}</p>
                    <p class="num">{{ thousandSeparator(salesNumTrendData.overData[item.value]) || 0 }}</p>
                </div>
            </div>
          </template>
      </orderLine>
      <div class="salesSellerTop">
        <span>销售人员业绩排名（前top50）</span>
        <ws-table-el ref="table" v-bind="tableConfigTwo" :data="salesSellerTopData"
                    style="margin-top:16px;padding:0px !important;" :header-cell-style="{ background: '#F5F7FA' }">
          <ws-table-column-el label="名次" prop='ranking'></ws-table-column-el>
          <ws-table-column-el label="姓名" prop='name'></ws-table-column-el>
          <ws-table-column-el label="订单金额(元)" prop='orderMoney'>
            <template slot-scope="scope">
              {{ $baseMethod.regFenToYuan(scope.row.orderMoney) }}
            </template>
          </ws-table-column-el>
          <ws-table-column-el label="支付金额(元)" prop='paidMoney'>
            <template slot-scope="scope">
              {{ $baseMethod.regFenToYuan(scope.row.paidMoney) }}
            </template>
          </ws-table-column-el>
      </ws-table-el>
      </div>
      <div class="salesSellerTop" style="padding: 24px 18px 60px;" v-if="searchParms.provinceCode ==0">
        <div v-if="businessType == -1">
          <span>排名分析</span>
          <el-table ref="table" v-bind="tableConfigTwo" :data="salesProvinceTopData" @sort-change="sortChange"
                      style="margin-top:16px;padding:0px !important;" :header-cell-style="{ background: '#F5F7FA' }">
            <el-table-column label="省份" prop='provinceName'></el-table-column>
            <el-table-column label="全部">
              <el-table-column label="订单总金额(元)" prop='allOrderMoney'></el-table-column>
              <el-table-column label="支付总金额(元)" prop='allPaidMoney' sortable="true"></el-table-column>
            </el-table-column>
            <el-table-column label="两轮车">
              <el-table-column label="订单总金额(元)" prop='dogCartOrderMoney'></el-table-column>
              <el-table-column label="支付总金额(元)" prop='dogCartPaidMoney'></el-table-column>
            </el-table-column>
            <el-table-column label="保险">
              <el-table-column label="订单总金额(元)" prop='insureOrderMoney'></el-table-column>
              <el-table-column label="支付总金额(元)" prop='insurePaidMoney'></el-table-column>
            </el-table-column>
            <el-table-column label="酒水饮料">
              <el-table-column label="订单总金额(元)" prop='drinkOrderMoney'></el-table-column>
              <el-table-column label="支付总金额(元)" prop='drinkPaidMoney'></el-table-column>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            v-if="salesProvinceTopData.length"
            @current-change="handleCurrentChange()"
            @size-change="handleSizeChange"
            :current-page.sync="currentPage"
            :page-sizes="pageSizeList"
            :page-size="pageSize"
              layout="total,sizes,prev,slot,next"
            :total="total"
        >
            <span class="tc" >{{ currentPage }}</span>
          </el-pagination>
        </div>
        <div v-else>
          <span>排名分析</span>
          <el-table ref="tables" v-bind="tableConfigTwo" :data="salesProvinceTopData" @sort-change="sortChange"
                      style="margin-top:16px;padding:0px !important;" :header-cell-style="{ background: '#F5F7FA' }">
                <el-table-column v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :column-key="`${index}`" :sortable="item.sortable" :sort-method="(a, b) => { return a[item.prop] - b[item.prop]; }">
                </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            v-if="salesProvinceTopData.length"
            @current-change="handleCurrentChange()"
            @size-change="handleSizeChange"
            :current-page.sync="currentPage"
            :page-sizes="pageSizeList"
            :page-size="pageSize"
              layout="total,sizes,prev,slot,next"
            :total="total"
        >
            <span class="tc" >{{ currentPage }}</span>
        </el-pagination>
        </div>
      </div>
        
      </div>
      
    </div>
</template>

<script>
import searchColumn from "./components/searchColumn";
import orderPie from "./components/pie";
import orderLine from "./components/line";
import { tableColumnDrink,tableColumnInsure,tableColumnCar } from "./components/tableColum";
export default {
  name:'sellPerformance',
  data (){
    return {
      moduleName:'/dataServer/sellPerformance',
      orderChartLoading:false,
      tableConfigTwo: {
          indexColumn: false,
          filterColumns: false,
          pagination: false,
          autoHeight: false,
      },
      searchParms:{
        provinceCode:0,
        startDay:this.$baseMethod.getBeforeDay(-6, 'yyyy-MM-dd', new Date()),
        endDay:this.$baseMethod.getBeforeDay(0, 'yyyy-MM-dd', new Date()),
      },
      salesProvinceTopData:[],
      salesSellerTopData:[],
      salesMoneySumData:{},
      salesNumTrendData:{},
      salesMoneyTrendData:{},
      sellNumTrend:{},
      tableColumn:[],
      serviceTypeList:[
        {
          value:-1,
          label:'全部'
        },
        {
          value:1,
          label:'两轮车'
        },
        {
          value:2,
          label:'保险'
        },
        {
          value:3,
          label:'酒水饮料'
        }
      ],
      businessType:-1,
      currentPage:1,
      pageSize:20,
      pageSizeList:[20, 30, 40, 50],
      sort:1,
      total:0
    }
  },
  components:{searchColumn,orderPie,orderLine},
  mounted(){
    this.$nextTick(()=>{
      this.search()
    })
  },
  computed:{
    currentTypeName(){
        return this.serviceTypeList.find(item=>item.value == this.businessType).name
    },
    gridList(){
      let arr = [{
            name:'销售总数量',
            value:'allCnt'
          },
          {
            name:'酒水饮料销售数量(瓶)',
            value:'drinkCnt',
          },
          {
            name:'保险销售数量(单)',
            value:'insureCnt',
          },
          {
            name:'两轮车销售数量(台)',
            value:'dogCartCnt',
          }]
      if (this.businessType == -1) {
        return arr
      } else if (this.businessType == 1){
        return [arr.find(item=>item.value == 'dogCartCnt')]
      } else if (this.businessType == 2){
        return [arr.find(item=>item.value == 'insureCnt')]
      } else if (this.businessType == 3){
        return [arr.find(item=>item.value == 'drinkCnt')]
      }
    }
  },
  methods:{
    thousandSeparator(num){
        var res = num && num.toString().replace(/\d+/, function (n) { // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                return $1 + ",";
            });
        })
        return res;
    },
    //页面切换触发事件
    handleCurrentChange() {
        //可手动触发表格更新
        let opt = {
            currentPage: this.currentPage, //翻页后页码
            pageSize: this.pageSize //当前每页条数
        };
        this.$nextTick(() => {
          this.getsalesProvinceTop(opt)
        });
    },
    // 每页条数切换,切换后页码跳转至第一页
    handleSizeChange(pageSize) {
        this.currentPage = 1;
        this.pageSize = pageSize;
        this.handleCurrentChange();
    },
    exportFile({ dateTime, relationId}){
      this.exportExcel()
    },
    businessTypeChange(e){
      let tableColumn = []
      if (e == 1) {
        tableColumn = tableColumnCar
      } else if(e == 2){
        tableColumn = tableColumnInsure
      } else if(e == 3){
        tableColumn = tableColumnDrink
      } 
      this.currentPage = 1,
      this.pageSize = 20
      this.salesProvinceTopData = []
      this.tableColumn = tableColumn
      this.$refs.salesNumTrend.clearChart()
    },
    exportExcel(){
      const op = 'salesExport';
      let data = {
          data: {
              body:{
                ...this.searchParms,
                businessType:this.businessType
              },
              currentPage:1,
              pageSize:100,
          },
          op,
      };
      let URL = this.$getModuleUrl(this.moduleName, op);
      this.$downFile(URL, data,{dataType:'json'}).then(res => {
        if (res.code == 200) {
          this.$baseMethod.exportFile(res, '省份排名导出.csv')
        }
      })
    },
    search(searchParms){
      this.searchParms = searchParms || this.searchParms
      this.getsalesMoneySum()
      this.getsalesNumTrend()
      this.getsalesSellerTop()
      if (this.searchParms.provinceCode == 0) {
        this.getsalesProvinceTop()
      }
      if (this.businessType != -1) {
        this.getsalesMoneyTrend()
      }
    },
    // 销售金额汇总
    getsalesMoneySum(){
      const op = 'salesMoneySum';
      let data = {
          data: {
              ...this.searchParms,
              businessType:this.businessType
          },
          op,
      };
      let URL = this.$getModuleUrl(this.moduleName, op);
      this.$axios(URL, data,{dataType:'json',successCode:200}).then(res => {
          if (res.code == 200) {
            this.salesMoneySumData = res.data
          }
        })
    },
    // 销售数量趋势图
   getsalesNumTrend(){
        const op = 'salesNumTrend';
        let data = {
            data: {
                ...this.searchParms,
                businessType:this.businessType
            },
            op,
        };
        let URL = this.$getModuleUrl(this.moduleName, op);
        this.$axios(URL, data,{dataType:'json',successCode:200}).then(res => {
          if (res.code == 200) {
            this.salesNumTrendData = res.data
          }
        })
    },
    // 销售人员业绩排名
    getsalesSellerTop() {
      const op = 'salesSellerTop';
      let data = {
          data: {
              ...this.searchParms,
              businessType:this.businessType
          },
          op,
      };
      let URL = this.$getModuleUrl(this.moduleName, op);
      this.$axios(URL, data,{dataType:'json',successCode:200}).then(res => {
        if (res.code == 200) {
          this.salesSellerTopData = res.data
        }
      })
    },
    // 销售排名分析
    getsalesProvinceTop(opt) {
      const op = 'salesProvinceTop';
      let data = {
          data: {
              body:{
                ...this.searchParms,
                businessType:this.businessType,
                sort:this.sort
              },
              currentPage:1,
              pageSize:20,
              ...opt
          },
          op,
      };
      let URL = this.$getModuleUrl(this.moduleName, op);
      this.$axios(URL, data,{dataType:'json',successCode:200}).then(res => {
        if (res.code == 200) {
          let data = res.data
          this.total = res.total || 0
          this.salesProvinceTopData = this.formatMoneyFields(data)
        }
      })
    },
    formatMoneyFields(data) {
      const formattedData = data.map(item => {
        const formattedItem = { ...item };
        for (const key in formattedItem) {
          if (key.endsWith("Money")) {
            formattedItem[key] = this.$baseMethod.regFenToYuan(formattedItem[key]);
          }
        }
        return formattedItem;
      });
      return formattedData;
    },
    // 销售金额趋势图
    getsalesMoneyTrend(){
      const op = 'salesMoneyTrend';
      let data = {
          data: {
              ...this.searchParms,
              businessType:this.businessType
          },
          op,
      };
      let URL = this.$getModuleUrl(this.moduleName, op);
      this.$axios(URL, data,{dataType:'json',successCode:200}).then(res => {
          if (res.code == 200) {
            this.salesMoneyTrendData = res.data
          }
        })
    },
    sortChange(e){
      this.currentPage = 1,
      this.pageSize = 20
      this.sort = e.order == 'ascending' ? 0 : 1
      this.getsalesProvinceTop()
    }
  }
}
</script>

<style lang="scss" scoped>
.sellPerformance{
  .sellPerformance-content {
    background: #fff;
    padding:24px;
    border-radius: 8px;
  }
  .allType{
    margin-top: 32px;
  }
  /deep/ .el-table{
    border-radius: 8px;
  }
  .pagination{
    margin: 20px 0;
  }
  .flex-row {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background: #F5F7FA;
    height: 108px;
    width: 100%;
    margin: 16px 0;
    .grid-content {
        // background: #F5F7FA;
        border-radius: 8px;
        border-right: 1px solid #EBEEF5;
        // height: 154px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 58px;
        padding: 24px;
        width: 50%;
        .num {
            font-size: 48px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #303133;
            line-height: 1;
            margin-top: 12px;
        }
    }
  }
  .salesSellerTop{
    border:1px solid #EBEEF5;
    padding: 24px 18px;
    border-radius: 8px;
    margin:32px 0;
    span {
      font-weight: 600;
      color: #303133;
      font-size: 18px;
    }
  }
}

</style>