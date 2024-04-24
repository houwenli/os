<template>
    <div :class="['searchBox', customClass]">
        <div class="left">
            <div class="custom" v-if="$slots.custom">
                <slot name="custom"></slot>
            </div>
            <div class="org" v-if="showOrgSearch">
                选择机构：
                <el-cascader style="width: 270px" placeholder="请选择机构" v-model="searchOptions.relationId" filterable
                    :props="props" clearable>
                </el-cascader>
            </div>
            <div class="day" v-show="showDaySearch">
                选择日期：
                <el-date-picker style="width: 270px;" v-model="searchOptions.dateTime" type="daterange"
                    value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" :picker-options="pickerOptions" :clearable="false" @blur="blur">
                </el-date-picker>
            </div>
            <div class="day" v-show="showTodaySearch">
                选择日期：
                <el-date-picker value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 270px;"
                    v-model="searchOptions.date" type="date" :clearable="false">
                </el-date-picker>
            </div>
        </div>
        <div class="right">
            <ws-enter-event>
                <el-button icon="el-icon-search" type="primary" @click="search" style="width: 96px;">查询</el-button>
            </ws-enter-event>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex"
export default {
    props: {
        id: {
            type: String | Number,
            default: 0,
        },
        showDaySearch: {
            type: Boolean,
            default: true,
        },
        showOrgSearch: {
            type: Boolean,
            default: true,
        },
        showTodaySearch: {
            type: Boolean,
            default: false,
        },
        customClass: {
            type: String,
            default: ''
        },
    },

    computed: {
        userArea() {
            const userArea = this.$store.getters.userArea;
            return userArea || {};
        },
        orgType() {
            return this.$baseMethod.getStore('roleOption')?.orgType ?? 0
        },
    },

    data() {
        return {
            searchOptions: {
                dateTime: [
                    new Date(this.$baseMethod.getBeforeDay(-6, 'yyyy/MM/dd', new Date())),
                    new Date(this.$baseMethod.getBeforeDay(0, 'yyyy/MM/dd', new Date()))
                ],
                relationId: [],
                date: new Date()
            },
            choiceDate: '',
            props: {
                expandTrigger: 'click',
                value: 'number',
                label: 'name',
                checkStrictly: true,
                lazy: true,
                lazyLoad: this.lazyLoad
            },
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    this.choiceDate = minDate.getTime();
                    if (maxDate) {
                        this.choiceDate = '';
                    }
                },
                disabledDate: time => {
                    if (this.choiceDate) {
                        const firstDay = new Date(this.$baseMethod.getBeforeDay(-30, 'yyyy/MM/dd', new Date(this.choiceDate)))
                        const lastDay = new Date(this.$baseMethod.getBeforeDay(30, 'yyyy/MM/dd', new Date(this.choiceDate)))
                        return time.getTime() < firstDay || time.getTime() > lastDay || time.getTime() > Date.now()
                    } else {
                        return time.getTime() > Date.now() || time < new Date('2022.1.1');
                    }
                },
            },
        }
    },

    methods: {
        ...mapActions('orderAnalysis', ['getOrgs', 'getArea']),
        search() {
            const { searchOptions, id } = this
            this.$emit('search',
                {
                    dateTime: [
                        this.$baseMethod.formatData(searchOptions.dateTime[0], 'yyyy-MM-dd') || null,
                        this.$baseMethod.formatData(searchOptions.dateTime[1], 'yyyy-MM-dd') || null
                    ],
                    relationId: searchOptions.relationId,
                    date: this.$baseMethod.formatData(searchOptions.date, 'yyyy-MM-dd') || null,
                    id,
                })
        },
        blur() {
            this.choiceDate = ''
        },
        lazyLoad(node, resolve) {
            let item = node.data;
            if (!item) {
                if (this.userArea && this.userArea.region) {
                    resolve(this.userArea.region);
                } else {
                    this.getArea().then(res => {
                        res.region.forEach(item => {
                            if (this.orgType === 5) {
                                item.leaf = true;
                            }
                            if (this.orgType === 30) {
                                item.leaf = true;
                            }
                            if (this.orgType === 40) {
                                item.leaf = true;
                            }
                        })
                        resolve(res.region);
                    });
                }
            } else {
                if (item.leaf) {
                    resolve(item);
                    return;
                }
                // const params = item ? (item.type === 0 ? { bigRegionNumber: item.number } : { regionNumber: item.number }) : {};
                let params = {}
                if (item) {
                    if (item.type === 0) {
                        params = { bigRegionNumber: item.number }
                    }
                    if (item.type === 10) {
                        params = { regionNumber: item.number }
                    }
                    if (item.type === 20) {
                        params = { companyNumberList: [item.number] }
                    }
                    if (item.type === 30) {
                        params = { centerNumber: item.number }
                    }
                }
                this.getOrgs(params).then(result => {
                    result.forEach(item => {
                        if (this.orgType<10) {
                            item.leaf = item.type === 20;
                        }
                        if (this.orgType === 20) {
                            item.leaf = item.type === 40;
                        }
                        if (this.orgType === 30) {
                            item.leaf = false;
                        }
                    });
                    resolve(result);
                });
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.searchBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #F5F7FA;
    border-radius: 8px;
    border: 1px solid #EBEEF5;
    height: 76px;
    padding: 0 24px;
    // margin-bottom: 32px;

    .left {
        display: flex;
        align-items: center;

        .org {
            margin-right: 32px;
        }
    }
}
</style>