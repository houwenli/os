<template>
    <div class="group-user-list">
        <!-- 头部 -->
        <div class="list-head">
            <div class="head-title">群成员列表（{{userNumber}}人）</div>
            <!-- <i class="el-icon-user" @click="addUser()"></i> -->
            <img class="el-icon-user" src="../../image/icon_chat_add.png" @click="addUser()" />
            <el-input
                placeholder="请输入搜索"
                prefix-icon="el-icon-search"
                @input="searchGroupUser"
                v-model="searchUser"
                clearable>
            </el-input>
        </div>
        <!-- 列表 -->
        <user-list v-bind="{
            ...$attrs,
            'userList': $attrs.userList,
        }" :class="showMore ? '' : 'maxh220'"></user-list>
        <div class="more" v-if="userNumber > 24 && !showMore && !searchUser" @click="showMore = true">查看更多</div>
    </div>
</template>
<script>
import UserList from '../userList'; // 成员列表
export default {
    components: {
        UserList
    },
    data() {
        return {
            userNumber: this.$store.state.im.groupUserListLength,
            searchUser: '',
            showMore: false,
        }
    },
    watch: {
        '$store.state.im.groupUserListLength': function(newV){
            const self = this;
            if(newV){
                self.userNumber = newV
            }
        },
    },
    methods: {
        addUser(){
            this.$emit('addUser')
        },
        searchGroupUser(){
            this.$emit('searchGroupUser', this.searchUser)
        }
    }
}
</script>
<style scoped lang="scss">
.list-head {
    display: flex;
    .head-title{
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #303133;
        line-height: 22px;
        flex: 1;
    }
    // i {
    //     font-size: 22px;
    //     margin-right: 16px;
    //     margin-top: 2px;
    //     cursor: pointer;
    // }
    .el-icon-user {
        width: 24px;
        height: 24px;
        cursor: pointer;
        margin-right: 5px;
        margin-top: 3px;
    }
    // .add-user {
    //     background: url('../image/add-user.png') no-repeat;
    //     display: inline-block;
    //     background-size: 100%;
    //     width: 16px;
    //     height: 16px;
    // }
    /deep/.el-input{
        width: 164px;
        height: 28px;
        .el-input__inner{
            height: 28px;
            background: #FFFFFF;
            border-radius: 20px;
            font-size: 12px;
        }
        
    }
}

.more {
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0088FF;
    line-height: 20px;
    text-align: center;
    margin-bottom: 14px;
    cursor: pointer;
}
.maxh220 {
    max-height: 220px;
}
</style>
<style lang="scss">
.el-input__suffix{
    .el-icon-search {
        line-height: 30px;
        margin-top: -3px;
    }
}
.el-input--medium .el-input__icon {
    line-height: 30px;
}
</style>