<template>
    <div class="select_tree">
        <div class="select_tree_box">
            <el-checkbox ref="wsCheckbox" v-show="isShowCheck" v-model="isAllSelect" class="all_check" @change="$emit('allSelect', isAllSelect)">全选</el-checkbox>
            <ul v-show="treeList && treeList.length > 0">
                <li v-for="(item, index) in treeList" :key="`${index}${new Date()}`" @click="liEvent(item)">
                    <el-checkbox :value="checkIds.includes(item.id)" :class="[!item.isLeaf && 'visibility']" @change="checkEvent(item)"></el-checkbox>
                    <slot :row="item"></slot>
                    <i v-show="!item.isLeaf" class="el-input__icon el-icon-arrow-right"></i>
                </li>
            </ul>
            <div v-show="treeList && treeList.length === 0" class="empty_box">
                <img :src="emptyImg" />
                <p>暂未成员<br />管理员还没有设置人员
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        treeList: null,
        isShowCheck: {
            type: Boolean,
            default: false
        },
        isAllChecked: {
            type: Boolean,
            default: false
        },
        checkList: {
            type: Array,
            default: () => []
        }
    },

    computed: {
        checkIds() {
            return this.checkList.map(item => item.id);
        }
    },

    data() {
        return {
            isAllSelect: false,
            emptyImg: require('@/assets/images/img_no_data.png')
        };
    },

    watch: {
        isAllChecked: {
            handler: function (val) {
                this.isAllSelect = val;
            },
            immediate: true
        }
    },

    methods: {
        liEvent(item) {
            !item.isLeaf && this.$emit('click', item);
        },
        checkEvent(item) {
            this.$emit('checkEl', item);
        }
    }
};
</script>

<style lang="scss" scoped>
.select_tree {
    flex: 1;
    overflow-y: hidden;

    .select_tree_box {
        height: 100%;
        display: flex;
        flex-direction: column;

        .all_check {
            padding: 7px 0;
            margin-left: 8px;
            color: #303133;
        }

        ul {
            flex: 1;
            overflow-y: auto;

            li {
                padding: 8px;
                display: flex;
                font-size: 14px;
                color: #303133;
                line-height: 16px;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;

                p {
                    padding-left: 10px;
                    flex: 1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    -o-text-overflow: ellipsis;
                }

                span {
                    flex: 1;
                    font-size: 14px;
                    color: #909399;
                    line-height: 16px;
                    margin-left: 4px;
                    font-style: normal;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    -o-text-overflow: ellipsis;

                    i {
                        font-style: normal;
                    }
                }

                .el-icon-arrow-right {
                    line-height: 18px;
                }
            }

            li:hover {
                background: #f5f7fa;
            }
        }

        .empty_box {
            flex: 1;

            img {
                width: 100px;
                height: 100px;
                display: block;
                margin: 76px auto 0;
            }

            p {
                font-size: 14px;
                color: #606266;
                line-height: 20px;
                text-align: center;
                margin-top: 8px;
            }
        }
    }

    .visibility {
        visibility: hidden;
    }
}
</style>
