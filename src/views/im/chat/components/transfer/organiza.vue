<template>
    <div class="userFriends-organiza-box">
        <div  class="title_box"><i class="el-icon-arrow-left" @click="back()"></i>深圳万顺叫车云信息技术有限公司</div>
        <div v-if="breadcrumbList.length > 1" class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item style="cursor: pointer;color:rgba(0, 136, 255, 1);" @click.native="getBreadcrumbItem(item, index)" v-for="(item, index) in breadcrumbList" :key="index">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <ul class="list listOverflow">
            <li class="list-item list-flex" v-for="(item, index) in list.children" :key="index" :class="[!isSelected(item.id) !== undefined ? '' : 'isSelectedClass']">
                <div class="item-box" @click="selected(item)">
                    <img v-if="isSelected(item.id) !== undefined"    class="selectImgIcon"  src="../../image/icon_selected@2x.png">
                    <img v-else  class="selectImgIcon" src="../../image/icon_not_select@2x.png">
                    <!-- <i :class="isSelected(item.id) !== undefined ? 'el-icon-circle-check': 'el-icon-chat-round'"></i> -->
                    <HeadImg v-if="item.empCount>=0" :headName="item.name" :other_w="'is32w'" :isOrganiza="true"></HeadImg>
                    <HeadImg v-else :headName="item.name" :imgUrl="item.icon" :other_w="'is32w'"></HeadImg>
                    <span class="name">{{item.name}}</span>
                    <span v-if="item.empCount > 0">({{item.empCount}})</span>
                </div>
                <template>
                    <span v-if="item.empCount > 0 && t_selectList.indexOf(item) === -1" @click="getOrganiza(item)" class="nextSpanClass">下级<i class="el-icon-arrow-right arrowRight" style="color:#0088FF;"></i></span>
                    <span v-else-if="item.empCount === 0">下级<i class="el-icon-arrow-right"></i></span>
                </template>
                
            </li>
            <template v-if="list.empList && list.empList.length > 0">
                <li class="list-item list-flex" v-for="(itemA, indexA) in list.empList" :key="indexA+1000" :class="[!isSelected(itemA.id) !== undefined ? '' : 'isSelectedClass']">
                    <div class="item-box" @click="selected(itemA)"  :class="[!isSelected(itemA.id) !== undefined ? '' : 'isSelectedClass']">
                        <img v-if="isSelected(itemA.id) !== undefined" class="selectImgIcon" src="../../image/icon_selected@2x.png">
                        <img v-else  class="selectImgIcon" src="../../image/icon_not_select@2x.png">
                        <HeadImg :headName="itemA.name" :imgUrl="itemA.icon" :other_w="'is32w'"></HeadImg>
                        <div v-if="itemA.positionName" class="deptFullName-box">
                            <span class="name line-deptFullName">{{itemA.name || itemA.userID}}</span>
                            <div class="deptFullName">{{itemA.positionName}}</div>
                        </div>
                        <span v-else class="name">{{itemA.name}}</span>
                    </div>
                </li>
            </template>
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
            list: [],
            moduleName: '/chat',
            op: {
                selectContacts: 'selectContacts', // 查询全部组织架构
            },
            breadcrumbList: [],
            isChildrenList: true, // 是否有下级
        }
    },
    mounted(){
        this.getOrganiza()
    },   
    methods: {
        back(){
            this.$emit('update:searchType', '')
        },
        // 判断是否已包含
        isSelected(id){
           return this.t_selectList.find(item => item.id === id)
        },
        // 组织架构导航
        getBreadcrumbItem(item, index){
            const self = this;
            let l = self.breadcrumbList.length - 1;
            if(l === index){return false;}
            self.getOrganiza(item)
            self.breadcrumbList.splice(index+1)
        },
        getName(name){
            return name.substring(0,1)
        },
        // 查询全部组织架构
        getOrganiza(item){
            const self = this;
            let id = 0;
            if(item){
                id = item.id
            }
            const op = self.op.selectContacts;
            let data = {
                data: {
                    id: id ? id : 0
                },
                op,
            };
            if(id){
                self.breadcrumbList.push(item)
            }
            let URL = self.$getModuleUrl(self.moduleName, op);
            this.$axios(URL, data).then((res) => {
                if (res.code == 1) {
                    const ret = JSON.parse(res.data);
                    self.list = [];
                    if(ret.children.length > 0){
                        self.list = {
                            'children': ret?.children || [],
                            'empList': ret?.empList || []
                        }
                    }else if(ret.empList.length > 0){
                        self.list = {
                            'children': ret?.children || [],
                            'empList': ret?.empList || []
                        }
                    }
                    if(id === 0){
                        self.breadcrumbList = [];
                        self.breadcrumbList.push({
                            id: ret.orgPath[0].deptId,
                            name: ret.orgPath[0].deptName,
                        })
                    }
                }
            });
        },
        selected(item){
            const index = this.t_selectList.findIndex((items, index) => items.id === item.id)
            if (index > -1) {
                return this.t_selectList.splice(index, 1);
            }
            let t = [...this.t_selectList, item]
            this.$emit("update:t_selectList", t)
        }
    }
}
</script>
<style scoped lang="scss" src="./style/styleMain.scss"></style>
<style scoped lang="scss">
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