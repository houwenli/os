<template>
  <div :class="[prefix]">
    <slot name="action">
      <div :class="prefix + '__icon'">
        <img class="play" src="../../../../assets/images/orderMap/play.png" v-if="!isPlay" @click="play"/>
        <img class="play" src="../../../../assets/images/orderMap/pause.png" v-else @click="pause"/>
      </div>
    </slot>
    <el-select :disabled="isPlay" :class="prefix + '__speed'" v-model="speed" placeholder="请选择">
      <el-option
        v-for="item in speedOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div :class="prefix + '__control'">
      <div :class="prefix + '__time'" v-if="!showMarks">{{ startTime.slice(11)}}</div>
      <div :class="prefix + '__process'">
        <el-slider
          v-model="currentValue"
          @input="input"
          :format-tooltip="formatValue"
          :step="innerStep"
          :disabled="disabled"
          :show-tooltip="false"
          show-stops
          class="slider"
          :marks="showMarks?marks:null"
        ></el-slider>
      </div>
      <div :class="prefix + '__time'" v-if="!showMarks">{{ endTime.slice(11) }}</div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'ws-order-play',
    props: {
        value: { type: [String, Number] },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        step: { type: Number, default: 30 },
        disabled:{ type: Boolean, default: true },
        showMarks: { type: Boolean, default: true },
        marksGap: { type: Number, default: 60 },
        getPoints: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            prefix: 'ws-order-play',
            currentValue: 0,
            isPlay: false,
            timer: null,
            // countDown:null,
            fullYear: this.startTime.slice(0, 11),
            clickNum:1,
            responseNum:1,
		    speed: 1,
            speedOptions: [{
                label: '✖1',
                value: 1
            }, {
                label: '✖2',
                value: 2
            }, {
                label: '✖4',
                value: 4
            }],
        };
    },
    watch: {
        value: {
            handler(val) {
                if (val) {
                    this.currentValue =
                        ((this.getSeconds(val) -
                            this.getSeconds(this.startTime)) /
                            this.diffTimestamp) *
                        100;
                }
            },
            immediate: true,
        },
        currentValue(val) {
            this.$emit('input', this.formatValue(val, true));
            if (val >= 100) {
                this.$emit('end'); //播放完毕
            }
        },
    },
    computed: {
        diffTimestamp() {
            return (
                this.getSeconds(this.endTime) - this.getSeconds(this.startTime)
            );
        },
        innerStep() {
            return ((this.step * 60 * 1000) / this.diffTimestamp) * 100;
        },
        marks() {
            let obj = {};
            let max = Math.ceil(this.diffTimestamp / (this.step * 60 * 1000));
            let innerStep = this.innerStep * this.marksGap;
            for (let i = 0; i <= max; i++) {
                let key = innerStep * i >= 100 ? 100 : innerStep * i;
                obj[key] = this.formatValue(innerStep * i);
            }
            return obj;
        },
        duration() {
            // 播放一次间隔的毫秒数，5 * 60（要求五分钟播放完成)，24*60总帧数
            return (5 * 60 * 1000) / (24*60) / this.speed;
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
        // clearInterval(this.countDown)
        this.timer = null;
        // this.countDown = null
    },

    methods: {
        // 开始播放
        async play() {
            this.$parent.clearTimer()
            if (this.getPoints) {
                if(!this.value||this.value==this.endTime||this.value==this.startTime||this.$baseMethod.formatData(this.value,'hh:mm:ss')=="00:00:00"){
                    this.clickNum = this.clickNum+1
                    let flag = await this.getPoints(this.startTime,this.endTime);
                    this.responseNum = this.responseNum+1
                    if(flag && this.responseNum==this.clickNum){
                        this.isPlay = true;
                        this.currentValue >= 100 && (this.currentValue = 0);
                        this.timer = setInterval(() => {
                            if (this.currentValue >= 100) {
                                this.pause();
                            } else {
                                this.currentValue += this.innerStep;
                            }
                        }, this.duration);
                    }
                }else{
                    this.isPlay = true;
                    this.currentValue >= 100 && (this.currentValue = 0);
                    this.timer = setInterval(() => {
                        if (this.currentValue >= 100) {
                            this.pause();
                        } else {
                            this.currentValue += this.innerStep;
                        }
                    }, this.duration);
                }
            }
        },
        // responseData(){
        //     this.countDown&&clearInterval(this.countDown)
        //     let count = 15,responseNum = this.responseNum,clickNum = this.clickNum
        //     this.countDown = setInterval(() => {
        //         if (count<=0||this.responseNum==this.clickNum) {
        //             clearInterval(this.countDown)
        //             responseNum = 1
        //             clickNum = 1
        //         }else{
        //             count--
        //         }
        //     }, 1000);
        //     return {responseNum,clickNum}
        // },
        // 暂停
        pause() {
            this.isPlay = false;
            clearInterval(this.timer);
        },
        // 重置
        reset() {
            clearInterval(this.timer);
            this.currentValue = 0;
            this.timer = null;
            this.isPlay = false;
            this.responseNum = 1
            this.clickNum = 1
        },
        // 播放跳转
        input(val) {
            this.currentValue = val;
            this.$emit('change', this.formatValue(val, true));
        },
        // 格式化显示的时间
        formatValue(val, showFull = false) {
            val = val >= 100 ? 100 : val;
            let d = new Date(
                this.getSeconds(this.startTime) +
                    (this.diffTimestamp / 100) * val
            );
            let h = d.getHours();
            let m = d.getMinutes();

            let fullTime = this.formatZero(h) + ':' + this.formatZero(m);

            let s = fullTime == '23:59' ? ':59' : ':00';
            return showFull ? this.startTime.slice(0, 11) + fullTime + s : fullTime;
        },
        formatZero(num) {
            return num > 9 ? num : '0' + num;
        },
        // 获取时间对应的毫秒数
        getSeconds(date) {
            return new Date(date).getTime();
        },
    },
};
</script>

<style lang="scss" scoped>
.ws-order-play {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /deep/.el-slider__runway{
        background-color: #fff;
        height: 3px;
    }
    /deep/.el-slider__bar{
        background-color: #E43F3F;
        height: 3px;
    }
    /deep/ .el-slider__button{
        background: url("../../../../assets/images/orderMap/progressBar.png") no-repeat;
        background-size: 100% 100%;
        border: none;
        width: 28px;
        height: 28px;
        margin-bottom: 2px;
    }
    /deep/.el-slider__stop{
        display: none;
    }
    /deep/.el-slider__stop:first-child,/deep/.el-slider__stop:last-child{
        display: block;
    }
    /deep/.el-slider__marks-stop:first-child{
        width: 10px;
        height: 10px;
        top: -3.5px;
    }
    /deep/.el-slider__marks-stop:last-child{
        height: 20px;
        width: 2px;
        border-radius: 0;
        top: -8px;
    }
    /deep/.el-slider__marks-text{
        margin-top: -30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.85);


    }
   /deep/.el-slider__marks-text:nth-child(odd){
        @media only screen and (max-width: 1500px) {
            display: none;
        }
    }
    /deep/.el-slider__marks-text:first-child{
        margin-top: 15px;
    }
    /deep/.el-slider__marks-text:last-child{
        display: none;
    }
    &__icon {
        margin-right: 10px;
        cursor: pointer;
        .play {
            width: 50px;
            height: 50px;
        }
    }
    &__speed {
        margin-right: 30px;
        width: 70px;
    }
    &__control {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
    }
    &__time {
        font-size: 14px;
        color: #666;
    }
    &__process {
        // width: 100%;
        // height: 6px;
        // background: #ccc;
        // border-radius: 3px;
        flex: 1;
        margin: 0 20px;
    }
}
</style>
