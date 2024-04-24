<template>
    <div class="flowDiv" v-if="newNodeList.length">
        <div class="taskflow" v-for="(item, index) in newNodeList" :key="index">
            <div class="nodeEdge" :style="nodeStyle(item, 'borderColor') ? { 'border-color': nodeStyle(item, 'borderColor') } : ''" v-show="index == 0">
                <div class="head" v-if="index == 0" :style="nodeStyle(item, 'backgroundColor') ? { background: nodeStyle(item, 'backgroundColor') } : ''">
                    <div class="nodeName">
                        <span :style="nodeStyle(item, 'color') ? { color: nodeStyle(item, 'color') } : ''">{{ item[propObj.nodeName] }}</span>
                    </div>
                </div>

                <div
                    class="content"
                    :style="{
                        'justify-content': index == '0' ? 'flex-start' : 'center',
                        height: index == '0' ? 'calc(100% - 40px)' : '100%'
                    }"
                >
                    {{ getContent(item, propObj) }}
                </div>
            </div>
            <div
                class="node"
                :style="nodeStyle(item, 'borderColor') ? { 'border-color': nodeStyle(item, 'borderColor') } : ''"
                @mouseover="handleMouseOver(item, index)"
                @mouseout="handleMouseLeave(item, index)"
                v-show="index !== 0 && index !== newNodeList.length - 1"
            >
                <div
                    class="moveup"
                    v-show="isShowMoveup(index)"
                    :disabled="index === 1"
                    :class="{ disabled: index === 1 }"
                    @click="handleMoveUp(item, index)"
                    @mouseover.stop="handleMouseOver2(item, index)"
                    @mouseout.stop="handleMouseLeave2(item, index)"
                >
                    <img :src="index === 1 ? require('../../assets/images/up-not.png') : require('../../assets/images/up-available.png')" alt="" />
                    <!-- <i class="el-icon-arrow-up"></i> -->
                </div>
                <img
                    src="../../assets/images/icon_off2.png"
                    @click="handleDel(item, index)"
                    @mouseover.stop="handleMouseOver(item, index)"
                    v-show="currentNodeIndex === index"
                    class="closeBtn"
                    :class="{ mouseOver: currentNodeIndex === index ? true : false }"
                    alt=""
                />
                <!-- <i
                    class="el-icon-circle-close"
                    @click="handleDel(item, index)"
                    @mouseover.stop="handleMouseOver(item, index)"
                    v-show="currentNodeIndex === index"
                    :class="{ mouseOver: currentNodeIndex === index ? true : false }"
                ></i> -->
                <div class="head" :style="nodeStyle(item, 'backgroundColor') ? { background: nodeStyle(item, 'backgroundColor') } : ''">
                    <img :src="nodeStyle(item, 'iconClass')" alt="" />

                    <!-- <i :class="nodeStyle(item, 'iconClass')" :style="nodeStyle(item, 'color') ? { color: nodeStyle(item, 'color') } : ''"></i> -->
                    <div class="nodeNameInput" v-show="isShowHeadInput(index)">
                        <el-input :maxlength="10" @blur="handleNodeNameInputBlur(item, index)" v-model="item[propObj.nodeName]"></el-input>
                    </div>
                    <div class="nodeName" v-show="!isShowHeadInput(index)">
                        <span :style="nodeStyle(item, 'color') ? { color: nodeStyle(item, 'color') } : ''">
                            {{ item[propObj.nodeName] }}
                        </span>
                    </div>
                    <i class="el-icon-edit" v-show="isShowMoveup(index) && !isShowHeadInput(index)" @click="handelEditNodeName(index)"></i>
                </div>

                <div class="content" @click="handleEditNode(item, index)">
                    <div class="contentStrDiv" style="">
                        <div class="contentStr" v-show="item[propObj.personTypeName]">
                            <div v-if="!$scopedSlots.contentName">
                                <span>{{ item[propObj.personTypeName] }}</span>
                                <!-- 审批节点 -->
                                <span v-if="item.nodeType === 'sp' && item.personType === 8 && item.managerLevel">{{'第'+item.managerLevel+'级主管'}}</span>
                                <span v-if="item.personType == 12">-{{item.orgType | orgStr}}</span>
                            </div>
                            <div v-else>
                                <slot name="contentName" v-bind:item="item" v-bind:propObj="propObj"></slot>
                            </div>
                        </div>
                        <!-- 指定人/或指定账号组显示会签/或签  加入直属上级也应该显示  positionList新增直属机构的显示-->
                        <div style="margin-top: 5px" class="contentStr" v-show="isShowPerson(item)">
                            <div v-if="!$scopedSlots.content">
                                {{ item.personType == 12 ? getPosition(item.positionList) : getContent(item, propObj) }}
                                <span v-if="item[propObj.nodeSpTypeName]">{{ ' (' + item[propObj.nodeSpTypeName] + ')' }}</span>
                            </div>
                            <div v-else>
                                <slot name="content" v-bind:item="item" v-bind:propObj="propObj"></slot>
                            </div>
                        </div>
                    </div>
                    <div class="editIcon" >
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>

                <div
                    class="movedown"
                    @click="handleMoveDown(item, index)"
                    v-show="isShowMoveup(index)"
                    :class="{ disabled: index === newNodeList.length - 2 }"
                    :disabled="index === newNodeList.length - 2"
                    @mouseover.stop="handleMouseOver2(item, index)"
                    @mouseout.stop="handleMouseLeave2(item, index)"
                >
                    <img :src="index === newNodeList.length - 2 ? require('../../assets/images/down-not.png') : require('../../assets/images/down-available.png')" alt="" />
                    <!-- <i class="el-icon-arrow-down"></i> -->
                </div>
            </div>
            <div v-show="index == newNodeList.length - 1">流程结束</div>

            <div class="linediv" v-if="index !== newNodeList.length - 1">
                <div class="line"></div>
                <i class="el-icon-caret-bottom"></i>
                <div class="actionbtn" @click="addNode(item, index)">
                    <img src="../../assets/images/iconAdd.png" alt="" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { nodeConfig } from './enum';
export default {
    name: 'FlowChart',
    props: {
        nodeList: {
            type: Array,
            required: true,
            default: () => {
                return [];
            }
        },
        propObj: {
            type: Object,
            default: () => {
                return {
                    nodeName: 'label',
                    nodeType: 'nodeType',
                    personTypeName: 'personTypeName',
                    person: 'person'
                };
            },
            required: true
        }
    },
    filters:{
        orgStr (val) {
            if(val == 20) {
                return '分公司'
            } else if(val == 30) {
                return '服务中心'
            } else if(val == 5) {
                return '大区'
            } else {
                return '实体店'
            }
        }
    },
    data() {
        return {
            nodeConfig,
            newNodeList: [],
            currentNodeIndex: -1,
            currentNode: null,
            lastNodeIndex: -1,
            lastNode: null,
            isOver: false,
            isEditName: false,
            editIndex: -1
            // content:''
        };
    },
    methods: {
        addNode(item, i) {
            // this.newNodeList.splice(i + 1, 0, { label: "dccc" });
            this.$emit('addFlowNode', { item, i });
        },
        handleDel(item, i) {
            this.newNodeList.splice(i, 1);
            this.$emit('delFlowNode', { item, i });
        },
        handleMouseOver(item, index) {
            this.currentNodeIndex = Number(index);
            this.currentNode = item;
            this.isOver = false;
            if (this.lastNodeIndex != index && this.lastNodeIndex != -1) {
                if (this.isEditName) {
                    this.handleNodeNameInputBlur(this.lastNode ? this.lastNode : item, this.lastNodeIndex >= 0 ? this.lastNodeIndex : index);
                    this.isEditName = false;
                }
            }
            this.lastNodeIndex = index;
            this.lastNode = item;
        },
        handleMouseLeave(item, index) {
            if (item == this.currentNode && !this.isOver) {
                this.currentNodeIndex = -1;
                this.currentNode = null;
            }
        },
        handleMouseOver2(item, index) {
            this.isOver = true;
            this.currentNodeIndex = Number(index);
            this.currentNode = item;
            this.lastNodeIndex = index;
        },

        handleMouseLeave2(item, index) {
            this.currentNodeIndex = -1;
            this.currentNode = null;
        },
        handleMoveUp(item, index) {
            if (index > 1 && index < this.newNodeList.length - 1) {
                this.newNodeList.splice(index, 1);
                this.newNodeList.splice(index - 1, 0, item);
            }
        },

        handleMoveDown(item, index) {
            if (index >= 1 && index < this.newNodeList.length - 2) {
                this.newNodeList.splice(index, 1);
                this.newNodeList.splice(index + 1, 0, item);
            }
        },

        handelEditNodeName(index) {
            this.isEditName = true;
            this.currentNodeIndex = index;
            this.editIndex = index;
        },
        handleNodeNameInputBlur(item, index) {
            // this.$set(this.newNodeList[index],'label',item.label)
            this.$emit('changeFlowNodeName', { item, index });
            this.isEditName = false;
        },

        handleEditNode(item, index) {
            this.$emit('editFlowNode', { item, index });
            console.log('openDialog');
        },

        getPosition(val) {
            let plist = val.map(item => item.name)
            return plist.join(',')
        },

        isShowPerson(item) {
            if (item.positionList) {
                return true
            } else if (item[this.propObj.person]){
                return true
            } else if (item[this.propObj.personGroup] && item[this.propObj.personGroup].name) {
                return true
            } else if (item[this.propObj.personType] == 8) {
                return true
            } else if (item[this.propObj.personType] == 4) {
                return true
            } else {
                return false
            }
        }
    },
    computed: {
        isShowMoveup() {
            return function (index) {
                return index !== 0 && index !== this.newNodeList.length - 1 && this.currentNodeIndex === index;
            };
        },
        isShowHeadInput() {
            return function (index) {
                return this.editIndex == index && this.editIndex == this.currentNodeIndex && this.isEditName;
            };
        },
        nodeStyle() {
            return function (item, propName) {
                return this.nodeConfig[item[this.propObj.nodeType]] ? this.nodeConfig[item[this.propObj.nodeType]][propName] : '';
            };
        },
        getContent() {
            return function (item, propKey) {
                let content = '';
                if (this.propObj.setContent && typeof this.propObj.setContent === 'function') {
                    content = this.propObj.setContent(item, propKey);
                }
                return content;
            };
        },
    },
    watch: {
        nodeList: {
            handler(val) {
                if (!val.length) {
                    return;
                } else {
                    this.newNodeList = val;
                }
            },
            immediate: true
        },
        newNodeList: {
            handler(val) {
                this.$emit('update:nodeList', val);
            },
            immediate: true
        }
        /*'lastNode.label': {
      handler(val) {
        this.$emit("changeFlowNodeName",  { item:this.lastNode, index:this.lastNodeIndex });
      },
      immediate: true,
    },*/
    },
    created() {}
};
</script>

<style lang="scss" scoped>
.flowDiv {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #606266;
    .taskflow {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .nodeEdge {
            width: 280px;
            height: 108px;
            border: 1px solid #dcdfe6;
            box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);
            border-radius: 8px;
            .head {
                width: 100%;
                height: 40px;
                border-radius: 8px 8px 0 0;
                background-color: rgba(233, 242, 255, 1);
                display: flex;
                align-items: center;
                padding-left: 16px;
                .nodeName {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    margin-left: 5px;
                }
            }
            .content {
                margin-left: 16px;
                display: flex;
                align-items: center;
            }
        }
        .node {
            width: 280px;
            height: 108px;
            border: 1px solid #dcdfe6;
            box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);
            border-radius: 8px;
            position: relative;
            .head {
                width: 100%;
                height: 40px;
                border-radius: 8px 8px 0 0;
                background-color: rgba(233, 242, 255, 1);
                display: flex;
                align-items: center;
                padding-left: 16px;
                .nodeName {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    max-width: 140px;
                    margin-left: 5px;
                }
                .nodeNameInput {
                    line-height: 28px !important;
                    height: 28px !important;
                    width: 200px !important;
                    margin-left: 4px;
                    /deep/ .el-input--medium .el-input__inner {
                        width: 100%;
                        height: 28px !important;
                        border-radius: 4px;
                        padding: 0 5px;
                    }
                }
                .el-icon-edit {
                    margin-left: 5px;
                    cursor: pointer;
                    color: white;
                }
            }
            .content {
                margin-left: 20px;
                margin-top: 5px;
                display: flex;
                height: calc(80px - 25px - 5px - 2px); //节点高80 头部高25 边距5 边框2
                .contentStrDiv {
                    flex: 1;
                    display: flex;
                    // align-items: center;
                    flex-direction: column;
                    justify-content: center;
                    .contentStr {
                        max-width: 220px;
                        height: 19px;
                        div {
                            width: 100%;
                            height: 100%;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                    }
                }
                .editIcon {
                    width: 20px;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
            .closeBtn {
                cursor: pointer;
                position: absolute;
                // color: white;
                top: 7px;
                right: 3px;
                z-index: 20;
            }
            // .mouseOver {
            //     color: white;
            //     &:hover {
            //         transform: scale(1.1);
            //     }
            // }

            .moveup {
                position: absolute;
                margin-left: calc(140px - 11px); //节点宽度的一半减去 图标宽度的一半（图标宽度一半是7像素 边框1像素 连线边框1像素）
                margin-top: calc(-16px); // -9px 再浮动 5个像素 以盖住箭头
                &.disabled {
                    img {
                        cursor: not-allowed;
                        // background: grey;
                        // color: white;
                        // border: 1px solid grey;
                    }
                }
                img {
                    cursor: pointer;
                }
                // i {
                //     background: white;
                //     z-index: 20;
                //     border-radius: 50%;
                //     border: 1px solid #0088ff;
                //     color: #0088ff;
                //     cursor: pointer;
                // }
            }
            .movedown {
                position: absolute;
                margin-left: calc(140px - 11px); // 图标大小为16*19
                margin-top: calc(5px); // -9px 再浮动 5个像素 以盖住箭头
                //  margin-top: calc(0px);
                //  margin-top: -8px;// 0 -4*2
                &.disabled {
                    img {
                        cursor: not-allowed;
                        // background: grey;
                        // border: 1px solid grey;
                        // color: white;
                    }
                }
                img {
                    cursor: pointer;
                }
                // i {
                //     background: white;
                //     z-index: 20;
                //     border-radius: 50%;
                //     border: 1px solid #0088ff;
                //     color: #0088ff;
                //     cursor: pointer;
                // }
            }
        }

        .linediv {
            display: flex;
            width: 2px;
            height: 100px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .line {
                width: 1px;
                height: 100px;
                background: #b9b6b6;
                //  margin-left:100px;
            }
            .el-icon-caret-bottom {
                margin-top: -6px;
                color: #b9b6b6;
                font-size: 16px;
            }

            .actionbtn {
                position: relative;
                display: flex;
                width: auto;
                img {
                    margin-top: -70px;
                    width: 31px;
                    height: 31px;
                    cursor: pointer;
                    &:hover {
                        transform: scale(1.1);
                    }
                }
            }
        }
    }
}
</style>
