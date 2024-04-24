export const marketing = {
    data() {
        return {
            riskAndSets: [],
            modelList: []
        }
    },
    created() {
        this.getPassengerRiskType();
        this.getModelType()
    },
    methods: {
        // 金额展示处理
        // type 立减类型
        // discount 折扣
        // num 金额
        faceValueHandle(row, type='couponsType', discount="row[discount]", num="row[num]") {
            let text;
            switch (row[type]) {
                case 1:
                    text = `满${row[discount] / 100 || '--'}元减${row[num] / 100 || '--'} 元`;
                    break;
                case 2:
                    text = `${row[discount] / 100 || '--'} 折/${row[num] / 100 || '--'} 元`;
                    break;
                case 3:
                    text = `${row[num] / 100 || '--'} 元`;
                    break;
                default:
                    text = '--';
                    break;
            }
            return text;
        },
        async getPassengerRiskType(riskTypeCode) {
            try {
                let res = await this._axios({ activityRiskType: -1, riskTypeCode: riskTypeCode, op: 'queryPassengerRiskType' }, '', '/passengerAct/common/select')
                if (res.code === 1) {
                    this.riskAndSets = res.data
                }
            } catch (_err) {
                console.log(_err)
            }
        },
        async getModelType() {
            try {
                let res = await this._axios({ patternType: 10, op: 'selectAvailableOrgPattern' }, '', '/orgActivity/pattern/select')
                if (res.code === 1) {
                    this.modelList = res.data.body
                }
            } catch (_err) {
                throw _err
            }
        },

        // 获取模板列表
        // type 1,注册送-小程序  101,注册送-H5   8,推荐乘客 10,平台推广 12,好友助力 171,定时抢券H5 172,定时抢券小程序
        async getTemplateList(type, key='templateList') {
            try {
                let res = await this._axios({ type, op: 'dropDownBox' }, '', '/activity/drive/select')
                if (res.code === 1) {
                    this[key] = res.data
                }
            } catch (_err) {
                throw _err
            }
        },
    }
}