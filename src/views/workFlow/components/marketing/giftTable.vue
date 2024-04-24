<template>
    <ws-table-el v-bind="tableConfig" :data="tableData" :header-cell-style="{ background: '#F5F7FA' }">
        <template>
            <ws-table-column-el v-for="item in tableKeys" :prop="item.key" :width="item.width" :label="item.name" :key="item.key">
                <template v-if="item._node" slot-scope="scope">
                    <span v-html="item._node(scope.row, this)"></span>
                </template>
            </ws-table-column-el>
        </template>
    </ws-table-el>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        tableData: {
            type: Array,
            default: () => [],
        },
        tableList: {
            type: Array,
            default: () => [],
        },
        type: {
            type: [String , Number],
            default:0,
        },
    },

    computed: {
        ...mapState({
            availableChannelFilters: state => state.workFlow.availableChannelFilters,
            useCityFilters: state => state.workFlow.useCityFilters,
            fitBusinessFilters: state => state.workFlow.fitBusinessFilters,
            couponsTypeFilters: state => state.workFlow.couponsTypeFilters,
        }),
        tableKeys() {
            return this.tableList.length > 0 ? this.tableList : (this.defaultTable[this.type]||[]);
        },
    },

    data() {
        return {
            tableConfig: {
                filterColumns: false,
                indexColumn: false,
                pagination: false,
                autoHeight: false,
            },
             defaultTable: {
                1: [
                    {
                    name: '出行券名称',
                    key: 'giftName',
                    },
                    {
                        name: 'App显示别名',
                        key: 'showName',
                        _node: row => {
                            return row.activityPackType === 1 ? row.showName : '--';
                        },
                    },
                    {
                        name: '出行券类型',
                        key: 'couponsType',
                        _node: row => (row.activityPackType === 1 ? this.getEnumVal(this.couponsTypeFilters, row.couponsType, 'value') : (row.activityPackType === 2?'红包':'电商优惠券')),
                    },
                    {
                        name: '优惠金额',
                        key: 'faceValue',
                        _node: row => this.faceValueHandle(row),
                    },
                    {
                        name: '适用业务',
                        key: 'serviceId',
                        _node: row => {
                            let text = this.getEnumVal(this.fitBusinessFilters, row.serviceId ? row.serviceId.split(',') : '', 'value').toString();
                            return row.ifAllBusiness === 1 ? '不限' : text;
                        },
                    },
                    {
                        name: '数量',
                        key: 'sendNumber',
                    },
                    {
                        name: '有效期',
                        width: '350px',
                        key: 'effectiveStartTime',
                        _node: row => this.timeHandle(row),
                    },
                    {
                        name: '可用时间段',
                        width: '120px',
                        _node: row => this.availableHandle(row),
                    },
                    {
                        name: '适用城市',
                        width: '120px',
                        key: 'useCity',
                        _node: row => {
                            let text = this.getEnumVal(this.useCityFilters, row.useCity, 'value');
                            return row.activityPackType === 1 ? text : '--';
                        },
                    },
                    {
                        name: '可用渠道',
                        width: '120px',
                        key: 'availableChannel',
                        _node: row => {
                            let text = this.getEnumVal(this.availableChannelFilters, row.availableChannel, 'value');
                            return row.activityPackType === 1 ? text : '--';
                        },
                    }
                ],
                2: [
                    {
                        name: '红包名称',
                        key: 'giftName'
                    },
                    {
                        name: '优惠金额',
                        key: 'faceValue',
                        _node: row => this.faceValueHandle(row)
                    },
                    {
                        name: '数量',
                        key: 'sendNumber'
                    }
                ],
                3: [
                    {
                        name: '优惠券名称',
                        key: 'giftName'
                    },
                    {
                        name: 'App别名',
                        key: 'showName'
                    },
                    // {
                    //     name: '券包类型',
                    //     key: 'couponsType',
                    //     _node: row => (row.activityPackType === 1 ? getEnumVal(couponsTypeFilters, row.couponsType, 'value') : (row.activityPackType === 2?'红包':'电商优惠券')),
                    // },
                    {
                        name: '券包类型',
                        key: 'couponsType',
                        _node: row => (row.couponsType === 3 ? '立减' : '折扣')
                    },
                    {
                        name: '金额/折扣',
                        key: 'faceValue',
                        _node: row => this.faceValueHandle(row,true)
                    },
                    {
                        name: '数量',
                        key: 'sendNumber'
                    },
                    {
                        name: '有效期',
                        width: '350px',
                        key: 'effectiveStartTime',
                        _node: row => this.timeHandle(row)
                    },
                    {
                        name: '商品spu名称',
                        width: '120px',
                        key: 'commodityName'
                        // _node: row => {
                        //      return row.ifAllCommodity == 1 ? '全部' : '部分';
                        // },
                    }
                ]
            }
        };
    },
    created(){},
    methods: {
        faceValueHandle(row,tag) {
            let { couponsType, faceValue, amountLimitation, redPacketMoney, activityPackType } = row;
            let text;
            switch (couponsType) {
                case 1: // 满减
                    text = `满${amountLimitation / 100 || '--'}元减${faceValue / 100 || '--'} 元`;
                    break;
                case 2: // 折扣
                    text = tag ? `${faceValue / 100 || '--'} 折` : `${faceValue / 100 || '--'} 折/${amountLimitation / 100 || '--'} 元`;
                    break;
                case 3: // 立减
                    text = `${faceValue / 100 || '--'} 元`;
                    break;
                default:
                    text = '--';
                    break;
            }
            activityPackType == 2 && (text = `${redPacketMoney / 100} 元`)
            return text;
        },

        timeHandle(row) {
            let { validDay, effectiveStartTime, effectiveEndTime, couponsPeriodType } = row;
            if (couponsPeriodType === 1) {
                // 红包
                return `领取后${validDay || '--'}天内有效`;
            } else {
                return `${effectiveStartTime || '--'} 至 ${effectiveEndTime || '--'}`;
            }
        },

        availableHandle(row) {
            let { availableStartTime, availableEndTime } = row;
            if (!availableStartTime && !availableEndTime) return '--';
            return `${availableStartTime || '--'}-${availableEndTime || '--'}`;
        },
    },
};
</script>
