<template>
    <div class="approvalProcess">
        <div class="processTitle">流程节点记录</div>
        <!-- 组件中自动计算column宽度 只计算第一个el-table中的el-table__body-wrapper 此处先把弹窗table的放在前面-->
        <processPointDia v-if="showDiaList" :showProcessPerson="showDiaList" :isNodeUser='false' :listTitle="diaTitle" :procinstId="$route.query.procinstId" :personList="personList" @closepop="showDiaList = false" :personType="personType"></processPointDia>
        <ws-table-el ref="table" class="approvalProcess-table" v-bind="tableConfig" :header-cell-style="{ background: '#F5F7FA' }">
            <template>
                <ws-table-column-el prop="nodeType" label="节点类型" width="113px">
                    <template slot-scope="scope">
                        <div>
                            <img src="@/assets/index/icon_check.png" class="imgPoint" alt="" v-if="scope.row.nodeType === '1'" />
                            <img src="@/assets/index/icon_send.png" class="imgPoint" alt="" v-if="scope.row.nodeType === '2'" />
                            <span>{{ scope.row.nodeType == '1' ? '审核' : '抄送' }}</span>
                        </div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="nodeName" label="审核节点名称"></ws-table-column-el>
                <ws-table-column-el prop="userName" label="人员信息" width="274px">
                    <!-- <template slot-scope="scope">
                        <span @click="showPersonList(1, scope.row.userIds)" :class="scope.row.userName ? 'userStyle' : ''">{{ scope.row.userName ? scope.row.userName : '--' }}</span>
                    </template> -->
                </ws-table-column-el>
                <ws-table-column-el prop="approvalType" label="多人审批方式" width="205px">
                    <template slot-scope="scope">
                        <span>{{ APPROVAL_STATUS[scope.row.approvalType]||'--'}}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="approvalStatus" label="审核状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.approvalStatus == 1 ? '已审核' : '--' }}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="readFlag" label="抄送已读状态">
                    <template slot-scope="scope">
                        <div class="read-falg-style"> <img v-if="scope.row.readFlag=='0'"  src="@/assets/icons/unread.png" /><span>{{ scope.row.readFlagStr || '--' }}</span></div>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="nodeStatus" label="节点状态" width="137px">
                    <template slot-scope="scope">
                        <span :class="['nodeStatus',getClass(scope.row.nodeStatus)]">{{scope.row.nodeStatusStr||'--'}}</span>
                    </template>
                </ws-table-column-el>
                <ws-table-column-el prop="latestUpdateTime" label="最新更新时间" width="236px">
                    <template slot-scope="scope">
                        <span>{{scope.row.latestUpdateTime || '--' }}</span>
                    </template>
                </ws-table-column-el>
            </template>
        </ws-table-el>
      <ws-footer>
        <el-button @click='onBack'>返回</el-button>
      </ws-footer>
    </div>
</template>
<script>
import processPointDia from '../components/processPointDia';
import { NODE_STATUS } from '../../../../utils/enum';
import { APPROVAL_STATUS } from '../../../../utils/enum';
import { CCREAD_STATUS } from '../../../../utils/enum';
// 公共页面

export default {
    name: 'approvalProcess',
    components: {
        processPointDia
    },
    data() {
        return {
            moduleName: '/index/todo',
            searchOptions: {
                procdefId: '',
                procinstId: '',
            },
            tableConfig: {
                loading: true,
                emptyModel: true,
                filterColumns: false,
                pageCreateTime: 'updateTime',
                lazyQuery: {
                    moduleName: '/index/todo',
                    op: {
                        selectList: 'flowNodeRecode',
                        selectCount: 'flowNodeRecodeCount'
                    },
                    beforeQuery: this.beforeQuery,
                },
            },
            diaTitle: '',
            showDiaList: false,
            personList: [], //人员信息dialog框数据
            procdefId: this.$route.query.procdefId,
            procinstId: this.$route.query.procinstId,
            allProcessData: [],
            APPROVAL_STATUS, //审批方式
            NODE_STATUS, //节点状态
            CCREAD_STATUS,//抄送是否已读状态
            personType: null
        };
    },

    methods: {
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        beforeQuery() {
            this.searchOptions.procdefId=this.procdefId;
            this.searchOptions.procinstId=this.procinstId
            return this.searchOptions
        },
        getClass(status){
            if([null,undefined].includes(status)) return ''
            switch(status){
                case 0:
                    return 'waiting';
                case 1:
                    return 'pass';
                case 2:
                    return 'goback';
                case 3:
                    return 'pending';
                case 4:
                    return 'pass';
                case 5:
                    return 'close';
                case 6:
                    return 'close';

            }
        },
        getValue(nodeStatus){
            if(!nodeStatus) return '--'
            return  NODE_STATUS[nodeStatus]['value']
        },

        showPersonList(type, personList) {
            this.personType=type;
            console.log(personList)
            if (personList.length > 0) {
                switch (type) {
                    case 1:
                        this.diaTitle = '节点人员列表';
                        break;
                    case 2:
                        this.diaTitle = '已审人员列表';
                        break;
                    case 3:
                        this.diaTitle = '抄送已读人员列表';
                }
                if(type==2||type==3){
                    this.personList = personList.map((item)=>{
                        return item.id+""
                    })
                }else{

                    this.personList = personList.split(',');
                }
                this.showDiaList = true;
            }
        },

        onBack() {
          this.$router.go(-1)
        }
    }
};
</script>
<style lang="scss" scoped>
.read-falg-style{
    img{
    border-radius: 4px;
    width: 8px;
    margin-right: 5px;
    margin-bottom: 1px;
    }
}
.approvalProcess {
    background-color: #fff;
    position: relative;
    .ws-table-warp{
        margin-bottom: 64px;
        min-height: calc(100% - 64px);
    }

    .processTitle {
        position: absolute;
        left: 56px;
        top: 40px;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
    }
    .approvalProcess-table {
        padding-top: 62px !important;
        .option-box {
            margin-bottom: 0px;
        }
        .userStyle {
            text-decoration: underline;
            cursor: pointer;
        }
        .baseBg {
            border-radius: 4px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            padding: 4px 8px;
        }
    }
    .imgPoint {
        margin-bottom: -5px;
    }
    .nodeStatus {
        display: inline-block;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        text-align: center;
    }
    .waiting {
        background: #fdf6ec;
        color: #e6a23c;
    }
    .pending {
        background: #ecf5ff;
        color: #409eff;
    }
    .pass {
        background: #e1fef7;
        color: #2ac39b;
    }
    .goback {
        background: #f5f7fa;
        color: #606266;
    }
    .close {
        background: #f5f7fa;
        color: #909399;
    }
}
</style>
