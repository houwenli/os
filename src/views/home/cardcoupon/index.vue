<template>
    <div>
        <div class="cardcoupon-apply">
            <div class="currency-apply-title">申请配置</div>
            <el-select @change="changeType" v-model="couponType" placeholder="请选择申请类型" style="width: 20%">
                <el-option v-for="item of flowNamesOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>

            <component ref="applyFrom" :is="componentsObj[couponType]" @changeVal="changeVal" />
        </div>

        <!-- 审核流程 -->
        <div v-if="actions" style="margin-bottom: 64px; margin-top: 16px">
            <audit-process :key='refreshKey' v-if='couponType' title="审核流程" ref="auditProcess" :actions="actions" :query="{ nameCode: couponType }" :overflowLimit="10" custom-class="custom-class"></audit-process>
        </div>

        <!-- 底部按钮 -->
        <footer-fixed class='bottombtn' backTo="index">
            <ws-throttle>
                <el-button type="primary" style="width: 160px; height: 40px" @click="submitForm()">提交审核</el-button>
            </ws-throttle>
        </footer-fixed>
        <!-- 操作失败 -->
        <el-dialog class="deleteDialog" append-to-body :lock-scroll="false" :show-close='false' :close-on-click-modal="false" title="提交失败" :visible.sync="showErr" width="30%" center>
            <div style="text-align:center;">{{errMsg}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 98px" type="primary" @click="resetList()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import FooterFixed from '../components/FooterFixed';
import AuditProcess from '@/components/AuditProcess';
import travelCoupon from './components/travelCoupon'; // 出行券配置申请
import envelopesCoupon from './components/envelopesCoupon'; // 红包配置申请
import addentityCard from './components/addentityCard'; // 新增实体卡申请
import receiveentityCard from './components/receiveentityCard'; // 领取实体卡申请
import addTravelCoupon from './components/addTravelCoupon'; // 出行券补量申请
import addEnvelopesCoupon from './components/addEnvelopesCoupon'; // 红包补量申请
import ecommerceConfiguration from './components/ecommerceConfiguration.vue'  //电商优惠券配置申请
import ecommerceMakeupcoupons from './components/ecommerceMakeupcoupons.vue'    //电商优惠券补量申请
import electricCar from './components/electricCar.vue'
import ecMakeupcoupons from './components/ecMakeupcoupons.vue'
import { deepClone } from '@/utils/index'

export default {
    name: 'currencyApply',
    components: { FooterFixed, AuditProcess, travelCoupon, envelopesCoupon, addentityCard, receiveentityCard, addTravelCoupon, addEnvelopesCoupon, ecommerceConfiguration,ecommerceMakeupcoupons,electricCar,ecMakeupcoupons},

    data() {
        return {
            couponType: '',
            formData: {},
            flowNamesOptions: [],
            componentsObj: {
                40: 'travelCoupon',
                41: 'envelopesCoupon',
                42: 'addentityCard',
                43: 'receiveentityCard',
                44: 'addTravelCoupon',
                45: 'addEnvelopesCoupon',
                47: 'ecommerceConfiguration',
                48: 'ecommerceMakeupcoupons',
                49: 'electricCar',
                140: 'ecMakeupcoupons'
            },
            actions: {
                moduleName: '/index/todo',
                op: 'flowNode',
            },
            flowPart: true,
            op: 'insertApplyTravelCoupon',
            moduleName: '/cardcouponApply',
            errMsg: '',
            showErr: false,
            refreshKey: 0
        };
    },

    created() {
        this.getSelect();
    },
    methods: {
        async getSelect() {
          try {
            let res = await   this.$axios('flowable/common/select', {
              op: 'workflowName',
              data: { body: { id: 8 } },
            })
            let data = JSON.parse(res.data) || []
            this.flowNamesOptions = data.filter(item => item.id !== 43);
            this.couponType = this.flowNamesOptions[0].id;
          } catch (e) {
          }
        },
        changeVal(form) {
            console.log(form,'form');
            switch (this.couponType) {
                case 40: // 出行券配置申请
                    let type = form.couponsPeriodType;

                    if (type == 2 && form.pickerDate && form.pickerDate.length !== 0) {
                        form.effectiveEndTime = this.$baseMethod.formatData(form.pickerDate[1], 'yyyy-MM-dd hh:mm:ss');
                        form.effectiveStartTime = this.$baseMethod.formatData(form.pickerDate[0], 'yyyy-MM-dd hh:mm:ss');
                        form.validDay = null;
                    }
                    if (type == 1) {
                        form.effectiveEndTime = '';
                        form.effectiveStartTime = '';
                    }
                    if (form.pickerTime && form.pickerTime.length !== 0) {
                        form.availableStartTime = form.pickerTime[0];
                        form.availableEndTime = form.pickerTime[1];
                    }
                    this.formData = { ...form };
                    // 内容在OA 6.4版本中同步过，6.4 在11.3号上线，此内容11.8号上线，所以注释
                    this.formData.faceValue = this.$baseMethod.regYuanToFen(this.formData.faceValue)
                    this.formData.faceValue = this.formData.faceValue + '';
                    this.formData.totalNumber = this.formData.totalNumber * 1;
                    if (this.formData.couponsType) {
                        this.formData.couponsType = this.formData.couponsType * 1;
                    }
                    this.formData.couponsPeriodType = this.formData.couponsPeriodType * 1;
                    if (this.formData.validDay) {
                        this.formData.validDay = this.formData.validDay * 1;
                    }
                    if (this.formData.ifAllBusiness) {
                        this.formData.ifAllBusiness = this.formData.ifAllBusiness * 1;
                    }
                    this.formData.amountLimitation = this.$baseMethod.regYuanToFen(this.formData.amountLimitation);
                    this.formData.serviceId = this.formData.serviceId.toString();
                    this.formData.serviceCar = this.formData.serviceCar.toString();
                    this.formData.serviceOrder = this.formData.serviceOrder.toString();
                    this.op = 'insertApplyTravelCoupon';
                    console.log(this.formData);
                    break;
                case 41: // 红包配置申请
                    this.formData = { ...form };
                    this.formData.money = this.formData.money * 100;
                    this.formData.totalNumber = this.formData.totalNumber * 1;
                    this.op = 'insertApplyRedPacket';
                    break;
                case 42: // 新增实体卡申请
                    this.formData = { ...form };
                    this.formData.activityMoney = this.formData.activityMoney * 100;
                    this.formData.activityNum = this.formData.activityNum * 1;
                    this.op = 'insertActivityFuka';
                    break;
                case 43: // 领取实体卡申请
                    this.formData = { ...form };
                    this.formData.applyMoney = this.formData.applyMoney * 100;
                    this.op = 'insertActivityFuKaGrant';
                    break;
                case 44: // 出行券补领申请
                    let type2 = form.couponsPeriodType;
                    if (type2 == 2 && form.pickerDate && form.pickerDate.length !== 0) {
                        form.effectiveEndTime = this.$baseMethod.formatData(form.pickerDate[1], 'yyyy-MM-dd hh:mm:ss');
                        form.effectiveStartTime = this.$baseMethod.formatData(form.pickerDate[0], 'yyyy-MM-dd hh:mm:ss');
                    }
                    if (form.pickerTime && form.pickerTime.length !== 0) {
                        form.availableStartTime = form.pickerTime[0];
                        form.availableEndTime = form.pickerTime[1];
                    }
                    this.formData = { ...form };
                    this.formData.addNum = this.formData.addNum * 1;
                    this.formData.couponsType = this.formData.couponsType * 1;
                    this.formData.couponsPeriodType = this.formData.couponsPeriodType * 1;
                    this.formData.validDay = this.formData.validDay * 1;
                    this.formData.ifAllBusiness = this.formData.ifAllBusiness * 1;
                    this.formData.availableChannel = this.formData.availableChannel * 1;
                    this.formData.useCity = this.formData.useCity* 1;
                    this.formData.serviceId = this.formData.serviceId.toString();
                    this.formData.serviceCar = this.formData.serviceCar.toString();
                    this.formData.serviceOrder = this.formData.serviceOrder.toString();
                    this.op = 'addTravelCouponSubmit';
                    break;
                case 45: // 红包补领申请
                    this.formData = { ...form };
                    this.formData.addNum = this.formData.addNum * 1;
                    this.op = 'addRedPacketSubmit';
                    break;
                case 47:    //电商卡券新增
                    this.formData = [...form ];
                    // console.log(this.formData,'formData');
                    // this.formData.forEach(item => {
                    //         item.amountLimitation = 0;
                    //         if (item.couponsPeriodType==2) {
                    //         // item.faceValue = this.$baseMethod.regYuanToFen(item.faceValue);
                    //         item.effectiveStartTime=this.$baseMethod.formatData(item.pickerDate[0], 'yyyy-MM-dd hh:mm:ss');
                    //         item.effectiveEndTime=this.$baseMethod.formatData(item.pickerDate[1], 'yyyy-MM-dd hh:mm:ss');
                    //         item.validDay=null
                    //         }else{
                    //         item.effectiveStartTime=null,
                    //         item.effectiveEndTime=null
                    //         }
                    // });
                    this.op = 'insertApplyTravelCoupon';
                    break;
                case 48:    //电商卡券补量新增
                    this.formData = { ...form};
                    console.log(this.formData,'-=--------------------');
                    this.formData.faceValue = this.$baseMethod.regYuanToFen(this.formData.faceValue);
                   if (this.formData.couponsPeriodType==2) {
                     this.formData.effectiveStartTime=this.formData.pickerDate[0],
                    this.formData.effectiveEndTime=this.formData.pickerDate[1],
                    this.formData.validDay=null
                   }else{
                     this.formData.effectiveStartTime=null,this.formData.effectiveEndTime=null
                   }
                    this.op = 'insertApplyTravelCoupon';
                      break;
                case 49: 
                    this.formData = {...form}
                    //金额转换
                    this.formData.faceValue = this.$baseMethod.regYuanToFen(this.formData.faceValue);
                    this.formData.amountLimitation = this.$baseMethod.regYuanToFen(this.formData.amountLimitation);
                    //有效日期 可用时段转换
                    this.formData.effectiveStartTime= '',
                    this.formData.effectiveEndTime= '',
                    this.formData.availableStartTime = '';
                    this.formData.availableEndTime = '';
                    this.formData.serviceId = this.formData.serviceId[0]
                    this.formData.serviceOrder = this.formData.serviceOrder[0]
                    this.op = 'insertApplyTravelCoupon';
                    break;
                case 140: 
                    this.formData = {...form}
                    //金额转换
                    this.formData.faceValue = this.$baseMethod.regYuanToFen(this.formData.faceValue);
                    this.formData.amountLimitation = this.$baseMethod.regYuanToFen(this.formData.amountLimitation);

                    this.formData.effectiveStartTime= '',
                    this.formData.effectiveEndTime= '',
                    this.formData.availableStartTime = '';
                    this.formData.availableEndTime = '';
                    //有效日期 可用时段转换
                    this.formData.serviceId = 1
                    this.formData.serviceOrder = 10
                    this.op = 'startProcess'
                    break;
                default:
                    break;
            }
        },

        changeType() {
            this.formData = {};
            this.refreshKey = Date.now()
        },
        //提交
        submitForm() {
            let vm = this;
            let from;
            if (vm.$refs['applyFrom'].cardList) {
            let listLength= vm.$refs['applyFrom'].$refs['basicInfo'].length;
              from = vm.$refs['applyFrom'].$refs['basicInfo'][listLength-1];
            }else{
            from = vm.$refs['applyFrom'].$refs['basicInfo'];
            }
            from.validate(valid => {
                if (valid) {
                    if (this.checkedApprovaForm()) {
                         let data=deepClone(this.formData)
                       if (this.couponType == 47 && data.length >0) {
                            data.forEach(item=>{
                                item.amountLimitation=0
                                 if (item.couponsPeriodType==2) {
                                    item.effectiveStartTime=this.$baseMethod.formatData(item.pickerDate[0], 'yyyy-MM-dd hh:mm:ss');
                                    item.effectiveEndTime=this.$baseMethod.formatData(item.pickerDate[1], 'yyyy-MM-dd hh:mm:ss');
                                    item.validDay=null
                                    }else{
                                    item.effectiveStartTime=null,
                                    item.effectiveEndTime=null
                                    }
                                item.faceValue = this.$baseMethod.regYuanToFen(item.faceValue)
                            })
                        }
                        let opt = {
                            data: {
                                nameCode: this.couponType,
                                procDefId: this.$refs.auditProcess.procdefId,
                                approvalInfo: this.createdApprovalInfo(),
                                nodeFormJson: JSON.stringify(data),
                                flag: true,
                                type:this.couponType
                            },
                            op: this.op,
                        };
                        if (!opt.data.procDefId) {
                            this.$message.error('当前审批未配置工作流，审批发起失败，请联系管理员处理');
                            return;
                        }
                        if  (this.couponType==47) {
                             let couponsList=true
                            this.formData.forEach(item=>{
                            if (item.couponRelationSpuList.length==0) {
                                couponsList=false
                            }
                            })
                             if (couponsList==false) {
                                 return this.$message.error('当前卡券未添加商品');
                             }
                        }

                        //换电券补量走通用审批
                        this.$axios(this.getModuleUrl(opt.op) , opt)
                            .then(res => {
                                if (res.code === 1 && res.msg === '001') {
                                    this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提交失败', {
                                        confirmButtonText: '确定',
                                        showCancelButton: false,
                                        closeOnClickModal: false,
                                        showClose: false,
                                        center: true,
                                    }).then(() => {
                                        this.$refs.auditProcess.getFlowable();
                                    });
                                    return 
                                } 
                                //提交成功
                                if (res.code == 1) {
                                    this.$router.replace({ path: '/applySuccess' });
                                } 
                            })
                            .catch(error => {
                                this.$message.error(error.msg ||error.message);
                            });
                    } else {
                        this.$message.error('还有审批人没选择，请补充完整');
                    }
                }
            });
        },
        checkedApprovaForm() {
            let allList = this.$refs.auditProcess.allList;
            const arr = allList.filter(item => {
                return item.memberType == 3 || item.memberType == 4;
            });
            return arr.every(item => {
                return item.userInfos.length > 0;
            });
        },
        createdApprovalInfo() {
            let allList = this.$refs.auditProcess.allList;
            // 补量申请走通用审批 nodekey替换成nodeid
            let arr = [140]
            return allList.map((items, i) => {
                let data = {
                    nodeKey: items.nodeKey,
                    userIds: items.userInfos
                        .filter((item, j) => {
                            return item.id && !item.isDefUser;
                        })
                        .map(item => {
                            return item.id;
                        }),
                }
                if(arr.includes(this.couponType)) {
                    data.nodeId = data.nodeKey
                    delete data.nodeKey
                }
                return data
            });
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        resetList() {
            this.showErr = false;
            this.$refs.auditProcess.getFlowable();
        },
    },
};
</script>

<style lang="scss" scoped>
.cardcoupon-apply {
    background: #ffffff;
    border-radius: 8px;
    padding: 32px 40px 8px 40px;
}
.currency-apply-title {
    width: 80px;
    height: 28px;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 16px;
}
.bottombtn{
    z-index:999
}
</style>

