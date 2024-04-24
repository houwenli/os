<template>
    <div style="overflow:hidden">
        <div class="stepsBox">
            <div class="left" @click="goleft()" >
                <img src="@/assets/index/img_left.png" alt="" />
            </div>
            <div class="right" @click="goright()" >
                <img src="@/assets/index/img_right.png" alt="" />
            </div>
            <div class="stepsTop">
                <div class="stepsTitle">审批节点流程</div>
                <div class='stepsBtn'>
                    <div class="viewAll viewRules" @click="goRules()">
                      <span class="textStyle">工作流规则</span>
                     <img src="@/assets/index/icon_more.png" width="16" /></div>
                    <div class="viewAll" @click="goAllProcess()">
                        <span class="textStyle">查看全流程</span>
                        <img src="@/assets/index/icon_more.png" width="16" />
                    </div>
                </div>
            </div>

            <swiper :options="swiperOption" class="stepsBottom" :not-next-tick="notNextTick" ref="mySwiper" >
                <swiper-slide  v-for="(item, index) in dataList" :key="index">
                        <div class="icon" :class="judgeIconStyle(item.approvalStatus)">
                            <img v-if="item.approvalStatus === '2'" src="@/assets/index/icon_completed.png" />
                            <span v-else>{{ index + 1 }}</span>
                        </div>
                        <div class="line" :class="judegLightLine(index)" v-show="index !== dataList.length - 1"></div>
                        <div class="cardContent">
                            <div class="arrowBox"><img :src="judegeArrowSrc(item.approvalStatus)" alt="" class="arrowImg" /></div>
                            <div :class="['cardStyle',judgeBorderStyle(item.approvalStatus)]" @click="showPersonDia(item)">
                                <div :class="['cardTitle', judgeTitleStyle(item.approvalStatus)]">
                                    <span class="titleLeft">
                                        {{ item.nodeName }}
                                    </span>
                                    <span class="titleRight">
                                        <img v-if="item.nodeType == '1' || item.nodeType == '2'" :src="judgeTypeSrc(item.approvalStatus, item.nodeType)" alt="" />
                                    </span>
                                </div>
                                <div class="textInfo" >
                                    <div class="checkPerson">
                                      <!-- 或签 只显示一个已审批通过的人， 其余显示数量 -->
                                        <p class="personStyle">{{item.detailTitel }}</p>
                                        <p class="timeStyle" v-if="item.approvalTime">{{ item.approvalTime }}</p>
                                        <p class="timeStyle" v-if="item.startTime">{{ item.startTime }}</p>
                                    </div>
                                    <div class="viewPerson" >
                                        <img src="@/assets/index/icon_more_grey.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="currentTag" v-if="item.approvalStatus=='3'">
                            <div class="check"><img src="@/assets/index/img_check_shadow.png" alt=""></div>
                            <div class="instruct"><img src="@/assets/index/img_instruct.png" alt=""></div>
                        </div>
                </swiper-slide>
            </swiper>

        </div>
    </div>
</template>
<script>
import arrowComplete from '@/assets/index/img_arrow_completed.png';
import arrowPresent from '@/assets/index/img_arrow_present.png';
import arrowUndone from '@/assets/index/img_arrow_undone.png';
import statusSendImg from '@/assets/index/completed_status_send.png';
import statusCheckImg from '@/assets/index/completed_status_check.png';
import currentCheckImg from '@/assets/index/current_status_check.png';
import currentSendImg from '@/assets/index/current_status_send.png';
import undoneCheckImg from '@/assets/index/undone_status_check.png';
import undoneSendImg from '@/assets/index/undone_status_send.png';
import { swiper, swiperSlide } from './vue-swiper'

export default {
    /**dataList的数据结构：
    [{ nodeName: '发起申请',  nodeType: '审核人', approvalStatus: '2',detailTitel:'杨过过',approvalTime:'2022-2-17 12:00'}]
     */
    props: {
        dataList: {
            type: Array
        },
        stepId: {
            type: String
        },
        processId: {
            type: String
        }
    },
    components:{
      swiper, swiperSlide
    },
    data() {
        return {
            dialogVisible: true,
            showLeftArrow: false,
            showRightArrow: true,
            listLength: 0,
            arrowComplete: arrowComplete,
            arrowPresent: arrowPresent,
            arrowUndone: arrowUndone,
            statusSendImg: statusSendImg,
            statusCheckImg: statusCheckImg,
            currentCheckImg: currentCheckImg,
            currentSendImg: currentSendImg,
            undoneCheckImg: undoneCheckImg,
            undoneSendImg: undoneSendImg,

            swiperOption: {
              // swiper options 所有的配置同swiper官方api配置
                slidesPerView:4,
                centeredSlides: true,
                swipeHandler:'.cardContent',
                breakpoints:{
                    1280:{
                        slidesPerView: 3,
                    }
                },
            },
            notNextTick:false
        };
    },
    watch:{
       dataList:{
           handler(value){
               if(value){
                   this.listLength = value.length
                    if(this.activeIndex <= 0){
                       this.swiperOption.centeredSlides = false
                       this.swiperOption.slidesOffsetBefore = 140
                    }else{
                        this.swiper.slideTo(this.activeIndex, 300, false)
                    }
               }
           },
           deep:true
       }
    },
    computed: {
        currentIndex() {
            for (let [index, data] of this.dataList.entries()) {
                if (data.approvalStatus === '3') {
                    // 如果审核状态为当前节点则返回当前index
                    return index;
                }
            }
            return this.listLength;  // 如果审核完成则返回数值长度，注：这里不是
        },
        swiper() {
            return this.$refs.mySwiper.swiper
        },
        activeIndex(){
            return this.dataList.findIndex(item=>item.approvalStatus==='3')
        }
    },
    methods: {
        judgeIconStyle(iconStyle) {
            if (iconStyle == '3') {
                return 'iconCurrent';
            } else if (iconStyle == '1') {
                return 'iconUnfinish';
            } else return '';
        },
        judegLightLine(index) {
            if (index < this.currentIndex) {
                return 'lineActive';
            } else {
                return 'lineUnLight';
            }
        },
        judegeArrowSrc(arrowSrc) {
            if (arrowSrc == '2') {
                return arrowComplete;
            } else if (arrowSrc == '3') {
                return arrowPresent;
            } else return arrowUndone;
        },
        judgeTitleStyle(titleStyle) {
            if (titleStyle == '2') {
                return 'titleFinish';
            } else if (titleStyle == '3') {
                return 'titleCurrent';
            } else return 'titleUndo';
        },
        judgeBorderStyle(titleStyle) {
            if (titleStyle == '2') {
                return 'boderFinish';
            } else if (titleStyle == '3') {
                return 'boderCurrent';
            } else return 'boderUndo';
        },
        judgeTypeSrc(typeStatus, typeSort) {
            if (typeStatus == '2') {
                if (typeSort == '1') {
                    return statusCheckImg;
                } else return statusSendImg;
            } else if (typeStatus == '3') {
                if (typeSort == '1') {
                    return currentCheckImg;
                } else return currentSendImg;
            } else if (typeStatus == '1') {
                if (typeSort == '1') {
                    return undoneCheckImg;
                } else return undoneSendImg;
            }
        },
        goRules() {
            this.$router.push({ name: 'workflowRules', query:{procdefId:this.stepId,procinstId:this.processId} });
        },
        goAllProcess() {
            this.$router.push({ name: 'approvalProcess', query: {procdefId:this.stepId,procinstId:this.processId} });
        },
        //点击箭头出现人员弹窗
        showPersonDia(item) {
            // if (item.nodeType == '0') {
            //     // 如果是发起人节点则取userInfos数组数据
            //     let list = item.userInfos;
            //     this.$emit('showPerList', true, list);
            // } else {
            //     // 第一个节点以后的就发请求
            //     let params = {
            //         op: 'approvalUser',
            //         data: {
            //             procdefId: item.procdefId,
            //             nodeId: item.id
            //         }
            //     };
            //     this.$axios('/new/flowable/todoTask/select', params).then(res => {
            //         let list = JSON.parse(res.data);
            //         this.$emit('showPerList', true, list);
            //     });
            // }
            let list = item.userIds;

            // 判断是否为开始节点
            let isStartUser = item.nodeType ==='0'
            this.$emit('showPerList', true, list,isStartUser);
        },
        intPosition() {
            let box = document.getElementById('setpUl');
            let stepsBottomWidth = document.getElementById('stepsBottom').offsetWidth + 100; // stepBottom长度加上100px的margin-left
            let bottomHalfWidth = stepsBottomWidth / 2; //stepBottom的一半
            let currentNum = this.currentIndex; // 当前index的数值
            let currentBoxLen = 440 * (currentNum + 1); //从第一个li盒子index到当前index的长度
            // 当前盒子居中的计算
            if (currentNum != this.listLength && currentNum >= 1) {
                // 判断当前节点>=第2个
                // 如果当前节点在第2个li
                if (currentNum == 1) {
                    this.showLeftArrow = false; // 左按钮隐藏
                    if (this.listLength <= 3) {
                        //当数组长度小于3时同时隐藏右按钮
                        this.showRightArrow = false;
                    } else {
                        // 数组长度> 3 显示右按钮
                        this.showRightArrow = true;
                    }
                } else {
                    // 当前节点>=第3个li，则左右按钮都显示
                    this.showLeftArrow = true;
                    this.showRightArrow = true;
                }
                box.style.left = -(currentBoxLen - bottomHalfWidth) + 110 + 'px';
            } else if (currentNum == this.listLength) {
                //如果流程完结重置boxleft为0
                box.style.left = 0 + 'px';
                //boxleft为0就隐藏左按钮显示右按钮
                this.showLeftArrow = false;
                if (this.listLength <= 3) {
                    //当数组长度小于3时隐藏右按钮
                    this.showRightArrow = false;
                } else {
                    this.showRightArrow = true;
                }
            }
        },
        goleft() {
            // let dataListlen = this.dataList.length;
            // let box = document.getElementById('setpUl');
            //  let stepsBottomWidth = document.getElementById('stepsBottom').offsetWidth + 100;
            //  let bottomHalfWidth = stepsBottomWidth / 2 //stepBottom的一半
            // let leftPx = parseInt(box.style.left.substring(0, box.style.left.length - 2))
            // if ( leftPx < 0) { // 限制左按钮不能一直向左
            //     //能点击的左区间内显示右按钮
            //     this.showRightArrow = true
            //     box.style.left = leftPx + 440 + 'px';
            // }else{
            //     // 按钮在最左侧（超出左边范围）时隐藏左按钮显示右按钮
            //     this.showLeftArrow = false
            //     this.showRightArrow = true
            //     box.style.left = leftPx + 'px'
            // }
             this.swiper.slidePrev();
            // console.log(box.style.left);
        },
        goright() {
            //  let box = document.getElementById('setpUl');
            //  let ulBoxLen = box.offsetWidth
            //  let stepsBottomWidth = document.getElementById('stepsBottom').offsetWidth + 100; // stepBottom长度加上100px的margin-left
            //  let bottomHalfWidth = stepsBottomWidth / 2 //stepBottom的一半
            // let rightpx = parseInt(box.style.left.substring(0, box.style.left.length - 2));
            //     if(rightpx > bottomHalfWidth - ulBoxLen + 440){ //限制右按钮不能一直向右
            //         //能点击的右区间范围内显示左按钮
            //         this.showLeftArrow = true
            //         box.style.left = rightpx - 440 + 'px';
            //     }else{
            //         //超出右边范围就显示左按钮隐藏右按钮
            //       this.showLeftArrow = true
            //       this.showRightArrow = false
            //       box.style.left = rightpx + 'px'
            //   }
            this.swiper.slideNext();
        }
    }
};
</script>
<style lang="scss" scoped>
@import "./vue-swiper/swiper.min.css";
.stepsBox {
    height: 284px;
    padding: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #dcdfe6;
    position: relative;
    .left {
        position: absolute;
        left: 16px;
        top: 50%;
        z-index: 10;
    }
    .right {
        position: absolute;
        right: 16px;
        top: 50%;
        z-index: 10;
    }
    .stepsTop {
        display: flex;
        justify-content: space-between;
        margin-bottom: 35px;
        .stepsTitle {
            margin-top: 4px;
            margin-left: 20px;
            color: #303133;
            font-weight: 600;
            font-size: 16px;
        }
        .stepsBtn {
            display: flex;
            align-items:center;
        }
        .viewRules {
            margin-right: 16px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #f05259;
            // line-height: 25px;
            cursor: pointer;
        }
        .viewAll {
            display: flex;
            align-items: center;
            cursor: pointer;
            .textStyle {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #f05259;
                // line-height: 14px;
            }
            img {
                margin-left: 2px;
            }
        }
    }

    .stepsBottom {
        height: 204px;
        box-sizing: border-box;
        position: relative;

            display: flex;
            justify-content: space-around;
            flex-wrap: nowrap;
            flex-shrink: 0;
            .swiper-slide {
                height: 164px;
                position: relative;
                .currentTag {
                    width: 280px;
                    height: 23px;
                    position: absolute;
                    bottom: -35px;
                    left: 50%;
                    margin-left: -140px;
                    // z-index: 100;
                    .check {
                        width: 280px;
                        height: 13px;
                    }
                    .instruct {
                        margin: 0 auto;
                        width: 24px;
                        height: 10px;
                    }
                }
                .icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 auto;
                    z-index: 99;
                }
                .iconCurrent {
                    font-size: 20px;
                    border: 2px solid #f05259;
                    background: #f05259;
                    color: #fff;
                }
                .iconUnfinish {
                    font-size: 20px;
                    border: 2px solid #ebeef5;
                    background: #fff;
                    color: #c0c4cc;
                }
                .line {
                    width: 100%;
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    border-bottom: 2px solid;
                }
                .lineUnLight {
                    border-color: #ebeef5;
                }
                .lineActive {
                    border-color: #f9bbbd;
                }
                .cardContent {
                    width: 280px;
                    height: 120px;
                    position: absolute;
                    top: 44px;
                    left: 50%;
                    transform: translateX(-50%);
                    cursor: pointer;
                    .arrowBox {
                        width: 280px;
                        display: flex;
                        justify-content: center;
                        .arrowImg {
                            width: 16px;
                            height: 12px;
                            vertical-align: top;
                        }
                    }
                    .boderFinish {
                        border: #f9bbbd 1px solid;
                    }
                    .boderCurrent {
                        border: #f05259 1px solid;
                    }
                    .boderUndo {
                        border: #f5f5f5 1px solid;
                    }
                    .cardStyle {
                        width: 280px;
                        height: 108px;
                        border-radius: 8px;
                        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);
                        .cardTitle {
                            height: 40px;
                            display: flex;
                            justify-content: space-between;
                            border-top-left-radius: 8px;
                            border-top-right-radius: 8px;
                        }
                        .titleFinish {
                            background-color: #f9bbbd;
                            color: #fff;
                        }
                        .titleCurrent {
                            background-color: #f05259;
                            color: #fff;
                        }
                        .titleUndo {
                            background-color: #f5f5f5;
                            color: #909399;
                        }
                        .titleLeft {
                            margin-left: 16px;
                            margin-top: 10px;
                            font-size: 14px;
                            // color: #fff;
                        }

                    }
                }
            }
    }
}

.textInfo {
    box-sizing: border-box;
    width: 278px;
    height: 68px;
    padding: 16px 12px 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .checkPerson {
        font-size: 14px;
        line-height: 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .personStyle,
        .timeStyle {
            line-height: 14px;
        }
        .personStyle {
            color: #606266;
        }
        .timeStyle {
            margin-top: 12px;
            color: #c0c4cc;
        }
    }
    .viewPerson {
        cursor: pointer;
    }
}
</style>