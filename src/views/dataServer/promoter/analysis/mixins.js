export const mixins = {
    data() {
        return {
            reqData: {
                op: 'selectOrgByOrgType',
                moduleName: '/dataServer/promoterAnalysis',
            },
            moduleName: '/dataServer/promoterAnalysis',
            roleType: 0, // 账户角色
            minDate: null,
            maxDate: null,
            pickerOptions: {
                shortcuts: [
                    {
                        text: '今年至今',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date(new Date().getFullYear(), 0);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: '最近六个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setMonth(start.getMonth() - 5);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: '最近一年',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setMonth(start.getMonth() - 12);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                ],
                onPick: ({ maxDate, minDate }) => {
                    this.minDate = minDate;
                    this.maxDate = maxDate;
                },
                disabledDate: time => {
                    if (this.minDate !== null && this.maxDate === null) {
                        let minMonth = this.minDate.getMonth(),
                            lastYear = new Date(this.minDate).setMonth(minMonth - 12),
                            nextYear = new Date(this.minDate).setMonth(minMonth + 12);
                        let minTime = this.minDate.getTime();
                        let nextTime = new Date().setMonth(new Date().getMonth() + 12);
                        let lastTime = new Date().setMonth(new Date().getMonth() - 12);
                        if (minTime <= nextTime || minTime >= lastTime) {
                            //开始日期少于当前月+12个月 并且大于当前月-12个月&#xff0c;则表示只限制前面的范围
                            return time.valueOf() > new Date().getTime() || time.valueOf() > nextYear.valueOf() || time.valueOf() < lastYear.valueOf();
                        } else {
                            // 只能选 minDate 前后一年的范围
                            return time.valueOf() < lastYear.valueOf() || time.valueOf() > nextYear.valueOf();
                        }
                    } else {
                        let date = new Date();
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        if (month >= 1 && month <= 9) {
                            month = '0' + month;
                        }
                        let currentdate = year.toString() + month.toString();

                        let timeyear = time.getFullYear();
                        let timemonth = time.getMonth() + 1;
                        if (timemonth >= 1 && timemonth <= 9) {
                            timemonth = '0' + timemonth;
                        }
                        let timedate = timeyear.toString() + timemonth.toString();
                        return currentdate < timedate;
                    }
                },
            },
        };
    },
    computed: {
        selectOptions() {
            const arr = [
                { value: '10', label: '大区' },
                { value: '20', label: '城市分公司' },
                { value: '30', label: '区县分公司' },
                { value: '40', label: '实体店' },
            ];
            if (this.roleType === 5) {
                return arr.slice(1)
            }
            if (this.roleType === 20) {
                return arr.slice(2)
            }
            if (this.roleType === 30) {
                return arr.slice(3)
            }
            return arr.slice(0)
        },
    },
    mounted() {
        this.roleType = (this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType) || 0;

        // 监听页面变化
        this.ro = new ResizeObserver((entries, observer) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                this.$nextTick(() => {
                    this.resize()
                });
            }
        });
        this.ro.observe(document.querySelector('.promoter-analysis'));
    },
    beforeDestroy() {
        let dom = document.querySelector('.promoter-analysis');
        if (dom) {
            this.ro.unobserve(dom);
        }
    },
};
