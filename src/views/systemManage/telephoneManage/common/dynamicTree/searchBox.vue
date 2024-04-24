<template>
    <div class="sever_search" @blur="selectPop = false" v-click-outside="close">
        <div class="sever_input">
            <i class="el-input__icon el-icon-search"></i>
            <input type="text" :placeholder="placeholder" v-model="inputVal" @focus="inputFocus" />
        </div>

        <ul class="sever_pop_list" v-if="selectPop && inputVal">
            <template  v-if="optionList[0].length >0 || optionList[1].length > 0">
                <template  v-if="optionList[0].length > 0">
                      <li class="dept_title">部门列表</li>
                       <li v-for="item in optionList[0]" :key="item.index" @click="$emit('click', item)">
                        <!-- <h3><p v-html="nameHandle(item.name)" /></h3> -->
                        <!-- <p class="part_text ellipsis">{{ item.partimeString }}</p> -->
                        <p class="dep_text ellipsis">{{ item.name }}</p>
                    </li>
                </template>
                 <template  v-if="optionList[1].length > 0">
                       <li class="dept_title">人员列表</li>
                       <li v-for="item in optionList[1]" :key="item.index" @click="$emit('click', item)">
                        <!-- <h3><p v-html="nameHandle(item.name)" /></h3> -->
                        <!-- <p class="part_text ellipsis">{{ item.partimeString }}</p> -->
                        <p class="dep_text ellipsis">{{ item.name }}</p>
                    </li>
                </template>
            </template>
           
            <template v-else>
                <li>
                    <p class="text_none ellipsis">没有匹配到任何结果</p>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        optionList: {
            type: Array,
            default: () => []
        },
        placeholder: {
            type: String,
            default: '请输入部门名称'
        }
    },
    data() {
        return {
            inputVal: '',
            selectPop: false
        };
    },
    computed: {
        // nameHandle() {
        //     return function (val) {
        //         return val.replace(new RegExp(`(${this.inputVal})`, 'g'), `<span style='color:#0088ff'>${this.inputVal}</span>`);
        //     };
        // }
    },
    watch: {
        inputVal(val) {
            this.inputFocus()
        }
    },
    methods: {
        inputFocus() {
            this.selectPop = true;
            this.$emit('change', this.inputVal);
        },

        close() {
            this.selectPop = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.sever_search {
    background: #ffffff;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    margin-bottom: 12px;
    position: relative;

    .sever_input {
        width: 100%;
        border-radius: 4px;
        border: 1px solid #d8dce6;
        padding: 12px 16px 10px 8px;
        display: flex;
        align-items: center;

        .el-icon-search {
            font-size: 16px;
            line-height: 14px;
        }

        input {
            margin-left: 4px;
            height: 14px;
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            color: #303133;
            line-height: 14px;
        }

        input::placeholder {
            font-weight: 400;
            color: #909399;
            line-height: 14px;
        }
    }

    .sever_pop_list {
        width: 100%;
        position: absolute;
        max-height: 400px;
        z-index: 3;
        overflow-y: auto;
        background: #ffffff;
        box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.06);
        border-radius: 4px;
        border: 1px solid #d8dce6;

        li {
            padding: 11px 25px 11px 28px;
            font-size: 14px;
            font-weight: 400;
            line-height: 14px;
            position: relative;
            cursor: pointer;

            h3 {
                font-size: 16px;
                font-weight: 700;
                color: #303133;
                line-height: 16px;
            }

            .part_text {
                color: #606266;
                // margin-top: 8px;
            }

            .dep_text {
                color: #909399;
                // margin-top: 8px;
            }
           

            .text_none {
                color: #909399;
                text-align: center;
            }
        }

        li:hover {
            background: #f5f7fa;
        }

        // li::after {
        //     content: '';
        //     position: absolute;
        //     width: calc(100% - 27px);
        //     height: 1px;
        //     background: #e7e9e9;
        //     right: 0;
        //     bottom: 0;
        // }
        .dept_title{
           font-weight: bold;
            padding: 14px 16px 14px 16px;
                // cursor: ;
        }
    }

    .ellipsis {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
    }
}
</style>
