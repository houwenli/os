<template>
    <div class="select_tree">
        <div class="select_tree_box">
            <ul v-show="treeList && treeList.length > 0">
                <li v-for="(item, index) in treeList" :key="`${index}${new Date()}`">
                    <el-checkbox :value="checkIds.includes(item.id)" @change="checkEvent(item)"></el-checkbox>
                    <!-- <el-checkbox :true-label="item.id" @change="checkEvent(item)"></el-checkbox> -->
                    <span @click="!item.isLeaf && !(item.parentId == 0 && item.depType && item.depType == 2) && liEvent(item)">
                        <slot :row="item" ></slot>
                    </span>
                        
                    
                    <template>
                        <i v-if="deptType===0">
                            <!-- 高管模式 -->
                            <i
                                v-show="!item.isLeaf "
                                class="el-icon-arrow-right"
                                :class="[checkIds.includes(item.id)]"
                                @click="liEvent(item)"
                            ></i>
                        </i>
                        <i v-else>
                            <i
                                v-show="!item.isLeaf && !(item.parentId == 0 && item.depType && item.depType == 2)"
                                class="el-icon-arrow-right"
                                :class="[checkIds.includes(item.id)]"
                                @click="liEvent(item)"
                            ></i>
                            <!-- <i v-if="!item.isLeaf && deptType != 2" class="el-icon-arrow-right" :class="[checkIds.includes(item.id) && 'noClick']" @click="!checkIds.includes(item.id) && liEvent(item)" /> -->
                            <i v-if="item.parentId == 0 && item.depType && item.depType == 2" class="link-span">
                                <span @click.self="liEvent(item, 1)" :class="[checkIds.includes(item.id)]">组织机构</span>
                                <span @click.self="liEvent(item, 2)" :class="[checkIds.includes(item.id)]">部门</span>
                            </i>
                        </i>
                    </template>
                </li>
            </ul>
            <div v-show="treeList && treeList.length === 0" class="empty_box">
                <img :src="emptyImg" />
                <p>
                    暂未成员
                    <br />
                    管理员还没有设置人员
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
    inject: ['treeDeptType'],
    computed: {
        checkIds() {
            return this.checkList.map(item => item.id);
        }
    },

    data() {
        return {
            isAllSelect: false,
            isIndeterminate: false,
            emptyImg: require('@/assets/images/img_no_data.png'),
            deptType: null,
            filterType: null
        };
    },
    watch: {
        isAllChecked: {
            handler: function (val) {
                // this.isAllSelect = val;
            },
            immediate: true
        },
        treeDeptType: {
            handler(val) {
                if (val.deptType === 0) {
                    //高管模式
                    this.deptType = val.deptType;
                }
            },
            immediate: true
        }
    },

    methods: {
        liEvent(item, filterType) {
            this.filterType = filterType || this.filterType;
            !item.isLeaf && this.$emit('click', { item, filterType: this.filterType });
        },
        checkEvent(item) {
            this.$emit('checkEl', item);
        }
        // handleCheckAllChange(val){
        //     //  this.checkList = val ? this.treeList : [];
        //     //  this.isIndeterminate = false;
        // }
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
                .link-span {
                    span {
                        font-size: 14px;
                        color: #0088ff;
                    }
                }
                .noClick {
                    // span {
                    // visibility: hidden;
                    cursor: not-allowed;
                    // pointer-events: none;
                    opacity: 0.6;
                    // }
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

    .noClick {
        // visibility: hidden;
        cursor: not-allowed;
        // pointer-events: none;
        opacity: 0.6;
    }
}
</style>
