import { debounce } from 'lodash-es'
export const mixins = {
    computed: {
        orgType() {
            return this.$baseMethod.getStore('roleOption')?.orgType ?? 0
        },
        oaPower() {
            return (moduleName) => {
                return this.getModulePower(this.moduleName ?? moduleName)
            }
        }
    },

    methods: {
        /**
         * @description: 自适应echart
         */
        autoResize() {
            for (let s of Object.keys(this.$refs)) {
                if (s) {
                    if (this.myChart) {
                        this.myChart.resize();
                    } else {
                        let myChart = this.$refs[s]?.myChart
                        if (Array.isArray(myChart)) {
                            for (let i = 0; i < myChart.length; i++) {
                                const e = myChart[i];
                                e.resize();
                            }
                        } else {
                            myChart.resize();
                        }
                    }
                }
            }
        },


        /**
         * @description: 公共请求
         * @param {string} op 
         * @param {object} data 请求参数
         * @param {object} moduleName 请求模快
         * @return {object} 
         */
        commonAjax(op, data, moduleName) {
            const url = this.$getModuleUrl(this.moduleName ?? moduleName, op), params = { data, op }
            if (url) {
                return this.$axios(url, params).then(({ code, data }) => {
                    if (code === 1) {
                        return data && JSON.parse(data)
                    }
                }).catch((err) => {
                    throw new Error(err)
                })
            }
        },
        // 处理数据
        returnPieLegendData(data = []) {
            if (data.length) {
                return data.map(item => item.desc);
            }
        },
        //数据中心迁移代码
        returnPieSeriesData(data = [], valName) {
            if (data.length) {
                return data.map(item => {
                    // 饼图不显示0数据
                    item[valName] = item[valName] ? item[valName] : '';
                    if (valName === 'cnt') {
                        return { value: item[valName], name: item.desc };
                    }
                    return {
                        value: Math.round((item[valName] / 100) * 100) / 100,
                        name: item.desc
                    };
                });
            }
        },

    },

    created() {
        this.resize = debounce(this.autoResize, 100)
    },

    mounted() {
        window.addEventListener('resize', this.resize)
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.resize)
    },
}