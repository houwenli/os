<template>
    <div class="warp">
        <div v-if="list.length===0" class="no">
            <img :src="noData" alt="">
            暂无排名数据
        </div>
        <div>
            <div class="box" :class="{'all': all}">
                <div class="item" v-for="(item, i) in list" :key="i">
                    <div class="serialNo-name">
                        <span class="serialNo" :class="[i < 3 ? 'bg_FF9B00': '']">{{ i + 1 }}</span>
                        <span class="name">{{ item.name }}</span>
                    </div>
                    <div class="bar" :style="{'padding-right': rightWidth + 'px'}">
                        <div class="bgc" :style="computePer(item.value)">
                            <span :style="{'right': -(rightWidth - 10) + 'px'}">{{ item.value }}人</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="btn" @click="handelOpen" v-if="datas.length > 10">
                <i class="el-icon-d-arrow-right" :class="{'rotate': all}" />
                <span style="margin-left: 6px;">{{ all ? '收起' : '展开'}}</span>
            </div> -->
        </div>
    </div>
</template>

<script>
import noData from '@/assets/images/img_no_data.png'
export default {
    name: 'Ranking',
    props: {
        datas: {
            type: Array,
            // required: true
            default: () => []
        }
    },
    data() {
        return {
            list: [],
            maxVal: null,
            rightWidth: null,
            all: false,
            noData: noData
        }
    },
    mounted() {
        this.proData(this.datas)
    },
    watch: {
        datas(val) {
            // console.log(val)
            this.proData([...val])
        }
    },
    methods: {
        // 处理数据
        proData(list) {
            if (list.length <= 0) {
                this.maxVal = null
                this.rightWidth = null
                this.list = []
                return
            }
            const arr = list.sort((a, b) => { return b.value - a.value })
            this.maxVal = arr[0].value
            this.rightWidth = this.computeWidth(this.maxVal + '人') + 20
            this.list = arr
            // console.log(arr)
        },
        // 计算文字占用宽度
        computeWidth(str, fontSize = 12) {
            const dom = document.createElement('span')
            dom.innerText = str
            dom.style.fontSize = fontSize + 'px'
            dom.style.visibility = 'hidden';
            document.body.appendChild(dom);
            let width = dom.getBoundingClientRect().width;
            document.body.removeChild(dom);
            return width;
        },
        // 计算柱状
        computePer(val) {
            let w = 0
            if (this.maxVal) {
                w = (val/this.maxVal).toFixed(6) * 100
            }
            return {
                width: w + '%'
            }
        },
        handelOpen() {
            this.all = !this.all
        }
    }
}
</script>

<style lang="scss" scoped>
    .warp {
        height: 100%;
        padding: 24px;
        overflow: auto;
        margin-right: 1px;
    }
    .no {
        text-align: center;
        color: #999;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
            margin-bottom: 10px;
        }
    }
    .box {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        // max-height: 280px;
        transition: all 3s linear;
        overflow: hidden;
        &.all {
            // max-height: none;
        }
        .item {
            width: calc(50% - 20px);
            width: 100%;
            display: flex;
            align-items: center;
            margin-bottom: 14px;
            // flex: 1;
            &:nth-of-type(2n - 1) {
                // margin-right: 20px;
            }
            &:nth-of-type(2n) {
                // margin-left: 20px;
            }
            .serialNo-name {
                display: flex;
                align-items: center;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-size: 12px;
            }
            .serialNo {
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background: #909399;
                border-radius: 50%;
                font-weight: 400;
                color: #FFFFFF;
                margin-right: 6px;
                &.bg_FF9B00 {
                    background: #FF9B00;
                }
            }
            .name {
                font-weight: 600;
                color: #606266;
                // line-height: 17px;
                width: 100px;
            }
            .bar {
                flex: 1;
                height: 22px;
                margin-left: 10px;
                display: flex;
                align-items: center;
                position: relative;
                .bgc {
                    height: 100%;
                    background: #254BE9;
                    position: relative;
                }
                span {
                    flex: 1;
                    position: absolute;
                    // right: 0px;
                    top: 3px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #303133;
                }
            }
        }
    }
    .btn {
        width: 50px;
        margin: 0 auto;
        cursor: pointer;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0088FF;
        line-height: 17px;
        i {
            transform: rotate(90deg);
            &.rotate {
                transform: rotate(-90deg);
            }
        }
    }
</style>