<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="1141px" :lock-scroll="false" :top="'10vh'" :close-on-click-modal="false" append-to-body :before-close="handleClose">
        <div class="mechanism">
            <div class="rowDiv">
                <div class="leftDiv">
                    <div class="leftTitle">
                        <div></div>
                        <span>选择</span>
                    </div>
                    <div class="leftBody">
                        <el-checkbox class="checkAll" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="padding: 5px 0;"></div>
                        <el-checkbox-group v-model="selectList">
                            <el-checkbox class="selectCheckBox" v-for="item in pList" :label="item" :key="item.id">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="gap"></div>
                <div class="rightDiv">
                    <div class="rightTitle">
                        <div></div>
                        <span>已选</span>
                    </div>
                    <div class="cardDiv">
                        <el-card shadow="never" v-for="item in selectList" :key="item.id">
                            <div class="content">
                                <span>{{ item.name }}</span>
                                <img src="../../../../assets/images/icon_off.png" @click="selectItem(item.id)" alt="" />
                            </div>
                        </el-card>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
           <el-button @click="handleCancle">取消</el-button>
            <el-button type="primary" @click="handleCommit">确认</el-button>
        </template>
    </el-dialog>
</template>
<script>
export default {
  name: 'positionList',
  props:{
    dialogVisible:{ type: Boolean, default: false},
    pList:{ type: Array, default: []},
    positionList:{ type: Array, default: []},
    title:{ type: String, default: ''},
  },
  data () {
    return {
        selectList:[],
        isIndeterminate:true
    }
  },
  computed: {
    checkAll: {
        get() {
            return this.pList.length == this.selectList.length
        },
        set() {}
    }   
  },
  methods: {
    handleCancle() {
        this.$emit('update:dialogVisible',false)
    },
    handleClose() {
        this.$emit('update:dialogVisible',false)
    },
    handleCommit() {
        this.$emit('commit',this.selectList)
    },
    
    selectItem(id) {
        this.selectList = this.selectList.filter(item => item.id != id)
    },
    handleCheckAllChange(val){
        this.selectList = val ? this.pList : []
    },
  },
  created () {
    let parr = this.positionList.map(item => item.id)
    this.selectList = this.pList.filter(item => {
        return parr.includes(item.id)
    })
  },
}
</script>
<style lang="scss" scoped>
.checkAll {
    margin-top: 5px;
}
.selectCheckBox {
    width: 100%;
    padding: 8px 0;
    border-radius: 4px;
    &:hover {
        background: #f5f7fa;
        cursor: pointer;
    }
}

.mechanism {
  max-height: 450px;
  height: 450px;
    flex-wrap: wrap;
    .rowDiv {
        height: 100%;
        background: white;
        display: flex;
        width: 100%;
        flex-direction: row;
        background: white;
        .leftTitle,
        .rightTitle {
            display: flex;
            height: 50px;
            align-items: center;
            div {
                width: 12px;
                height: 12px;
                background: #c0c4cc;
                border-radius: 50%;
                margin-right: 5px;
            }
            span {
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #303133;
            }
        }
        .leftDiv {
            height: 100%;
            width: calc(50% - 10px);
            .leftBody {
                height: calc(100% - 50px);
                overflow-y: auto;
                overflow-x: hidden;
                padding: 12px;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
            }
        }
        .gap {
            width: 20px;
            height: 100%;
        }
        .rightDiv {
            width: calc(50% - 10px);
            position: relative;
            .cardDiv {
                height: calc(100% - 50px);
                overflow-y: auto;
                overflow-x: hidden;
                padding: 12px;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                background: #f5f7fa;
                .el-card {
                    margin: 5px;
                    border: none;
                    background: #f5f7fa;
                    /deep/ .el-card__body {
                        padding: 12px;
                    }
                    &:hover {
                        background: #f0f2f5;
                    }
                    .content {
                        display: flex;
                        position: relative;
                        img {
                            width: 18px;
                            height: 18px;
                            position: absolute;
                            right: 0;
                            cursor: pointer;
                        }
                    }
                }
            }

            .personCount {
                margin-left: 5px;
                color: #909399;
            }
        }
    }
}
</style>
