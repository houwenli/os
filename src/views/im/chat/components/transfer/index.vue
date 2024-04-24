<template>
    <div class="transfer">
        <header class="transfer-h5-header" v-if="title">
            <span class="title">{{title}}</span>
        </header>
        <main class="main" :class="type === 'creatGroup' ? 'is-creat-group' : ''">
            <div class="left">
                <p class="transfer-select-title"><span></span>选择</p>
                <div class="left-main">
                    <header v-if="isSearch">
                        <el-input type="text" :disabled="searchType != ''" v-model="searchValue" @input="handleInput" :placeholder="placeholder || '搜索'" enterkeyhint="search"></el-input>
                    </header>
                    <div class="select-others" v-if="searchType === '' && isUserAndOrg">
                        <div @click="btnOthers('userFriends')">
                            <!-- <i class="el-icon-user"></i> -->
                            <img class="icon_selectImg el-icon-user" src="../../image/icon_addPerson.png">
                            <span>按好友</span>
                        </div>
                        <div @click="btnOthers('organiza')">
                            <!-- <i class="el-icon-s-operation"></i> -->
                            <img class="icon_selectImg el-icon-s-operation" src="../../image/icon_pros.png">
                            <span>按组织架构</span>
                        </div>
                    </div>
                    <!-- 按好友选择 -->
                    <UserFriends v-if="searchType === 'userFriends'" :searchType.sync = "searchType" :t_selectList.sync = "t_selectList" />
                    <!-- 按组织架构选择 -->
                    <Organiza v-if="searchType === 'organiza'" :searchType.sync = "searchType" :t_selectList.sync = "t_selectList" />
                    <ul class="list" v-if="searchType === ''">
                        <!-- <li class="list-item" @click="selectedAll" v-if="optional.length > 1 && !isRadio">
                            <i :class="[t_selectList.length === optional.length ? 'el-icon-circle-check': 'el-icon-chat-round']"></i>
                            <span class="all">全选</span>
                        </li> -->
                        <li class="list-item" v-for="(item, index) in list" :key="index" @click="selected(item)">
                            <!-- <img v-if="t_selectList.indexOf(item)>-1" class="selectImgIcon"  src="../../image/icon_selected@2x.png"> -->
                            <img v-if="isSelected(item.userID) !== undefined" class="selectImgIcon"  src="../../image/icon_selected@2x.png">
                            <img v-else  class="selectImgIcon" src="../../image/icon_not_select@2x.png">
                            <template v-if="!isCustomItem">
                                <HeadImg class="avatar" v-if="!item.avatar" :headName="item.nick" :other_w="'is36w'"></HeadImg>
                                <img v-else class="avatar" :src="item.avatar">
                                <div v-if="item.deptFullName" class="deptFullName-box">
                                    <span class="name line-deptFullName">{{item.nick || item.userID}}</span>
                                    <div class="deptFullName">{{item.deptFullName}}</div>
                                </div>
                                <span v-else class="name">{{item.nick || item.userID}}</span>
                            </template>
                            <template v-else>
                                <slot name="left" :data="item" />
                            </template>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="right">
                <p class="transfer-select-title"><span></span>已选  <em>({{t_selectList.length}})</em></p>
                <ul class="list rightList" v-show="resultShow">
                    <li class="space-between-self" v-for="(item, index) in t_selectList" :key="index">
                        <div class="asideClass" v-if="!isCustomItem">
                            <!-- 部门 -->
                            <template v-if="item.isLeaf !== undefined">
                                <HeadImg :isOrganiza="true" class="headImg-mini" :other_w="'is32w'" style="display: flex;"></HeadImg>
                                <span >{{item.name}}</span>
                            </template>
                            <!-- 部门下的人员 -->
                            <template v-else-if="item.positionName !== undefined">
                                <HeadImg :headName="item.name" :imgUrl="item.icon || item.avatar" :other_w="'is32w'" style="display: flex;"></HeadImg>
                                <span >{{item.name}}</span>
                            </template>
                            <!-- 按好友 -->
                            <template v-else-if="item.userFriendList !== undefined">
                                <HeadImg :headName="item.userFriendList[0].name" :imgUrl="item.userFriendList[0].imagePath" :other_w="'is32w'" style="display: flex;"></HeadImg>
                                <span >{{item.userFriendList[0].name}}</span>
                            </template>
                            <!-- 其它 -->
                            <template v-else>
                                <HeadImg v-if="!item.avatar" :headName="item.nick" :other_w="'is32w'" style="display: flex;"></HeadImg>
                                <img v-else class="avatar" :src="item.avatar">
                                <span >{{item.nick || item.userID}}</span>
                            </template>
                        </div>
                        <div class="asideClass" v-else>
                            <slot name="right" :data="item" />
                        </div>
                        <img src="../../image/icon_off2@2x.png"  class="el-icon-circle-close closeImg"  @click="selected(item)">
                        <!-- <i class="el-icon-circle-close" @click="selected(item)" ></i> -->
                    </li>
                </ul>
            </div>
        </main>
        <p v-if="type === 'creatGroup'" class="creat-group"><span>填写群名称：</span><el-input v-model="groupName" maxlength="10"></el-input></p>
        <footer>
            <button class="btn btn-cancel" @click="cancel">取消</button>
            <button v-if="t_selectList.length>0" class="btn" @click="submit">完成</button>
            <button v-else class="btn btn-no">完成</button>
        </footer>
    </div>
</template>

<script>
import UserFriends from './userFriends'
import Organiza from './organiza'
import HeadImg from '../headImg'
import { fifterUserList } from './js/utils'
export default {
    components: {
        UserFriends,
        Organiza,
        HeadImg
    },
    data() {
        return {
            moduleName: '/chat',
            t_selectList: [],
            groupName: '', // 群名称
            searchType: '', // 搜索类型
            op: {
                'selectSearchOrgUser': 'selectSearchOrgUser'
            },
            placeholder: '',
            searchValue: '', // 搜索值
        }
    },
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        selectedList: {
            type: Array,
            default: () => [],
        },
        isSearch: {
            type: Boolean,
            default: () => true,
        },
        isRadio: {
            type: Boolean,
            default: () => false,
        },
        title: {
            type: String,
            default: () => '',
        },
        type: {
            type: String,
            default: () => '',
        },
        resultShow: {
            type: Boolean,
            default: () => true,
        },
        isUserAndOrg: {
            type: Boolean,
            default: () => false,
        },
        isCustomItem: {
            type: Boolean,
            default: () => false,
        },
    },
    watch: {
        t_selectList: {
            handler(newV, oldV){
                console.log(newV)
            },
            immediate: true,
            deep: true,
        },
        selectedList:  {
            handler(newV, oldV){
                if(newV.length > 0){
                    this.t_selectList = newV
                }
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {
        optional: function(){
            return this.list.filter((item) => !item.isDisabled)
        }
    },
    mounted(){
        /**
         * type = 
         * changeOwner  群主转让        完成
         * addAdmin     添加群管理员    完成
         * addMute      添加禁言人员    完成
         * add          添加群成员      完成
         * messageForwar信息转发        完成
         * 
         * 
         * 
         */
        this.placeholder = {
            'changeOwner': '搜索名字',
            'addAdmin': '搜索名字',
            'add': '搜索名字',
            'addMute': '搜索名字',
        }[this.type]
        console.log('type', this.type)
    },
    methods: {
        // 判断是否已包含
        isSelected(id){
           return this.t_selectList.find(item => item.userID === id)
        },
        // 按组织架构选择
        btnOthers(type){
            this.searchType = type;
        },
        handleInput(e){
            if(e !== ''){
                this.searchType = ''
            }
            this.$emit('search', e);
        },
        selected(item){
            if (item.isDisabled) {
                return;
            }
            let list = this.t_selectList;
            const index = this.t_selectList.indexOf(item);
            if (index > -1) {
                return this.t_selectList.splice(index, 1);
            }
            if (this.isRadio) {
                list = [];
            }
            list.push(item);
            this.t_selectList = list;
        },
        async submit(){
            const self = this;
            if(this.type !== 'creatGroup'){
                let submitList = await fifterUserList(self)
                this.$emit('submit', submitList);
            }else{
                let groupName = this.groupName
                if(!groupName){
                    this.$message.error('请输入群名称')
                    return false;
                }
                let submitList = await fifterUserList(self)
                this.$emit('submit', {t_selectList: submitList, groupName});
            }
        },
        cancel(){
            this.$emit('cancel');
        }
    },
}
</script>

<style lang="scss" scoped src="./style/transfer.scss"></style>
<style lang="scss" scoped>
.transfer-title {
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #303133;
    line-height: 18px;
}
.transfer-select-title{
    display: flex;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #303133;
    line-height: 14px;
    margin-bottom: 16px;
    span {
        display: block;
        width: 12px;
        height: 12px;
        background: #C0C4CC;
        border-radius: 12px;
        margin-right: 8px;
    }
    em {
        margin-left:4px;
        color: #909399;
    }
}
.left-main {
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    .icon_selectImg {
        width: 40px;
        height: 40px;
    }
}
.right {
    .rightList {
        height: 500px;
        background: #F5F7FA;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        padding-top: 16px;
    }
    .closeImg {
        width: 18px;
        height: 18px;
    }
    .space-between-self {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        line-height: 48px;
        margin: 0 16px;
        padding: 0 8px;
        .asideClass {
            img {
                width: 32px;
                height: 32px;
            }
            display: flex;
            align-items: center;
            span {
                margin-left: 8px;
                color: #303133;
                font-weight: 600;
            }
        }
        // &:nth-child(even) {
        //     background: #fff;
        // }
    }
}
.list-item {
    padding: 12px 8px;
    cursor: pointer;
    display: flex;
    .selectImgIcon {
        width: 16px;
        height: auto;
        margin-right: 14px;
    }
    .avatar{
        display: inline-block;
    }
    .name {
        margin-left: 12px;
        font-weight: 600;
        line-height: 40px;
    }
}
.deptFullName-box {
    margin-left: 12px;
    .line-deptFullName {
        line-height: 22px !important;
        margin-left: 0 !important;
    }
    .deptFullName {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

</style>
