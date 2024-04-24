<template>
    <div class="userFriends-organiza-box">
        <div class="title_box"><i class="el-icon-arrow-left"  @click="back()"></i>按好友选</div>
        <ul class="list listOverflow">
            <li class="list-item" v-for="(item, index) in list" :key="index" :class="[!isSelected(item.userId) ? '' : 'isSelectedClass']" >
                <div class="item-box" @click="selected(item)">
                    <img v-if="isSelected(item.userId) !== undefined" class="selectImgIcon"  src="../../image/icon_selected@2x.png">
                    <img v-else  class="selectImgIcon" src="../../image/icon_not_select@2x.png">
                    <!-- <i :class="isSelected(item.userId) !== undefined ? 'el-icon-circle-check': 'el-icon-chat-round'"></i> -->
                    <HeadImg :headName="item.name" :imgUrl="item.imagePath" :other_w="'is32w'"></HeadImg>
                    <span class="name">{{item.name}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import HeadImg from '../headImg'
export default {
    props: {
        searchType: {
            type: String,
            default: () => ''
        },
        t_selectList: {
            type: Array,
            default: () => []
        }
    },
    components: {
        HeadImg
    },
    data() {
        return {
            moduleName: '/chat',
            list: [],
            op: {
                selectFriendGroupList: 'selectFriendGroupList'
            }
        }
    },
    mounted() {
        this.getUserFriends()
    },
    methods: {
        back(){
            this.$emit('update:searchType', '')
        },
        // 判断是否已包含
        isSelected(id){
           return this.t_selectList.find(item => item.id === id)
        },
        getUserFriends(){
            const self = this;
            const op = self.op.selectFriendGroupList;
            let data = {
                data: {
                    'name': '',
                    "pageSize": 1000,
                    "currentPage": "1"
                },
                op,
            };
            let URL = self.$getModuleUrl(self.moduleName, op);
            this.$axios(URL, data).then((res) => {
                if (res.code == 1) {
                    let ret = JSON.parse(res.data);
                    self.list = [];
                    ret.map(item => {
                        item.userFriendList.map(itemA => {
                            itemA['id'] = itemA.userId
                            itemA['userID'] = itemA.userId
                            let a = itemA;
                            self.list.push(a)
                        })
                    })
                }
            });
        },
        selected(item){
            const index = this.t_selectList.findIndex((items) => items.id === item.id)
            if (index > -1) {
                return this.t_selectList.splice(index, 1);
            }
            let t = [...this.t_selectList, item]
            this.$emit("update:t_selectList", t)
        }
    }
}
</script>
<style lang="scss" scoped src="./style/styleMain.scss">
</style>