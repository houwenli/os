<template>
  	<div class="orderMap">
		  <div class="map-wrap">
			<div class="map-content" style="height:100%;width: 100%;" id="map-content" ref="mapElement"></div>
			<div>
				<el-drawer :modal="false"
					size="347" custom-class="drawerClass" style="position:absolute;z-index:999" :visible.sync="drawer" :direction="direction" :show-close = 'false' :before-close="handleClose">
					<div class="drawerBox">
						<div class="infoBox">
							<div class="title">
								<span>订单信息</span>
								<img class="colseBtn" @click="storeClose" src="../../../../assets/images/orderMap/colseBtn.png" alt="">
							</div>
							<div class="contBox">
								<div class="label">
									<span class="labelTit">订单号：</span>
									<span>{{orderInfo.orderNo||''}}</span>
								</div>
								<div class="label">
									<span class="labelTit">下单时间：</span>
									<span>{{orderInfo.createTime||''}}</span>
								</div>
								<div class="label" v-if="orderInfo.orderType==21">
									<span class="labelTit">预约出发时间：</span>
									<span>{{orderInfo.reserveStartTime||''}}</span>
								</div>
								<div class="label">
									<span class="labelTit">订单类型：</span>
									<span>{{orderType[orderInfo.orderType]||''}}</span>
								</div>
								<div class="label">
									<span class="labelTit">起点城市：</span>
									<span>{{orderInfo.startCity||''}}</span>
								</div>
								<div class="label">
									<span class="labelTit">订单起点：</span>
									<span>{{orderInfo.startAddr||''}}</span>
								</div>
								<div class="label">
									<span class="labelTit">订单终点：</span>
									<span>{{orderInfo.endAddr||''}}</span>
								</div>
								<div class="label">
									<span class="labelTit">订单状态：</span>
									<span>{{orderInfo.statusName||''}}</span>
								</div>
								<template v-if="orderInfo.orderType!=40">
									<div class="label">
										<span class="labelTit">预估时长：</span>
										<span>{{orderInfo.estimateTime|fixTime}}</span>
									</div>
									<div class="label">
										<span class="labelTit">预估价格：</span>
											<span>{{orderInfo.estimatePrice|price}}</span>
									</div>
									<div class="label">
										<span class="labelTit">预估里程：</span>
										<span>{{orderInfo.estimateDistance|convertToKm}}</span>
									</div>
								</template>
								<div class="label">
									<span class="labelTit">乘客电话：</span>
									<span>{{orderInfo.passengerPhone||''}}</span>
								</div>
							</div>
						</div>
						<div class="infoBox" style="margin-top:20px" v-if="orderInfo.status!==0">
							<div class="title">
								<span>司机信息</span>
							</div>
							<div class="contBox">
								<div class="label">
									<span class="labelTit">司机姓名：</span>
									<span>{{driverName||'--'}}</span>
								</div>
								<div class="label">
									<span class="labelTit">司机手机号：</span>
									<span>{{driverPhone||'--'}}</span>
								</div>
								<div class="label">
									<span class="labelTit">车牌号：</span>
									<span>{{driverPlate||'--'}}</span>
								</div>
								<div class="label" style="display:flex">
									<span class="labelTit">归属机构：</span>
									<span style="width:230px;display:inlinde-block">{{company||'--'}}</span>
								</div>
								<div class="label" style="display:flex">
									<span class="labelTit" style="visibility:hidden">归属机构：</span>
									<span style="width:230px;display:inlinde-block">{{serviceCenter||'--'}}</span>
								</div>
								<div class="label" style="display:flex" >
									<span class="labelTit" style="visibility:hidden">归属机构：</span>
									<span style="width:230px;display:inlinde-block">{{serviceStation||'--'}}</span>
								</div>
							</div>
						</div>
					</div>
				</el-drawer>
			</div>
			<div class="refreshBtn goBack">
                <ws-enter-event>
                    <el-button type="primary" @click="isEncrypt = !isEncrypt" :plain="!isEncrypt">{{isEncrypt?'解密':'加密'}}</el-button>
                </ws-enter-event>
				<el-button class="button" style="margin-left: 10px" type="primary" @click="$router.push({path:moduleName})">返回</el-button>
			</div>
			<div class="mapBox">
				<div class="mapMarker">
					<div class="btnBox">
						<div class="refreshBtn">
							<ws-throttle>
								<el-button v-if="flag" type="primary" @click="refresh()">刷新</el-button>
								<el-button v-else style="background: #909399;color:#fff" type="primary">刷新</el-button>
							</ws-throttle>
						</div>
						<div class="mapColor">
							<div class="labelText">地图颜色：</div>
							<el-radio-group v-model="colorTal" @change="colorTalChange">
								<el-radio :label="true">深色模式</el-radio>
								<el-radio :label="false">浅色模式</el-radio>
							</el-radio-group>
							<!-- <span class="timeBox">图中只显示<span class="time">{{nowDate}} {{nowTime}}-{{nowEndTime}}</span>内下单的订单</span> -->
						</div>
					</div>
					<el-checkbox-group v-model="searchOptions.stateCode" :min="1" :max="2" @change="checkboxChange">
						<div class="markerBox">
							订单状态：
							<el-checkbox :label="1">未接单</el-checkbox>
							<el-checkbox :label="2">已接单</el-checkbox>
						</div>
					</el-checkbox-group>
					<el-checkbox-group v-model="searchOptions.orderTypes" :min="1" @change="checkboxChange">
						<div class="markerBox">
							订单类型：
							<el-checkbox :label="20">
								<div class="markerItme">
									<div class="markerTit">实时订单</div>
									<img class="jMarkerImg" src="../../../../assets/images/orderMap/shiOrder.png" alt="">
								</div>
							</el-checkbox>
							<el-checkbox :label="21">
								<div class="markerItme">
									<div class="markerTit">预约订单</div>
									<img class="jMarkerImg" src="../../../../assets/images/orderMap/yuOrder.png" alt="">
								</div>
							</el-checkbox>
							<el-checkbox :label="70">
								<div class="markerItme">
									<div class="markerTit">包车订单</div>
									<img class="jMarkerImg" src="../../../../assets/images/orderMap/baoOrder.png" alt="">
								</div>
							</el-checkbox>
							<el-checkbox :label="40">
								<div class="markerItme">
									<div class="markerTit">拼车订单</div>
									<img class="jMarkerImg" src="../../../../assets/images/orderMap/pinOrder.png" alt="">
								</div>
							</el-checkbox>
							<el-checkbox :label="22">
								<div class="markerItme">
									<div class="markerTit">扫码订单</div>
									<img class="jMarkerImg" src="../../../../assets/images/orderMap/saoOrder.png" alt="">
								</div>
							</el-checkbox>
						</div>
					</el-checkbox-group>
					<div class="markerBox">
						当前定位城市：{{ $route.query.city }}
					</div>
				</div>
				<!-- <img @click="setMapCenter" :style="{top:radioTal==1?450+'px':500+'px'}" class="setCenter" src="../../../assets/images/setCenter.png" alt=""> -->
			</div>
			<div class="searchBox">
				<div class="searchDate">
					<span class="dateLabel">选择时间：</span>
					<el-date-picker :editable="false" :clearable="false" v-model="dateTime" @blur="blur" @change="dateChange" @focus="dateFocus" :type="dateType" ref="picker" placeholder="选择日期时间" align="left"
						:format="formatDate" popper-class="hide_time" :key="dateType" :picker-options="pickerOptions"></el-date-picker>
					<order-player :disabled="disabled" :marksGap="marksGap" :getPoints="getPoints" ref="orderPlay" v-model="playVal" :startTime="startTime" :endTime="endTime" @change="handleChange" :step="step"></order-player>
				</div>
			</div>
		</div>
		<!-- <div @click="toFullMap">点击</div> -->
	</div>
</template>

<script>
let response = false
import orderPlayer from '../components/orderPlayer'
const receiveMap = {
	'1': 'N',
	'2': 'Y',
	'1,2': 'ALL',
	'2,1': 'ALL',
}
export default {
    name: 'offLineCityMap',
	components:{orderPlayer},
    data() {
		let self = this
      	return {
      	  	isEncrypt: true, // 数据加密
			drawer: false,
			searchOptions:{
				cityCode:'',
				startTime:self.timeTo(new Date(),'yyyy-MM-dd') + ' 00:00:00',
				endTime:self.timeTo(new Date(),'yyyy-MM-dd hh',':00:00'),
				stateCode: [1,2],
				orderTypes: [20, 21, 22, 40, 70]
			},
			op: {
				detail: 'detail',
      	      encryptDetail: 'encryptDetail', // 敏感详情
				list: 'list',
				orgInfo:'orgInfo',
				driverInfo:'driverInfo',
      	      encryptDriverInfo: 'encryptDriverInfo'  // 敏感详情
			},
			dateTime:new Date(),
			playVal:'',
			nowDate:'',
			nowTime:'',
			nowEndTime:'',
			startTime:self.timeTo(new Date(),'yyyy-MM-dd',' 00:00:00'),//开始时间
			endTime:self.timeTo(new Date(),'yyyy-MM-dd hh',':00:00'),//结束时间
			dateType:'date',//时间组件类型
			formatDate:'yyyy-MM-dd',
			step:1,//时间间隔
			moduleName: '/workbench/orderMap/offLine',
			map: null,
			disabled:true,
			direction: 'rtl',
			driverInfo:{},
			orderInfo:{},
			queryData:{},
			flag:true,
			colorTal:true,
			routerChange:this.$route,
			mapHeight:880,
			mapStyle:true,
			resData:{},
			readonly:false,
			massMarksStyle:[
				{
					url:require('../../../../assets/images/orderMap/shiOrder.png'),
					anchor: new AMap.Pixel(25, 35),
					size: new AMap.Size(25, 35)
				},
				{
					url:require('../../../../assets/images/orderMap/yuOrder.png'),
					anchor: new AMap.Pixel(25, 35),
					size: new AMap.Size(25, 35)
				},
				{
					url:require('../../../../assets/images/orderMap/saoOrder.png'),
					anchor: new AMap.Pixel(25, 35),
					size: new AMap.Size(25, 35)
				},
				{
					url:require('../../../../assets/images/orderMap/baoOrder.png'),
					anchor: new AMap.Pixel(25, 35),
					size: new AMap.Size(25, 35)
				},
				{
					url:require('../../../../assets/images/orderMap/pinOrder.png'),
					anchor: new AMap.Pixel(25, 35),
					size: new AMap.Size(25, 35)
				},
			],
			orderType:{
				'20':'实时',
				'21':'预约',
				'22':'扫码',
				'40':'拼车',
				'70':'包车'
			},
			orderCode:{
				'1':'未接单',
				'2':'已接单'
			},
			pickerOptions:{},
			pickerOptions1: {
				disabledDate:this.disabledDate,
      	    	shortcuts: [{
					text: '按日期选择',
					onClick(picker) {
						self.changeDate('date')
						self.formatDate='yyyy-MM-dd'
					}
				}, {
					text: '按时间选择',
					onClick(picker) {
						self.changeDate('datetime')
						self.formatDate='yyyy-MM-dd HH'
					}
      	    	}],
				selectableRange:self.selectRange()
      	  	},
			pickerOptions2: {
				disabledDate:this.disabledDate,
      	    	shortcuts: [{
					text: '按日期选择',
					onClick(picker) {
						self.changeDate('date')
						self.formatDate='yyyy-MM-dd'
						self.$refs.orderPlay.reset()
					}
				}, {
					text: '按时间选择',
					onClick(picker) {
						self.changeDate('datetime')
						self.formatDate='yyyy-MM-dd HH'
						self.$refs.orderPlay.reset()
					}
      	    	}],
				selectableRange:"00:00:00-23:00:00"
      	  	},
			company:'',
			serviceCenter:'',
			serviceStation:'',
			// stateCode:1,
			driverName:'',
			driverPhone:'',
			driverPlate:'',
			timer: null
      	}
	},
	computed: {
		marksGap() {
			return {
				'date': 60,
				'datetime': 5
			}[this.dateType]
		}
	},
	watch:{
		dateTime:{
			handler(val,oldVal){
				this.nowDate = this.timeTo(val,'yyyy-MM-dd')
				let isToday = this.isToday()
				if(this.dateType=='date'){
					this.startTime = this.nowDate+" 00:00:00"
					this.endTime=isToday?this.nowDate+" "+(this.timeTo(new Date(),'hh')||'00')+':00:00':this.nowDate+" "+"23:59:59"
				}else{
					let hours = this.timeTo(val,'hh')
					this.startTime = this.nowDate+" "+(hours||'00')+":00:00"
					this.endTime=hours=='23'?this.nowDate+' 23:59:59':this.$baseMethod.formatData(new Date((new Date(this.startTime)).getTime()+60*60*1000),'yyyy-MM-dd hh:mm:ss')
				}
				this.playVal=this.nowDate+' 00:00:00'//开始时间
				this.searchOptions.startTime = this.startTime
				this.searchOptions.endTime = this.endTime
				// if(val!=oldVal){
					// 重置播放器
					this.$refs.orderPlay.reset()

				// }
				this.pickerOptions1.selectableRange=this.selectRange()
				// 如果是当天小时到系统时间当前小时
				this.pickerOptions = isToday?this.pickerOptions1:this.pickerOptions2
			}
		},
		drawer:function(val,oldVal){
			if (val==true) {
				this.pause()
			}
		},
		'$route'(to,from){
          	const that = this
          	if(to.path == '/workbench/orderMap/offLine/city'){
				that.drawer= false
				that.reset()
          	  	that.createHandle()
          	}
        },
		resData:{
			handler(newValue,oldValue){
				this.setDisbled(newValue)
			},
			deep: true
        }
	},
    filters:{
		convertToKm:(distance)=>{
			if(distance===0){
				return 0+'km'
			}
			if (distance===''||distance==null) {
				return ''
			}
			distance = distance / 1000
			return distance.toFixed(2)+'km';
		},
		fixTime:(time) => {
			if(time===0){
				return 0+'分'
			}
			if (time===''||time==null) {
				return ''
			}
			time = time / 60;
			if (time >= 60) {
				const m = time % 60;
				return parseInt(time / 60) + "时" + (m == 0 ? "" : m.toFixed(0) + "分")
			} else {
				return time.toFixed(0) + "分";
			}
		},
		price:(price) => {
			if(price===0){
				return 0+'元'
			}
			if(price===''||price==null){
				return ''
			}
			return price ? (price / 100).toFixed(2)+'元' : 0+'元'
		},
		thousandSeparator: function (num){
			var num = (num || 0).toString(), re = /\d{3}$/, result = '';
			while ( re.test(num) ) {
				result = RegExp.lastMatch + result;
				if (num !== RegExp.lastMatch) {
					result = ',' + result;
					num = RegExp.leftContext;
				} else {
					num = '';
					break;
				}
			}
			if (num) { result = num + result; }
			return result;
		},
    },
    methods: {
		// toFullMap(){
		// 	window.open('/order/orderMap/provinceMap/fullMap?lng=114.085947&lat=22.547&areaCode=440300', '_blank')
		// },
		selectRange(){
			return "00:00:00 -"+this.timeTo(new Date(new Date().getTime()),'hh:mm:ss')
		},
		setDisbled(val){
			if(Object.keys(val).length){
				this.disabled = false
			}else{
				this.disabled = true
			}
		},
		checkboxChange(e){
			this.$refs.orderPlay.reset()
			this.resData = {}
		},
		blur(){
			let isDateTime = false
			if (!this.dateTime) {
				this.dateTime = new Date()
				let hh = this.timeTo(this.dateTime,'hh')
				this.nowDate = this.timeTo(new Date(),'yyyy-MM-dd')
				this.dateTime = this.isToday()&&hh!='00'?this.startHM(new Date(this.dateTime),60,'yyyy-MM-dd hh:mm:ss'):new Date()
				isDateTime = true
			}
			this.dateTime = this.timeTo(this.dateTime,'yyyy-MM-dd hh',':00:00')
			let hours = this.timeTo(this.dateTime,'hh:mm')
			if(this.dateType=='datetime'){
				// let datetimeH = this.timeTo(this.dateTime,'hh')
				// let nowH = this.timeTo(new Date(),'hh')
				this.formatDate = 'yyyy-MM-dd HH:mm:ss'
				// if (this.isToday()) {
				// 	if(nowH==datetimeH) {
				// 		this.dateTime = datetimeH!='00'?this.startHM(new Date(this.dateTime),60,'yyyy-MM-dd hh:mm:ss'):new Date()
				// 	}else if(parseInt(datetimeH)>parseInt(nowH)){
				// 		this.dateTime = this.startHM(new Date(),60,'yyyy-MM-dd hh')+':00:00'
				// 	}
				// }
			}
			this.getTime(hours,isDateTime)
			this.resData = {}
		},
		dateChange(){
			if(this.dateType=='datetime'){
				this.formatDate = 'yyyy-MM-dd HH:mm:ss'
			}
		},
		dateFocus(){
			if(this.dateType=='datetime'){
				this.formatDate = 'yyyy-MM-dd HH'
			}
			this.pause()
		},
		// 暂停
		pause(){
			this.$refs.orderPlay.pause()
		},
		play(){
			this.$refs.orderPlay.play()
		},
		// 判断选择时间是否为当天
		isToday(val){
			return this.nowDate==this.timeTo(new Date(),'yyyy-MM-dd')
		},
		// 设置不可选时间
		disabledDate(date){
			let minTime =date.getTime() < Date.now() - 4 * 24 * 60 * 60 * 1000
			return minTime||date.getTime()>=Date.now()
		},
		getSeconds(date) {
            return new Date(date).getTime();
        },
		handleChange(e){
			if(e.indexOf("NaN")!=-1) return false;
			let timeH = this.timeTo(e,'hh:mm'),
				timeS = this.getSeconds(e);
			this.getTime(timeH)
			this.setMapData(timeS)
		},
		setMapData(val){
			// let key = val=='23:59'?'24:00':val
			// let mapData = key==this.timeTo(this.startTime,'hh:mm')?[]:this.resData[key]
			let mapData = this.resData[val] || []
			this.massMarks&&this.massMarks.clear()
			mapData&&mapData.map((item)=>{
				item.lnglat = [item.startLon,item.startLat]
				if (item.orderType==20) {//已接实时
					item.style = 0
				}else if(item.orderType==21){//预约
					item.style = 1
				}else if(item.orderType==22){//扫码
					item.style = 2
				}else if(item.orderType==70){//包车
					item.style = 3
				}else if(item.orderType==40){//拼车
					item.style = 4
				}
			})
			this.massMarks.setData(mapData);
		},
		changeDate(type){
			this.dateType = type
			this.dateTime = '' //清空选择，否则切换会报错
			this.$nextTick(() => {
				this.$refs.picker.focus()
			})
		},
		storeClose(){
			this.drawer = false
			// this.play()
		},
		handleClose(done) {
			done();
			// this.play()
		},
		reset(){
			let that = this
			// 重置播放器
			that.$refs.orderPlay.reset()
			that.pickerOptions = that.pickerOptions1
			that.searchOptions={
				cityCode:'',
				startTime:that.timeTo(new Date(),'yyyy-MM-dd') + ' 00:00:00',
				endTime:that.timeTo(new Date(),'yyyy-MM-dd hh',':00:00'),
				stateCode: that.searchOptions.stateCode,
				orderTypes: [20, 21, 22, 40, 70]
			}
			that.dateTime=new Date()
			that.playVal=''
			// that.nowDate=''
			that.nowTime='00:00'
			that.nowEndTime='00:00'
			that.startTime=that.timeTo(new Date(),'yyyy-MM-dd',' 00:00:00')
			that.endTime=that.timeTo(new Date(),'yyyy-MM-dd hh',':00:00')//结束时间
			that.dateType='date'//时间组件类型
			that.formatDate='yyyy-MM-dd'
		},
		refresh(){
			let that = this
			that.reset()
			// that.getPoints(true)
		},
		setMapCenter(){
			let {lng,lat} = this.queryData
			if (lng &&lat) {
				let mapCenter = new AMap.LngLat(lng,lat)
				this.map.setCenter(mapCenter);
				this.map.setZoom('12')
			}
		},
		colorTalChange(e){
			this.colorTal = e
			this.map.setMapStyle(this.colorTal?"amap://styles/998f25903ebf671b4f4ea6c5645a5791":'amap://styles/b265c2b3c5dc85d44e1fcedeac037ead')
		},
		getModuleUrl (op) {
			return this.$getModuleUrl(this.moduleName, op);
		},
		deepClone(obj){
			var type = Object.prototype.toString.call(obj);  //通过原型对象获取对象类型
			var newObj;
			if(type ==='[object Array]'){
				//数组
				newObj =[];
				if(obj.length >0){
					for(var x=0;x<obj.length;x++){
						newObj.push(this.deepClone(obj[x]));
					}
				}
			}else if(type==='[object Object]'){
				//对象
				newObj = {};
				for(var x in obj) {
					newObj[x] = this.deepClone(obj[x]);
				}
			}else{
				//基本类型和方法可以直接赋值
				newObj = obj;
			}
			return newObj;
		},
		addFirst(arr, item) {
			return [item].concat(arr);
		},
		// 获取订单数据
		async getPoints() {
			// let that = this
			const loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
			this.massMarks&&this.massMarks.clear()
			let searchOptions = this.deepClone(this.searchOptions)
			searchOptions.cityCode = this.queryData.adcode
			searchOptions.isReceived = receiveMap[searchOptions.stateCode.join()]
			delete searchOptions.stateCode
			let data = {
				data: JSON.stringify(searchOptions),
				op: this.op.list
			}
			let url = this.getModuleUrl(this.op.list)
			await this.$axios(url, data, {timeout: 30000}).then(res => {
				const resData = JSON.parse(res.data);
				let data = {};
				resData.forEach(item => {
					data[item.frameStart] = item.orderList
				})
				this.resData = data;
				// searchOptions.queryType==3&&this.setMapData('0')
				response = true;
			}).finally(() => {
				loading.close();
			})
			return response
		},
		// 地图开始拖拽
		showInfoDragstart(e){
			this.pause()
		},
		async getOrderInfo(data){
			this.drawer = true
			await this.getOrderData(data)
			this.getDriverData(this.orderInfo)
			this.getOrgData(this.orderInfo)
		},
		// 获取机构信息
		getOrgData(inData){
			this.company =  ''
			this.serviceCenter =  ''
			this.serviceStation =  ''
			if (inData.status === 0) return false
			if (this.orderInfo.driverId) {
				let reqData = {
					data: {agencyNumber:inData.agencyNumber},
					op: this.op.orgInfo
				};
				let url = this.getModuleUrl(this.op.orgInfo)
				this.$axios(url, reqData).then(res => {
					let resData = JSON.parse(res.data);
					this.company = resData.company
					this.serviceCenter = resData.serviceCenter
					this.serviceStation = resData.serviceStation
				});
			}
		},
		// 获取司机信息
		getDriverData(inData){
			this.driverName = ''
			this.driverPhone = ''
			this.driverPlate = ''
			// this.stateCode=inData.stateCode
			if (inData.status === 0) return false
			if (this.orderInfo.driverId) {
				let reqData = {
					data: {driverId:inData.driverId},
					op: {'false': this.op.encryptDriverInfo,'true': this.op.driverInfo}[this.isEncrypt+'']
				};
				let url = this.getModuleUrl(this.op.driverInfo)
				this.$axios(url, reqData).then(res => {
					let resData = JSON.parse(res.data);
					this.driverName = resData.driverName
					this.driverPhone = resData.driverPhone
					this.driverPlate = resData.driverPlate
				})
			}
		},
		// 获取订单信息
		async getOrderData(inData){
			this.orderInfo ={}
			let reqData = {
				data: {
					orderNo:inData.orderId
				},
				op: {'false': this.op.encryptDetail,'true': this.op.detail}[this.isEncrypt+''],
			};
			let url = this.getModuleUrl(this.op.detail)
			await this.$axios(url, reqData).then(res => {
				let resData = JSON.parse(res.data);
				resData.stateCode = inData.stateCode
				this.orderInfo = resData
			});
		},
		createHandle(){
			let that = this
			that.queryData = that.$route.query
			let clientH = `${document.documentElement.clientHeight}`
			if (clientH) {
				this.mapHeight = parseInt(clientH)-56
			}
			window.onresize = () => {
				return (() => {
					that.mapHeight = parseInt(`${document.documentElement.clientHeight}`)-56;
				})();
			};
			this.map = new AMap.Map('map-content',{
				zoom:12,
				mapStyle: this.colorTal?"amap://styles/998f25903ebf671b4f4ea6c5645a5791":'amap://styles/b265c2b3c5dc85d44e1fcedeac037ead'
			});
			this.massMarks = new AMap.MassMarks([],{
				zIndex: 100,
				style: this.massMarksStyle
			});
			this.massMarks.on('click', ({data}) => {
				this.getOrderInfo(data);
			});
			// 地图绑定拖拽事件
			this.map.on('dragstart', this.showInfoDragstart);
			this.map.on('dragend', this.showInfoDragend);
			// 地图绑定缩放事件
			this.map.on('zoomend', this.zoomend);
			this.massMarks.setMap(this.map);
			this.setMapCenter()
			// this.getPoints(true);
		},
		async initMarks() {
			const data = await this.getNewData();
			this.setMapData(data);
		},
		setUpdateTimer() {
			this.timer = setInterval(() => {
				this.initMarks()
			}, 60000)
		},
		clearTimer() {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
		async getNewData() {
			let frameStart
			let searchOptions = {
				cityCode: this.queryData.adcode,
				isReceived: receiveMap[this.searchOptions.stateCode.join()],
				orderTypes: this.searchOptions.orderTypes,
				startTime: this.startHM(new Date(), 1, 'yyyy-MM-dd hh:mm') + ':00',
				endTime: this.startHM(new Date(), 1, 'yyyy-MM-dd hh:mm') + ':59',
			}
			let data = {
				data: JSON.stringify(searchOptions),
				op: this.op.list
			}
			let url = this.getModuleUrl(this.op.list)
			await this.$axios(url, data).then(res => {
				const resData = JSON.parse(res.data);
				if (resData.length) {
					frameStart = resData[0].frameStart
					this.resData = {
						[frameStart]: resData[0].orderList
					}
				}
			})
			return frameStart
		},
		getTime(e,isDateTime = false){
			let dateTime = this.dateType=='date'?this.dateTime:new Date(this.dateTime)
			this.nowDate = this.timeTo(dateTime,'yyyy-MM-dd')
			let startTime = this.timeTo(this.startTime,'hh:mm')
			let playDate = this.nowDate+' ' + e +':00'
			if (this.dateType=='date') {
				if(isDateTime){
					this.nowTime = "00:00"
					this.nowEndTime = "00:00"
				}else{
					let subTime = e=='23:59'?59:60
					this.nowTime = e=='00:00'?'00:00':this.startHM(new Date(playDate),subTime,'hh:mm')
					this.nowEndTime = this.timeTo(new Date(playDate),'hh:mm')
				}
			}else{
				let isEndTime = this.timeTo(new Date(playDate),'hh:mm')=='23:59'
				let subDateTime = isDateTime?0:isEndTime?4:5
				this.nowTime = e==startTime?startTime: this.startHM(new Date(playDate),subDateTime,'hh:mm')
				this.nowEndTime = isEndTime?'23:59':this.timeTo(new Date(playDate),'hh:mm')
			}
		},
		/*****
		 * dateTime 日期
		 * num 减多少分钟
		 * *****/
		startHM(dateTime,num,str){
			return this.$baseMethod.formatData(new Date((dateTime).getTime()-(num*60*1000)),str)
		},
		/*****
		 * dateTime 日期
		 * str 日期格式
		 * joint 拼接
		 * *****/
		timeTo(time,str,joint=''){
			let dateStr = this.$baseMethod.formatData(time,str)
			return joint?dateStr+joint:dateStr
		},
		nowStartTime(dateTime){
			let date = this.timeTo(dateTime,'yyyy-MM-dd')
			let nowHours = this.timeTo(dateTime,'hh')
			return nowHours=='00'?date+" 00:00:00":this.startHM(dateTime,60,'yyyy-MM-dd hh:mm:ss')
		}
	},
	mounted() {
		/******地图进来查询当前时间订单，系统时间往前推一小时区间值，刷新查当前订单.
		 考虑播放时点击marker显示侧边栏操作******/
		this.pickerOptions = this.pickerOptions1
		this.createHandle()
		this.initMarks()
		this.setUpdateTimer()
	},
	beforeDestroy() {
		this.clearTimer()
    },
	destroyed(){

	}
  }
</script>

<style>
	.hide_time .el-time-spinner__wrapper{
		width: 100% !important;
	}
	.hide_time .el-scrollbar:nth-of-type(2){
		display: none;
	}
	.hide_time .el-picker-panel__footer .el-button--text {
		display: none;
	}
</style>

<style scoped lang="scss">
	.orderMap{
		// height: 100%;
		height: calc(100vh - 105px);
		padding-bottom: 0px;
		padding-top: 24px;
		/deep/.amap-logo{
			display: none !important;
		}
		/deep/.noSelect{
			visibility: hidden;
		}
		.amap-scale-text{
			color: #fff !important;
		}
		.amap-logo{
			display: none !important;
		}
		// .el-drawer__wrapper{
		// 	background: rgba(255, 255, 255,.15) !important;
		// }
		/deep/.drawerClass{
			background: #F1F3F5;
			width: 347px;
			overflow-y:scroll;
			.el-drawer__header{
				padding: 0;
				margin-bottom: 12px;
			}
		}
		.drawerBox{
			.infoBox{
				padding: 0 16px 0 20px;
				color: #676767;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				.contBox{
					margin-top: 10px;
				}
				.title{
					font-size: 14px;
					border-bottom: 1px solid #979797;
					padding-bottom: 10px;
					font-weight: 500;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.colseBtn{
						width: 9px;
						height: 8px;
						cursor: pointer;
					}
				}
				.label{
					font-size: 14px;
					line-height: 27px;
					.labelTit{
						display: inline-block;
						text-align: left;
						max-width: 105px;
						min-width: 90px;
					}
				}
			}
		}
		.goBack{
			position: absolute;
			right: 10px;
			top: 10px;
			height: 40px;
			border-radius: 2px;
			display: flex;
            .el-button--primary.is-plain:focus{
                color: #F05259;
                background: rgb(254, 238, 238);
                border-color: rgb(249, 186, 189);
            }
            .el-button{
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                border: none;
                font-weight: 500;
                box-shadow: 0px 6px 9px 0px rgba(0, 0, 0, 0.5);
            }
			.button,.is-plain{
				color: #333333;
				background: #FFFFFF;
			}
		}
		#map-content {
			width: 100%;
			height:100%;
		}
		.map-wrap {
			height: 100%;
			border-radius: 8px;
			position: relative;
		}
		.mapBox{
			.mapMarker{
				position: absolute;
				left: 10px;
				top: 10px;
				.btnBox{
					display: flex;
				}
				.mapTime{
					width: 308px;
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 46px;
					text-align: center;
					height: 46px;
					background: #252931;
					border-radius: 4px;
					opacity: 0.9;
					border: 1px solid #979797;
				}
				.mapColor{
					display: flex;
					align-items: center;
					justify-content: flex-start;
					width: 270px;
					height: 40px;
					background: #252931;
					border-radius: 4px;
					border: 1px solid #979797;
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #fff;
					padding-left: 10px;
					/deep/.el-radio{
						margin-right: 14px;
						color: #fff;
						margin-top: 4px;
					}
				}
				.refreshBtn{
					height: 40px;
					border-radius: 2px;
					display: flex;
					margin-right: 5px;
					margin-top: 2px;
					.el-button{
						width: 80px;
						font-size: 16px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
						background: #FFFFFF;
						border: none;
						box-shadow: 0px 6px 9px 0px rgba(0, 0, 0, 0.5);
					}
				}
			}
			.markerBox{
				width: 777px;
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 40px;
				text-align: center;
				height: 40px;
				background: #252931;
				border-radius: 4px;
				opacity: 0.74;
				border: 1px solid #979797;
				display: flex;
				justify-content: flex-start;
				margin-top: 10px;
				padding-left: 10px;
				.markerItme{
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.markerTit{
					margin-right: 6px;
				}
				.markerImg{
					width: 24px;
					height: 24px;
					margin-right: 12px;
				}
				.jMarkerImg{
					width: 23px;
					height: 32.3px;
				}
				.el-checkbox {
					display: flex;
					align-items: center;
				}
				/deep/ .is-disabled{
					.el-checkbox__inner{
						color: #F05259;
						background-color: #F05259;
    					border-color: #F05259;
					}
					.el-checkbox__label{
						color: #F05259;
					}
				}
			}
			.timeBox{
				display: inline-block;
				color: #fff;
				font-size: 13px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				border-left: 1px solid #fff;
				padding-left: 13px;
				.time{
					color: #fff;
				}
			}
			.setCenter{
				position: absolute;
				left: 23px;
				top: 500px;
				width: 46px;
				height: 46px;
				cursor: pointer;
			}
		}
		.searchBox{
			position: absolute;
			bottom: 10px;
			height: 70px;
			margin: 0 10px;
			width: 99%;
			background: #252931;
			opacity: .74;
			display: flex;
			align-items: center;
			padding-left: 20px;
			margin: 0 10px;
			border: 1px solid #979797;
			border-radius: 4px;
			.searchDate{
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.ws-order-play{
					width: 79%;
					margin-left: 30px;
					color: #fff;
				}
			}
			.dateLabel{
				color: rgba(255, 255, 255, 0.85);
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				width: 75px;
			}
		}
  }
</style>
