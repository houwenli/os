<template>
    <div class="settle-payCompang-list">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>实时订单</el-breadcrumb-item>
        </el-breadcrumb>
        <ws-table-el ref="table" v-bind="tableConfig" :total="10" :data='tableList'>
            <template #search>
                <search-group>
                    <label for>订单号：</label>
                    <el-input v-model.trim="searchOptions.orderId" placeholder="请输入订单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>车主ID：</label>
                    <el-input v-model.trim="searchOptions.driverId" placeholder="请输入车主ID" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>商户订单号：</label>
                    <el-input v-model.trim="searchOptions.outTradeNo" placeholder="请输入商户订单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>交易订单号：</label>
                    <el-input v-model.trim="searchOptions.tradeNo" placeholder="请输入交易订单号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>乘客账号：</label>
                    <el-input v-model.trim="searchOptions.passengerPhone" placeholder="请输入乘客账号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>车主账号：</label>
                    <el-input v-model.trim="searchOptions.driverPhone" placeholder="请输入车主账号" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>订单服务类型：</label>
                    <el-select v-model="searchOptions.requestRideType" filterable clearable placeholder="请选择">
                        <el-option v-for="item in businessTypes" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label class="seach-label" for>订单所属机构：</label>
                    <ws-organization style="display:inline-block"  valueKey="agencyNumber" v-model="searchOptions.agencyNumber"></ws-organization>
                </search-group>
                <search-group>
                    <label for>订单状态：</label>
                    <el-select v-model="searchOptions.status" filterable clearable placeholder="请选择">
                        <el-option v-for="item in instantOrder20" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>订单类型：</label>
                    <el-select v-model="searchOptions.orderType" filterable clearable placeholder="请选择">
                        <el-option v-for="item in ordinaryTypesFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>渠道ID：</label>
                    <el-input v-model.trim="searchOptions.channelId" placeholder="请输入渠道ID" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>渠道类型：</label>
                    <el-select v-model="searchOptions.channelType" filterable clearable placeholder="请选择">
                        <el-option v-for="item in channelTypesFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>支付方式：</label>
                    <el-select v-model="searchOptions.payType" filterable clearable placeholder="请选择">
                        <el-option v-for="item in ordinaryPayMethodFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>所属运力商：</label>
                    <el-select v-model="searchOptions.rideChannelId" clearable placeholder="请选择" filterable>
                        <el-option v-for="item in rideChannelListFilters" :key="item.rideChannelId" :label="item.rideChannelName" :value="item.rideChannelId"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <label for>下单时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.createStartTime" :endTime.sync="searchOptions.createEndTime" :intervalTime='180'></ws-date-range>
                </search-group>
                <search-group>
                    <label for>支付时间：</label>
                    <ws-date-range :startTime.sync="searchOptions.payStartTime" :endTime.sync="searchOptions.payEndTime" :intervalTime='180'></ws-date-range>
                </search-group>
                <search-group>
                    <label for>车主ID：</label>
                    <el-input v-model.trim="searchOptions.driverPhone" placeholder="请输入车主ID" clearable></el-input>
                </search-group>
                <search-group>
                    <label for>订单标签：</label>
                    <el-select v-model="searchOptions.orderChannel" clearable placeholder="请选择" filterable>
                        <el-option v-for="item in realtimeorderFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group>
                <!-- <search-group>
                    <label for>风控标签：</label>
                    <el-select v-model="searchOptions.riskControlLabel" clearable placeholder="请选择">
                        <el-option v-for="item in [{id: 1,value: '偏航订单'}]" :key="item.id" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                </search-group> -->
                <search-group>
                    <label for>服务场景：</label>
                    <el-select v-model="searchOptions.scenesType" clearable placeholder="请选择">
                        <el-option v-for="item in scenesArr" :key="item.scenesType" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </search-group>
                <search-group>
                    <el-button-group v-if="powerList.list">
                        <ws-enter-event>
                            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                        </ws-enter-event>
                        <ws-throttle>
                            <el-button type="primary" class="resetBtn" @click="reset" icon="el-icon-refresh-left"></el-button>
                        </ws-throttle>
                    </el-button-group>
                     <ws-throttle>
                        <el-button style="margin-left: 20px;" v-if="powerList.export"   @click="fileExport" plain>导出</el-button>
                    </ws-throttle>
                </search-group>
            </template>
            <template>
                <ws-table-column-el align="center" prop="orderId" label="订单号" width="170"></ws-table-column-el>
                <ws-table-column-el align="center" prop="rideChannelName" label="所属运力商">
                    <template slot-scope="scope">
                        {{scope.row.rideChannelName || '-'}}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="requestRideType"  label="订单服务类型"></ws-table-column-el>
                <ws-table-column-el align="center" prop="orderType" label="订单类型">
                    <template slot-scope="scope">
                        {{scope.row.orderType |ordinaryTypesFilters}}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="createTime" label="下单时间" width="170"></ws-table-column-el>
                <ws-table-column-el align="center" prop="passengerPhone" label="乘客账号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverPhone" label="车主账号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverName" label="车主姓名"></ws-table-column-el>
                <ws-table-column-el align="center" prop="carNum" label="车牌号"></ws-table-column-el>
                <ws-table-column-el align="center" prop="driverId" label="车主ID">
                     <template slot-scope="scope">
                       {{scope.row.driverId || '-'}}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="cityName" label="订单起点城市"></ws-table-column-el>
                <ws-table-column-el align="center" prop="startAddr" label="起点" width="200"></ws-table-column-el>
                <ws-table-column-el align="center" prop="endAddr" label="终点" width="200"></ws-table-column-el>
                <ws-table-column-el align="center" prop="statusName" label="订单状态"></ws-table-column-el>
                <ws-table-column-el align="center" prop="payTime" label="支付时间"></ws-table-column-el>
                <ws-table-column-el align="center" prop="scenesType" label="服务场景">
                    <template slot-scope="scope">
                        {{scope.row.scenesType == 2 ? '接机': (scope.row.scenesType == 3 ? '送机': '--')}}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="orderPrice" label="订单金额(元)">
                    <template slot-scope="scope">
                        {{scope.row.orderPrice | regFenToYuan}}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="discountPrice" label="优惠金额(元)">
                    <template slot-scope="scope">
                        {{scope.row.discountPrice | regFenToYuan}}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="realPayPrice" label="实付金额(元)">
                    <template slot-scope="scope">
                        {{scope.row.realPayPrice | regFenToYuan}}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="orgName" label="订单所属机构" width="200">
                    <template slot-scope="scope">
                        {{scope.row.orgName || '-'}}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center" prop="channelType" label="渠道类型">
                     <template slot-scope="scope">
                        {{scope.row.channelType|channelTypesFilters}}
                    </template>
                </ws-table-column-el>
                <ws-table-column-el align="center"  label="操作">
                     <template slot-scope="scope">
                        <el-button type="text" v-if="powerList.selectDetail||powerList.selectExpOrderCost||powerList.selectMapInfo||powerList.selectDetails" @click="enterForm(scope.row)" style="color:#0088ff;">详情</el-button>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {

        data(){
            return{
                searchOptions:{
                    orderId: '',
                    outTradeNo: '',
                    tradeNo: '',
                    passengerPhone:'',
                    driverPhone: '',
                    requestRideType:'',
                    agencyNumber: '',
                    status: '',
                    orderType:'',
                    channelId:'',
                    channelType:'',
                    payType: '',
                    createStartTime: this.$baseMethod.getBeforeDay(-1,'yyyy-MM-dd 00:00:00'),
                    createEndTime:this.$baseMethod.getBeforeDay(0,'yyyy-MM-dd 23:59:59'),
                    payStartTime: '',
                    payEndTime: '',
                    rideChannelId: '',
                    driverId: '', // 车主ID
                    scenesType: '',
                    orderChannel:null
                    // riskControlLabel:''
                },
                rideChannelListFilters: [],
                scenesArr: [{label: '接机',value: 2},{label: '送机', value: 3}],
                orderId:'',
                startSource: '',
                endSource: '',
                firstTime: '',
                lastTime: '',
                tableList: [],
                transportList: [],
                tableConfig: {
                    loading:true,
                    pageId: 'orderId',
                    lazyQuery: {
                        immediate:true,
                        moduleName: '/order/real-time',
                        op: {
                            selectList: 'list',
                            // selectCount: 'count'
                        },
                        beforeQuery: this.beforeQuery,
                        afterQuery: this.afterQuery
                    },
                    hideColumnList:[
                        '车主姓名',
                        '车牌号',
                        '订单起点城市',
                        '支付时间',
                        '订单金额',
                        '优惠金额(元)',
                        '订单金额(元)',
                        '实付金额(元)',
                        '订单所属机构',
                        '渠道类型',
                        '渠道名称',
                        '渠道ID',
                    ],
                    topFixedRange: 55
                },
                moduleName: '/order/real-time',
                op: {
                    fileExport: 'export'
                },
                isfirstFlag:true
            }
        },
        computed: {
             ...mapGetters('order', [
                'ordinaryTypesFilters',
                'ordinaryPayMethodFilters',
                'channelTypesFilters',
                'businessTypes',
                'instantOrder20',
                'realtimeorderFilters',
                'orderLaberFilters'
            ]),
        },
        mounted() {
            this.getCapacityInfo().then(res=>{
                this.rideChannelListFilters = res
            })
            let driverAccount = this.$route.query.driverAccount || this.$route.query.driverPhone || '';
            if (driverAccount) {
                this.searchOptions.driverPhone = driverAccount
                let dateTime = new Date()
                let startTime=dateTime.getTime()-24*60*60*1000
                this.searchOptions.createStartTime =  this.$baseMethod.formatData(startTime,'yyyy-MM-dd hh:mm:ss')
                this.searchOptions.createEndTime =  this.$baseMethod.formatData(dateTime,'yyyy-MM-dd hh:mm:ss')
                this.search();
            }
        },
        methods:{
            ...mapActions([
                'getOrgOptionList',
            ]),
            ...mapActions('order',[
                'getCapacityInfo'
            ]),
            lazyLoad(node, resolve) {
                let item = node.data;
				this.getOrgOptionList(item || {}).then(item => {
					resolve(item)
				});
			},

            search(){
                let reg = /^[0-9]*$/
                if (!reg.test(this.searchOptions.driverId)) {
                    this.$message.error('请输入正确的车主ID')
                    return
                }
                this.startSource = '';
                this.endSource = '';
                this.firstTime = '';
                this.lastTime = '';
                this.tableList = []
                if(!this.checkData())  return
                this.$refs.table.search()
            },
            checkData() {
                if (!this.searchOptions.orderId && !this.searchOptions.outTradeNo && !this.searchOptions.tradeNo && !this.searchOptions.passengerPhone && !this.searchOptions.driverPhone &&
                (!this.searchOptions.createStartTime) && (!this.searchOptions.payStartTime || !this.searchOptions.payEndTime)) {
                    this.$message.warning('请输入订单号、乘客信息、下单时间、支付时间或车主信息进行查询');
                    return false
                }
                return this.checkChannelId()
            },
            reset(){
                this.searchOptions = {
                    orderId: '',
                    outTradeNo: '',
                    tradeNo: '',
                    passengerPhone:'',
                    driverPhone: '',
                    requestRideType:'',
                    agencyNumber: '',
                    status: '',
                    orderType:'',
                    channelId:'',
                    channelType:'',
                    payType: '',
                    createStartTime: this.$baseMethod.getBeforeDay(-1,'yyyy-MM-dd 00:00:00'),
                    createEndTime: this.$baseMethod.getBeforeDay(0,'yyyy-MM-dd 23:59:59'),

                    payStartTime: '',
                    driverId: '',
                    payEndTime: '',
                    orderChannel:null
                }
                this.search();
            },
            beforeQuery(){
                this.searchOptions.startSource = this.startSource
                this.searchOptions.endSource = this.endSource
                this.searchOptions.firstTime = this.firstTime
                this.searchOptions.lastTime = this.lastTime
                let routerQurey = this.$route.params;
                if (routerQurey.type && routerQurey.type == 1 && this.isfirstFlag) {
                    this.isfirstFlag = false
                    this.searchOptions.createStartTime = `${this.$baseMethod.formatData(new Date(), 'yyyy-MM-dd')} 00:00:00`;
                    this.searchOptions.createEndTime = `${this.$baseMethod.formatData(new Date(), 'yyyy-MM-dd')} 23:59:59`;
                }
                return {
                    ...this.searchOptions
                }
            },
            afterQuery(data){
                let list = data.body
                this.startSource = list.length? list[0].startSource : null;
                this.endSource = list.length? list[list.length - 1].endSource : null;
                this.firstTime = list.length? list[0].createTime : null;
                this.lastTime = list.length? list[list.length - 1].createTime : null;
                return data
            },
            enterForm(row){
                let query = {
                    orderId: row.orderId
                }
                this.$router.refresh({ name: 'realTimeForm', query });
            },
            fileExport(){
                if(!this.checkChannelId())  return
                let param = {
                    data: this.searchOptions,
                    op: this.op.fileExport
                }
                this.$axios(this.powerList[param.op], param).then(res => {
                    this.$message.success('导出中，请稍后到文件中心下载！');
                })
            },
             getModuleUrl (op) {
                return this.$getModuleUrl(this.moduleName, op);
            },
        }
    }
</script>
