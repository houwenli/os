<template>
    <div class="bg-box">
        <div class="title">累计订单量</div>
        <div class="fristBox">
            <div class="fristBox-dataBox" v-for="(item, index) in fristDataBox" :key="index">
                <div class="dataTitle">{{ item.name }}</div>
                <div class="dataNumber">{{ thousandSeparator(item.num) }}</div>
            </div>
        </div>
        <div class="title">平台供应商数量</div>
        <div class="fristBox">
            <div class="dataBox" v-for="(item, index) in secondDataBox" :key="index">
                <div class="dataTitle">{{ item.name }}</div>
                <div class="dataNumber">{{thousandSeparator(item.num) }}</div>
            </div>
        </div>
        <div class="title">商品数量分析</div>
        <div class="fristBox">
            <div class="dataBox" v-for="(item, index) in thirdDataBox" :key="index">
                <div class="dataTitle">{{ item.name }}</div>
                <div class="dataNumber">{{ thousandSeparator(item.num) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fristDataBox: [
                {
                    name: '累计下单量',
                    num: 0
                },
                {
                    name: '累计支付订单量',
                    num: 0
                },
                {
                    name: '累计售后订单量',
                    num: 0
                }
            ],
            secondDataBox: [
                {
                    name: '累计入驻供应商数量',
                    num: 0
                },
                {
                    name: '营业中供应商数',
                    num: 0
                },
                {
                    name: '审核中供应商数',
                    num: 0
                },
                {
                    name: '停业供应商数',
                    num: 0
                }
            ],
            thirdDataBox: [
                {
                    name: '累计上架SPU总量',
                    num: 0
                },
                {
                    name: '在售SPU数',
                    num: 0
                },
                {
                    name: '在售SKU数',
                    num: 0
                },
                {
                    name: '动销SPU数',
                    num: 0
                }
            ]
        }
    },
    mounted(){
     this.getbrandList()
    },
    methods: {
        thousandSeparator(num) {
            var res = num.toString().replace(/\d+/, function (n) {
                // 先提取整数部分
                return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                    return $1 + ','
                })
            })
            return res
        },
        getbrandList() {
            let data = {
                op: 'statistics'
            }
            try {
                this.$axios('/wsf/statistics/select', data).then(res => {
                    //列表
                    if (res.code === 1) {
                        console.log(res)
                        res.data=JSON.parse( res.data)
                        this.fristDataBox[0].num = res.data.orderNumber //累计下单量
                        this.fristDataBox[1].num = res.data.payNumber //累计支付订单量
                        this.fristDataBox[2].num = res.data.afterOrderNumber
                        this.secondDataBox[0].num = res.data.becomeStorerNumber //累计入驻供应商数量
                        this.secondDataBox[1].num = res.data.businessStorerNumber//营业中供应商数
                        this.secondDataBox[2].num = res.data.examineStorerNumber//审核中供应商数
                        this.secondDataBox[3].num = res.data.stopStorerNumber//停业供应商数
                        this.thirdDataBox[0].num = res.data.shelfSpuNumber//累计上架SPU总量
                        this.thirdDataBox[1].num = res.data.saleSpuNumber//在售SPU数
                        this.thirdDataBox[2].num = res.data.saleSkuNumber//在售SKU数
                        this.thirdDataBox[3].num = res.data.movingSpuNumber//动销SPU数
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.bg-box{
    background-color: #ffffff;
    border-radius: 8px;
}
.title {
    margin: 32px 0px 16px 47px;
    height: 22px;
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;   //待确认的样式
    color: #303133;
}
.fristBox {
    margin-left: 40px;
    margin-right: 40px;
    display: flex;
}
.fristBox-dataBox{
    display: inline-block;
    width: 32.5%;
    height: 21.5%;
    margin: 7px 0 0 12px;
    background: #ffffff;
    box-shadow: 0px 5px 16px 0px rgba(186, 186, 186, 0.2);
    border-radius: 8px;
    border: 1px solid #ebeef5;
    .dataTitle {
        margin: 24px 40px 0px 40px;
        text-align: center;
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        color: #303133;
    }
    .dataNumber {
        margin: 24px 40px 28px 40px;
        text-align: center;
        height: 56px;
        line-height: 56px;
        font-size: 48px;
        color: #303133;
        font-weight: bold;
    }
}
.dataBox {
    display: inline-block;
    width: 24.2%;
    height: 21.5%;
    margin: 7px 0 0 12px;
    background: #ffffff;
    box-shadow: 0px 5px 16px 0px rgba(186, 186, 186, 0.2);
    border-radius: 8px;
    border: 1px solid #ebeef5;
    .dataTitle {
        margin: 24px 40px 0px 40px;
        text-align: center;
        width: 78.4%;
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        color: #303133;
    }
    .dataNumber {
        margin: 24px 40px 28px 40px;
        text-align: center;
        width: 78.4%;
        height: 56px;
        line-height: 56px;
        font-size: 48px;
        color: #303133;
        font-weight: bold;
    }
}
</style>
