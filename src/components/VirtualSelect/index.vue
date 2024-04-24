<!--
 * @Author: DaiYu
 * @Date: 2022-09-20 10:35:56
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-10-08 18:11:57
 * @FilePath: \main\src\components\VirtualSelect\index.vue
 * @description: 虚拟列表select
-->
<template>
    <el-select
        :value="defaultValue"
        popper-class="virtualselect"
        :multiple="multiple"
        filterable
        :filter-method="filterMethod"
        @visible-change="visibleChange"
        :popper-append-to-body="false"
        ref="select"
        v-bind="$attrs"
        v-on="$listeners"
        v-click-outside="hide"
    >
        <virtual-list
            ref="virtualList"
            class="virtualselect-list"
            :data-key="value"
            :data-sources="selectArr"
            :data-component="itemComponent"
            :keeps="20"
            :extra-props="{
                label,
                value,
                isRight,
            }"
        ></virtual-list>
    </el-select>
</template>
<script>
import virtualList from 'vue-virtual-scroll-list';
import ElOptionNode from './el-option-node';
export default {
    components: {
        'virtual-list': virtualList,
    },
    model: {
        prop: 'defaultValue',
        event: 'change',
    },
    props: {
        label: {
            type: String,
            default: 'name',
        },
        value: {
            type: String,
            default: 'agencyNumber',
        },
        isRight: {
            type: Boolean,
            default: false,
        },
        selectOptions: {
            type: Array,
            default() {
                return [];
            },
        }, //父组件传的值
        defaultValue: {
            type: Array,
            default: () => (this.multiple ? [] : ''),
        }, // 绑定的默认值
        multiple: {
            type: Boolean,
            default: true,
        },
        showAll: {
            type: Boolean,
            default: true,
        },
    },
    mounted() {
        this.init();
    },
    watch: {
        selectOptions() {
            this.init();
        },
    },
    data() {
        return {
            itemComponent: ElOptionNode,
            selectArr: [],
        };
    },
    methods: {
        init() {
            this.selectArr = JSON.parse(JSON.stringify(this.selectOptions));
            if (!this.defaultValue || !this.defaultValue.length) {
            } else {
                // 回显问题
                // 由于只渲染20条数据,当默认数据处于20条之外,在回显的时候会显示异常
                // 解决方法:遍历所有数据,将对应回显的那一条数据放在第一条即可
                let obj = [];
                let indexs = [];
                for (let i = 0; i < this.selectArr.length; i++) {
                    const element = this.selectArr[i];
                    if (this.multiple) {
                        // 多选
                        if (this.defaultValue.includes(element[this.value])) {
                            obj.push(element);
                            indexs.push(i);
                            if (obj.length === this.defaultValue.length) {
                                break;
                            }
                        }
                    } else {
                        // 单选
                        if (element[this.value] === this.defaultValue) {
                            obj.push(element);
                            break;
                        }
                    }
                }
                if (this.multiple) {
                    this.selectArr = [...obj, ...this.selectArr.filter((_, i) => !indexs.includes(i))];
                }
            }
            if (this.showAll) {
                this.selectArr.unshift({
                    [this.value]: 0,
                    [this.label]: '全部',
                });
            }
        },
        // 搜索
        filterMethod(query) {
            if (query !== '') {
                this.$refs.virtualList.scrollToIndex(0); //滚动到顶部
                setTimeout(() => {
                    this.selectArr = this.selectOptions.filter(item => {
                        return this.isRight ? item[this.label].indexOf(query) > -1 || item[this.value].indexOf(query) > -1 : item[this.label].indexOf(query) > -1;
                    });
                }, 100);
            } else {
                this.init();
            }
        },
        visibleChange(bool) {
            if (!bool) {
                this.$refs.virtualList.reset();
                this.init();
            }
        },
        hide() {
            this.$nextTick(this.$refs.select.blur)
        },
    },
};
</script>
<style lang="scss" scoped>
.virtualselect {
    // 设置最大高度
    &-list {
        max-height: 245px;
        overflow-y: auto;
        width: 220px;
        user-select: none;
    }
}
</style>
